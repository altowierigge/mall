// Types for React Native Mall App
// Core data types and interfaces

export interface Shop {
  id: string;
  mallId: string;
  name: string;
  nameAr: string;
  category: string;
  iconUrl: string;
  websiteUrl: string;
  description: string;
  location: {
    floor: string;
    zone: string;
    unit: string;
  };
  contact: {
    phone: string;
    whatsapp: string;
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

export interface Mall {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  address: string;
  city: string;
  country: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  contact: {
    phone: string;
    email: string;
    website: string;
  };
  hours: BusinessHours;
  amenities: string[];
  isActive: boolean;
}

export interface Offer {
  id: string;
  shopId: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  imageUrl: string;
  discountPercentage?: number;
  originalPrice?: number;
  salePrice?: number;
  validFrom: string;
  validTo: string;
  terms: string;
  isActive: boolean;
  isFeatured: boolean;
  category: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  preferences: UserPreferences;
  favoriteShops: string[];
  isActive: boolean;
  createdAt: string;
}

export interface UserPreferences {
  language: 'en' | 'ar';
  notifications: {
    offers: boolean;
    newShops: boolean;
    events: boolean;
  };
  theme: 'light' | 'dark';
}

export interface Category {
  id: string;
  name: string;
  nameAr: string;
  iconName: string;
  color: string;
  isActive: boolean;
}

// Navigation Types
export type RootStackParamList = {
  Main: undefined;
  Shop: { shop: Shop };
  ShopWebView: { shop: Shop };
};

export type MainTabParamList = {
  Home: undefined;
  Search: undefined;
  Favorites: undefined;
  Offers: undefined;
  Profile: undefined;
};

// API Response Types
export interface APIResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Redux State Types
export interface ShopsState {
  shops: Shop[];
  categories: Category[];
  loading: boolean;
  error: string | null;
  lastFetch: number | null;
}

export interface SearchState {
  query: string;
  category: string | null;
  results: Shop[];
  loading: boolean;
  error: string | null;
  history: string[];
}

export interface FavoritesState {
  shopIds: string[];
  synced: boolean;
  loading: boolean;
  error: string | null;
}

export interface UserState {
  user: User | null;
  isLoggedIn: boolean;
  loading: boolean;
  error: string | null;
}

export interface OffersState {
  offers: Offer[];
  featuredOffers: Offer[];
  loading: boolean;
  error: string | null;
  lastFetch: number | null;
}

export interface AppState {
  shops: ShopsState;
  search: SearchState;
  favorites: FavoritesState;
  user: UserState;
  offers: OffersState;
}

// Component Props Types
export interface ShopCardProps {
  shop: Shop;
  onPress: (shop: Shop) => void;
  size?: 'small' | 'medium' | 'large';
}

export interface HeaderProps {
  title: string;
  showBack?: boolean;
  showSearch?: boolean;
  showNotifications?: boolean;
  onBackPress?: () => void;
  onSearchPress?: () => void;
  onNotificationsPress?: () => void;
}

export interface LoadingProps {
  visible: boolean;
  message?: string;
}

export interface ErrorProps {
  visible: boolean;
  message: string;
  onRetry?: () => void;
  onDismiss?: () => void;
}

// Theme Types
export interface Colors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  error: string;
  success: string;
  warning: string;
  border: string;
  shadow: string;
}

export interface Theme {
  colors: Colors;
  fonts: {
    regular: string;
    medium: string;
    bold: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
  };
  shadow: {
    shadowColor: string;
    shadowOffset: {
      width: number;
      height: number;
    };
    shadowOpacity: number;
    shadowRadius: number;
    elevation: number;
  };
}

// Utility Types
export type LoadingState = 'idle' | 'pending' | 'fulfilled' | 'rejected';

export interface AsyncState<T> {
  data: T | null;
  status: LoadingState;
  error: string | null;
}

export interface ListState<T> extends AsyncState<T[]> {
  hasMore: boolean;
  page: number;
}

// Form Types
export interface SearchFilters {
  category?: string;
  sortBy?: 'name' | 'rating' | 'distance';
  sortOrder?: 'asc' | 'desc';
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface SearchParams extends PaginationParams {
  query?: string;
  category?: string;
  sortBy?: string;
  sortOrder?: string;
}

// Storage Types
export interface StorageKeys {
  FAVORITES: '@favorites';
  USER_PREFERENCES: '@userPreferences';
  SEARCH_HISTORY: '@searchHistory';
  USER_TOKEN: '@userToken';
  LAST_SYNC: '@lastSync';
  SETTINGS: '@settings';
}

// Constants
export const STORAGE_KEYS: StorageKeys = {
  FAVORITES: '@favorites',
  USER_PREFERENCES: '@userPreferences',
  SEARCH_HISTORY: '@searchHistory',
  USER_TOKEN: '@userToken',
  LAST_SYNC: '@lastSync',
  SETTINGS: '@settings',
};

export const CATEGORIES = [
  { id: 'all', name: 'All', nameAr: 'الكل', iconName: 'apps', color: '#666' },
  { id: 'fashion', name: 'Fashion', nameAr: 'أزياء', iconName: 'shirt', color: '#FF6B6B' },
  { id: 'electronics', name: 'Electronics', nameAr: 'إلكترونيات', iconName: 'phone', color: '#4ECDC4' },
  { id: 'food', name: 'Food & Dining', nameAr: 'طعام ومطاعم', iconName: 'restaurant', color: '#FFD93D' },
  { id: 'beauty', name: 'Beauty', nameAr: 'جمال', iconName: 'brush', color: '#FF8CC8' },
  { id: 'sports', name: 'Sports', nameAr: 'رياضة', iconName: 'fitness', color: '#45B7D1' },
  { id: 'books', name: 'Books', nameAr: 'كتب', iconName: 'book', color: '#96CEB4' },
  { id: 'jewelry', name: 'Jewelry', nameAr: 'مجوهرات', iconName: 'diamond', color: '#FFEAA7' },
  { id: 'home', name: 'Home & Garden', nameAr: 'منزل وحديقة', iconName: 'home', color: '#DDA0DD' },
  { id: 'kids', name: 'Kids', nameAr: 'أطفال', iconName: 'child', color: '#98D8C8' },
];

export const API_ENDPOINTS = {
  SHOPS: '/api/v1/malls/riyadh-park/shops',
  SEARCH: '/api/v1/malls/riyadh-park/shops/search',
  OFFERS: '/api/v1/malls/riyadh-park/offers',
  CATEGORIES: '/api/v1/malls/riyadh-park/categories',
  USER: '/api/v1/user',
  FAVORITES: '/api/v1/user/favorites',
};

export const MALL_ID = 'riyadh-park';