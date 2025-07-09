import { Router } from 'express';
import { UploadController } from '../controllers/uploadController';
import { authenticateToken } from '../middleware/authMiddleware';
import { uploadShopIcon, uploadProductImages, handleUploadError } from '../middleware/uploadMiddleware';

const router = Router();

// Shop icon upload
router.post('/shop-icon', 
  authenticateToken, 
  uploadShopIcon,
  handleUploadError,
  UploadController.uploadShopIcon
);

// Product images upload
router.post('/product-images',
  authenticateToken,
  uploadProductImages,
  handleUploadError,
  UploadController.uploadProductImages
);

// Delete file
router.delete('/file',
  authenticateToken,
  UploadController.deleteFile
);

export default router;