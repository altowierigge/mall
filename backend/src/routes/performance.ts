// Performance Monitoring Routes
// API endpoints for performance monitoring and optimization

import express from 'express';
import {
  performanceStatsHandler,
  slowRequestsHandler,
  errorRequestsHandler,
  endpointMetricsHandler,
  memoryMonitoringHandler,
  optimizationRecommendationsHandler
} from '../middleware/performance';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

// Apply authentication middleware to all performance routes
router.use(authenticateToken);

/**
 * @route   GET /api/v1/performance/stats
 * @desc    Get overall performance statistics
 * @access  Private (Shop Owner)
 */
router.get('/stats', performanceStatsHandler);

/**
 * @route   GET /api/v1/performance/slow-requests
 * @desc    Get slow requests (>1000ms by default)
 * @query   threshold - Response time threshold in milliseconds
 * @access  Private (Shop Owner)
 */
router.get('/slow-requests', slowRequestsHandler);

/**
 * @route   GET /api/v1/performance/error-requests
 * @desc    Get error requests (status code >= 400)
 * @access  Private (Shop Owner)
 */
router.get('/error-requests', errorRequestsHandler);

/**
 * @route   GET /api/v1/performance/endpoint-metrics
 * @desc    Get metrics for specific endpoint
 * @query   endpoint - Endpoint path
 * @query   method - HTTP method (optional)
 * @access  Private (Shop Owner)
 */
router.get('/endpoint-metrics', endpointMetricsHandler);

/**
 * @route   GET /api/v1/performance/memory
 * @desc    Get memory usage monitoring
 * @access  Private (Shop Owner)
 */
router.get('/memory', memoryMonitoringHandler);

/**
 * @route   GET /api/v1/performance/recommendations
 * @desc    Get performance optimization recommendations
 * @access  Private (Shop Owner)
 */
router.get('/recommendations', optimizationRecommendationsHandler);

export default router;