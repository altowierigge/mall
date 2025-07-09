import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// Public routes
router.post('/shop-owner/login', AuthController.login);
router.post('/refresh', AuthController.refreshToken);

// Protected routes
router.post('/shop-owner/logout', authenticateToken, AuthController.logout);
router.get('/shop-owner/profile', authenticateToken, AuthController.profile);

export default router;