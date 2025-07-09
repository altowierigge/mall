import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Shop, DashboardStats } from '../../types';

interface ShopState {
  currentShop: Shop | null;
  dashboardStats: DashboardStats | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ShopState = {
  currentShop: null,
  dashboardStats: null,
  isLoading: false,
  error: null,
};

const shopSlice = createSlice({
  name: 'shop',
  initialState,
  reducers: {
    setShopLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setShopError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setCurrentShop: (state, action: PayloadAction<Shop>) => {
      state.currentShop = action.payload;
    },
    updateShop: (state, action: PayloadAction<Partial<Shop>>) => {
      if (state.currentShop) {
        state.currentShop = { ...state.currentShop, ...action.payload };
      }
    },
    setDashboardStats: (state, action: PayloadAction<DashboardStats>) => {
      state.dashboardStats = action.payload;
    },
    clearShopData: (state) => {
      state.currentShop = null;
      state.dashboardStats = null;
      state.error = null;
    },
  },
});

export const {
  setShopLoading,
  setShopError,
  setCurrentShop,
  updateShop,
  setDashboardStats,
  clearShopData,
} = shopSlice.actions;

export default shopSlice.reducer;

// Selectors
export const selectCurrentShop = (state: { shop: ShopState }) => state.shop.currentShop;
export const selectDashboardStats = (state: { shop: ShopState }) => state.shop.dashboardStats;
export const selectShopLoading = (state: { shop: ShopState }) => state.shop.isLoading;
export const selectShopError = (state: { shop: ShopState }) => state.shop.error;