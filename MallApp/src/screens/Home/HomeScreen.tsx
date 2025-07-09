// Home Screen
// Main screen showing shop grid and welcome message

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { HomeScreenProps } from '../../navigation/types';
import { theme } from '../../utils/theme';
import { useGetShopsQuery, useGetFeaturedOffersQuery } from '../../store/api/mallApi';
import { Shop, Offer } from '../../types';

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  // Fetch shops data from API
  const { 
    data: shopsData, 
    isLoading: shopsLoading, 
    error: shopsError,
    refetch: refetchShops 
  } = useGetShopsQuery();

  // Fetch featured offers data from API
  const { 
    data: offersData, 
    isLoading: offersLoading, 
    error: offersError 
  } = useGetFeaturedOffersQuery();

  const shops = shopsData?.data || [];
  const offers = offersData?.data || [];

  // Handle shop card press
  const handleShopPress = (shop: Shop) => {
    navigation.navigate('ShopWebView', { shop });
  };

  // Handle refresh
  const onRefresh = () => {
    refetchShops();
  };

  // Render shop card component
  const renderShopCard = ({ item: shop }: { item: Shop }) => (
    <TouchableOpacity
      style={styles.shopCard}
      onPress={() => handleShopPress(shop)}
      activeOpacity={0.7}
    >
      <View style={styles.shopIcon}>
        <Text style={styles.shopIconText}>🏪</Text>
      </View>
      <Text style={styles.shopName} numberOfLines={2}>
        {shop.name}
      </Text>
    </TouchableOpacity>
  );

  // Render offer card component
  const renderOfferCard = ({ item: offer }: { item: Offer }) => (
    <View style={styles.offerCard}>
      <Text style={styles.offerTitle} numberOfLines={2}>
        {offer.title}
      </Text>
      <Text style={styles.offerDescription} numberOfLines={3}>
        {offer.description}
      </Text>
      {offer.discountPercentage && (
        <Text style={styles.discountText}>
          {offer.discountPercentage}% OFF
        </Text>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
      
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={shopsLoading}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Welcome to</Text>
          <Text style={styles.mallName}>Riyadh Park Mall</Text>
          <Text style={styles.subText}>
            {shops.length > 0 ? `${shops.length} stores to explore` : 'Loading stores...'}
          </Text>
        </View>

        {/* Featured Offers Section */}
        <View style={styles.promotionsSection}>
          <Text style={styles.sectionTitle}>🎯 Today's Deals</Text>
          {offersLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={theme.colors.primary} />
              <Text style={styles.loadingText}>Loading offers...</Text>
            </View>
          ) : offersError ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>Unable to load offers</Text>
            </View>
          ) : offers.length > 0 ? (
            <FlatList
              data={offers}
              renderItem={renderOfferCard}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No featured offers available</Text>
            </View>
          )}
        </View>

        {/* Shop Grid Section */}
        <View style={styles.shopsSection}>
          <Text style={styles.sectionTitle}>All Shops</Text>
          
          {shopsLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
              <Text style={styles.loadingText}>Loading shops...</Text>
            </View>
          ) : shopsError ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>Unable to load shops</Text>
              <Text style={styles.errorSubText}>Please check your internet connection and try again</Text>
            </View>
          ) : shops.length > 0 ? (
            <FlatList
              data={shops}
              renderItem={renderShopCard}
              keyExtractor={(item) => item.id}
              numColumns={4}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
              columnWrapperStyle={styles.shopRow}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No shops available</Text>
            </View>
          )}
        </View>

        {/* Status Message */}
        <View style={styles.statusSection}>
          <Text style={styles.statusText}>
            ✅ Phase 14: Native Home Screen with Shop Grid - Completed
          </Text>
          <Text style={styles.statusSubText}>
            • Connected to backend API{'\n'}
            • Real shop data fetching{'\n'}
            • Pull-to-refresh functionality{'\n'}
            • Shop card interactions{'\n'}
            • Loading states and error handling
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xl,
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    marginBottom: theme.spacing.md,
  },
  welcomeText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  mallName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: 8,
  },
  subText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  promotionsSection: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  promotionCard: {
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    alignItems: 'center',
  },
  promotionText: {
    fontSize: 16,
    color: theme.colors.text,
    fontWeight: '500',
  },
  shopsSection: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  shopGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  shopRow: {
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  shopCard: {
    width: '22%',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  shopIcon: {
    width: 60,
    height: 60,
    borderRadius: 15,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
    ...theme.shadow,
  },
  shopIconText: {
    fontSize: 24,
  },
  shopName: {
    fontSize: 12,
    color: theme.colors.text,
    textAlign: 'center',
    fontWeight: '500',
  },
  offerCard: {
    width: 250,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginRight: theme.spacing.sm,
    ...theme.shadow,
  },
  offerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  offerDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  discountText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.primary,
    textAlign: 'center',
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
    fontSize: 16,
    color: theme.colors.error,
    fontWeight: '500',
    textAlign: 'center',
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
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  statusSection: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xl,
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    marginHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.success,
  },
  statusText: {
    fontSize: 16,
    color: theme.colors.text,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  statusSubText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default HomeScreen;