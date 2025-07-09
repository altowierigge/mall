// Mall API
// RTK Query API slice for mall-related endpoints

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Shop, Offer, Category, APIResponse, PaginatedResponse, SearchParams } from '../../types';

// Base URL for API calls
const BASE_URL = 'http://localhost:3000/api/v1';

// Create API slice
export const mallApi = createApi({
  reducerPath: 'mallApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      // Add authentication token if available
      const token = (getState() as any)?.user?.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Shop', 'Offer', 'Category', 'Favorite'],
  endpoints: (builder) => ({
    // Get all shops
    getShops: builder.query<APIResponse<Shop[]>, void>({
      query: () => '/malls/riyadh-park/shops',
      providesTags: ['Shop'],
      transformResponse: (response: any) => {
        // Filter only active shops
        return {
          ...response,
          data: response.data?.filter((shop: Shop) => shop.isActive) || [],
        };
      },
    }),

    // Get shop by ID
    getShopById: builder.query<APIResponse<Shop>, string>({
      query: (id) => `/malls/riyadh-park/shops/${id}`,
      providesTags: (result, error, id) => [{ type: 'Shop', id }],
    }),

    // Search shops
    searchShops: builder.query<PaginatedResponse<Shop>, SearchParams>({
      query: (params) => ({
        url: '/malls/riyadh-park/shops/search',
        params: {
          q: params.query,
          category: params.category,
          page: params.page,
          limit: params.limit,
          sortBy: params.sortBy,
          sortOrder: params.sortOrder,
        },
      }),
      providesTags: ['Shop'],
    }),

    // Get offers
    getOffers: builder.query<APIResponse<Offer[]>, void>({
      query: () => '/malls/riyadh-park/offers',
      providesTags: ['Offer'],
      transformResponse: (response: any) => {
        // Filter only active offers
        return {
          ...response,
          data: response.data?.filter((offer: Offer) => offer.isActive) || [],
        };
      },
    }),

    // Get featured offers
    getFeaturedOffers: builder.query<APIResponse<Offer[]>, void>({
      query: () => '/malls/riyadh-park/offers?featured=true',
      providesTags: ['Offer'],
      transformResponse: (response: any) => {
        // Filter active and featured offers
        return {
          ...response,
          data: response.data?.filter((offer: Offer) => 
            offer.isActive && offer.isFeatured
          ) || [],
        };
      },
    }),

    // Get offer by ID
    getOfferById: builder.query<APIResponse<Offer>, string>({
      query: (id) => `/malls/riyadh-park/offers/${id}`,
      providesTags: (result, error, id) => [{ type: 'Offer', id }],
    }),

    // Get categories
    getCategories: builder.query<APIResponse<Category[]>, void>({
      query: () => '/malls/riyadh-park/categories',
      providesTags: ['Category'],
      transformResponse: (response: any) => {
        // Filter only active categories
        return {
          ...response,
          data: response.data?.filter((category: Category) => category.isActive) || [],
        };
      },
    }),

    // Get shops by category
    getShopsByCategory: builder.query<APIResponse<Shop[]>, string>({
      query: (categoryId) => `/malls/riyadh-park/categories/${categoryId}/shops`,
      providesTags: ['Shop'],
    }),

    // User favorites (if authentication is implemented)
    getUserFavorites: builder.query<APIResponse<string[]>, void>({
      query: () => '/user/favorites',
      providesTags: ['Favorite'],
    }),

    // Add shop to favorites
    addFavorite: builder.mutation<APIResponse<void>, string>({
      query: (shopId) => ({
        url: `/user/favorites/${shopId}`,
        method: 'POST',
      }),
      invalidatesTags: ['Favorite'],
    }),

    // Remove shop from favorites
    removeFavorite: builder.mutation<APIResponse<void>, string>({
      query: (shopId) => ({
        url: `/user/favorites/${shopId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Favorite'],
    }),

    // Get mall information
    getMallInfo: builder.query<APIResponse<any>, void>({
      query: () => '/malls/riyadh-park',
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetShopsQuery,
  useGetShopByIdQuery,
  useSearchShopsQuery,
  useGetOffersQuery,
  useGetFeaturedOffersQuery,
  useGetOfferByIdQuery,
  useGetCategoriesQuery,
  useGetShopsByCategoryQuery,
  useGetUserFavoritesQuery,
  useAddFavoriteMutation,
  useRemoveFavoriteMutation,
  useGetMallInfoQuery,
} = mallApi;