import { Response } from 'express';
import { ProductModelDB } from '../models/database/ProductModelDB';
import { AuthRequest } from '../middleware/authMiddleware';
import { ApiResponse, PaginatedResponse } from '../types';

export class ProductController {
  static async getProducts(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated',
        });
        return;
      }

      const { page = 1, limit = 10, search } = req.query;
      const shopId = req.user.shopId;

      const products = search 
        ? await ProductModelDB.search(shopId, search as string)
        : await ProductModelDB.findByShopId(shopId);

      // Simple pagination
      const pageNum = parseInt(page as string, 10);
      const limitNum = parseInt(limit as string, 10);
      const startIndex = (pageNum - 1) * limitNum;
      const endIndex = startIndex + limitNum;
      const paginatedProducts = products.slice(startIndex, endIndex);

      const response: ApiResponse<PaginatedResponse<typeof paginatedProducts[0]>> = {
        success: true,
        data: {
          data: paginatedProducts,
          pagination: {
            page: pageNum,
            limit: limitNum,
            total: products.length,
            totalPages: Math.ceil(products.length / limitNum),
            hasNextPage: endIndex < products.length,
            hasPrevPage: pageNum > 1,
          },
        },
        message: 'Products retrieved successfully',
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Get products error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  static async getProduct(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated',
        });
        return;
      }

      const { id } = req.params;
      const product = await ProductModelDB.findById(id);

      if (!product) {
        res.status(404).json({
          success: false,
          message: 'Product not found',
        });
        return;
      }

      // Verify product belongs to user's shop
      if (product.shopId !== req.user.shopId) {
        res.status(403).json({
          success: false,
          message: 'Access denied',
        });
        return;
      }

      const response: ApiResponse<typeof product> = {
        success: true,
        data: product,
        message: 'Product retrieved successfully',
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Get product error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  static async createProduct(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated',
        });
        return;
      }

      const productData = {
        ...req.body,
        shopId: req.user.shopId,
      };

      // Check subscription tier limits
      const existingProducts = await ProductModelDB.findByShopId(req.user.shopId);
      const activeProductCount = existingProducts.length;

      // Get shop subscription tier limits (mock implementation)
      const tierLimits = {
        basic: 50,
        professional: 200,
        premium: -1, // unlimited
      };

      // For now, assume professional tier - in real app, get from shop data
      const tierLimit = tierLimits.professional;
      if (tierLimit !== -1 && activeProductCount >= tierLimit) {
        res.status(400).json({
          success: false,
          message: `Product limit reached. Your subscription allows ${tierLimit} products.`,
        });
        return;
      }

      const product = await ProductModelDB.create(productData);

      const response: ApiResponse<typeof product> = {
        success: true,
        data: product,
        message: 'Product created successfully',
      };

      res.status(201).json(response);
    } catch (error) {
      console.error('Create product error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  static async updateProduct(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated',
        });
        return;
      }

      const { id } = req.params;
      const updates = req.body;

      const existingProduct = await ProductModelDB.findById(id);
      if (!existingProduct) {
        res.status(404).json({
          success: false,
          message: 'Product not found',
        });
        return;
      }

      // Verify product belongs to user's shop
      if (existingProduct.shopId !== req.user.shopId) {
        res.status(403).json({
          success: false,
          message: 'Access denied',
        });
        return;
      }

      const product = await ProductModelDB.update(id, updates);

      const response: ApiResponse<typeof product> = {
        success: true,
        data: product,
        message: 'Product updated successfully',
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Update product error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  static async deleteProduct(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated',
        });
        return;
      }

      const { id } = req.params;

      const existingProduct = await ProductModelDB.findById(id);
      if (!existingProduct) {
        res.status(404).json({
          success: false,
          message: 'Product not found',
        });
        return;
      }

      // Verify product belongs to user's shop
      if (existingProduct.shopId !== req.user.shopId) {
        res.status(403).json({
          success: false,
          message: 'Access denied',
        });
        return;
      }

      await ProductModelDB.delete(id);

      const response: ApiResponse<void> = {
        success: true,
        message: 'Product deleted successfully',
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Delete product error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }
}