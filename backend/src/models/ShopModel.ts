import { Shop } from '../types';
import { mockShops } from './mockData';

export class ShopModel {
  private static shops: Shop[] = [...mockShops];

  static async findById(id: string): Promise<Shop | null> {
    return this.shops.find(shop => shop.id === id && shop.isActive) || null;
  }

  static async findByMallId(mallId: string): Promise<Shop[]> {
    return this.shops.filter(shop => shop.mallId === mallId && shop.isActive);
  }

  static async findByCategory(mallId: string, category: string): Promise<Shop[]> {
    return this.shops.filter(shop => 
      shop.mallId === mallId && 
      shop.category === category && 
      shop.isActive
    );
  }

  static async search(mallId: string, query: string): Promise<Shop[]> {
    if (!query) return this.findByMallId(mallId);
    
    const searchQuery = query.toLowerCase();
    return this.shops.filter(shop =>
      shop.mallId === mallId &&
      shop.isActive &&
      (shop.name.toLowerCase().includes(searchQuery) ||
       shop.nameAr.includes(searchQuery) ||
       shop.description.toLowerCase().includes(searchQuery) ||
       shop.category.toLowerCase().includes(searchQuery))
    );
  }

  static async getFeaturedShops(mallId: string): Promise<Shop[]> {
    return this.shops.filter(shop => 
      shop.mallId === mallId && 
      shop.isActive && 
      shop.subscription.tier === 'premium'
    );
  }

  static async getCategories(mallId: string): Promise<string[]> {
    const shops = await this.findByMallId(mallId);
    const categories = [...new Set(shops.map(shop => shop.category))];
    return categories.sort();
  }

  static async create(shopData: Omit<Shop, 'id' | 'createdAt' | 'updatedAt'>): Promise<Shop> {
    const newShop: Shop = {
      id: `shop-${Date.now()}`,
      ...shopData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    this.shops.push(newShop);
    return newShop;
  }

  static async update(id: string, updates: Partial<Shop>): Promise<Shop | null> {
    const shopIndex = this.shops.findIndex(shop => shop.id === id);
    if (shopIndex === -1) return null;

    this.shops[shopIndex] = {
      ...this.shops[shopIndex],
      ...updates,
      updatedAt: new Date(),
    };

    return this.shops[shopIndex];
  }

  static async delete(id: string): Promise<boolean> {
    const shopIndex = this.shops.findIndex(shop => shop.id === id);
    if (shopIndex === -1) return false;

    // Soft delete - mark as inactive
    this.shops[shopIndex].isActive = false;
    this.shops[shopIndex].updatedAt = new Date();
    return true;
  }

  static async getShopStats(shopId: string): Promise<{
    totalViews: number;
    totalClicks: number;
    rating: number;
    totalProducts: number;
  } | null> {
    const shop = await this.findById(shopId);
    if (!shop) return null;

    // Mock statistics - in a real app, this would come from analytics service
    return {
      totalViews: Math.floor(Math.random() * 1000) + 500,
      totalClicks: Math.floor(Math.random() * 500) + 200,
      rating: shop.rating,
      totalProducts: Math.floor(Math.random() * 100) + 20,
    };
  }

  static async getAllShops(): Promise<Shop[]> {
    return this.shops.filter(shop => shop.isActive);
  }

  static async getShopsByTier(tier: 'basic' | 'professional' | 'premium'): Promise<Shop[]> {
    return this.shops.filter(shop => 
      shop.isActive && 
      shop.subscription.tier === tier
    );
  }

  static async updateSubscription(
    shopId: string, 
    tier: 'basic' | 'professional' | 'premium',
    status: 'active' | 'suspended' | 'expired'
  ): Promise<Shop | null> {
    const shop = await this.findById(shopId);
    if (!shop) return null;

    return this.update(shopId, {
      subscription: {
        tier,
        status,
      },
    });
  }

  static async toggleShopStatus(shopId: string): Promise<Shop | null> {
    const shop = await this.findById(shopId);
    if (!shop) return null;

    return this.update(shopId, {
      isActive: !shop.isActive,
    });
  }
}