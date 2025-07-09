import { Router } from 'express';
import { ShopController } from '../controllers/shopController';

const router = Router();

// GET /api/v1/malls/:mallId/shops - Get all shops for a mall
router.get('/:mallId/shops', ShopController.getShops);

// GET /api/v1/malls/:mallId/shops/featured - Get featured shops
router.get('/:mallId/shops/featured', ShopController.getFeaturedShops);

// GET /api/v1/malls/:mallId/shops/search - Search shops
router.get('/:mallId/shops/search', ShopController.searchShops);

// GET /api/v1/malls/:mallId/shops/:shopId - Get specific shop
router.get('/:mallId/shops/:shopId', ShopController.getShop);

// GET /api/v1/malls/:mallId/categories - Get shop categories
router.get('/:mallId/categories', ShopController.getShopCategories);

export default router;