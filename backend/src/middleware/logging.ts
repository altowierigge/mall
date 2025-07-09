// Logging Middleware
// Advanced request logging with performance metrics

import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { appLogger } from '../utils/logger';

// Extend Request interface to include logging context
declare global {
  namespace Express {
    interface Request {
      requestId: string;
      startTime: number;
      log: {
        info: (message: string, context?: any) => void;
        warn: (message: string, context?: any) => void;
        error: (message: string, context?: any) => void;
        debug: (message: string, context?: any) => void;
      };
    }
  }
}

// Request logging middleware
export const requestLoggingMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const requestId = uuidv4();
  const startTime = Date.now();

  // Add request ID and start time to request object
  req.requestId = requestId;
  req.startTime = startTime;

  // Add request-specific logger
  req.log = {
    info: (message: string, context?: any) => {
      appLogger.info(message, {
        requestId,
        userId: (req as any).user?.id,
        ip: req.ip,
        method: req.method,
        path: req.path,
        ...context
      });
    },
    warn: (message: string, context?: any) => {
      appLogger.warn(message, {
        requestId,
        userId: (req as any).user?.id,
        ip: req.ip,
        method: req.method,
        path: req.path,
        ...context
      });
    },
    error: (message: string, context?: any) => {
      appLogger.error(message, {
        requestId,
        userId: (req as any).user?.id,
        ip: req.ip,
        method: req.method,
        path: req.path,
        ...context
      });
    },
    debug: (message: string, context?: any) => {
      appLogger.debug(message, {
        requestId,
        userId: (req as any).user?.id,
        ip: req.ip,
        method: req.method,
        path: req.path,
        ...context
      });
    }
  };

  // Set response headers
  res.setHeader('X-Request-ID', requestId);

  // Log request start
  appLogger.http(`Incoming request: ${req.method} ${req.path}`, {
    requestId,
    method: req.method,
    path: req.path,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    contentLength: req.get('Content-Length'),
    contentType: req.get('Content-Type'),
    query: req.query,
    params: req.params,
    timestamp: new Date().toISOString()
  });

  // Override res.end to log response
  const originalEnd = res.end;
  res.end = function(chunk?: any, encoding?: BufferEncoding): void {
    const endTime = Date.now();
    const responseTime = endTime - startTime;

    // Log response completion
    appLogger.apiRequest(req, res, responseTime);

    // Log performance metrics
    appLogger.performance(`Request completed: ${req.method} ${req.path}`, {
      requestId,
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      responseTime,
      contentLength: res.get('Content-Length'),
      userId: (req as any).user?.id,
      ip: req.ip,
      timestamp: new Date().toISOString()
    });

    // Log slow requests
    if (responseTime > 1000) {
      appLogger.warn(`Slow request detected: ${req.method} ${req.path} - ${responseTime}ms`, {
        requestId,
        method: req.method,
        path: req.path,
        responseTime,
        statusCode: res.statusCode,
        userId: (req as any).user?.id,
        ip: req.ip,
        timestamp: new Date().toISOString()
      });
    }

    // Log error responses
    if (res.statusCode >= 400) {
      appLogger.error(`Error response: ${req.method} ${req.path} - ${res.statusCode}`, {
        requestId,
        method: req.method,
        path: req.path,
        statusCode: res.statusCode,
        responseTime,
        userId: (req as any).user?.id,
        ip: req.ip,
        timestamp: new Date().toISOString()
      });
    }

    originalEnd.call(this, chunk, encoding);
  };

  next();
};

// Security logging middleware
export const securityLoggingMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  // Log potential security issues
  const suspiciousPatterns = [
    /\.\./,  // Path traversal
    /<script/i,  // XSS attempts
    /union.*select/i,  // SQL injection
    /javascript:/i,  // JavaScript injection
    /data:text\/html/i,  // Data URI XSS
    /vbscript:/i,  // VBScript injection
    /onload=/i,  // Event handler injection
    /onerror=/i,  // Error handler injection
  ];

  const userAgent = req.get('User-Agent') || '';
  const checkSuspiciousActivity = (value: string): boolean => {
    return suspiciousPatterns.some(pattern => pattern.test(value));
  };

  // Check URL for suspicious patterns
  if (checkSuspiciousActivity(req.url)) {
    appLogger.security('Suspicious URL pattern detected', {
      requestId: req.requestId,
      method: req.method,
      path: req.path,
      ip: req.ip,
      userAgent,
      suspiciousUrl: req.url,
      type: 'suspicious-url',
      timestamp: new Date().toISOString()
    });
  }

  // Check user agent for suspicious patterns
  if (checkSuspiciousActivity(userAgent)) {
    appLogger.security('Suspicious User-Agent detected', {
      requestId: req.requestId,
      method: req.method,
      path: req.path,
      ip: req.ip,
      userAgent,
      type: 'suspicious-user-agent',
      timestamp: new Date().toISOString()
    });
  }

  // Check for rapid requests from same IP
  const requestCount = getRequestCount(req.ip);
  if (requestCount > 100) { // More than 100 requests in the tracking window
    appLogger.security('High request rate detected', {
      requestId: req.requestId,
      method: req.method,
      path: req.path,
      ip: req.ip,
      userAgent,
      requestCount,
      type: 'high-request-rate',
      timestamp: new Date().toISOString()
    });
  }

  next();
};

// Authentication logging middleware
export const authLoggingMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const originalJson = res.json;
  
  res.json = function(data: any) {
    // Log authentication attempts
    if (req.path.includes('/auth/login')) {
      const isSuccess = res.statusCode === 200;
      const email = req.body?.email;
      
      appLogger.auth(`Login attempt: ${isSuccess ? 'SUCCESS' : 'FAILED'}`, {
        requestId: req.requestId,
        email,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        success: isSuccess,
        statusCode: res.statusCode,
        type: 'login-attempt',
        timestamp: new Date().toISOString()
      });

      // Log failed login attempts for security monitoring
      if (!isSuccess) {
        appLogger.security('Failed login attempt', {
          requestId: req.requestId,
          email,
          ip: req.ip,
          userAgent: req.get('User-Agent'),
          statusCode: res.statusCode,
          type: 'failed-login',
          timestamp: new Date().toISOString()
        });
      }
    }

    // Log logout attempts
    if (req.path.includes('/auth/logout')) {
      appLogger.auth('User logout', {
        requestId: req.requestId,
        userId: (req as any).user?.id,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        type: 'logout',
        timestamp: new Date().toISOString()
      });
    }

    // Log token refresh attempts
    if (req.path.includes('/auth/refresh')) {
      const isSuccess = res.statusCode === 200;
      appLogger.auth(`Token refresh: ${isSuccess ? 'SUCCESS' : 'FAILED'}`, {
        requestId: req.requestId,
        userId: (req as any).user?.id,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        success: isSuccess,
        statusCode: res.statusCode,
        type: 'token-refresh',
        timestamp: new Date().toISOString()
      });
    }

    return originalJson.call(this, data);
  };

  next();
};

// Business logic logging middleware
export const businessLoggingMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const originalJson = res.json;
  
  res.json = function(data: any) {
    const userId = (req as any).user?.id;
    
    // Log business-critical operations
    if (req.method === 'POST' && req.path.includes('/products')) {
      appLogger.business('Product created', {
        requestId: req.requestId,
        userId,
        productData: req.body,
        ip: req.ip,
        type: 'product-creation',
        timestamp: new Date().toISOString()
      });
    }

    if (req.method === 'PUT' && req.path.includes('/products')) {
      appLogger.business('Product updated', {
        requestId: req.requestId,
        userId,
        productId: req.params.id,
        productData: req.body,
        ip: req.ip,
        type: 'product-update',
        timestamp: new Date().toISOString()
      });
    }

    if (req.method === 'DELETE' && req.path.includes('/products')) {
      appLogger.business('Product deleted', {
        requestId: req.requestId,
        userId,
        productId: req.params.id,
        ip: req.ip,
        type: 'product-deletion',
        timestamp: new Date().toISOString()
      });
    }

    if (req.method === 'PUT' && req.path.includes('/shop/profile')) {
      appLogger.business('Shop profile updated', {
        requestId: req.requestId,
        userId,
        profileData: req.body,
        ip: req.ip,
        type: 'shop-profile-update',
        timestamp: new Date().toISOString()
      });
    }

    return originalJson.call(this, data);
  };

  next();
};

// Simple request counting for rate limiting detection
const requestCounts = new Map<string, { count: number; timestamp: number }>();

function getRequestCount(ip: string): number {
  const now = Date.now();
  const window = 60000; // 1 minute window
  
  const record = requestCounts.get(ip);
  if (!record || now - record.timestamp > window) {
    requestCounts.set(ip, { count: 1, timestamp: now });
    return 1;
  }
  
  record.count++;
  return record.count;
}

// Clean up old request counts periodically
setInterval(() => {
  const now = Date.now();
  const window = 60000; // 1 minute window
  
  for (const [ip, record] of requestCounts.entries()) {
    if (now - record.timestamp > window) {
      requestCounts.delete(ip);
    }
  }
}, 60000); // Clean up every minute

// Export middleware functions
export {
  requestLoggingMiddleware,
  securityLoggingMiddleware,
  authLoggingMiddleware,
  businessLoggingMiddleware
};