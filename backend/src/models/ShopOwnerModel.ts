import { ShopOwner } from '../types';

// Mock data for shop owners
const shopOwners: ShopOwner[] = [
  {
    id: 'owner-1',
    email: 'owner@zara.com',
    password: '$2b$10$rOd2tqHfNJQ4rPJvGJx.P.uB9wTJ9J8Q9LKfSvVRQxlQVWTGsOoJ2', // password: 'password123'
    firstName: 'Ahmed',
    lastName: 'Hassan',
    phone: '+966501234567',
    shopId: 'shop-1',
    role: 'shop_owner',
    isActive: true,
    lastLogin: new Date('2025-01-09T10:00:00Z'),
    createdAt: new Date('2024-12-01T10:00:00Z'),
    updatedAt: new Date('2025-01-09T10:00:00Z'),
  },
  {
    id: 'owner-2',
    email: 'owner@hm.com',
    password: '$2b$10$rOd2tqHfNJQ4rPJvGJx.P.uB9wTJ9J8Q9LKfSvVRQxlQVWTGsOoJ2', // password: 'password123'
    firstName: 'Sara',
    lastName: 'Abdullah',
    phone: '+966507654321',
    shopId: 'shop-2',
    role: 'shop_owner',
    isActive: true,
    lastLogin: new Date('2025-01-09T09:30:00Z'),
    createdAt: new Date('2024-12-01T10:00:00Z'),
    updatedAt: new Date('2025-01-09T09:30:00Z'),
  },
  {
    id: 'owner-3',
    email: 'owner@nike.com',
    password: '$2b$10$rOd2tqHfNJQ4rPJvGJx.P.uB9wTJ9J8Q9LKfSvVRQxlQVWTGsOoJ2', // password: 'password123'
    firstName: 'Mohammed',
    lastName: 'Al-Rashid',
    phone: '+966551234567',
    shopId: 'shop-3',
    role: 'shop_owner',
    isActive: true,
    lastLogin: new Date('2025-01-09T08:45:00Z'),
    createdAt: new Date('2024-12-01T10:00:00Z'),
    updatedAt: new Date('2025-01-09T08:45:00Z'),
  },
];

export class ShopOwnerModel {
  static async findByEmail(email: string): Promise<ShopOwner | null> {
    return shopOwners.find(owner => owner.email === email && owner.isActive) || null;
  }

  static async findById(id: string): Promise<ShopOwner | null> {
    return shopOwners.find(owner => owner.id === id && owner.isActive) || null;
  }

  static async findByShopId(shopId: string): Promise<ShopOwner | null> {
    return shopOwners.find(owner => owner.shopId === shopId && owner.isActive) || null;
  }

  static async updateLastLogin(id: string): Promise<void> {
    const owner = shopOwners.find(owner => owner.id === id);
    if (owner) {
      owner.lastLogin = new Date();
      owner.updatedAt = new Date();
    }
  }

  static async create(ownerData: Omit<ShopOwner, 'id' | 'createdAt' | 'updatedAt'>): Promise<ShopOwner> {
    const newOwner: ShopOwner = {
      id: `owner-${Date.now()}`,
      ...ownerData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    shopOwners.push(newOwner);
    return newOwner;
  }

  static async update(id: string, updates: Partial<ShopOwner>): Promise<ShopOwner | null> {
    const ownerIndex = shopOwners.findIndex(owner => owner.id === id);
    if (ownerIndex === -1) return null;

    shopOwners[ownerIndex] = {
      ...shopOwners[ownerIndex],
      ...updates,
      updatedAt: new Date(),
    };

    return shopOwners[ownerIndex];
  }

  static async getAllOwners(): Promise<ShopOwner[]> {
    return shopOwners.filter(owner => owner.isActive);
  }
}