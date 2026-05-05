import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { logger } from '@/utils/logger';

// Rate limiting store (reuse from weather.ts)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

const querySchema = z.object({
  q: z.string().min(1, 'Query is required').max(100, 'Query too long'),
  days: z.string().optional().transform(val => val ? parseInt(val) : 7),
  lat: z.string().optional(),
  lon: z.string().optional(),
});

interface ForecastResponse {
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
  forecast: {
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
      hour: Array<{
        time: string;
        temp_c: number;
        condition: {
          text: string;
          icon: string;
        };
        wind_kph: number;
        humidity: number;
        chance_of_rain: number;
      }>;
    }>;
  };
}

// Rate limiting function (reuse from weather.ts)
function rateLimit(ip: string): boolean {
  const maxRequests = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100');
  const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000');
  
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
  res: NextApiResponse<ForecastResponse | { error: string; message: string }>
) {
  const startTime = Date.now();
  
  // Only allow GET requests
  if (req.method !== 'GET') {
    logger.apiRequest(req.method || 'unknown', req.url || '', { error: 'Method not allowed' });
    return res.status(405).json({
      error: 'Method not allowed',
      message: 'Only GET requests are supported'
    });
  }

  // Rate limiting
  const ip = req.headers['x-forwarded-for'] as string || req.connection.remoteAddress || 'unknown';
  if (!rateLimit(ip)) {
    logger.apiRequest('GET', req.url || '', { ip, error: 'Rate limit exceeded' });
    return res.status(429).json({
      error: 'Too many requests',
      message: 'Rate limit exceeded. Please try again later.'
    });
  }

  try {
    // Validate query parameters
    const { q, days = 7, lat, lon } = querySchema.parse(req.query);
    
    logger.apiRequest('GET', req.url || '', { query: q, days, lat, lon });
    
    const apiKey = process.env.WEATHER_API_KEY;
    if (!apiKey) {
      throw new Error('Weather API key not configured');
    }

    let apiUrl = '';
    
    if (lat && lon) {
      // Use coordinates for forecast
      apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&cnt=${days * 8}&appid=${apiKey}`;
    } else if (q) {
      // Use city name for forecast
      apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(q)}&units=metric&cnt=${days * 8}&appid=${apiKey}`;
    } else {
      return res.status(400).json({
        error: 'Bad request',
        message: 'Either city name (q) or coordinates (lat, lon) must be provided'
      });
    }

    // Fetch forecast data
    const forecastResponse = await fetch(apiUrl);
    const duration = Date.now() - startTime;
    
    if (!forecastResponse.ok) {
      const errorData = await forecastResponse.json().catch(() => ({}));
      logger.apiError(new Error(`Forecast API error: ${forecastResponse.status}`), { 
        status: forecastResponse.status, 
        errorData,
        query: q,
        duration 
      });
      
      return res.status(forecastResponse.status).json({
        error: 'Weather API error',
        message: errorData.message || 'Failed to fetch forecast data'
      });
    }

    const forecastData = await forecastResponse.json();
    
    // Transform OpenWeatherMap forecast data to our format
    const transformedData: ForecastResponse = {
      location: {
        name: forecastData.city.name,
        country: forecastData.city.country,
        lat: forecastData.city.coord.lat,
        lon: forecastData.city.coord.lon,
      },
      current: {
        temp_c: Math.round(forecastData.list[0].main.temp),
        temp_f: Math.round(forecastData.list[0].main.temp * 9/5 + 32),
        condition: {
          text: forecastData.list[0].weather[0].description,
          icon: forecastData.list[0].weather[0].icon,
        },
        humidity: forecastData.list[0].main.humidity,
        pressure_mb: forecastData.list[0].main.pressure,
        wind_kph: Math.round(forecastData.list[0].wind.speed * 3.6),
        vis_km: forecastData.list[0].visibility ? forecastData.list[0].visibility / 1000 : 10,
        uv: 0, // OpenWeatherMap free tier doesn't provide UV index in forecast
      },
      forecast: {
        forecastday: processForecastData(forecastData.list, days),
      },
    };

    logger.apiResponse(200, duration, { query: q, days, forecastDays: transformedData.forecast.forecastday.length });
    
    // Set caching headers
    res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=300'); // 10 minutes cache
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    return res.status(200).json(transformedData);
    
  } catch (error) {
    const duration = Date.now() - startTime;
    logger.apiError(error as Error, { duration });
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Invalid query parameters'
      });
    }
    
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to process forecast request'
    });
  }
}

function processForecastData(list: any[], days: number) {
  const dailyForecasts: any[] = [];
  const processedDates = new Set<string>();
  
  for (const item of list) {
    const date = new Date(item.dt * 1000).toISOString().split('T')[0];
    
    if (!processedDates.has(date) && dailyForecasts.length < days) {
      processedDates.add(date);
      
      // Get hourly data for this day
      const dayStart = new Date(date + 'T00:00:00Z').getTime() / 1000;
      const dayEnd = new Date(date + 'T23:59:59Z').getTime() / 1000;
      
      const hourlyData = list
        .filter(hourItem => hourItem.dt >= dayStart && hourItem.dt <= dayEnd)
        .map(hourItem => ({
          time: new Date(hourItem.dt * 1000).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          temp_c: Math.round(hourItem.main.temp),
          condition: {
            text: hourItem.weather[0].description,
            icon: hourItem.weather[0].icon,
          },
          wind_kph: Math.round(hourItem.wind.speed * 3.6),
          humidity: hourItem.main.humidity,
          chance_of_rain: hourItem.pop ? Math.round(hourItem.pop * 100) : 0,
        }));
      
      // Get min/max for the day
      const dayItems = list.filter(hourItem => {
        const itemDate = new Date(hourItem.dt * 1000).toISOString().split('T')[0];
        return itemDate === date;
      });
      
      const maxTemp = Math.max(...dayItems.map(item => item.main.temp));
      const minTemp = Math.min(...dayItems.map(item => item.main.temp));
      
      dailyForecasts.push({
        date,
        day: {
          maxtemp_c: Math.round(maxTemp),
          mintemp_c: Math.round(minTemp),
          condition: {
            text: item.weather[0].description,
            icon: item.weather[0].icon,
          },
        },
        hour: hourlyData,
      });
    }
  }
  
  return dailyForecasts;
}
