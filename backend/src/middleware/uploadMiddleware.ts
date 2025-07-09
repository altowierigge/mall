import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Shop icons storage configuration
const shopIconStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const shopIconsDir = path.join(uploadsDir, 'shop-icons');
    if (!fs.existsSync(shopIconsDir)) {
      fs.mkdirSync(shopIconsDir, { recursive: true });
    }
    cb(null, shopIconsDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, `shop-icon-${uniqueSuffix}${extension}`);
  }
});

// Product images storage configuration
const productImageStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const productImagesDir = path.join(uploadsDir, 'product-images');
    if (!fs.existsSync(productImagesDir)) {
      fs.mkdirSync(productImagesDir, { recursive: true });
    }
    cb(null, productImagesDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, `product-${uniqueSuffix}${extension}`);
  }
});

// File filter for images
const imageFileFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (JPEG, JPG, PNG, GIF, WebP)'));
  }
};

// Shop icon upload middleware
export const uploadShopIcon = multer({
  storage: shopIconStorage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 1
  }
}).single('icon');

// Product images upload middleware
export const uploadProductImages = multer({
  storage: productImageStorage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB per file
    files: 5 // Maximum 5 images per product
  }
}).array('images', 5);

// Error handling middleware for multer
export const handleUploadError = (err: any, _req: any, res: any, next: any) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'File size too large. Maximum size is 5MB.'
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        error: 'Too many files. Maximum 5 files allowed.'
      });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        error: 'Unexpected file field.'
      });
    }
  }
  
  if (err.message.includes('Only image files are allowed')) {
    return res.status(400).json({
      success: false,
      error: err.message
    });
  }
  
  next(err);
};