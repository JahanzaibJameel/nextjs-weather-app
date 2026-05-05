import pino from 'pino';
import { env } from './env';

// Create logger instance with environment-specific configuration
const logger = pino({
  level: env.NODE_ENV === 'production' ? 'info' : 'debug',
  // Use pretty printing in development
  transport: env.NODE_ENV !== 'production' ? {
    target: 'pino-pretty',
  } : undefined,
  // Add request ID for correlation and system info
  mixin() {
    return {
      hostname: process.env.HOSTNAME || 'unknown',
      pid: process.pid,
      // Add request ID for correlation
      reqId: Math.random().toString(36).substr(2, 9),
    };
  },
});

export default logger;
