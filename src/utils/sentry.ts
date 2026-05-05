import * as Sentry from '@sentry/nextjs';

export function initSentry() {
  if (typeof window !== 'undefined') {
    // Client-side initialization
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      environment: process.env.NODE_ENV || 'development',
      release: process.env.VERCEL_GIT_COMMIT_SHA || process.env.npm_package_version || 'unknown',
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
      beforeSend(event) {
        // Filter out certain errors
        if (event.exception) {
          const error = event.exception.values?.[0];
          if (error?.value?.includes('Network request failed')) {
            return null; // Don't send network errors
          }
        }
        return event;
      },
    });
  }
}

export function captureException(error: Error, context?: Record<string, any>) {
  console.error('Captured exception:', error);
  
  Sentry.withScope((scope) => {
    if (context) {
      Object.entries(context).forEach(([key, value]) => {
        scope.setContext(key, value);
      });
    }
    Sentry.captureException(error);
  });
}

export function captureMessage(message: string, level: Sentry.SeverityLevel = 'info') {
  console.log(`Sentry message [${level}]:`, message);
  Sentry.captureMessage(message, level);
}

export function setUser(user: { id?: string; email?: string; username?: string }) {
  Sentry.setUser(user);
}

export function clearUser() {
  Sentry.setUser(null);
}
