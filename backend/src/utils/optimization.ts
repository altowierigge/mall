// Performance Optimization Utilities
// Helper functions for performance optimization and monitoring

import { pool } from '../config/database';
import { Request, Response } from 'express';

export interface OptimizationResult {
  success: boolean;
  optimizations: string[];
  metrics: {
    before: any;
    after: any;
    improvement: number;
  };
}

export interface CacheConfig {
  ttl: number; // Time to live in seconds
  maxSize: number; // Maximum cache size
  keyPrefix: string;
}

// Simple in-memory cache for performance optimization
class MemoryCache {
  private cache: Map<string, { data: any; expiry: number }> = new Map();
  private readonly maxSize: number;
  private readonly defaultTTL: number;

  constructor(maxSize: number = 1000, defaultTTL: number = 300) {
    this.maxSize = maxSize;
    this.defaultTTL = defaultTTL;
  }

  set(key: string, data: any, ttl?: number): void {
    const expiry = Date.now() + (ttl || this.defaultTTL) * 1000;
    
    // Clean up expired entries if cache is getting full
    if (this.cache.size >= this.maxSize) {
      this.cleanup();
    }

    this.cache.set(key, { data, expiry });
  }

  get(key: string): any | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    // Check if entry has expired
    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }

  // Clean up expired entries
  private cleanup(): void {
    const now = Date.now();
    const expiredKeys: string[] = [];

    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiry) {
        expiredKeys.push(key);
      }
    }

    expiredKeys.forEach(key => this.cache.delete(key));
  }

  // Get cache statistics
  getStats(): { size: number; hitRate: number; expiredCount: number } {
    this.cleanup();
    
    return {
      size: this.cache.size,
      hitRate: 0, // Would need to track hits/misses for accurate calculation
      expiredCount: 0 // Would need to track expired entries
    };
  }
}

// Global cache instances
export const queryCache = new MemoryCache(500, 300); // 5 minute TTL
export const apiCache = new MemoryCache(1000, 60); // 1 minute TTL

// Cache middleware factory
export const cacheMiddleware = (ttl: number = 300, keyGenerator?: (req: Request) => string) => {
  return (req: Request, res: Response, next: Function) => {
    const cacheKey = keyGenerator ? keyGenerator(req) : `${req.method}:${req.originalUrl}`;
    const cachedData = apiCache.get(cacheKey);

    if (cachedData) {
      res.set('X-Cache', 'HIT');
      return res.json(cachedData);
    }

    // Override res.json to cache the response
    const originalJson = res.json;
    res.json = function(data: any) {
      // Only cache successful responses
      if (res.statusCode >= 200 && res.statusCode < 300) {
        apiCache.set(cacheKey, data, ttl);
      }
      res.set('X-Cache', 'MISS');
      return originalJson.call(this, data);
    };

    next();
  };
};

// Database query optimization
export const optimizeQuery = async (query: string, params: any[] = []): Promise<any> => {
  const cacheKey = `query:${query}:${JSON.stringify(params)}`;
  const cachedResult = queryCache.get(cacheKey);

  if (cachedResult) {
    return cachedResult;
  }

  try {
    const result = await pool.query(query, params);
    queryCache.set(cacheKey, result);
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

// Database connection pool optimization
export const optimizeConnectionPool = async (): Promise<OptimizationResult> => {
  const beforeStats = await getConnectionPoolStats();
  
  // Optimization recommendations
  const optimizations: string[] = [];
  
  // Check idle connections
  if (beforeStats.idleConnections > 10) {
    optimizations.push('Reduce idle connection pool size');
  }
  
  // Check active connections
  if (beforeStats.activeConnections > 50) {
    optimizations.push('Increase connection pool size or optimize queries');
  }
  
  // Check wait count
  if (beforeStats.waitCount > 5) {
    optimizations.push('Increase max connection pool size');
  }

  const afterStats = await getConnectionPoolStats();
  
  return {
    success: true,
    optimizations,
    metrics: {
      before: beforeStats,
      after: afterStats,
      improvement: calculateImprovement(beforeStats, afterStats)
    }
  };
};

// Memory optimization
export const optimizeMemory = (): OptimizationResult => {
  const beforeMemory = process.memoryUsage();
  
  // Force garbage collection if available
  if (global.gc) {
    global.gc();
  }
  
  // Clear caches
  queryCache.clear();
  apiCache.clear();
  
  const afterMemory = process.memoryUsage();
  const optimizations = [
    'Cleared query cache',
    'Cleared API cache',
    'Triggered garbage collection'
  ];
  
  return {
    success: true,
    optimizations,
    metrics: {
      before: {
        heapUsed: Math.round(beforeMemory.heapUsed / 1024 / 1024),
        heapTotal: Math.round(beforeMemory.heapTotal / 1024 / 1024),
        rss: Math.round(beforeMemory.rss / 1024 / 1024)
      },
      after: {
        heapUsed: Math.round(afterMemory.heapUsed / 1024 / 1024),
        heapTotal: Math.round(afterMemory.heapTotal / 1024 / 1024),
        rss: Math.round(afterMemory.rss / 1024 / 1024)
      },
      improvement: calculateMemoryImprovement(beforeMemory, afterMemory)
    }
  };
};

// Response compression optimization
export const optimizeResponseCompression = (data: any): any => {
  // Remove unnecessary fields for API responses
  if (Array.isArray(data)) {
    return data.map(item => removeUnnecessaryFields(item));
  }
  
  return removeUnnecessaryFields(data);
};

// Database index optimization suggestions
export const suggestDatabaseIndexes = async (): Promise<string[]> => {
  const suggestions: string[] = [];
  
  try {
    // Check for missing indexes on frequently queried columns
    const queries = [
      {
        table: 'shops',
        columns: ['mall_id', 'category', 'is_active'],
        query: 'SELECT COUNT(*) FROM shops WHERE mall_id = $1 AND is_active = true'
      },
      {
        table: 'products',
        columns: ['shop_id', 'category', 'is_available'],
        query: 'SELECT COUNT(*) FROM products WHERE shop_id = $1 AND is_available = true'
      },
      {
        table: 'users',
        columns: ['email', 'role', 'is_active'],
        query: 'SELECT COUNT(*) FROM users WHERE email = $1 AND is_active = true'
      }
    ];

    for (const queryInfo of queries) {
      // Check if indexes exist
      const indexQuery = `
        SELECT indexname, indexdef 
        FROM pg_indexes 
        WHERE tablename = $1 AND indexdef LIKE '%${queryInfo.columns.join('%')}%'
      `;
      
      const indexResult = await pool.query(indexQuery, [queryInfo.table]);
      
      if (indexResult.rows.length === 0) {
        suggestions.push(`CREATE INDEX idx_${queryInfo.table}_${queryInfo.columns.join('_')} ON ${queryInfo.table}(${queryInfo.columns.join(', ')});`);
      }
    }
  } catch (error) {
    console.error('Error checking database indexes:', error);
  }
  
  return suggestions;
};

// Performance monitoring utilities
export const getSystemMetrics = () => {
  const memoryUsage = process.memoryUsage();
  const cpuUsage = process.cpuUsage();
  
  return {
    memory: {
      heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024),
      heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024),
      rss: Math.round(memoryUsage.rss / 1024 / 1024),
      external: Math.round(memoryUsage.external / 1024 / 1024)
    },
    cpu: {
      user: cpuUsage.user,
      system: cpuUsage.system
    },
    uptime: process.uptime(),
    loadAverage: require('os').loadavg()
  };
};

// Helper functions
async function getConnectionPoolStats(): Promise<any> {
  try {
    const result = await pool.query('SELECT * FROM pg_stat_activity WHERE datname = current_database()');
    return {
      totalConnections: result.rows.length,
      activeConnections: result.rows.filter(row => row.state === 'active').length,
      idleConnections: result.rows.filter(row => row.state === 'idle').length,
      waitCount: result.rows.filter(row => row.wait_event_type === 'Lock').length
    };
  } catch (error) {
    console.error('Error getting connection pool stats:', error);
    return {
      totalConnections: 0,
      activeConnections: 0,
      idleConnections: 0,
      waitCount: 0
    };
  }
}

function calculateImprovement(before: any, after: any): number {
  // Calculate improvement percentage based on active connections
  const beforeActive = before.activeConnections || 0;
  const afterActive = after.activeConnections || 0;
  
  if (beforeActive === 0) return 0;
  
  return Math.round(((beforeActive - afterActive) / beforeActive) * 100);
}

function calculateMemoryImprovement(before: NodeJS.MemoryUsage, after: NodeJS.MemoryUsage): number {
  const beforeHeap = before.heapUsed;
  const afterHeap = after.heapUsed;
  
  if (beforeHeap === 0) return 0;
  
  return Math.round(((beforeHeap - afterHeap) / beforeHeap) * 100);
}

function removeUnnecessaryFields(item: any): any {
  if (!item || typeof item !== 'object') return item;
  
  const fieldsToRemove = ['password', 'hash', 'salt', 'token', 'secret'];
  const cleaned = { ...item };
  
  fieldsToRemove.forEach(field => {
    delete cleaned[field];
  });
  
  return cleaned;
}