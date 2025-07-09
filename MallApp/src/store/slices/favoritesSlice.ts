// Favorites Slice
// Redux slice for favorites state management

import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FavoritesState, STORAGE_KEYS } from '../../types';

const initialState: FavoritesState = {
  shopIds: [],
  synced: false,
  loading: false,
  error: null,
};

// Async thunks for AsyncStorage operations
export const loadFavorites = createAsyncThunk(
  'favorites/loadFavorites',
  async () => {
    try {
      const favorites = await AsyncStorage.getItem(STORAGE_KEYS.FAVORITES);
      return favorites ? JSON.parse(favorites) : [];
    } catch (error) {
      console.error('Error loading favorites:', error);
      return [];
    }
  }
);

export const saveFavorites = createAsyncThunk(
  'favorites/saveFavorites',
  async (shopIds: string[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(shopIds));
      return shopIds;
    } catch (error) {
      console.error('Error saving favorites:', error);
      throw error;
    }
  }
);

const favoritesSlice = createSlice({
  name: 'favorites',
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

    // Set favorites from storage or API
    setFavorites: (state, action: PayloadAction<string[]>) => {
      state.shopIds = action.payload;
      state.synced = true;
      state.loading = false;
      state.error = null;
    },

    // Add shop to favorites
    addFavorite: (state, action: PayloadAction<string>) => {
      const shopId = action.payload;
      if (!state.shopIds.includes(shopId)) {
        state.shopIds.push(shopId);
        state.synced = false; // Mark as needing sync
      }
    },

    // Remove shop from favorites
    removeFavorite: (state, action: PayloadAction<string>) => {
      const shopId = action.payload;
      const index = state.shopIds.indexOf(shopId);
      if (index !== -1) {
        state.shopIds.splice(index, 1);
        state.synced = false; // Mark as needing sync
      }
    },

    // Toggle favorite status
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const shopId = action.payload;
      const index = state.shopIds.indexOf(shopId);
      if (index !== -1) {
        state.shopIds.splice(index, 1);
      } else {
        state.shopIds.push(shopId);
      }
      state.synced = false; // Mark as needing sync
    },

    // Clear all favorites
    clearFavorites: (state) => {
      state.shopIds = [];
      state.synced = false;
      state.loading = false;
      state.error = null;
    },

    // Mark as synced
    markAsSynced: (state) => {
      state.synced = true;
    },

    // Mark as unsynced
    markAsUnsynced: (state) => {
      state.synced = false;
    },

    // Sync favorites with server
    syncFavorites: (state) => {
      state.loading = true;
      state.error = null;
    },

    // Sync success
    syncSuccess: (state, action: PayloadAction<string[]>) => {
      state.shopIds = action.payload;
      state.synced = true;
      state.loading = false;
      state.error = null;
    },

    // Sync failure
    syncFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.synced = false;
    },

    // Load favorites from local storage
    loadFromStorage: (state, action: PayloadAction<string[]>) => {
      state.shopIds = action.payload;
      state.synced = false; // Local data might be out of sync
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Load favorites
      .addCase(loadFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadFavorites.fulfilled, (state, action) => {
        state.loading = false;
        state.shopIds = action.payload;
        state.synced = true;
        state.error = null;
      })
      .addCase(loadFavorites.rejected, (state) => {
        state.loading = false;
        state.error = 'Failed to load favorites';
      })
      // Save favorites
      .addCase(saveFavorites.fulfilled, (state) => {
        state.synced = true;
      })
      .addCase(saveFavorites.rejected, (state) => {
        state.error = 'Failed to save favorites';
      });
  },
});

export const {
  setLoading,
  setError,
  setFavorites,
  addFavorite,
  removeFavorite,
  toggleFavorite,
  clearFavorites,
  markAsSynced,
  markAsUnsynced,
  syncFavorites,
  syncSuccess,
  syncFailure,
  loadFromStorage,
} = favoritesSlice.actions;

// Export async thunks
export { loadFavorites, saveFavorites };

// Selectors
export const selectFavoriteShopIds = (state: { favorites: FavoritesState }) => state.favorites.shopIds;
export const selectFavoritesLoading = (state: { favorites: FavoritesState }) => state.favorites.loading;
export const selectFavoritesError = (state: { favorites: FavoritesState }) => state.favorites.error;
export const selectFavoritesSynced = (state: { favorites: FavoritesState }) => state.favorites.synced;

// Memoized selectors
export const selectIsFavorite = (shopId: string) => (state: { favorites: FavoritesState }) => {
  return state.favorites.shopIds.includes(shopId);
};

export const selectFavoritesCount = (state: { favorites: FavoritesState }) => {
  return state.favorites.shopIds.length;
};

export const selectHasFavorites = (state: { favorites: FavoritesState }) => {
  return state.favorites.shopIds.length > 0;
};

export const selectNeedsSyncing = (state: { favorites: FavoritesState }) => {
  return !state.favorites.synced && state.favorites.shopIds.length > 0;
};

// Combined selector with shops data
export const selectFavoriteShops = (state: { favorites: FavoritesState; shops: any }) => {
  const favoriteIds = state.favorites.shopIds;
  const allShops = state.shops.shops || [];
  return allShops.filter((shop: any) => favoriteIds.includes(shop.id));
};

export default favoritesSlice.reducer;