// Performance Monitoring Middleware
// Tracks API performance metrics and provides optimization insights

import { Request, Response, NextFunction } from 'express';
import { performance } from 'perf_hooks';

interface PerformanceMetrics {
  endpoint: string;
  method: string;
  responseTime: number;
  statusCode: number;
  timestamp: Date;
  memoryUsage: NodeJS.MemoryUsage;
  userAgent?: string;
}

interface PerformanceStats {
  totalRequests: number;
  averageResponseTime: number;
  slowestEndpoint: string;
  slowestResponseTime: number;
  errorRate: number;
  memoryTrend: number[];
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private readonly MAX_METRICS = 10000; // Keep last 10k metrics
  private readonly SLOW_THRESHOLD = 1000; // 1 second

  // Record performance metric
  recordMetric(metric: PerformanceMetrics): void {
    this.metrics.push(metric);
    
    // Keep only recent metrics
    if (this.metrics.length > this.MAX_METRICS) {
      this.metrics = this.metrics.slice(-this.MAX_METRICS);
    }

    // Log slow requests
    if (metric.responseTime > this.SLOW_THRESHOLD) {
      console.warn(`🐌 Slow request detected: ${metric.method} ${metric.endpoint} - ${metric.responseTime}ms`);
    }
  }

  // Get performance statistics
  getStats(): PerformanceStats {
    if (this.metrics.length === 0) {
      return {
        totalRequests: 0,
        averageResponseTime: 0,
        slowestEndpoint: '',
        slowestResponseTime: 0,
        errorRate: 0,
        memoryTrend: []
      };
    }

    const totalRequests = this.metrics.length;
    const averageResponseTime = this.metrics.reduce((sum, m) => sum + m.responseTime, 0) / totalRequests;
    
    const slowestMetric = this.metrics.reduce((slowest, current) => 
      current.responseTime > slowest.responseTime ? current : slowest
    );

    const errorCount = this.metrics.filter(m => m.statusCode >= 400).length;
    const errorRate = (errorCount / totalRequests) * 100;

    const memoryTrend = this.metrics.slice(-10).map(m => m.memoryUsage.heapUsed / 1024 / 1024);

    return {
      totalRequests,
      averageResponseTime: Math.round(averageResponseTime * 100) / 100,
      slowestEndpoint: `${slowestMetric.method} ${slowestMetric.endpoint}`,
      slowestResponseTime: Math.round(slowestMetric.responseTime * 100) / 100,
      errorRate: Math.round(errorRate * 100) / 100,
      memoryTrend
    };
  }

  // Get endpoint-specific metrics
  getEndpointMetrics(endpoint: string, method?: string): PerformanceMetrics[] {
    return this.metrics.filter(m => {
      const endpointMatch = m.endpoint === endpoint || m.endpoint.includes(endpoint);
      const methodMatch = !method || m.method === method;
      return endpointMatch && methodMatch;
    });
  }

  // Get slow requests
  getSlowRequests(threshold: number = this.SLOW_THRESHOLD): PerformanceMetrics[] {
    return this.metrics.filter(m => m.responseTime > threshold);
  }

  // Get error requests
  getErrorRequests(): PerformanceMetrics[] {
    return this.metrics.filter(m => m.statusCode >= 400);
  }

  // Clear old metrics
  clearMetrics(): void {
    this.metrics = [];
  }

  // Export metrics for analysis
  exportMetrics(): PerformanceMetrics[] {
    return [...this.metrics];
  }
}

// Global performance monitor instance
const performanceMonitor = new PerformanceMonitor();

// Performance tracking middleware
export const performanceMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const startTime = performance.now();
  const startMemory = process.memoryUsage();

  // Override res.end to capture response time
  const originalEnd = res.end;
  res.end = function(chunk?: any, encoding?: any): Response<any, Record<string, any>> {
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    const endMemory = process.memoryUsage();

    // Record performance metric
    const metric: PerformanceMetrics = {
      endpoint: req.route?.path || req.path,
      method: req.method,
      responseTime: Math.round(responseTime * 100) / 100,
      statusCode: res.statusCode,
      timestamp: new Date(),
      memoryUsage: {
        rss: endMemory.rss - startMemory.rss,
        heapTotal: endMemory.heapTotal - startMemory.heapTotal,
        heapUsed: endMemory.heapUsed - startMemory.heapUsed,
        external: endMemory.external - startMemory.external,
        arrayBuffers: endMemory.arrayBuffers - startMemory.arrayBuffers
      },
      userAgent: req.get('User-Agent')
    };

    performanceMonitor.recordMetric(metric);

    // Add performance headers
    res.set('X-Response-Time', `${responseTime}ms`);
    res.set('X-Memory-Usage', `${Math.round(endMemory.heapUsed / 1024 / 1024)}MB`);

    // Call original end
    return originalEnd.call(this, chunk, encoding);
  };

  next();
};

// Performance statistics endpoint
export const performanceStatsHandler = (_req: Request, res: Response): void => {
  const stats = performanceMonitor.getStats();
  
  res.json({
    success: true,
    data: {
      ...stats,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch
    }
  });
};

// Slow requests endpoint
export const slowRequestsHandler = (req: Request, res: Response): void => {
  const threshold = parseInt(req.query.threshold as string) || 1000;
  const slowRequests = performanceMonitor.getSlowRequests(threshold);
  
  res.json({
    success: true,
    data: {
      threshold,
      count: slowRequests.length,
      requests: slowRequests.slice(-50) // Return last 50 slow requests
    }
  });
};

// Error requests endpoint
export const errorRequestsHandler = (_req: Request, res: Response): void => {
  const errorRequests = performanceMonitor.getErrorRequests();
  
  res.json({
    success: true,
    data: {
      count: errorRequests.length,
      requests: errorRequests.slice(-50) // Return last 50 error requests
    }
  });
};

// Endpoint-specific metrics
export const endpointMetricsHandler = (req: Request, res: Response): void => {
  const { endpoint, method } = req.query;
  const metrics = performanceMonitor.getEndpointMetrics(endpoint as string, method as string);
  
  if (metrics.length === 0) {
    res.json({
      success: true,
      data: {
        endpoint,
        method,
        message: 'No metrics found for this endpoint'
      }
    });
    return;
  }

  const avgResponseTime = metrics.reduce((sum, m) => sum + m.responseTime, 0) / metrics.length;
  const minResponseTime = Math.min(...metrics.map(m => m.responseTime));
  const maxResponseTime = Math.max(...metrics.map(m => m.responseTime));
  
  res.json({
    success: true,
    data: {
      endpoint,
      method,
      totalRequests: metrics.length,
      averageResponseTime: Math.round(avgResponseTime * 100) / 100,
      minResponseTime: Math.round(minResponseTime * 100) / 100,
      maxResponseTime: Math.round(maxResponseTime * 100) / 100,
      recentMetrics: metrics.slice(-10)
    }
  });
};

// Memory monitoring
export const memoryMonitoringHandler = (_req: Request, res: Response): void => {
  const memoryUsage = process.memoryUsage();
  const stats = performanceMonitor.getStats();
  
  res.json({
    success: true,
    data: {
      current: {
        rss: Math.round(memoryUsage.rss / 1024 / 1024 * 100) / 100,
        heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024 * 100) / 100,
        heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024 * 100) / 100,
        external: Math.round(memoryUsage.external / 1024 / 1024 * 100) / 100,
        arrayBuffers: Math.round(memoryUsage.arrayBuffers / 1024 / 1024 * 100) / 100
      },
      trend: stats.memoryTrend,
      timestamp: new Date().toISOString()
    }
  });
};

// Performance optimization recommendations
export const optimizationRecommendationsHandler = (_req: Request, res: Response): void => {
  const stats = performanceMonitor.getStats();
  const slowRequests = performanceMonitor.getSlowRequests();
  
  const recommendations: string[] = [];

  // Response time recommendations
  if (stats.averageResponseTime > 500) {
    recommendations.push('Average response time is high (>500ms). Consider optimizing database queries and adding caching.');
  }

  // Error rate recommendations
  if (stats.errorRate > 5) {
    recommendations.push('Error rate is high (>5%). Review error logs and implement better error handling.');
  }

  // Memory recommendations
  const currentMemory = process.memoryUsage().heapUsed / 1024 / 1024;
  if (currentMemory > 500) {
    recommendations.push('Memory usage is high (>500MB). Consider implementing memory optimization techniques.');
  }

  // Slow endpoint recommendations
  if (slowRequests.length > 0) {
    const slowEndpoints = slowRequests.reduce((acc, req) => {
      const key = `${req.method} ${req.endpoint}`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topSlowEndpoint = Object.entries(slowEndpoints)
      .sort(([,a], [,b]) => b - a)[0];

    if (topSlowEndpoint) {
      recommendations.push(`Slow endpoint detected: ${topSlowEndpoint[0]} (${topSlowEndpoint[1]} slow requests). Consider optimization.`);
    }
  }

  // General recommendations
  if (recommendations.length === 0) {
    recommendations.push('System performance is within acceptable limits. Continue monitoring.');
  }

  res.json({
    success: true,
    data: {
      recommendations,
      stats: {
        averageResponseTime: stats.averageResponseTime,
        errorRate: stats.errorRate,
        memoryUsage: currentMemory,
        slowRequests: slowRequests.length
      },
      timestamp: new Date().toISOString()
    }
  });
};

// Export performance monitor instance
export { performanceMonitor };