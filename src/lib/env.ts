import { cleanEnv, str, url } from 'envalid';

export const env = cleanEnv(process.env, {
  // Required environment variables
  WEATHER_API_KEY: str({
    desc: 'OpenWeatherMap API key',
    example: 'your_openweathermap_api_key_here',
  }),
  
  // Optional environment variables with defaults
  RATE_LIMIT_MAX_REQUESTS: str({
    desc: 'Maximum requests per rate limit window',
    example: '10',
    default: '10',
  }),
  
  RATE_LIMIT_WINDOW_MS: str({
    desc: 'Rate limit window in milliseconds',
    example: '10000',
    default: '10000',
  }),
  
  // Sentry configuration
  NEXT_PUBLIC_SENTRY_DSN: url({
    desc: 'Sentry DSN for error tracking',
    example: 'https://your-org.ingest.sentry.io/project-id',
    default: '',
  }),
  
  // Environment detection
  NODE_ENV: str({
    desc: 'Node environment',
    example: 'production',
    default: 'development',
  }),
});

export type Env = typeof env;
