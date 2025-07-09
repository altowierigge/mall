// Search Screen
// Native search with filters and real-time results

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SearchScreenProps } from '../../navigation/types';
import { theme } from '../../utils/theme';
import { CATEGORIES, STORAGE_KEYS } from '../../types';
import { useSearchShopsQuery, useGetCategoriesQuery } from '../../store/api/mallApi';
import { Shop } from '../../types';
import { useAppDispatch, useAppSelector } from '../../store';
import { addFavorite, removeFavorite, loadFavorites } from '../../store/slices/favoritesSlice';

const SearchScreen: React.FC<SearchScreenProps> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'name' | 'rating'>('name');

  const dispatch = useAppDispatch();
  const favorites = useAppSelector(state => state.favorites.shopIds);

  // Fetch search results with debounced query
  const { 
    data: searchData, 
    isLoading: searchLoading, 
    error: searchError 
  } = useSearchShopsQuery(
    {
      query: debouncedQuery,
      category: selectedCategory !== 'all' ? selectedCategory : undefined,
      page: 1,
      limit: 20,
      sortBy,
      sortOrder: 'asc'
    },
    { skip: debouncedQuery.length === 0 }
  );

  const { data: categoriesData } = useGetCategoriesQuery();

  const searchResults = searchData?.data || [];
  const categories = categoriesData?.data || CATEGORIES;

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Load favorites and recent searches on mount
  useEffect(() => {
    loadRecentSearches();
    dispatch(loadFavorites());
  }, [dispatch]);

  // Load recent searches from AsyncStorage
  const loadRecentSearches = useCallback(async () => {
    try {
      const searches = await AsyncStorage.getItem(STORAGE_KEYS.SEARCH_HISTORY);
      if (searches) {
        setRecentSearches(JSON.parse(searches));
      }
    } catch (error) {
      console.error('Error loading recent searches:', error);
    }
  }, []);

  // Save search to history
  const saveSearchToHistory = useCallback(async (query: string) => {
    if (query.trim().length < 2) return;
    
    try {
      const updatedSearches = [query, ...recentSearches.filter(s => s !== query)].slice(0, 10);
      setRecentSearches(updatedSearches);
      await AsyncStorage.setItem(STORAGE_KEYS.SEARCH_HISTORY, JSON.stringify(updatedSearches));
    } catch (error) {
      console.error('Error saving search to history:', error);
    }
  }, [recentSearches]);

  // Handle search input
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    if (query.trim().length >= 2) {
      saveSearchToHistory(query);
    }
  }, [saveSearchToHistory]);

  // Handle category selection
  const handleCategorySelect = useCallback((categoryId: string) => {
    setSelectedCategory(categoryId);
  }, []);

  // Handle shop press
  const handleShopPress = useCallback((shop: Shop) => {
    navigation.navigate('ShopWebView', { shop });
  }, [navigation]);

  // Handle favorite toggle
  const handleFavoriteToggle = useCallback(async (shop: Shop) => {
    try {
      if (favorites.includes(shop.id)) {
        dispatch(removeFavorite(shop.id));
      } else {
        dispatch(addFavorite(shop.id));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update favorites');
    }
  }, [favorites, dispatch]);

  // Handle recent search selection
  const handleRecentSearchSelect = useCallback((query: string) => {
    setSearchQuery(query);
    setDebouncedQuery(query);
  }, []);

  // Clear search
  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setDebouncedQuery('');
  }, []);

  // Render shop item
  const renderShopItem = useCallback(({ item: shop }: { item: Shop }) => {
    const isFavorite = favorites.includes(shop.id);
    
    return (
      <TouchableOpacity
        style={styles.shopItem}
        onPress={() => handleShopPress(shop)}
        activeOpacity={0.7}
      >
        <View style={styles.shopItemContent}>
          <View style={styles.shopIcon}>
            <Text style={styles.shopIconText}>🏪</Text>
          </View>
          <View style={styles.shopInfo}>
            <Text style={styles.shopName}>{shop.name}</Text>
            <Text style={styles.shopCategory}>{shop.category}</Text>
            <Text style={styles.shopLocation}>
              {shop.location.floor}, {shop.location.zone}
            </Text>
            <View style={styles.shopRating}>
              <Icon name="star" size={16} color="#FFD700" />
              <Text style={styles.ratingText}>{shop.rating}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={() => handleFavoriteToggle(shop)}
          >
            <Icon
              name={isFavorite ? "favorite" : "favorite-border"}
              size={24}
              color={isFavorite ? theme.colors.error : theme.colors.textSecondary}
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  }, [favorites, handleShopPress, handleFavoriteToggle]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
      
      {/* Search Header */}
      <View style={styles.searchHeader}>
        <View style={styles.searchInputContainer}>
          <Icon name="search" size={20} color={theme.colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search shops..."
            placeholderTextColor={theme.colors.textSecondary}
            value={searchQuery}
            onChangeText={handleSearch}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch}>
              <Icon name="close" size={20} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Categories */}
        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          >
            {CATEGORIES.slice(0, 6).map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryChip,
                  selectedCategory === category.id && styles.categoryChipSelected,
                ]}
                onPress={() => handleCategorySelect(category.id)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === category.id && styles.categoryTextSelected,
                  ]}
                >
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Sort Options */}
        <View style={styles.sortSection}>
          <Text style={styles.resultsText}>Results ({searchQuery ? '0' : '320'})</Text>
          <TouchableOpacity style={styles.sortButton}>
            <Text style={styles.sortText}>Sort</Text>
            <Icon name="arrow-drop-down" size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Search Results */}
        <View style={styles.resultsSection}>
          {searchQuery.length > 0 ? (
            searchLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text style={styles.loadingText}>Searching...</Text>
              </View>
            ) : searchError ? (
              <View style={styles.errorContainer}>
                <Icon name="error-outline" size={48} color={theme.colors.error} />
                <Text style={styles.errorText}>Search failed</Text>
                <Text style={styles.errorSubText}>Please try again</Text>
              </View>
            ) : searchResults.length > 0 ? (
              <FlatList
                data={searchResults}
                renderItem={renderShopItem}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: theme.colors.border }} />}
              />
            ) : (
              <View style={styles.emptyContainer}>
                <Icon name="search-off" size={48} color={theme.colors.textSecondary} />
                <Text style={styles.emptyText}>No shops found</Text>
                <Text style={styles.emptySubText}>Try different keywords or browse categories</Text>
              </View>
            )
          ) : (
            <View style={styles.placeholderContainer}>
              <Icon name="store" size={48} color={theme.colors.textSecondary} />
              <Text style={styles.placeholderText}>
                Start typing to search shops
              </Text>
              <Text style={styles.placeholderSubText}>
                Search by name, category, or keywords
              </Text>
            </View>
          )}
        </View>

        {/* Recent Searches */}
        {searchQuery.length === 0 && recentSearches.length > 0 && (
          <View style={styles.recentSection}>
            <Text style={styles.sectionTitle}>Recent Searches</Text>
            <View style={styles.recentList}>
              {recentSearches.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.recentItem}
                  onPress={() => handleRecentSearchSelect(item)}
                >
                  <Icon name="history" size={16} color={theme.colors.textSecondary} />
                  <Text style={styles.recentText}>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  searchHeader: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  searchInput: {
    flex: 1,
    marginLeft: theme.spacing.sm,
    fontSize: 16,
    color: theme.colors.text,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  categoriesSection: {
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
  },
  categoriesContainer: {
    paddingHorizontal: theme.spacing.lg,
  },
  categoryChip: {
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
    marginRight: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  categoryChipSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  categoryText: {
    fontSize: 14,
    color: theme.colors.text,
    fontWeight: '500',
  },
  categoryTextSelected: {
    color: theme.colors.background,
  },
  sortSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  resultsText: {
    fontSize: 16,
    color: theme.colors.text,
    fontWeight: '500',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  sortText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginRight: 4,
  },
  resultsSection: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xl,
  },
  placeholderContainer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
  },
  placeholderText: {
    fontSize: 16,
    color: theme.colors.text,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xs,
  },
  placeholderSubText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  recentSection: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  recentList: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.xs,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  recentText: {
    fontSize: 14,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },
  shopItem: {
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  shopItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shopIcon: {
    width: 60,
    height: 60,
    borderRadius: 15,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
    ...theme.shadow,
  },
  shopIconText: {
    fontSize: 24,
  },
  shopInfo: {
    flex: 1,
  },
  shopName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 4,
  },
  shopCategory: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 2,
  },
  shopLocation: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  shopRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    color: theme.colors.text,
    marginLeft: 4,
    fontWeight: '500',
  },
  favoriteButton: {
    padding: theme.spacing.sm,
  },
  loadingContainer: {
    paddingVertical: theme.spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.sm,
  },
  errorContainer: {
    paddingVertical: theme.spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.error,
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  errorSubText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  emptyContainer: {
    paddingVertical: theme.spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  emptySubText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});

export default SearchScreen;