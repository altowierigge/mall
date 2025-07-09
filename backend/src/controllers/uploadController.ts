import { Response } from 'express';
import { AuthRequest } from '../types/index';
import { ShopModel } from '../models/ShopModel';
import path from 'path';
import fs from 'fs';

export class UploadController {
  static async uploadShopIcon(req: AuthRequest, res: Response): Promise<void> {
    try {
      const shopOwner = req.user;
      if (!shopOwner) {
        res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
        return;
      }

      const file = req.file;
      if (!file) {
        res.status(400).json({
          success: false,
          error: 'No file uploaded'
        });
        return;
      }

      // Get the shop to update
      const shop = await ShopModel.findById(shopOwner.shopId);
      if (!shop) {
        res.status(404).json({
          success: false,
          error: 'Shop not found'
        });
        return;
      }

      // Delete old icon if exists
      if (shop.iconUrl && shop.iconUrl.startsWith('/uploads/')) {
        const oldIconPath = path.join(__dirname, '../../', shop.iconUrl);
        if (fs.existsSync(oldIconPath)) {
          fs.unlinkSync(oldIconPath);
        }
      }

      // Generate new icon URL
      const iconUrl = `/uploads/shop-icons/${file.filename}`;

      // Update shop with new icon URL
      await ShopModel.update(shopOwner.shopId, {
        iconUrl,
        updatedAt: new Date()
      });

      res.json({
        success: true,
        data: {
          iconUrl,
          message: 'Shop icon uploaded successfully'
        }
      });
    } catch (error) {
      console.error('Upload shop icon error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to upload shop icon'
      });
    }
  }

  static async uploadProductImages(req: AuthRequest, res: Response): Promise<void> {
    try {
      const shopOwner = req.user;
      if (!shopOwner) {
        res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
        return;
      }

      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0) {
        res.status(400).json({
          success: false,
          error: 'No files uploaded'
        });
        return;
      }

      // Generate URLs for uploaded images
      const imageUrls = files.map(file => `/uploads/product-images/${file.filename}`);

      res.json({
        success: true,
        data: {
          images: imageUrls,
          count: imageUrls.length,
          message: 'Product images uploaded successfully'
        }
      });
    } catch (error) {
      console.error('Upload product images error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to upload product images'
      });
    }
  }

  static async deleteFile(req: AuthRequest, res: Response): Promise<void> {
    try {
      const shopOwner = req.user;
      if (!shopOwner) {
        res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
        return;
      }

      const { fileUrl } = req.body;
      if (!fileUrl || !fileUrl.startsWith('/uploads/')) {
        res.status(400).json({
          success: false,
          error: 'Invalid file URL'
        });
        return;
      }

      // Check if file exists and delete it
      const filePath = path.join(__dirname, '../../', fileUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        res.json({
          success: true,
          data: { message: 'File deleted successfully' }
        });
      } else {
        res.status(404).json({
          success: false,
          error: 'File not found'
        });
      }
    } catch (error) {
      console.error('Delete file error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete file'
      });
    }
  }
}