export interface Shop {
  id: string;
  mallId: string;
  name: string;
  nameAr: string;
  category: string;
  iconUrl: string;
  websiteUrl: string;
  description: string;
  descriptionAr?: string;
  location: {
    floor: string;
    zone: string;
    unit: string;
  };
  contact: {
    phone: string;
    whatsapp: string;
    email: string;
  };
  hours: BusinessHours;
  rating: number;
  isActive: boolean;
  subscription: {
    tier: 'basic' | 'professional' | 'premium';
    status: 'active' | 'suspended' | 'expired';
  };
  features: {
    hasOnlineOrdering: boolean;
    hasDelivery: boolean;
    acceptsOnlinePayment: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface BusinessHours {
  monday: DayHours;
  tuesday: DayHours;
  wednesday: DayHours;
  thursday: DayHours;
  friday: DayHours;
  saturday: DayHours;
  sunday: DayHours;
}

export interface DayHours {
  open: string;
  close: string;
  isClosed: boolean;
}

export interface Offer {
  id: string;
  mallId: string;
  shopId: string;
  title: string;
  description: string;
  imageUrl: string;
  validFrom: Date;
  validUntil: Date;
  discountPercentage?: number;
  originalPrice?: number;
  salePrice?: number;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Mall {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  address: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  phone: string;
  email: string;
  website: string;
  hours: BusinessHours;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ShopOwner {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  shopId: string;
  role: 'shop_owner';
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  shopId: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  price: number;
  salePrice?: number;
  category: string;
  images: string[];
  inStock: boolean;
  stockQuantity: number;
  isActive: boolean;
  isFeatured: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ShopAnalytics {
  shopId: string;
  period: 'daily' | 'weekly' | 'monthly';
  startDate: Date;
  endDate: Date;
  metrics: {
    views: number;
    clicks: number;
    products: {
      total: number;
      active: number;
      featured: number;
    };
    performance: {
      clickThroughRate: number;
      averageSessionDuration: number;
      bounceRate: number;
    };
    revenue: {
      totalOrders: number;
      totalRevenue: number;
      averageOrderValue: number;
    };
  };
  chartData: {
    labels: string[];
    views: number[];
    clicks: number[];
    revenue: number[];
  };
}

export interface DashboardStats {
  totalViews: number;
  totalClicks: number;
  totalProducts: number;
  totalRevenue: number;
  growthMetrics: {
    viewsGrowth: number;
    clicksGrowth: number;
    revenueGrowth: number;
  };
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  id: string;
  type: 'view' | 'click' | 'order' | 'product_added' | 'product_updated';
  title: string;
  description: string;
  timestamp: Date;
  metadata?: any;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

import { Request } from 'express';

export interface AuthRequest extends Request {
  user?: ShopOwner;
}