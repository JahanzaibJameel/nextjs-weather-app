import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

// Rate limiting in-memory store (for production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Validation schema
const querySchema = z.object({
  q: z.string().min(1, 'Query is required').max(100, 'Query too long'),
  lat: z.string().optional(),
  lon: z.string().optional(),
});

// Weather response type
interface WeatherResponse {
  location: {
    name: string;
    country: string;
    lat: number;
    lon: number;
  };
  current: {
    temp_c: number;
    temp_f: number;
    condition: {
      text: string;
      icon: string;
    };
    humidity: number;
    pressure_mb: number;
    wind_kph: number;
    vis_km: number;
    uv: number;
  };
  forecast?: {
    forecastday: Array<{
      date: string;
      day: {
        maxtemp_c: number;
        mintemp_c: number;
        condition: {
          text: string;
          icon: string;
        };
      };
    }>;
  };
}

interface ErrorResponse {
  error: string;
  message: string;
  details?: any;
}

// Rate limiting middleware
function rateLimit(ip: string): boolean {
  const maxRequests = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '10');
  const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '10000'); // 10 seconds
  
  const now = Date.now();
  const record = rateLimitStore.get(ip);
  
  if (!record || now > record.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (record.count >= maxRequests) {
    return false;
  }
  
  record.count++;
  return true;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<WeatherResponse | ErrorResponse>
) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({
      error: 'Method not allowed',
      message: 'Only GET requests are supported'
    });
  }

  // Rate limiting
  const ip = req.headers['x-forwarded-for'] as string || req.connection.remoteAddress || 'unknown';
  if (!rateLimit(ip)) {
    return res.status(429).json({
      error: 'Too many requests',
      message: 'Rate limit exceeded. Please try again later.'
    });
  }

  try {
    // Validate query parameters
    const { q, lat, lon } = querySchema.parse(req.query);
    
    const apiKey = process.env.WEATHER_API_KEY;
    if (!apiKey) {
      throw new Error('Weather API key not configured');
    }

    let apiUrl = '';
    
    if (lat && lon) {
      // Use coordinates
      apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    } else if (q) {
      // Use city name
      apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(q)}&units=metric&appid=${apiKey}`;
    } else {
      return res.status(400).json({
        error: 'Bad request',
        message: 'Either city name (q) or coordinates (lat, lon) must be provided'
      });
    }

    // Fetch weather data
    const weatherResponse = await fetch(apiUrl);
    
    if (!weatherResponse.ok) {
      const errorData = await weatherResponse.json().catch(() => ({}));
      return res.status(weatherResponse.status).json({
        error: 'Weather API error',
        message: errorData.message || 'Failed to fetch weather data',
        details: errorData
      });
    }

    const weatherData = await weatherResponse.json();
    
    // Transform OpenWeatherMap data to our format
    const transformedData: WeatherResponse = {
      location: {
        name: weatherData.name,
        country: weatherData.sys.country,
        lat: weatherData.coord.lat,
        lon: weatherData.coord.lon,
      },
      current: {
        temp_c: Math.round(weatherData.main.temp),
        temp_f: Math.round(weatherData.main.temp * 9/5 + 32),
        condition: {
          text: weatherData.weather[0].description,
          icon: weatherData.weather[0].icon,
        },
        humidity: weatherData.main.humidity,
        pressure_mb: weatherData.main.pressure,
        wind_kph: Math.round(weatherData.wind.speed * 3.6),
        vis_km: weatherData.visibility ? weatherData.visibility / 1000 : 10,
        uv: 0, // OpenWeatherMap free tier doesn't provide UV index
      }
    };

    // Set caching headers
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=150');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    return res.status(200).json(transformedData);
    
  } catch (error) {
    console.error('Weather API error:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Invalid query parameters',
        details: error.errors
      });
    }
    
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to process weather request'
    });
  }
}
