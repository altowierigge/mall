// Stress Test Processor
// Custom functions for stress testing scenarios

const jwt = require('jsonwebtoken');

// Test credentials
const testCredentials = {
  email: 'shop.owner@test.com',
  password: 'password123'
};

// Authentication function
function authenticateUser(requestParams, context, ee, next) {
  const options = {
    method: 'POST',
    url: '/api/v1/auth/login',
    json: testCredentials,
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const request = require('request');
  request(options, (error, response, body) => {
    if (error) {
      console.error('Authentication error:', error);
      return next(error);
    }

    if (response.statusCode === 200 && body.token) {
      context.vars.authToken = body.token;
      return next();
    } else {
      console.error('Authentication failed:', response.statusCode, body);
      return next(new Error('Authentication failed'));
    }
  });
}

// Generate random test data
function generateTestData(requestParams, context, ee, next) {
  const categories = ['electronics', 'fashion', 'food', 'books', 'sports'];
  const arabicNames = ['الكترونيات', 'أزياء', 'طعام', 'كتب', 'رياضة'];
  
  context.vars.testProduct = {
    name: `Test Product ${Math.random().toString(36).substr(2, 9)}`,
    name_ar: `منتج تجريبي ${Math.random().toString(36).substr(2, 9)}`,
    description: `Performance test product created at ${new Date().toISOString()}`,
    price: Math.floor(Math.random() * 1000) + 10,
    category: categories[Math.floor(Math.random() * categories.length)],
    is_available: Math.random() > 0.1, // 90% available
    stock_quantity: Math.floor(Math.random() * 100) + 1
  };

  return next();
}

// Validate response performance
function validateResponseTime(requestParams, response, context, ee, next) {
  const responseTime = response.timings.response;
  const threshold = 2000; // 2 seconds

  if (responseTime > threshold) {
    console.warn(`Slow response detected: ${responseTime}ms for ${requestParams.url}`);
    ee.emit('customStat', 'slowResponse', 1);
  }

  return next();
}

// Memory usage monitoring
function monitorMemoryUsage(requestParams, context, ee, next) {
  const used = process.memoryUsage();
  const memoryStats = {
    rss: Math.round(used.rss / 1024 / 1024 * 100) / 100,
    heapTotal: Math.round(used.heapTotal / 1024 / 1024 * 100) / 100,
    heapUsed: Math.round(used.heapUsed / 1024 / 1024 * 100) / 100,
    external: Math.round(used.external / 1024 / 1024 * 100) / 100
  };

  // Log memory usage every 100 requests
  if (context.vars.$loopCount % 100 === 0) {
    console.log('Memory usage:', memoryStats);
  }

  // Alert if memory usage is high
  if (memoryStats.heapUsed > 500) { // 500MB threshold
    console.warn('High memory usage detected:', memoryStats);
    ee.emit('customStat', 'highMemoryUsage', 1);
  }

  return next();
}

// Error handler
function handleError(requestParams, response, context, ee, next) {
  if (response.statusCode >= 400) {
    console.error(`Error ${response.statusCode}: ${requestParams.url}`);
    ee.emit('customStat', `error_${response.statusCode}`, 1);
  }

  return next();
}

// Custom metrics
function recordCustomMetrics(requestParams, response, context, ee, next) {
  const responseTime = response.timings.response;
  const statusCode = response.statusCode;

  // Record response time buckets
  if (responseTime < 100) {
    ee.emit('customStat', 'response_time_fast', 1);
  } else if (responseTime < 500) {
    ee.emit('customStat', 'response_time_medium', 1);
  } else if (responseTime < 1000) {
    ee.emit('customStat', 'response_time_slow', 1);
  } else {
    ee.emit('customStat', 'response_time_very_slow', 1);
  }

  // Record success rate
  if (statusCode >= 200 && statusCode < 300) {
    ee.emit('customStat', 'success_rate', 1);
  } else {
    ee.emit('customStat', 'error_rate', 1);
  }

  return next();
}

module.exports = {
  authenticateUser,
  generateTestData,
  validateResponseTime,
  monitorMemoryUsage,
  handleError,
  recordCustomMetrics
};