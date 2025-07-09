import { Router } from 'express';
import { MallController } from '../controllers/mallController';

const router = Router();

// GET /api/v1/malls - Get all malls
router.get('/', MallController.getMallList);

// GET /api/v1/malls/:mallId - Get mall info
router.get('/:mallId', MallController.getMallInfo);

export default router;