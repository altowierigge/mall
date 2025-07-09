// Shops Slice
// Redux slice for shops state management

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Shop, Category, ShopsState } from '../../types';

const initialState: ShopsState = {
  shops: [],
  categories: [],
  loading: false,
  error: null,
  lastFetch: null,
};

const shopsSlice = createSlice({
  name: 'shops',
  initialState,
  reducers: {
    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    // Set error state
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    // Set shops data
    setShops: (state, action: PayloadAction<Shop[]>) => {
      state.shops = action.payload;
      state.loading = false;
      state.error = null;
      state.lastFetch = Date.now();
    },

    // Set categories data
    setCategories: (state, action: PayloadAction<Category[]>) => {
      state.categories = action.payload;
    },

    // Update single shop
    updateShop: (state, action: PayloadAction<Shop>) => {
      const index = state.shops.findIndex(shop => shop.id === action.payload.id);
      if (index !== -1) {
        state.shops[index] = action.payload;
      }
    },

    // Clear shops data
    clearShops: (state) => {
      state.shops = [];
      state.categories = [];
      state.loading = false;
      state.error = null;
      state.lastFetch = null;
    },

    // Filter shops by category
    filterShopsByCategory: (state, action: PayloadAction<string>) => {
      const category = action.payload;
      if (category === 'all') {
        // Return all shops - no filtering needed as the UI will handle display
        return;
      }
      // Note: This doesn't modify the state, just triggers a re-render
      // The actual filtering happens in the component using selectors
    },

    // Sort shops
    sortShops: (state, action: PayloadAction<{ sortBy: string; order: 'asc' | 'desc' }>) => {
      const { sortBy, order } = action.payload;
      state.shops.sort((a, b) => {
        let aValue: any;
        let bValue: any;

        switch (sortBy) {
          case 'name':
            aValue = a.name.toLowerCase();
            bValue = b.name.toLowerCase();
            break;
          case 'rating':
            aValue = a.rating;
            bValue = b.rating;
            break;
          case 'category':
            aValue = a.category.toLowerCase();
            bValue = b.category.toLowerCase();
            break;
          default:
            aValue = a.name.toLowerCase();
            bValue = b.name.toLowerCase();
        }

        if (order === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
    },

    // Refresh shops data
    refreshShops: (state) => {
      state.loading = true;
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setError,
  setShops,
  setCategories,
  updateShop,
  clearShops,
  filterShopsByCategory,
  sortShops,
  refreshShops,
} = shopsSlice.actions;

// Selectors
export const selectShops = (state: { shops: ShopsState }) => state.shops.shops;
export const selectCategories = (state: { shops: ShopsState }) => state.shops.categories;
export const selectShopsLoading = (state: { shops: ShopsState }) => state.shops.loading;
export const selectShopsError = (state: { shops: ShopsState }) => state.shops.error;
export const selectLastFetch = (state: { shops: ShopsState }) => state.shops.lastFetch;

// Memoized selectors
export const selectShopsByCategory = (category: string) => (state: { shops: ShopsState }) => {
  if (category === 'all') {
    return state.shops.shops;
  }
  return state.shops.shops.filter(shop => shop.category === category);
};

export const selectShopById = (id: string) => (state: { shops: ShopsState }) => {
  return state.shops.shops.find(shop => shop.id === id);
};

export const selectShopsByIds = (ids: string[]) => (state: { shops: ShopsState }) => {
  return state.shops.shops.filter(shop => ids.includes(shop.id));
};

export const selectActiveShops = (state: { shops: ShopsState }) => {
  return state.shops.shops.filter(shop => shop.isActive);
};

export const selectShopsByRating = (minRating: number) => (state: { shops: ShopsState }) => {
  return state.shops.shops.filter(shop => shop.rating >= minRating);
};

export const selectShopsWithFeature = (feature: keyof Shop['features']) => (state: { shops: ShopsState }) => {
  return state.shops.shops.filter(shop => shop.features[feature]);
};

export default shopsSlice.reducer;