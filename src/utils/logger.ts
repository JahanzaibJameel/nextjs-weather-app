type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, any>;
  userId?: string;
  requestId?: string;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private logs: LogEntry[] = [];

  private formatLog(entry: LogEntry): string {
    const { level, message, timestamp, context, userId, requestId } = entry;
    
    let logString = `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    
    if (userId) logString += ` [user:${userId}]`;
    if (requestId) logString += ` [req:${requestId}]`;
    if (context) {
      logString += ` ${JSON.stringify(context)}`;
    }
    
    return logString;
  }

  private createLogEntry(level: LogLevel, message: string, context?: Record<string, any>): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
    };
  }

  debug(message: string, context?: Record<string, any>) {
    const entry = this.createLogEntry('debug', message, context);
    this.logs.push(entry);
    
    if (this.isDevelopment) {
      console.debug(this.formatLog(entry));
    }
  }

  info(message: string, context?: Record<string, any>) {
    const entry = this.createLogEntry('info', message, context);
    this.logs.push(entry);
    
    if (this.isDevelopment) {
      console.info(this.formatLog(entry));
    }
  }

  warn(message: string, context?: Record<string, any>) {
    const entry = this.createLogEntry('warn', message, context);
    this.logs.push(entry);
    
    if (this.isDevelopment) {
      console.warn(this.formatLog(entry));
    }
  }

  error(message: string, context?: Record<string, any>) {
    const entry = this.createLogEntry('error', message, context);
    this.logs.push(entry);
    
    if (this.isDevelopment) {
      console.error(this.formatLog(entry));
    }
  }

  // API-specific logging
  apiRequest(method: string, url: string, context?: Record<string, any>) {
    this.info(`API Request: ${method} ${url}`, {
      type: 'api_request',
      method,
      url,
      ...context,
    });
  }

  apiResponse(status: number, duration: number, context?: Record<string, any>) {
    this.info(`API Response: ${status} (${duration}ms)`, {
      type: 'api_response',
      status,
      duration,
      ...context,
    });
  }

  apiError(error: Error, context?: Record<string, any>) {
    this.error(`API Error: ${error.message}`, {
      type: 'api_error',
      stack: error.stack,
      ...context,
    });
  }

  // User interaction logging
  userAction(action: string, context?: Record<string, any>) {
    this.info(`User Action: ${action}`, {
      type: 'user_action',
      action,
      ...context,
    });
  }

  // Performance logging
  performance(metric: string, value: number, unit: string = 'ms', context?: Record<string, any>) {
    this.info(`Performance: ${metric} = ${value}${unit}`, {
      type: 'performance',
      metric,
      value,
      unit,
      ...context,
    });
  }

  // Get logs for debugging/exporting
  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  // Clear logs
  clearLogs() {
    this.logs = [];
  }
}

export const logger = new Logger();
