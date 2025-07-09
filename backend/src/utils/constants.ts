export const MALL_CONFIG = {
  DEFAULT_MALL_ID: 'riyadh-park',
  DEFAULT_MALL_NAME: 'Riyadh Park',
  DEFAULT_MALL_NAME_AR: 'الرياض بارك',
};

export const API_CONFIG = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
};

export const SHOP_CATEGORIES = [
  'Fashion',
  'Electronics',
  'Food & Dining',
  'Beauty & Health',
  'Sports & Recreation',
  'Home & Garden',
  'Books & Stationery',
  'Jewelry & Accessories',
  'Kids & Toys',
  'Services',
  'Entertainment',
  'Supermarket',
] as const;

export const SUBSCRIPTION_TIERS = {
  BASIC: 'basic',
  PROFESSIONAL: 'professional',
  PREMIUM: 'premium',
} as const;

export const SUBSCRIPTION_STATUS = {
  ACTIVE: 'active',
  SUSPENDED: 'suspended',
  EXPIRED: 'expired',
} as const;