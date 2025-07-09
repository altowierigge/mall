// Core types for Shop Admin Dashboard

export interface ShopOwner {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  shopId: string;
  role: 'shop_owner';
  isActive: boolean;
  lastLogin: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Shop {
  id: string;
  mallId: string;
  name: string;
  nameAr: string;
  category: string;
  iconUrl: string;
  websiteUrl: string;
  description: string;
  descriptionAr: string;
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
    expiresAt: Date;
    features: SubscriptionFeatures;
  };
  features: {
    hasOnlineOrdering: boolean;
    hasDelivery: boolean;
    acceptsOnlinePayment: boolean;
  };
  stats: {
    totalViews: number;
    totalProducts: number;
    totalOrders: number;
    averageRating: number;
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
  isOpen: boolean;
  openTime: string; // "09:00"
  closeTime: string; // "22:00"
}

export interface SubscriptionFeatures {
  maxProducts: number; // -1 for unlimited
  analytics: 'basic' | 'advanced' | 'full';
  featuredPlacementsPerMonth: number;
  maxTemplates: number; // -1 for unlimited
  prioritySupport: boolean;
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
  isFeatures: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductCategory {
  id: string;
  name: string;
  nameAr: string;
  shopId: string;
  isActive: boolean;
  sortOrder: number;
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

export interface AuthState {
  user: ShopOwner | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: ShopOwner;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  timestamp: Date;
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

export interface ApiError {
  message: string;
  status: number;
  code?: string;
  details?: any;
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

export interface SubscriptionTier {
  tier: 'basic' | 'professional' | 'premium';
  name: string;
  price: number;
  currency: string;
  features: SubscriptionFeatures;
  popular?: boolean;
}

export interface ShopTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  tier: 'basic' | 'professional' | 'premium';
  thumbnailUrl: string;
  previewUrl: string;
  customizable: boolean;
  features: string[];
  isActive: boolean;
}

export interface TemplateCustomization {
  templateId: string;
  shopId: string;
  theme: {
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    textColor: string;
    fontFamily: string;
  };
  layout: {
    headerType: 'minimal' | 'full' | 'custom';
    productGrid: 'grid' | 'list' | 'carousel';
    showRatings: boolean;
    showPrices: boolean;
  };
  content: {
    bannerImage?: string;
    welcomeMessage?: string;
    footerText?: string;
    socialLinks?: {
      facebook?: string;
      instagram?: string;
      twitter?: string;
    };
  };
}

export interface NotificationPreferences {
  emailNotifications: {
    newOrders: boolean;
    productOutOfStock: boolean;
    weeklyReports: boolean;
    systemUpdates: boolean;
  };
  pushNotifications: {
    newOrders: boolean;
    criticalAlerts: boolean;
    promotionalMessages: boolean;
  };
}

export interface ShopSettings {
  id: string;
  shopId: string;
  notifications: NotificationPreferences;
  appearance: {
    theme: 'light' | 'dark' | 'auto';
    language: 'en' | 'ar';
  };
  integrations: {
    whatsappBusiness: boolean;
    googleAnalytics?: string;
    facebookPixel?: string;
  };
  updatedAt: Date;
}