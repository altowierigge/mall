// Redux Store Configuration
// Main store setup with RTK Query and middleware

import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

// Import slices
import shopsSlice from './slices/shopsSlice';
import searchSlice from './slices/searchSlice';
import favoritesSlice from './slices/favoritesSlice';
import userSlice from './slices/userSlice';
import offersSlice from './slices/offersSlice';

// Import API slice
import { mallApi } from './api/mallApi';

// Configure store
export const store = configureStore({
  reducer: {
    shops: shopsSlice,
    search: searchSlice,
    favorites: favoritesSlice,
    user: userSlice,
    offers: offersSlice,
    [mallApi.reducerPath]: mallApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          mallApi.util.upsertQueryData.type,
          mallApi.util.updateQueryData.type,
        ],
      },
    }).concat(mallApi.middleware),
  devTools: __DEV__,
});

// Setup listeners for RTK Query
setupListeners(store.dispatch);

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Export typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Export store
export default store;