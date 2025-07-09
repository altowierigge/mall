// User Slice
// Redux slice for user state management

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, UserState, UserPreferences } from '../../types';

const initialState: UserState = {
  user: null,
  isLoggedIn: false,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
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

    // Set user data (login)
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isLoggedIn = true;
      state.loading = false;
      state.error = null;
    },

    // Clear user data (logout)
    clearUser: (state) => {
      state.user = null;
      state.isLoggedIn = false;
      state.loading = false;
      state.error = null;
    },

    // Update user profile
    updateProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },

    // Update user preferences
    updatePreferences: (state, action: PayloadAction<Partial<UserPreferences>>) => {
      if (state.user) {
        state.user.preferences = { ...state.user.preferences, ...action.payload };
      }
    },

    // Add shop to user favorites
    addToUserFavorites: (state, action: PayloadAction<string>) => {
      if (state.user) {
        const shopId = action.payload;
        if (!state.user.favoriteShops.includes(shopId)) {
          state.user.favoriteShops.push(shopId);
        }
      }
    },

    // Remove shop from user favorites
    removeFromUserFavorites: (state, action: PayloadAction<string>) => {
      if (state.user) {
        const shopId = action.payload;
        const index = state.user.favoriteShops.indexOf(shopId);
        if (index !== -1) {
          state.user.favoriteShops.splice(index, 1);
        }
      }
    },

    // Set user favorites
    setUserFavorites: (state, action: PayloadAction<string[]>) => {
      if (state.user) {
        state.user.favoriteShops = action.payload;
      }
    },

    // Login start
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },

    // Login success
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isLoggedIn = true;
      state.loading = false;
      state.error = null;
    },

    // Login failure
    loginFailure: (state, action: PayloadAction<string>) => {
      state.user = null;
      state.isLoggedIn = false;
      state.loading = false;
      state.error = action.payload;
    },

    // Logout
    logout: (state) => {
      state.user = null;
      state.isLoggedIn = false;
      state.loading = false;
      state.error = null;
    },

    // Update notification preferences
    updateNotificationPreferences: (state, action: PayloadAction<Partial<UserPreferences['notifications']>>) => {
      if (state.user) {
        state.user.preferences.notifications = {
          ...state.user.preferences.notifications,
          ...action.payload,
        };
      }
    },

    // Set language preference
    setLanguage: (state, action: PayloadAction<'en' | 'ar'>) => {
      if (state.user) {
        state.user.preferences.language = action.payload;
      }
    },

    // Set theme preference
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      if (state.user) {
        state.user.preferences.theme = action.payload;
      }
    },

    // Guest user setup (for local preferences without account)
    setupGuestUser: (state, action: PayloadAction<UserPreferences>) => {
      state.user = {
        id: 'guest',
        email: '',
        firstName: 'Guest',
        lastName: 'User',
        preferences: action.payload,
        favoriteShops: [],
        isActive: true,
        createdAt: new Date().toISOString(),
      };
      state.isLoggedIn = false; // Guest is not logged in
    },
  },
});

export const {
  setLoading,
  setError,
  setUser,
  clearUser,
  updateProfile,
  updatePreferences,
  addToUserFavorites,
  removeFromUserFavorites,
  setUserFavorites,
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  updateNotificationPreferences,
  setLanguage,
  setTheme,
  setupGuestUser,
} = userSlice.actions;

// Selectors
export const selectUser = (state: { user: UserState }) => state.user.user;
export const selectIsLoggedIn = (state: { user: UserState }) => state.user.isLoggedIn;
export const selectUserLoading = (state: { user: UserState }) => state.user.loading;
export const selectUserError = (state: { user: UserState }) => state.user.error;

// Memoized selectors
export const selectUserPreferences = (state: { user: UserState }) => {
  return state.user.user?.preferences || {
    language: 'en',
    notifications: {
      offers: true,
      newShops: true,
      events: true,
    },
    theme: 'light',
  };
};

export const selectUserFavorites = (state: { user: UserState }) => {
  return state.user.user?.favoriteShops || [];
};

export const selectUserLanguage = (state: { user: UserState }) => {
  return state.user.user?.preferences.language || 'en';
};

export const selectUserTheme = (state: { user: UserState }) => {
  return state.user.user?.preferences.theme || 'light';
};

export const selectNotificationPreferences = (state: { user: UserState }) => {
  return state.user.user?.preferences.notifications || {
    offers: true,
    newShops: true,
    events: true,
  };
};

export const selectUserDisplayName = (state: { user: UserState }) => {
  const user = state.user.user;
  if (!user) return 'Guest';
  return `${user.firstName} ${user.lastName}`.trim() || user.email;
};

export const selectIsGuestUser = (state: { user: UserState }) => {
  return state.user.user?.id === 'guest';
};

export default userSlice.reducer;