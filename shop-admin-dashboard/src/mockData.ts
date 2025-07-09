import { Shop } from './types';

// Mock data for shop entries with complete contact information including email
export const mockShops: Shop[] = [
  {
    id: 'shop-001',
    mallId: 'riyadh-park-mall',
    name: 'KFC',
    nameAr: 'كنتاكي',
    category: 'Food & Beverages',
    iconUrl: 'https://example.com/icons/kfc.png',
    websiteUrl: 'https://kfc.com.sa',
    description: 'World famous fried chicken restaurant',
    descriptionAr: 'مطعم الدجاج المقلي الشهير عالمياً',
    location: {
      floor: 'Ground Floor',
      zone: 'Food Court',
      unit: 'FC-01'
    },
    contact: {
      phone: '+966501234567',
      whatsapp: '+966501234567',
      email: 'kfc@riyadhpark.com'
    },
    hours: {
      monday: { isOpen: true, openTime: '10:00', closeTime: '23:00' },
      tuesday: { isOpen: true, openTime: '10:00', closeTime: '23:00' },
      wednesday: { isOpen: true, openTime: '10:00', closeTime: '23:00' },
      thursday: { isOpen: true, openTime: '10:00', closeTime: '23:00' },
      friday: { isOpen: true, openTime: '10:00', closeTime: '23:00' },
      saturday: { isOpen: true, openTime: '10:00', closeTime: '23:00' },
      sunday: { isOpen: true, openTime: '10:00', closeTime: '23:00' }
    },
    rating: 4.5,
    isActive: true,
    subscription: {
      tier: 'professional',
      status: 'active',
      expiresAt: new Date('2024-12-31'),
      features: {
        maxProducts: 100,
        analytics: 'advanced',
        featuredPlacementsPerMonth: 5,
        maxTemplates: 10,
        prioritySupport: true
      }
    },
    features: {
      hasOnlineOrdering: true,
      hasDelivery: true,
      acceptsOnlinePayment: true
    },
    stats: {
      totalViews: 15420,
      totalProducts: 45,
      totalOrders: 1250,
      averageRating: 4.5
    },
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'shop-002',
    mallId: 'riyadh-park-mall',
    name: 'McDonald\'s',
    nameAr: 'ماكدونالدز',
    category: 'Food & Beverages',
    iconUrl: 'https://example.com/icons/mcdonalds.png',
    websiteUrl: 'https://mcdonalds.com.sa',
    description: 'Fast food restaurant chain serving burgers and fries',
    descriptionAr: 'سلسلة مطاعم الوجبات السريعة التي تقدم البرغر والبطاطس المقلية',
    location: {
      floor: 'Ground Floor',
      zone: 'Food Court',
      unit: 'FC-02'
    },
    contact: {
      phone: '+966501234568',
      whatsapp: '+966501234568',
      email: 'mcdonalds@riyadhpark.com'
    },
    hours: {
      monday: { isOpen: true, openTime: '09:00', closeTime: '24:00' },
      tuesday: { isOpen: true, openTime: '09:00', closeTime: '24:00' },
      wednesday: { isOpen: true, openTime: '09:00', closeTime: '24:00' },
      thursday: { isOpen: true, openTime: '09:00', closeTime: '24:00' },
      friday: { isOpen: true, openTime: '09:00', closeTime: '24:00' },
      saturday: { isOpen: true, openTime: '09:00', closeTime: '24:00' },
      sunday: { isOpen: true, openTime: '09:00', closeTime: '24:00' }
    },
    rating: 4.2,
    isActive: true,
    subscription: {
      tier: 'premium',
      status: 'active',
      expiresAt: new Date('2024-12-31'),
      features: {
        maxProducts: -1,
        analytics: 'full',
        featuredPlacementsPerMonth: 10,
        maxTemplates: -1,
        prioritySupport: true
      }
    },
    features: {
      hasOnlineOrdering: true,
      hasDelivery: true,
      acceptsOnlinePayment: true
    },
    stats: {
      totalViews: 18750,
      totalProducts: 52,
      totalOrders: 1680,
      averageRating: 4.2
    },
    createdAt: new Date('2023-02-01'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: 'shop-003',
    mallId: 'riyadh-park-mall',
    name: 'Burger King',
    nameAr: 'برغر كينغ',
    category: 'Food & Beverages',
    iconUrl: 'https://example.com/icons/burgerking.png',
    websiteUrl: 'https://burgerking.com.sa',
    description: 'Home of the Whopper burger',
    descriptionAr: 'موطن برغر الووبر',
    location: {
      floor: 'Ground Floor',
      zone: 'Food Court',
      unit: 'FC-03'
    },
    contact: {
      phone: '+966501234569',
      whatsapp: '+966501234569',
      email: 'burgerking@riyadhpark.com'
    },
    hours: {
      monday: { isOpen: true, openTime: '10:00', closeTime: '23:30' },
      tuesday: { isOpen: true, openTime: '10:00', closeTime: '23:30' },
      wednesday: { isOpen: true, openTime: '10:00', closeTime: '23:30' },
      thursday: { isOpen: true, openTime: '10:00', closeTime: '23:30' },
      friday: { isOpen: true, openTime: '10:00', closeTime: '23:30' },
      saturday: { isOpen: true, openTime: '10:00', closeTime: '23:30' },
      sunday: { isOpen: true, openTime: '10:00', closeTime: '23:30' }
    },
    rating: 4.1,
    isActive: true,
    subscription: {
      tier: 'professional',
      status: 'active',
      expiresAt: new Date('2024-11-30'),
      features: {
        maxProducts: 100,
        analytics: 'advanced',
        featuredPlacementsPerMonth: 5,
        maxTemplates: 10,
        prioritySupport: true
      }
    },
    features: {
      hasOnlineOrdering: true,
      hasDelivery: true,
      acceptsOnlinePayment: true
    },
    stats: {
      totalViews: 12340,
      totalProducts: 38,
      totalOrders: 980,
      averageRating: 4.1
    },
    createdAt: new Date('2023-03-10'),
    updatedAt: new Date('2024-01-18')
  },
  {
    id: 'shop-004',
    mallId: 'riyadh-park-mall',
    name: 'Pizza Hut',
    nameAr: 'بيتزا هت',
    category: 'Food & Beverages',
    iconUrl: 'https://example.com/icons/pizzahut.png',
    websiteUrl: 'https://pizzahut.com.sa',
    description: 'Italian-American pizza restaurant chain',
    descriptionAr: 'سلسلة مطاعم البيتزا الإيطالية الأمريكية',
    location: {
      floor: 'Ground Floor',
      zone: 'Food Court',
      unit: 'FC-04'
    },
    contact: {
      phone: '+966501234570',
      whatsapp: '+966501234570',
      email: 'pizzahut@riyadhpark.com'
    },
    hours: {
      monday: { isOpen: true, openTime: '11:00', closeTime: '23:00' },
      tuesday: { isOpen: true, openTime: '11:00', closeTime: '23:00' },
      wednesday: { isOpen: true, openTime: '11:00', closeTime: '23:00' },
      thursday: { isOpen: true, openTime: '11:00', closeTime: '23:00' },
      friday: { isOpen: true, openTime: '11:00', closeTime: '24:00' },
      saturday: { isOpen: true, openTime: '11:00', closeTime: '24:00' },
      sunday: { isOpen: true, openTime: '11:00', closeTime: '23:00' }
    },
    rating: 4.3,
    isActive: true,
    subscription: {
      tier: 'basic',
      status: 'active',
      expiresAt: new Date('2024-10-31'),
      features: {
        maxProducts: 25,
        analytics: 'basic',
        featuredPlacementsPerMonth: 2,
        maxTemplates: 3,
        prioritySupport: false
      }
    },
    features: {
      hasOnlineOrdering: true,
      hasDelivery: true,
      acceptsOnlinePayment: false
    },
    stats: {
      totalViews: 9870,
      totalProducts: 22,
      totalOrders: 650,
      averageRating: 4.3
    },
    createdAt: new Date('2023-04-05'),
    updatedAt: new Date('2024-01-12')
  },
  {
    id: 'shop-005',
    mallId: 'riyadh-park-mall',
    name: 'Zara',
    nameAr: 'زارا',
    category: 'Fashion & Clothing',
    iconUrl: 'https://example.com/icons/zara.png',
    websiteUrl: 'https://zara.com/sa',
    description: 'Spanish multinational clothing retailer',
    descriptionAr: 'متجر الملابس الإسباني متعدد الجنسيات',
    location: {
      floor: 'First Floor',
      zone: 'Fashion Wing',
      unit: 'F1-15'
    },
    contact: {
      phone: '+966501234571',
      whatsapp: '+966501234571',
      email: 'zara@riyadhpark.com'
    },
    hours: {
      monday: { isOpen: true, openTime: '10:00', closeTime: '22:00' },
      tuesday: { isOpen: true, openTime: '10:00', closeTime: '22:00' },
      wednesday: { isOpen: true, openTime: '10:00', closeTime: '22:00' },
      thursday: { isOpen: true, openTime: '10:00', closeTime: '22:00' },
      friday: { isOpen: true, openTime: '10:00', closeTime: '22:00' },
      saturday: { isOpen: true, openTime: '10:00', closeTime: '22:00' },
      sunday: { isOpen: true, openTime: '10:00', closeTime: '22:00' }
    },
    rating: 4.4,
    isActive: true,
    subscription: {
      tier: 'premium',
      status: 'active',
      expiresAt: new Date('2024-12-31'),
      features: {
        maxProducts: -1,
        analytics: 'full',
        featuredPlacementsPerMonth: 10,
        maxTemplates: -1,
        prioritySupport: true
      }
    },
    features: {
      hasOnlineOrdering: false,
      hasDelivery: false,
      acceptsOnlinePayment: false
    },
    stats: {
      totalViews: 22450,
      totalProducts: 150,
      totalOrders: 0,
      averageRating: 4.4
    },
    createdAt: new Date('2023-01-20'),
    updatedAt: new Date('2024-01-22')
  },
  {
    id: 'shop-006',
    mallId: 'riyadh-park-mall',
    name: 'H&M',
    nameAr: 'إتش آند إم',
    category: 'Fashion & Clothing',
    iconUrl: 'https://example.com/icons/hm.png',
    websiteUrl: 'https://hm.com/sa',
    description: 'Swedish multinational clothing retailer',
    descriptionAr: 'متجر الملابس السويدي متعدد الجنسيات',
    location: {
      floor: 'First Floor',
      zone: 'Fashion Wing',
      unit: 'F1-18'
    },
    contact: {
      phone: '+966501234572',
      whatsapp: '+966501234572',
      email: 'hm@riyadhpark.com'
    },
    hours: {
      monday: { isOpen: true, openTime: '10:00', closeTime: '22:00' },
      tuesday: { isOpen: true, openTime: '10:00', closeTime: '22:00' },
      wednesday: { isOpen: true, openTime: '10:00', closeTime: '22:00' },
      thursday: { isOpen: true, openTime: '10:00', closeTime: '22:00' },
      friday: { isOpen: true, openTime: '10:00', closeTime: '22:00' },
      saturday: { isOpen: true, openTime: '10:00', closeTime: '22:00' },
      sunday: { isOpen: true, openTime: '10:00', closeTime: '22:00' }
    },
    rating: 4.2,
    isActive: true,
    subscription: {
      tier: 'professional',
      status: 'active',
      expiresAt: new Date('2024-12-31'),
      features: {
        maxProducts: 100,
        analytics: 'advanced',
        featuredPlacementsPerMonth: 5,
        maxTemplates: 10,
        prioritySupport: true
      }
    },
    features: {
      hasOnlineOrdering: false,
      hasDelivery: false,
      acceptsOnlinePayment: false
    },
    stats: {
      totalViews: 19200,
      totalProducts: 120,
      totalOrders: 0,
      averageRating: 4.2
    },
    createdAt: new Date('2023-02-15'),
    updatedAt: new Date('2024-01-19')
  },
  {
    id: 'shop-007',
    mallId: 'riyadh-park-mall',
    name: 'Starbucks',
    nameAr: 'ستاربكس',
    category: 'Food & Beverages',
    iconUrl: 'https://example.com/icons/starbucks.png',
    websiteUrl: 'https://starbucks.com.sa',
    description: 'Premium coffee chain and coffeehouse',
    descriptionAr: 'سلسلة القهوة الفاخرة ومقهى',
    location: {
      floor: 'Ground Floor',
      zone: 'Main Entrance',
      unit: 'G-05'
    },
    contact: {
      phone: '+966501234573',
      whatsapp: '+966501234573',
      email: 'starbucks@riyadhpark.com'
    },
    hours: {
      monday: { isOpen: true, openTime: '07:00', closeTime: '23:00' },
      tuesday: { isOpen: true, openTime: '07:00', closeTime: '23:00' },
      wednesday: { isOpen: true, openTime: '07:00', closeTime: '23:00' },
      thursday: { isOpen: true, openTime: '07:00', closeTime: '23:00' },
      friday: { isOpen: true, openTime: '07:00', closeTime: '23:00' },
      saturday: { isOpen: true, openTime: '07:00', closeTime: '23:00' },
      sunday: { isOpen: true, openTime: '07:00', closeTime: '23:00' }
    },
    rating: 4.6,
    isActive: true,
    subscription: {
      tier: 'premium',
      status: 'active',
      expiresAt: new Date('2024-12-31'),
      features: {
        maxProducts: -1,
        analytics: 'full',
        featuredPlacementsPerMonth: 10,
        maxTemplates: -1,
        prioritySupport: true
      }
    },
    features: {
      hasOnlineOrdering: true,
      hasDelivery: true,
      acceptsOnlinePayment: true
    },
    stats: {
      totalViews: 28900,
      totalProducts: 65,
      totalOrders: 2150,
      averageRating: 4.6
    },
    createdAt: new Date('2023-01-10'),
    updatedAt: new Date('2024-01-25')
  },
  {
    id: 'shop-008',
    mallId: 'riyadh-park-mall',
    name: 'Apple Store',
    nameAr: 'متجر أبل',
    category: 'Electronics',
    iconUrl: 'https://example.com/icons/apple.png',
    websiteUrl: 'https://apple.com/sa',
    description: 'Premium electronics and technology products',
    descriptionAr: 'منتجات الإلكترونيات والتكنولوجيا المتميزة',
    location: {
      floor: 'Second Floor',
      zone: 'Electronics Wing',
      unit: 'F2-08'
    },
    contact: {
      phone: '+966501234574',
      whatsapp: '+966501234574',
      email: 'apple@riyadhpark.com'
    },
    hours: {
      monday: { isOpen: true, openTime: '10:00', closeTime: '22:00' },
      tuesday: { isOpen: true, openTime: '10:00', closeTime: '22:00' },
      wednesday: { isOpen: true, openTime: '10:00', closeTime: '22:00' },
      thursday: { isOpen: true, openTime: '10:00', closeTime: '22:00' },
      friday: { isOpen: true, openTime: '10:00', closeTime: '22:00' },
      saturday: { isOpen: true, openTime: '10:00', closeTime: '22:00' },
      sunday: { isOpen: true, openTime: '10:00', closeTime: '22:00' }
    },
    rating: 4.8,
    isActive: true,
    subscription: {
      tier: 'premium',
      status: 'active',
      expiresAt: new Date('2024-12-31'),
      features: {
        maxProducts: -1,
        analytics: 'full',
        featuredPlacementsPerMonth: 10,
        maxTemplates: -1,
        prioritySupport: true
      }
    },
    features: {
      hasOnlineOrdering: true,
      hasDelivery: true,
      acceptsOnlinePayment: true
    },
    stats: {
      totalViews: 35670,
      totalProducts: 85,
      totalOrders: 890,
      averageRating: 4.8
    },
    createdAt: new Date('2023-03-01'),
    updatedAt: new Date('2024-01-28')
  },
  {
    id: 'shop-009',
    mallId: 'riyadh-park-mall',
    name: 'Samsung Store',
    nameAr: 'متجر سامسونغ',
    category: 'Electronics',
    iconUrl: 'https://example.com/icons/samsung.png',
    websiteUrl: 'https://samsung.com/sa',
    description: 'Latest Samsung electronics and mobile devices',
    descriptionAr: 'أحدث إلكترونيات وأجهزة سامسونغ المحمولة',
    location: {
      floor: 'Second Floor',
      zone: 'Electronics Wing',
      unit: 'F2-12'
    },
    contact: {
      phone: '+966501234575',
      whatsapp: '+966501234575',
      email: 'samsung@riyadhpark.com'
    },
    hours: {
      monday: { isOpen: true, openTime: '10:00', closeTime: '22:00' },
      tuesday: { isOpen: true, openTime: '10:00', closeTime: '22:00' },
      wednesday: { isOpen: true, openTime: '10:00', closeTime: '22:00' },
      thursday: { isOpen: true, openTime: '10:00', closeTime: '22:00' },
      friday: { isOpen: true, openTime: '10:00', closeTime: '22:00' },
      saturday: { isOpen: true, openTime: '10:00', closeTime: '22:00' },
      sunday: { isOpen: true, openTime: '10:00', closeTime: '22:00' }
    },
    rating: 4.5,
    isActive: true,
    subscription: {
      tier: 'professional',
      status: 'active',
      expiresAt: new Date('2024-12-31'),
      features: {
        maxProducts: 100,
        analytics: 'advanced',
        featuredPlacementsPerMonth: 5,
        maxTemplates: 10,
        prioritySupport: true
      }
    },
    features: {
      hasOnlineOrdering: true,
      hasDelivery: true,
      acceptsOnlinePayment: true
    },
    stats: {
      totalViews: 24580,
      totalProducts: 78,
      totalOrders: 720,
      averageRating: 4.5
    },
    createdAt: new Date('2023-03-15'),
    updatedAt: new Date('2024-01-24')
  },
  {
    id: 'shop-010',
    mallId: 'riyadh-park-mall',
    name: 'Sephora',
    nameAr: 'سيفورا',
    category: 'Beauty & Health',
    iconUrl: 'https://example.com/icons/sephora.png',
    websiteUrl: 'https://sephora.com/sa',
    description: 'Premium beauty and cosmetics retailer',
    descriptionAr: 'متجر الجمال ومستحضرات التجميل المتميز',
    location: {
      floor: 'First Floor',
      zone: 'Beauty Wing',
      unit: 'F1-25'
    },
    contact: {
      phone: '+966501234576',
      whatsapp: '+966501234576',
      email: 'sephora@riyadhpark.com'
    },
    hours: {
      monday: { isOpen: true, openTime: '10:00', closeTime: '22:00' },
      tuesday: { isOpen: true, openTime: '10:00', closeTime: '22:00' },
      wednesday: { isOpen: true, openTime: '10:00', closeTime: '22:00' },
      thursday: { isOpen: true, openTime: '10:00', closeTime: '22:00' },
      friday: { isOpen: true, openTime: '10:00', closeTime: '22:00' },
      saturday: { isOpen: true, openTime: '10:00', closeTime: '22:00' },
      sunday: { isOpen: true, openTime: '10:00', closeTime: '22:00' }
    },
    rating: 4.4,
    isActive: true,
    subscription: {
      tier: 'professional',
      status: 'active',
      expiresAt: new Date('2024-11-30'),
      features: {
        maxProducts: 100,
        analytics: 'advanced',
        featuredPlacementsPerMonth: 5,
        maxTemplates: 10,
        prioritySupport: true
      }
    },
    features: {
      hasOnlineOrdering: true,
      hasDelivery: true,
      acceptsOnlinePayment: true
    },
    stats: {
      totalViews: 18950,
      totalProducts: 195,
      totalOrders: 1420,
      averageRating: 4.4
    },
    createdAt: new Date('2023-04-10'),
    updatedAt: new Date('2024-01-21')
  }
];

export default mockShops;