// Mock Data Service for Development
// Provides in-memory data when database is not available

import { Shop, Mall, Offer } from '../types';

// Mock Mall Data
const mockMall: Mall = {
  id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  name: 'Riyadh Park',
  nameAr: 'الرياض بارك',
  description: 'Premium shopping destination in the heart of Riyadh',
  address: '1234 King Fahd Road, Riyadh',
  city: 'Riyadh',
  country: 'Saudi Arabia',
  latitude: 24.7136,
  longitude: 46.6753,
  phone: '+966-11-123-4567',
  email: 'info@riyadhpark.com',
  website: 'https://riyadhpark.com',
  hours: {
    monday: { open: '10:00', close: '23:00', isClosed: false },
    tuesday: { open: '10:00', close: '23:00', isClosed: false },
    wednesday: { open: '10:00', close: '23:00', isClosed: false },
    thursday: { open: '10:00', close: '23:00', isClosed: false },
    friday: { open: '14:00', close: '23:00', isClosed: false },
    saturday: { open: '10:00', close: '23:00', isClosed: false },
    sunday: { open: '10:00', close: '23:00', isClosed: false },
  },
  isActive: true,
  createdAt: new Date('2025-01-01T00:00:00Z'),
  updatedAt: new Date('2025-01-01T00:00:00Z'),
};

// Mock Shop Data
const mockShops: Shop[] = [
  {
    id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    mallId: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    name: 'Zara',
    nameAr: 'زارا',
    category: 'Fashion & Clothing',
    iconUrl: '/images/shops/zara-icon.png',
    websiteUrl: 'https://www.zara.com',
    description: 'International fashion retailer offering trendy clothing for men, women, and children',
    descriptionAr: 'متجر أزياء عالمي يقدم ملابس عصرية للرجال والنساء والأطفال',
    location: {
      floor: 'Ground Floor',
      zone: 'North Wing',
      unit: 'G-15',
    },
    contact: {
      phone: '+966-11-234-5678',
      whatsapp: '+966-50-234-5678',
      email: 'riyadh@zara.com',
    },
    hours: {
      monday: { open: '10:00', close: '22:00', isClosed: false },
      tuesday: { open: '10:00', close: '22:00', isClosed: false },
      wednesday: { open: '10:00', close: '22:00', isClosed: false },
      thursday: { open: '10:00', close: '22:00', isClosed: false },
      friday: { open: '14:00', close: '22:00', isClosed: false },
      saturday: { open: '10:00', close: '22:00', isClosed: false },
      sunday: { open: '10:00', close: '22:00', isClosed: false },
    },
    rating: 4.5,
    isActive: true,
    subscription: {
      tier: 'professional',
      status: 'active',
    },
    features: {
      hasOnlineOrdering: true,
      hasDelivery: true,
      acceptsOnlinePayment: true,
    },
    createdAt: new Date('2025-01-01T00:00:00Z'),
    updatedAt: new Date('2025-01-01T00:00:00Z'),
  },
  {
    id: 'b2c3d4e5-f6g7-8901-bcde-f23456789012',
    mallId: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    name: 'H&M',
    nameAr: 'اتش اند ام',
    category: 'Fashion & Clothing',
    iconUrl: '/images/shops/hm-icon.png',
    websiteUrl: 'https://www2.hm.com',
    description: 'Swedish fashion retailer known for fast-fashion clothing for all ages',
    descriptionAr: 'متجر أزياء سويدي معروف بالأزياء العصرية لجميع الأعمار',
    location: {
      floor: 'Ground Floor',
      zone: 'North Wing',
      unit: 'G-23',
    },
    contact: {
      phone: '+966-11-345-6789',
      whatsapp: '+966-50-345-6789',
      email: 'riyadh@hm.com',
    },
    hours: {
      monday: { open: '10:00', close: '22:00', isClosed: false },
      tuesday: { open: '10:00', close: '22:00', isClosed: false },
      wednesday: { open: '10:00', close: '22:00', isClosed: false },
      thursday: { open: '10:00', close: '22:00', isClosed: false },
      friday: { open: '14:00', close: '22:00', isClosed: false },
      saturday: { open: '10:00', close: '22:00', isClosed: false },
      sunday: { open: '10:00', close: '22:00', isClosed: false },
    },
    rating: 4.2,
    isActive: true,
    subscription: {
      tier: 'professional',
      status: 'active',
    },
    features: {
      hasOnlineOrdering: true,
      hasDelivery: false,
      acceptsOnlinePayment: true,
    },
    createdAt: new Date('2025-01-01T00:00:00Z'),
    updatedAt: new Date('2025-01-01T00:00:00Z'),
  },
  {
    id: 'c3d4e5f6-g7h8-9012-cdef-345678901234',
    mallId: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    name: 'Apple Store',
    nameAr: 'متجر آبل',
    category: 'Electronics',
    iconUrl: '/images/shops/apple-icon.png',
    websiteUrl: 'https://www.apple.com',
    description: 'Premium electronics and technology products from Apple',
    descriptionAr: 'منتجات إلكترونية وتقنية متميزة من آبل',
    location: {
      floor: 'First Floor',
      zone: 'East Wing',
      unit: 'F-08',
    },
    contact: {
      phone: '+966-11-456-7890',
      whatsapp: '+966-50-456-7890',
      email: 'riyadh@apple.com',
    },
    hours: {
      monday: { open: '10:00', close: '22:00', isClosed: false },
      tuesday: { open: '10:00', close: '22:00', isClosed: false },
      wednesday: { open: '10:00', close: '22:00', isClosed: false },
      thursday: { open: '10:00', close: '22:00', isClosed: false },
      friday: { open: '14:00', close: '22:00', isClosed: false },
      saturday: { open: '10:00', close: '22:00', isClosed: false },
      sunday: { open: '10:00', close: '22:00', isClosed: false },
    },
    rating: 4.8,
    isActive: true,
    subscription: {
      tier: 'premium',
      status: 'active',
    },
    features: {
      hasOnlineOrdering: true,
      hasDelivery: true,
      acceptsOnlinePayment: true,
    },
    createdAt: new Date('2025-01-01T00:00:00Z'),
    updatedAt: new Date('2025-01-01T00:00:00Z'),
  },
  {
    id: 'd4e5f6g7-h8i9-0123-defg-456789012345',
    mallId: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    name: 'Starbucks',
    nameAr: 'ستاربكس',
    category: 'Food & Dining',
    iconUrl: '/images/shops/starbucks-icon.png',
    websiteUrl: 'https://www.starbucks.com',
    description: 'World-famous coffee chain serving premium coffee and snacks',
    descriptionAr: 'سلسلة قهوة عالمية مشهورة تقدم القهوة المميزة والوجبات الخفيفة',
    location: {
      floor: 'Ground Floor',
      zone: 'Food Court',
      unit: 'FC-12',
    },
    contact: {
      phone: '+966-11-567-8901',
      whatsapp: '+966-50-567-8901',
      email: 'riyadh@starbucks.com',
    },
    hours: {
      monday: { open: '07:00', close: '23:00', isClosed: false },
      tuesday: { open: '07:00', close: '23:00', isClosed: false },
      wednesday: { open: '07:00', close: '23:00', isClosed: false },
      thursday: { open: '07:00', close: '23:00', isClosed: false },
      friday: { open: '07:00', close: '23:00', isClosed: false },
      saturday: { open: '07:00', close: '23:00', isClosed: false },
      sunday: { open: '07:00', close: '23:00', isClosed: false },
    },
    rating: 4.3,
    isActive: true,
    subscription: {
      tier: 'professional',
      status: 'active',
    },
    features: {
      hasOnlineOrdering: true,
      hasDelivery: true,
      acceptsOnlinePayment: true,
    },
    createdAt: new Date('2025-01-01T00:00:00Z'),
    updatedAt: new Date('2025-01-01T00:00:00Z'),
  },
  {
    id: 'e5f6g7h8-i9j0-1234-efgh-567890123456',
    mallId: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    name: 'Nike',
    nameAr: 'نايك',
    category: 'Sports & Recreation',
    iconUrl: '/images/shops/nike-icon.png',
    websiteUrl: 'https://nike.com',
    description: 'Sports apparel, footwear, and equipment for athletes',
    descriptionAr: 'ملابس رياضية وأحذية ومعدات للرياضيين',
    location: {
      floor: 'First Floor',
      zone: 'West Wing',
      unit: 'F-25',
    },
    contact: {
      phone: '+966-11-678-9012',
      whatsapp: '+966-50-678-9012',
      email: 'riyadh@nike.com',
    },
    hours: {
      monday: { open: '10:00', close: '22:00', isClosed: false },
      tuesday: { open: '10:00', close: '22:00', isClosed: false },
      wednesday: { open: '10:00', close: '22:00', isClosed: false },
      thursday: { open: '10:00', close: '22:00', isClosed: false },
      friday: { open: '14:00', close: '22:00', isClosed: false },
      saturday: { open: '10:00', close: '22:00', isClosed: false },
      sunday: { open: '10:00', close: '22:00', isClosed: false },
    },
    rating: 4.6,
    isActive: true,
    subscription: {
      tier: 'premium',
      status: 'active',
    },
    features: {
      hasOnlineOrdering: true,
      hasDelivery: true,
      acceptsOnlinePayment: true,
    },
    createdAt: new Date('2025-01-01T00:00:00Z'),
    updatedAt: new Date('2025-01-01T00:00:00Z'),
  },
];

// Mock Offers
const mockOffers: Offer[] = [
  {
    id: 'offer-1',
    mallId: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    shopId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    title: 'Up to 50% Off on New Collection',
    description: 'Get amazing discounts on Zara\'s latest fashion collection',
    imageUrl: '/images/offers/zara-offer.jpg',
    discountPercentage: 50,
    validFrom: new Date('2025-07-01T00:00:00Z'),
    validUntil: new Date('2025-07-31T23:59:59Z'),
    isActive: true,
    isFeatured: true,
    createdAt: new Date('2025-01-01T00:00:00Z'),
    updatedAt: new Date('2025-01-01T00:00:00Z'),
  },
  {
    id: 'offer-2',
    mallId: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    shopId: 'c3d4e5f6-g7h8-9012-cdef-345678901234',
    title: 'Buy iPhone, Get AirPods Free',
    description: 'Purchase any iPhone 15 model and receive AirPods Pro for free',
    imageUrl: '/images/offers/apple-offer.jpg',
    originalPrice: 999,
    salePrice: 999,
    validFrom: new Date('2025-07-01T00:00:00Z'),
    validUntil: new Date('2025-07-15T23:59:59Z'),
    isActive: true,
    isFeatured: true,
    createdAt: new Date('2025-01-01T00:00:00Z'),
    updatedAt: new Date('2025-01-01T00:00:00Z'),
  },
];

// Simple category list for backend
const shopCategories = [
  'Fashion & Clothing',
  'Electronics',
  'Food & Dining',
  'Sports & Recreation',
  'Beauty & Health',
  'Home & Garden',
  'Kids & Toys',
];

// Mock Data Service
export class MockDataService {
  // Mall Methods
  static async getMall(mallId: string): Promise<Mall | null> {
    if (mallId === 'riyadh-park') {
      return mockMall;
    }
    return null;
  }

  // Shop Methods
  static async getShops(mallId: string): Promise<Shop[]> {
    if (mallId === 'riyadh-park') {
      return mockShops.filter(shop => shop.isActive);
    }
    return [];
  }

  static async getShopById(shopId: string): Promise<Shop | null> {
    return mockShops.find(shop => shop.id === shopId && shop.isActive) || null;
  }

  static async getFeaturedShops(mallId: string): Promise<Shop[]> {
    if (mallId === 'riyadh-park') {
      return mockShops.filter(shop => 
        shop.isActive && shop.subscription.tier === 'premium'
      );
    }
    return [];
  }

  static async searchShops(mallId: string, query: string, category?: string): Promise<Shop[]> {
    if (mallId !== 'riyadh-park') return [];
    
    let results = mockShops.filter(shop => shop.isActive);
    
    // Filter by category if provided
    if (category && category !== 'all') {
      results = results.filter(shop => 
        shop.category.toLowerCase().includes(category.toLowerCase())
      );
    }
    
    // Filter by search query
    if (query) {
      const lowerQuery = query.toLowerCase();
      results = results.filter(shop => 
        shop.name.toLowerCase().includes(lowerQuery) ||
        shop.nameAr.includes(query) ||
        shop.category.toLowerCase().includes(lowerQuery) ||
        shop.description.toLowerCase().includes(lowerQuery)
      );
    }
    
    return results;
  }

  static async getShopsByCategory(mallId: string, category: string): Promise<Shop[]> {
    if (mallId !== 'riyadh-park') return [];
    
    return mockShops.filter(shop => 
      shop.isActive && shop.category === category
    );
  }

  // Category Methods
  static async getCategories(): Promise<string[]> {
    return shopCategories;
  }

  // Offer Methods
  static async getOffers(mallId: string): Promise<Offer[]> {
    if (mallId === 'riyadh-park') {
      return mockOffers.filter(offer => offer.isActive);
    }
    return [];
  }

  static async getFeaturedOffers(mallId: string): Promise<Offer[]> {
    if (mallId === 'riyadh-park') {
      return mockOffers.filter(offer => offer.isActive && offer.isFeatured);
    }
    return [];
  }

  static async getOfferById(offerId: string): Promise<Offer | null> {
    return mockOffers.find(offer => offer.id === offerId && offer.isActive) || null;
  }

  // Utility Methods
  static async isDataAvailable(): Promise<boolean> {
    return true; // Mock data is always available
  }
}

export default MockDataService;