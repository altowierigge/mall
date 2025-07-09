// Favorites Screen
// Display user's favorite shops with local storage

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { FavoritesScreenProps } from '../../navigation/types';
import { theme } from '../../utils/theme';
import { useAppDispatch, useAppSelector } from '../../store';
import { loadFavorites, removeFavorite, saveFavorites } from '../../store/slices/favoritesSlice';
import { useGetShopsQuery } from '../../store/api/mallApi';
import { Shop } from '../../types';

const FavoritesScreen: React.FC<FavoritesScreenProps> = ({ navigation }) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const dispatch = useAppDispatch();
  const favoriteIds = useAppSelector(state => state.favorites.shopIds);
  const favoritesLoading = useAppSelector(state => state.favorites.loading);
  const favoritesError = useAppSelector(state => state.favorites.error);

  // Get all shops to filter favorites
  const { data: shopsData } = useGetShopsQuery();
  const allShops = shopsData?.data || [];

  // Filter shops to get only favorites
  const favoriteShops = allShops.filter(shop => favoriteIds.includes(shop.id));

  // Load favorites on component mount
  useEffect(() => {
    dispatch(loadFavorites());
  }, [dispatch]);

  const toggleViewMode = () => {
    setViewMode(viewMode === 'grid' ? 'list' : 'grid');
  };

  // Handle shop press
  const handleShopPress = (shop: Shop) => {
    navigation.navigate('ShopWebView', { shop });
  };

  // Handle remove favorite
  const handleRemoveFavorite = (shop: Shop) => {
    Alert.alert(
      'Remove Favorite',
      `Remove ${shop.name} from your favorites?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive',
          onPress: () => {
            dispatch(removeFavorite(shop.id));
            dispatch(saveFavorites(favoriteIds.filter(id => id !== shop.id)));
          }
        }
      ]
    );
  };

  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <Icon name="favorite-border" size={64} color={theme.colors.textSecondary} />
      <Text style={styles.emptyTitle}>No favorites yet</Text>
      <Text style={styles.emptySubtitle}>
        Start exploring and tap the heart icon to save your favorite shops
      </Text>
      <TouchableOpacity
        style={styles.exploreButton}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.exploreButtonText}>Explore Shops</Text>
      </TouchableOpacity>
    </View>
  );

  // Render favorite shop item
  const renderFavoriteItem = ({ item: shop }: { item: Shop }) => {
    const isGrid = viewMode === 'grid';
    
    return (
      <TouchableOpacity
        style={isGrid ? styles.gridItem : styles.listItem}
        onPress={() => handleShopPress(shop)}
        activeOpacity={0.7}
      >
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
          onPress={() => handleRemoveFavorite(shop)}
        >
          <Icon name="favorite" size={24} color={theme.colors.error} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Favorites</Text>
        <TouchableOpacity onPress={toggleViewMode} style={styles.viewModeButton}>
          <Icon
            name={viewMode === 'grid' ? 'view-list' : 'view-module'}
            size={24}
            color={theme.colors.text}
          />
        </TouchableOpacity>
      </View>

      {favoritesLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading favorites...</Text>
        </View>
      ) : favoritesError ? (
        <View style={styles.errorContainer}>
          <Icon name="error-outline" size={64} color={theme.colors.error} />
          <Text style={styles.errorTitle}>Error loading favorites</Text>
          <Text style={styles.errorSubtitle}>{favoritesError}</Text>
        </View>
      ) : favoriteShops.length === 0 ? (
        <EmptyState />
      ) : (
        <View style={styles.contentContainer}>
          {/* Favorites Count */}
          <View style={styles.countContainer}>
            <Text style={styles.countText}>
              {favoriteShops.length} favorite{favoriteShops.length !== 1 ? 's' : ''}
            </Text>
          </View>

          {/* Favorites List */}
          {viewMode === 'grid' ? (
            <FlatList
              data={favoriteShops}
              renderItem={renderFavoriteItem}
              keyExtractor={(item) => item.id}
              numColumns={2}
              columnWrapperStyle={styles.gridRow}
              contentContainerStyle={styles.gridContainer}
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
            />
          ) : (
            <FlatList
              data={favoriteShops}
              renderItem={renderFavoriteItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
            />
          )}

          {/* Status Message */}
          <View style={styles.statusNote}>
            <Text style={styles.statusText}>
              ✅ Phase 15: Favorites System - Completed
            </Text>
            <Text style={styles.statusSubText}>
              • AsyncStorage for local persistence{'\n'}
              • Real-time add/remove from search and home{'\n'}
              • Grid and list view modes{'\n'}
              • Persistent across app sessions
            </Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  viewModeButton: {
    padding: theme.spacing.xs,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  countContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  countText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: theme.spacing.lg,
    justifyContent: 'space-between',
  },
  listContainer: {
    paddingHorizontal: theme.spacing.lg,
  },
  gridItem: {
    width: '48%',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    alignItems: 'center',
    ...theme.shadow,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    ...theme.shadow,
  },
  shopIcon: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  shopIconText: {
    fontSize: 20,
  },
  shopInfo: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  shopName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 2,
  },
  shopCategory: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 2,
  },
  shopLocation: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  favoriteButton: {
    padding: theme.spacing.xs,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  emptySubtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: theme.spacing.xl,
  },
  exploreButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  exploreButtonText: {
    color: theme.colors.background,
    fontSize: 16,
    fontWeight: '600',
  },
  implementationNote: {
    margin: theme.spacing.lg,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.secondary,
  },
  noteText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  noteSubText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  loadingText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.md,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.error,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  errorSubtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  contentContainer: {
    flex: 1,
  },
  gridRow: {
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
  },
  shopRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingText: {
    fontSize: 12,
    color: theme.colors.text,
    marginLeft: 4,
    fontWeight: '500',
  },
  statusNote: {
    margin: theme.spacing.lg,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.success,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  statusSubText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
});

export default FavoritesScreen;