import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../index';
import { 
  LoginRequest, 
  LoginResponse, 
  ApiResponse, 
  Shop, 
  Product, 
  ShopAnalytics, 
  DashboardStats,
  PaginatedResponse
} from '../../types';

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.REACT_APP_API_URL || 'http://localhost:3001/api/v1',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    headers.set('content-type', 'application/json');
    return headers;
  },
});

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  let result = await baseQuery(args, api, extraOptions);
  
  if (result.error && result.error.status === 401) {
    // Try to refresh token
    const refreshToken = (api.getState() as RootState).auth.refreshToken;
    if (refreshToken) {
      const refreshResult = await baseQuery(
        {
          url: '/auth/refresh',
          method: 'POST',
          body: { refreshToken },
        },
        api,
        extraOptions
      );
      
      if (refreshResult.data) {
        // Store new tokens
        api.dispatch({ type: 'auth/refreshTokenSuccess', payload: refreshResult.data });
        // Retry original query
        result = await baseQuery(args, api, extraOptions);
      } else {
        // Refresh failed, logout user
        api.dispatch({ type: 'auth/logout' });
      }
    } else {
      // No refresh token, logout user
      api.dispatch({ type: 'auth/logout' });
    }
  }
  
  return result;
};

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Shop', 'Product', 'Analytics', 'Dashboard'],
  endpoints: (builder) => ({
    // Authentication endpoints
    login: builder.mutation<ApiResponse<LoginResponse>, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/shop-owner/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    
    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/shop-owner/logout',
        method: 'POST',
      }),
    }),
    
    refreshToken: builder.mutation<ApiResponse<{ token: string; refreshToken: string }>, { refreshToken: string }>({
      query: (body) => ({
        url: '/auth/refresh',
        method: 'POST',
        body,
      }),
    }),
    
    // Shop endpoints
    getShopProfile: builder.query<ApiResponse<Shop>, void>({
      query: () => '/shop/profile',
      providesTags: ['Shop'],
    }),
    
    updateShopProfile: builder.mutation<ApiResponse<Shop>, Partial<Shop>>({
      query: (shopData) => ({
        url: '/shop/profile',
        method: 'PUT',
        body: shopData,
      }),
      invalidatesTags: ['Shop'],
    }),
    
    getDashboardStats: builder.query<ApiResponse<DashboardStats>, void>({
      query: () => '/shop/dashboard/stats',
      providesTags: ['Dashboard'],
    }),
    
    getShopAnalytics: builder.query<ApiResponse<ShopAnalytics>, { period: 'daily' | 'weekly' | 'monthly' }>({
      query: ({ period }) => `/shop/analytics?period=${period}`,
      providesTags: ['Analytics'],
    }),
    
    // Product endpoints
    getProducts: builder.query<ApiResponse<PaginatedResponse<Product>>, { page?: number; limit?: number; search?: string }>({
      query: ({ page = 1, limit = 10, search }) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          ...(search && { search }),
        });
        return `/shop/products?${params}`;
      },
      providesTags: ['Product'],
    }),
    
    getProduct: builder.query<ApiResponse<Product>, string>({
      query: (id) => `/shop/products/${id}`,
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),
    
    createProduct: builder.mutation<ApiResponse<Product>, Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>({
      query: (productData) => ({
        url: '/shop/products',
        method: 'POST',
        body: productData,
      }),
      invalidatesTags: ['Product', 'Dashboard'],
    }),
    
    updateProduct: builder.mutation<ApiResponse<Product>, { id: string; data: Partial<Product> }>({
      query: ({ id, data }) => ({
        url: `/shop/products/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Product', id }, 'Dashboard'],
    }),
    
    deleteProduct: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/shop/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Product', 'Dashboard'],
    }),
    
    // File upload endpoints
    uploadShopIcon: builder.mutation<ApiResponse<{ iconUrl: string }>, FormData>({
      query: (formData) => ({
        url: '/shop/upload/icon',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Shop'],
    }),
    
    uploadProductImages: builder.mutation<ApiResponse<{ images: string[] }>, FormData>({
      query: (formData) => ({
        url: '/upload/product-images',
        method: 'POST',
        body: formData,
      }),
    }),

    uploadShopIcon: builder.mutation<ApiResponse<{ iconUrl: string; message: string }>, FormData>({
      query: (formData) => ({
        url: '/upload/shop-icon',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Shop'],
    }),

    deleteFile: builder.mutation<ApiResponse<{ message: string }>, { fileUrl: string }>({
      query: (body) => ({
        url: '/upload/file',
        method: 'DELETE',
        body,
      }),
    }),

    // Template endpoints
    getTemplates: builder.query<ApiResponse<any[]>, { category?: string; type?: string }>({
      query: ({ category, type }) => {
        const params = new URLSearchParams();
        if (category) params.append('category', category);
        if (type) params.append('type', type);
        return `/templates?${params}`;
      },
      providesTags: ['Templates'],
    }),

    getTemplate: builder.query<ApiResponse<any>, string>({
      query: (id) => `/templates/${id}`,
      providesTags: (result, error, id) => [{ type: 'Templates', id }],
    }),

    getShopCustomization: builder.query<ApiResponse<any>, void>({
      query: () => '/shop/customization',
      providesTags: ['Customization'],
    }),

    applyTemplate: builder.mutation<ApiResponse<any>, { templateId: string; customizations?: any }>({
      query: (body) => ({
        url: '/shop/apply-template',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Customization', 'Shop'],
    }),

    updateCustomization: builder.mutation<ApiResponse<any>, { customizations: any }>({
      query: (body) => ({
        url: '/shop/customization',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Customization'],
    }),

    removeCustomization: builder.mutation<ApiResponse<any>, void>({
      query: () => ({
        url: '/shop/customization',
        method: 'DELETE',
      }),
      invalidatesTags: ['Customization'],
    }),

    previewTemplate: builder.mutation<ApiResponse<any>, { templateId: string; customizations?: any }>({
      query: (body) => ({
        url: '/templates/preview',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useRefreshTokenMutation,
  useGetShopProfileQuery,
  useUpdateShopProfileMutation,
  useGetDashboardStatsQuery,
  useGetShopAnalyticsQuery,
  useGetProductsQuery,
  useGetProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useUploadShopIconMutation,
  useUploadProductImagesMutation,
  useDeleteFileMutation,
  useGetTemplatesQuery,
  useGetTemplateQuery,
  useGetShopCustomizationQuery,
  useApplyTemplateMutation,
  useUpdateCustomizationMutation,
  useRemoveCustomizationMutation,
  usePreviewTemplateMutation,
} = apiSlice;