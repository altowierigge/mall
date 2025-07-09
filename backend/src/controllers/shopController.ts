import { Request, Response } from 'express';
import { ShopModelDB } from '../models/database/ShopModelDB';
import { ProductModelDB } from '../models/database/ProductModelDB';
import { AuthRequest } from '../middleware/authMiddleware';
import { ApiResponse, DashboardStats, ActivityItem, ShopAnalytics } from '../types';
import { MockDataService } from '../services/mockDataService';

export class ShopController {
  static async getProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated',
        });
        return;
      }

      const shop = await ShopModelDB.findById(req.user.shopId);
      if (!shop) {
        res.status(404).json({
          success: false,
          message: 'Shop not found',
        });
        return;
      }

      const response: ApiResponse<typeof shop> = {
        success: true,
        data: shop,
        message: 'Shop profile retrieved successfully',
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Get shop profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  static async updateProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated',
        });
        return;
      }

      const updates = req.body;
      const updatedShop = await ShopModelDB.update(req.user.shopId, updates);

      if (!updatedShop) {
        res.status(404).json({
          success: false,
          message: 'Shop not found',
        });
        return;
      }

      const response: ApiResponse<typeof updatedShop> = {
        success: true,
        data: updatedShop,
        message: 'Shop profile updated successfully',
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Update shop profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  static async getDashboardStats(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated',
        });
        return;
      }

      const shopId = req.user.shopId;
      const activeProducts = await ProductModelDB.getActiveProductCount(shopId);

      // Mock analytics data - in a real app, this would come from analytics service
      const recentActivity: ActivityItem[] = [
        {
          id: 'activity-1',
          type: 'view',
          title: 'Shop viewed',
          description: 'Your shop was viewed by a customer',
          timestamp: new Date(),
        },
        {
          id: 'activity-2',
          type: 'product_added',
          title: 'Product added',
          description: 'New product was added to your shop',
          timestamp: new Date(Date.now() - 3600000), // 1 hour ago
        },
        {
          id: 'activity-3',
          type: 'click',
          title: 'Product clicked',
          description: 'A customer clicked on your product',
          timestamp: new Date(Date.now() - 7200000), // 2 hours ago
        },
      ];

      const dashboardStats: DashboardStats = {
        totalViews: Math.floor(Math.random() * 1000) + 500,
        totalClicks: Math.floor(Math.random() * 500) + 200,
        totalProducts: activeProducts, // Use active products count
        totalRevenue: Math.floor(Math.random() * 10000) + 5000,
        growthMetrics: {
          viewsGrowth: Math.floor(Math.random() * 20) - 10, // -10 to 10
          clicksGrowth: Math.floor(Math.random() * 30) - 15, // -15 to 15
          revenueGrowth: Math.floor(Math.random() * 25) - 10, // -10 to 15
        },
        recentActivity,
      };

      const response: ApiResponse<DashboardStats> = {
        success: true,
        data: dashboardStats,
        message: 'Dashboard stats retrieved successfully',
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Get dashboard stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  static async getAnalytics(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated',
        });
        return;
      }

      const period = req.query.period as 'daily' | 'weekly' | 'monthly' || 'weekly';
      const shopId = req.user.shopId;
      
      // Mock analytics data
      const now = new Date();
      const daysBack = period === 'daily' ? 7 : period === 'weekly' ? 4 : 6;
      
      const labels: string[] = [];
      const views: number[] = [];
      const clicks: number[] = [];
      const revenue: number[] = [];

      for (let i = daysBack - 1; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        
        if (period === 'daily') {
          labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
        } else if (period === 'weekly') {
          labels.push(`Week ${Math.floor(i / 7) + 1}`);
        } else {
          labels.push(date.toLocaleDateString('en-US', { month: 'short' }));
        }

        views.push(Math.floor(Math.random() * 200) + 50);
        clicks.push(Math.floor(Math.random() * 100) + 20);
        revenue.push(Math.floor(Math.random() * 2000) + 500);
      }

      const totalProducts = await ProductModelDB.getProductCount(shopId);
      const activeProducts = await ProductModelDB.getActiveProductCount(shopId);
      const featuredProducts = await ProductModelDB.getFeaturedCount(shopId);

      const analytics: ShopAnalytics = {
        shopId,
        period,
        startDate: new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000),
        endDate: now,
        metrics: {
          views: views.reduce((sum, v) => sum + v, 0),
          clicks: clicks.reduce((sum, c) => sum + c, 0),
          products: {
            total: totalProducts,
            active: activeProducts,
            featured: featuredProducts,
          },
          performance: {
            clickThroughRate: Math.random() * 10 + 5, // 5-15%
            averageSessionDuration: Math.floor(Math.random() * 120) + 60, // 60-180s
            bounceRate: Math.random() * 30 + 20, // 20-50%
          },
          revenue: {
            totalOrders: Math.floor(Math.random() * 100) + 50,
            totalRevenue: revenue.reduce((sum, r) => sum + r, 0),
            averageOrderValue: Math.floor(Math.random() * 200) + 100,
          },
        },
        chartData: {
          labels,
          views,
          clicks,
          revenue,
        },
      };

      const response: ApiResponse<ShopAnalytics> = {
        success: true,
        data: analytics,
        message: 'Analytics retrieved successfully',
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Get analytics error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  // Public methods for mobile app (non-authenticated)
  static async getShops(req: Request, res: Response): Promise<void> {
    try {
      const { mallId } = req.params;
      
      // Use mock data service for development
      const shops = await MockDataService.getShops(mallId);

      const response: ApiResponse<typeof shops> = {
        success: true,
        data: shops,
        message: 'Shops retrieved successfully',
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Get shops error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  static async getFeaturedShops(req: Request, res: Response): Promise<void> {
    try {
      const { mallId } = req.params;
      const shops = await MockDataService.getFeaturedShops(mallId);

      const response: ApiResponse<typeof shops> = {
        success: true,
        data: shops,
        message: 'Featured shops retrieved successfully',
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Get featured shops error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  static async searchShops(req: Request, res: Response): Promise<void> {
    try {
      const { mallId } = req.params;
      const { q: query, category } = req.query;
      const shops = await MockDataService.searchShops(mallId, query as string || '', category as string);

      const response: ApiResponse<typeof shops> = {
        success: true,
        data: shops,
        message: 'Shop search completed successfully',
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Search shops error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  static async getShop(req: Request, res: Response): Promise<void> {
    try {
      const { shopId } = req.params;
      const shop = await MockDataService.getShopById(shopId);

      if (!shop) {
        res.status(404).json({
          success: false,
          message: 'Shop not found',
        });
        return;
      }

      const response: ApiResponse<typeof shop> = {
        success: true,
        data: shop,
        message: 'Shop retrieved successfully',
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Get shop error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  static async getShopCategories(_req: Request, res: Response): Promise<void> {
    try {
      const categories = await MockDataService.getCategories();

      const response: ApiResponse<typeof categories> = {
        success: true,
        data: categories,
        message: 'Shop categories retrieved successfully',
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Get shop categories error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }
}