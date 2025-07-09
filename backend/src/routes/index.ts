import { Router } from 'express';
import mallRoutes from './mallRoutes';
import shopRoutes from './shopRoutes';
import offerRoutes from './offerRoutes';
import authRoutes from './authRoutes';
import shopAdminRoutes from './shopAdminRoutes';
import uploadRoutes from './uploadRoutes';
import templateRoutes from './templateRoutes';
import performanceRoutes from './performance';

const router = Router();

// Mount routes
router.use('/malls', mallRoutes);
router.use('/malls', shopRoutes);
router.use('/malls', offerRoutes);

// Authentication routes
router.use('/auth', authRoutes);

// Shop admin routes
router.use('/shop', shopAdminRoutes);

// Upload routes
router.use('/upload', uploadRoutes);

// Template routes
router.use('/', templateRoutes);

// Performance monitoring routes
router.use('/performance', performanceRoutes);

// Health check endpoint
router.get('/health', (_req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

export default router;