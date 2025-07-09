import { Router } from 'express';
import { ShopController } from '../controllers/shopController';
import { ProductController } from '../controllers/productController';
import { authenticateToken, requireShopOwner } from '../middleware/authMiddleware';

const router = Router();

// All shop routes require authentication and shop owner role
router.use(authenticateToken);
router.use(requireShopOwner);

// Shop profile routes
router.get('/profile', ShopController.getProfile);
router.put('/profile', ShopController.updateProfile);

// Dashboard and analytics routes
router.get('/dashboard/stats', ShopController.getDashboardStats);
router.get('/analytics', ShopController.getAnalytics);

// Product management routes
router.get('/products', ProductController.getProducts);
router.get('/products/:id', ProductController.getProduct);
router.post('/products', ProductController.createProduct);
router.put('/products/:id', ProductController.updateProduct);
router.delete('/products/:id', ProductController.deleteProduct);

export default router;