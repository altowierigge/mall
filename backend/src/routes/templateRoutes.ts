import { Router } from 'express';
import { TemplateController } from '../controllers/templateController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// Public routes (no authentication required)
router.get('/templates', TemplateController.getTemplates);
router.get('/templates/:id', TemplateController.getTemplate);

// Protected routes (authentication required)
router.get('/shop/customization', authenticateToken, TemplateController.getShopCustomization);
router.post('/shop/apply-template', authenticateToken, TemplateController.applyTemplate);
router.put('/shop/customization', authenticateToken, TemplateController.updateCustomization);
router.delete('/shop/customization', authenticateToken, TemplateController.removeCustomization);
router.post('/templates/preview', authenticateToken, TemplateController.previewTemplate);

export default router;