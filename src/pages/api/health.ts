import type { NextApiRequest, NextApiResponse } from 'next';
import { env } from '@/lib/env';

interface HealthResponse {
  status: 'ok' | 'error';
  timestamp: number;
  uptime: number;
  environment: string;
  version: string;
  checks?: {
    database: 'ok' | 'error';
    external_api: 'ok' | 'error';
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<HealthResponse>
) {
  const startTime = Date.now();
  
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({
      status: 'error',
      timestamp: startTime,
      uptime: process.uptime(),
      environment: env.NODE_ENV,
      version: process.env.npm_package_version || 'unknown',
    });
  }

  const checks: HealthResponse['checks'] = {
    database: 'ok', // In-memory store is always ok
    external_api: 'ok',
  };

  // Check external API connectivity
  try {
    const weatherApiKey = env.WEATHER_API_KEY;
    if (weatherApiKey) {
      const testUrl = `https://api.openweathermap.org/data/2.5/weather?q=London&units=metric&appid=${weatherApiKey}`;
      const response = await fetch(testUrl, { 
        method: 'HEAD', // Just check connectivity, don't fetch full data
        signal: AbortSignal.timeout(5000), // 5 second timeout
      });
      
      if (!response.ok) {
        checks.external_api = 'error';
      }
    } else {
      checks.external_api = 'error';
    }
  } catch (error) {
    console.error('Health check external API error:', error);
    checks.external_api = 'error';
  }

  const allChecksOk = Object.values(checks).every(check => check === 'ok');
  const statusCode = allChecksOk ? 200 : 503;

  const healthResponse: HealthResponse = {
    status: allChecksOk ? 'ok' : 'error',
    timestamp: startTime,
    uptime: process.uptime(),
    environment: env.NODE_ENV,
    version: process.env.npm_package_version || 'unknown',
    checks,
  };

  // Set cache headers
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  return res.status(statusCode).json(healthResponse);
}
