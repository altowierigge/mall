// Offers Slice
// Redux slice for offers state management

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Offer, OffersState } from '../../types';

const initialState: OffersState = {
  offers: [],
  featuredOffers: [],
  loading: false,
  error: null,
  lastFetch: null,
};

const offersSlice = createSlice({
  name: 'offers',
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

    // Set offers data
    setOffers: (state, action: PayloadAction<Offer[]>) => {
      state.offers = action.payload;
      state.loading = false;
      state.error = null;
      state.lastFetch = Date.now();
    },

    // Set featured offers
    setFeaturedOffers: (state, action: PayloadAction<Offer[]>) => {
      state.featuredOffers = action.payload;
    },

    // Update single offer
    updateOffer: (state, action: PayloadAction<Offer>) => {
      const index = state.offers.findIndex(offer => offer.id === action.payload.id);
      if (index !== -1) {
        state.offers[index] = action.payload;
      }
      
      // Update in featured offers if it exists there
      const featuredIndex = state.featuredOffers.findIndex(offer => offer.id === action.payload.id);
      if (featuredIndex !== -1) {
        state.featuredOffers[featuredIndex] = action.payload;
      }
    },

    // Add new offer
    addOffer: (state, action: PayloadAction<Offer>) => {
      state.offers.push(action.payload);
      
      // Add to featured if it's a featured offer
      if (action.payload.isFeatured) {
        state.featuredOffers.push(action.payload);
      }
    },

    // Remove offer
    removeOffer: (state, action: PayloadAction<string>) => {
      const offerId = action.payload;
      state.offers = state.offers.filter(offer => offer.id !== offerId);
      state.featuredOffers = state.featuredOffers.filter(offer => offer.id !== offerId);
    },

    // Clear offers data
    clearOffers: (state) => {
      state.offers = [];
      state.featuredOffers = [];
      state.loading = false;
      state.error = null;
      state.lastFetch = null;
    },

    // Filter offers by category
    filterOffersByCategory: (state, action: PayloadAction<string>) => {
      // This doesn't modify state, just triggers re-render
      // Actual filtering happens in selectors
    },

    // Filter offers by shop
    filterOffersByShop: (state, action: PayloadAction<string>) => {
      // This doesn't modify state, just triggers re-render
      // Actual filtering happens in selectors
    },

    // Sort offers
    sortOffers: (state, action: PayloadAction<{ sortBy: string; order: 'asc' | 'desc' }>) => {
      const { sortBy, order } = action.payload;
      const sortFunction = (a: Offer, b: Offer) => {
        let aValue: any;
        let bValue: any;

        switch (sortBy) {
          case 'title':
            aValue = a.title.toLowerCase();
            bValue = b.title.toLowerCase();
            break;
          case 'discount':
            aValue = a.discountPercentage || 0;
            bValue = b.discountPercentage || 0;
            break;
          case 'validTo':
            aValue = new Date(a.validTo).getTime();
            bValue = new Date(b.validTo).getTime();
            break;
          case 'validFrom':
            aValue = new Date(a.validFrom).getTime();
            bValue = new Date(b.validFrom).getTime();
            break;
          default:
            aValue = a.title.toLowerCase();
            bValue = b.title.toLowerCase();
        }

        if (order === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      };

      state.offers.sort(sortFunction);
      state.featuredOffers.sort(sortFunction);
    },

    // Refresh offers
    refreshOffers: (state) => {
      state.loading = true;
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setError,
  setOffers,
  setFeaturedOffers,
  updateOffer,
  addOffer,
  removeOffer,
  clearOffers,
  filterOffersByCategory,
  filterOffersByShop,
  sortOffers,
  refreshOffers,
} = offersSlice.actions;

// Selectors
export const selectOffers = (state: { offers: OffersState }) => state.offers.offers;
export const selectFeaturedOffers = (state: { offers: OffersState }) => state.offers.featuredOffers;
export const selectOffersLoading = (state: { offers: OffersState }) => state.offers.loading;
export const selectOffersError = (state: { offers: OffersState }) => state.offers.error;
export const selectOffersLastFetch = (state: { offers: OffersState }) => state.offers.lastFetch;

// Memoized selectors
export const selectOffersByCategory = (category: string) => (state: { offers: OffersState }) => {
  return state.offers.offers.filter(offer => offer.category === category);
};

export const selectOffersByShop = (shopId: string) => (state: { offers: OffersState }) => {
  return state.offers.offers.filter(offer => offer.shopId === shopId);
};

export const selectOfferById = (id: string) => (state: { offers: OffersState }) => {
  return state.offers.offers.find(offer => offer.id === id);
};

export const selectActiveOffers = (state: { offers: OffersState }) => {
  const now = new Date();
  return state.offers.offers.filter(offer => 
    offer.isActive && 
    new Date(offer.validFrom) <= now && 
    new Date(offer.validTo) >= now
  );
};

export const selectExpiredOffers = (state: { offers: OffersState }) => {
  const now = new Date();
  return state.offers.offers.filter(offer => 
    new Date(offer.validTo) < now
  );
};

export const selectUpcomingOffers = (state: { offers: OffersState }) => {
  const now = new Date();
  return state.offers.offers.filter(offer => 
    new Date(offer.validFrom) > now
  );
};

export const selectOffersByDiscount = (minDiscount: number) => (state: { offers: OffersState }) => {
  return state.offers.offers.filter(offer => 
    offer.discountPercentage && offer.discountPercentage >= minDiscount
  );
};

export const selectHighDiscountOffers = (state: { offers: OffersState }) => {
  return state.offers.offers.filter(offer => 
    offer.discountPercentage && offer.discountPercentage >= 50
  );
};

export const selectNewOffers = (state: { offers: OffersState }) => {
  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
  
  return state.offers.offers.filter(offer => 
    new Date(offer.validFrom) >= threeDaysAgo
  );
};

export const selectEndingSoonOffers = (state: { offers: OffersState }) => {
  const twoDaysFromNow = new Date();
  twoDaysFromNow.setDate(twoDaysFromNow.getDate() + 2);
  
  return state.offers.offers.filter(offer => 
    new Date(offer.validTo) <= twoDaysFromNow &&
    new Date(offer.validTo) >= new Date()
  );
};

export const selectOffersCount = (state: { offers: OffersState }) => {
  return state.offers.offers.length;
};

export const selectFeaturedOffersCount = (state: { offers: OffersState }) => {
  return state.offers.featuredOffers.length;
};

export const selectActiveOffersCount = (state: { offers: OffersState }) => {
  return selectActiveOffers(state).length;
};

export default offersSlice.reducer;