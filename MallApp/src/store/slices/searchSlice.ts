// Search Slice
// Redux slice for search state management

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Shop, SearchState } from '../../types';

const initialState: SearchState = {
  query: '',
  category: null,
  results: [],
  loading: false,
  error: null,
  history: [],
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    // Set search query
    setQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
    },

    // Set selected category
    setCategory: (state, action: PayloadAction<string | null>) => {
      state.category = action.payload;
    },

    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    // Set error state
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    // Set search results
    setResults: (state, action: PayloadAction<Shop[]>) => {
      state.results = action.payload;
      state.loading = false;
      state.error = null;
    },

    // Clear search results
    clearResults: (state) => {
      state.results = [];
      state.loading = false;
      state.error = null;
    },

    // Clear search
    clearSearch: (state) => {
      state.query = '';
      state.category = null;
      state.results = [];
      state.loading = false;
      state.error = null;
    },

    // Add to search history
    addToHistory: (state, action: PayloadAction<string>) => {
      const query = action.payload.trim();
      if (query && !state.history.includes(query)) {
        state.history = [query, ...state.history.slice(0, 9)]; // Keep only last 10 searches
      }
    },

    // Remove from search history
    removeFromHistory: (state, action: PayloadAction<string>) => {
      state.history = state.history.filter(item => item !== action.payload);
    },

    // Clear search history
    clearHistory: (state) => {
      state.history = [];
    },

    // Set search history from storage
    setHistory: (state, action: PayloadAction<string[]>) => {
      state.history = action.payload;
    },

    // Filter results by category
    filterResults: (state, action: PayloadAction<string | null>) => {
      const category = action.payload;
      if (!category || category === 'all') {
        // Reset to all results - this would require re-fetching or storing original results
        return;
      }
      state.results = state.results.filter(shop => shop.category === category);
    },

    // Sort results
    sortResults: (state, action: PayloadAction<{ sortBy: string; order: 'asc' | 'desc' }>) => {
      const { sortBy, order } = action.payload;
      state.results.sort((a, b) => {
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
  },
});

export const {
  setQuery,
  setCategory,
  setLoading,
  setError,
  setResults,
  clearResults,
  clearSearch,
  addToHistory,
  removeFromHistory,
  clearHistory,
  setHistory,
  filterResults,
  sortResults,
} = searchSlice.actions;

// Selectors
export const selectSearchQuery = (state: { search: SearchState }) => state.search.query;
export const selectSearchCategory = (state: { search: SearchState }) => state.search.category;
export const selectSearchResults = (state: { search: SearchState }) => state.search.results;
export const selectSearchLoading = (state: { search: SearchState }) => state.search.loading;
export const selectSearchError = (state: { search: SearchState }) => state.search.error;
export const selectSearchHistory = (state: { search: SearchState }) => state.search.history;

// Memoized selectors
export const selectSearchResultsByCategory = (category: string) => (state: { search: SearchState }) => {
  if (category === 'all') {
    return state.search.results;
  }
  return state.search.results.filter(shop => shop.category === category);
};

export const selectSearchResultsCount = (state: { search: SearchState }) => {
  return state.search.results.length;
};

export const selectIsSearching = (state: { search: SearchState }) => {
  return state.search.query.length > 0;
};

export const selectHasSearchResults = (state: { search: SearchState }) => {
  return state.search.results.length > 0;
};

export const selectSearchSuggestions = (state: { search: SearchState }) => {
  const query = state.search.query.toLowerCase();
  if (query.length < 2) return [];
  
  return state.search.history.filter(item => 
    item.toLowerCase().includes(query)
  ).slice(0, 5);
};

export default searchSlice.reducer;