import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';

import routes from './routes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { performanceMiddleware } from './middleware/performance';
import { API_CONFIG } from './utils/constants';

// Load environment variables
dotenv.config();

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: API_CONFIG.CORS_ORIGIN,
  credentials: true,
}));

// Logging middleware
app.use(morgan('combined'));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Performance monitoring middleware
app.use(performanceMiddleware);

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API routes
app.use('/api/v1', routes);

// 404 handler
app.use(notFoundHandler);

// Error handling middleware
app.use(errorHandler);

const PORT = Number(API_CONFIG.PORT);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Mall API Server running on port ${PORT}`);
  console.log(`📍 Environment: ${API_CONFIG.NODE_ENV}`);
  console.log(`🌐 CORS Origin: ${API_CONFIG.CORS_ORIGIN}`);
  console.log(`💡 API Documentation: http://localhost:${PORT}/api/v1/health`);
});

export default app;