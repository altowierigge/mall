// Advanced Logging System
// Structured logging with multiple transports and log levels

import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';
import { Request, Response } from 'express';

// Log levels
const LOG_LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6
};

// Log colors
const LOG_COLORS = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  verbose: 'grey',
  debug: 'blue',
  silly: 'rainbow'
};

// Custom log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.prettyPrint()
);

// Console format for development
const consoleFormat = winston.format.combine(
  winston.format.colorize({ all: true }),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    return `${timestamp} [${level}]: ${message} ${
      Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''
    }`;
  })
);

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../../logs');

// Daily rotate file transport for general logs
const fileRotateTransport = new DailyRotateFile({
  filename: path.join(logsDir, 'application-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  maxSize: '20m',
  maxFiles: '14d',
  format: logFormat,
  zippedArchive: true,
  auditFile: path.join(logsDir, 'audit.json')
});

// Daily rotate file transport for error logs
const errorFileRotateTransport = new DailyRotateFile({
  filename: path.join(logsDir, 'error-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  maxSize: '20m',
  maxFiles: '30d',
  format: logFormat,
  level: 'error',
  zippedArchive: true,
  auditFile: path.join(logsDir, 'error-audit.json')
});

// Daily rotate file transport for performance logs
const performanceFileRotateTransport = new DailyRotateFile({
  filename: path.join(logsDir, 'performance-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  maxSize: '20m',
  maxFiles: '7d',
  format: logFormat,
  zippedArchive: true,
  auditFile: path.join(logsDir, 'performance-audit.json')
});

// Daily rotate file transport for security logs
const securityFileRotateTransport = new DailyRotateFile({
  filename: path.join(logsDir, 'security-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  maxSize: '20m',
  maxFiles: '30d',
  format: logFormat,
  zippedArchive: true,
  auditFile: path.join(logsDir, 'security-audit.json')
});

// Create logger instance
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  levels: LOG_LEVELS,
  format: logFormat,
  transports: [
    fileRotateTransport,
    errorFileRotateTransport,
    // Console transport for development
    ...(process.env.NODE_ENV !== 'production' ? [
      new winston.transports.Console({
        format: consoleFormat
      })
    ] : [])
  ],
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(logsDir, 'exceptions.log'),
      format: logFormat
    })
  ],
  rejectionHandlers: [
    new winston.transports.File({
      filename: path.join(logsDir, 'rejections.log'),
      format: logFormat
    })
  ],
  exitOnError: false
});

// Performance logger
const performanceLogger = winston.createLogger({
  level: 'info',
  format: logFormat,
  transports: [
    performanceFileRotateTransport,
    ...(process.env.NODE_ENV !== 'production' ? [
      new winston.transports.Console({
        format: consoleFormat
      })
    ] : [])
  ]
});

// Security logger
const securityLogger = winston.createLogger({
  level: 'info',
  format: logFormat,
  transports: [
    securityFileRotateTransport,
    ...(process.env.NODE_ENV !== 'production' ? [
      new winston.transports.Console({
        format: consoleFormat
      })
    ] : [])
  ]
});

// Add colors to winston
winston.addColors(LOG_COLORS);

// Interface for structured logging
interface LogContext {
  userId?: string;
  requestId?: string;
  sessionId?: string;
  ip?: string;
  userAgent?: string;
  method?: string;
  path?: string;
  statusCode?: number;
  responseTime?: number;
  error?: Error;
  stack?: string;
  [key: string]: any;
}

// Enhanced logging functions
class Logger {
  private static instance: Logger;
  private logger: winston.Logger;
  private performanceLogger: winston.Logger;
  private securityLogger: winston.Logger;

  private constructor() {
    this.logger = logger;
    this.performanceLogger = performanceLogger;
    this.securityLogger = securityLogger;
  }

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  // General logging methods
  error(message: string, context?: LogContext): void {
    this.logger.error(message, context);
  }

  warn(message: string, context?: LogContext): void {
    this.logger.warn(message, context);
  }

  info(message: string, context?: LogContext): void {
    this.logger.info(message, context);
  }

  http(message: string, context?: LogContext): void {
    this.logger.http(message, context);
  }

  debug(message: string, context?: LogContext): void {
    this.logger.debug(message, context);
  }

  // Performance logging
  performance(message: string, context: LogContext): void {
    this.performanceLogger.info(message, {
      ...context,
      type: 'performance',
      timestamp: new Date().toISOString()
    });
  }

  // Security logging
  security(message: string, context: LogContext): void {
    this.securityLogger.info(message, {
      ...context,
      type: 'security',
      timestamp: new Date().toISOString()
    });
  }

  // Authentication logging
  auth(message: string, context: LogContext): void {
    this.securityLogger.info(message, {
      ...context,
      type: 'authentication',
      timestamp: new Date().toISOString()
    });
  }

  // Business logic logging
  business(message: string, context: LogContext): void {
    this.logger.info(message, {
      ...context,
      type: 'business',
      timestamp: new Date().toISOString()
    });
  }

  // API request logging
  apiRequest(req: Request, res: Response, responseTime: number): void {
    const context: LogContext = {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      responseTime,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      requestId: req.get('X-Request-ID'),
      userId: (req as any).user?.id,
      timestamp: new Date().toISOString()
    };

    const message = `${req.method} ${req.path} ${res.statusCode} ${responseTime}ms`;
    
    if (res.statusCode >= 400) {
      this.error(message, context);
    } else {
      this.http(message, context);
    }
  }

  // Database operation logging
  database(operation: string, table: string, context?: LogContext): void {
    this.info(`Database ${operation} on ${table}`, {
      ...context,
      type: 'database',
      operation,
      table,
      timestamp: new Date().toISOString()
    });
  }

  // Cache operation logging
  cache(operation: string, key: string, hit: boolean, context?: LogContext): void {
    this.info(`Cache ${operation} for key ${key} - ${hit ? 'HIT' : 'MISS'}`, {
      ...context,
      type: 'cache',
      operation,
      key,
      hit,
      timestamp: new Date().toISOString()
    });
  }

  // File operation logging
  file(operation: string, filename: string, context?: LogContext): void {
    this.info(`File ${operation} - ${filename}`, {
      ...context,
      type: 'file',
      operation,
      filename,
      timestamp: new Date().toISOString()
    });
  }

  // Email operation logging
  email(operation: string, recipient: string, context?: LogContext): void {
    this.info(`Email ${operation} to ${recipient}`, {
      ...context,
      type: 'email',
      operation,
      recipient,
      timestamp: new Date().toISOString()
    });
  }

  // External API logging
  externalApi(service: string, endpoint: string, statusCode: number, responseTime: number, context?: LogContext): void {
    this.info(`External API call to ${service} ${endpoint} - ${statusCode} ${responseTime}ms`, {
      ...context,
      type: 'external-api',
      service,
      endpoint,
      statusCode,
      responseTime,
      timestamp: new Date().toISOString()
    });
  }

  // Custom metric logging
  metric(name: string, value: number, unit: string, context?: LogContext): void {
    this.info(`Metric ${name}: ${value} ${unit}`, {
      ...context,
      type: 'metric',
      metricName: name,
      metricValue: value,
      metricUnit: unit,
      timestamp: new Date().toISOString()
    });
  }
}

// Export singleton instance
export const appLogger = Logger.getInstance();

// Export individual loggers for specific use cases
export { logger, performanceLogger, securityLogger };

// Export types
export type { LogContext };