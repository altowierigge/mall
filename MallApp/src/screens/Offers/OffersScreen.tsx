// Offers Screen
// Display mall-wide offers and deals

import React, { useState, useCallback } from 'react';
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
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { OffersScreenProps } from '../../navigation/types';
import { theme } from '../../utils/theme';
import { useGetOffersQuery, useGetFeaturedOffersQuery, useGetShopsQuery } from '../../store/api/mallApi';
import { Offer, Shop } from '../../types';

const OffersScreen: React.FC<OffersScreenProps> = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Fetch offers and shops data
  const { 
    data: offersData, 
    isLoading: offersLoading, 
    error: offersError,
    refetch: refetchOffers 
  } = useGetOffersQuery({ 
    category: selectedCategory !== 'all' ? selectedCategory : undefined,
    featured: false 
  });
  
  const { 
    data: featuredData, 
    isLoading: featuredLoading, 
    error: featuredError 
  } = useGetFeaturedOffersQuery();
  
  const { data: shopsData } = useGetShopsQuery();
  
  const offers = offersData?.data || [];
  const featuredOffers = featuredData?.data || [];
  const shops = shopsData?.data || [];
  
  // Filter offers by selected category
  const filteredOffers = selectedCategory === 'all' 
    ? offers 
    : offers.filter(offer => offer.category === selectedCategory);

  const categories = [
    { id: 'all', name: 'All', icon: 'local-offer' },
    { id: 'fashion', name: 'Fashion', icon: 'checkroom' },
    { id: 'food', name: 'Food', icon: 'restaurant' },
    { id: 'electronics', name: 'Electronics', icon: 'smartphone' },
    { id: 'sports', name: 'Sports', icon: 'sports-basketball' },
  ];

  const OfferCard = ({ offer }: { offer: Offer }) => {
    const shop = shops.find(s => s.id === offer.shopId);
    
    return (
      <TouchableOpacity style={styles.offerCard}>
        <View style={styles.offerImageContainer}>
          <View style={styles.offerImagePlaceholder}>
            <Text style={styles.offerImageText}>🎁</Text>
          </View>
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{offer.discount}</Text>
          </View>
        </View>
        
        <View style={styles.offerContent}>
          <Text style={styles.offerTitle}>{offer.title}</Text>
          <Text style={styles.offerShop}>{shop?.name || 'Shop'}</Text>
          <View style={styles.offerFooter}>
            <Text style={styles.validUntil}>Valid until {new Date(offer.endDate).toLocaleDateString()}</Text>
            <Icon name="arrow-forward" size={16} color={theme.colors.primary} />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const FeaturedOffer = ({ offer }: { offer: Offer }) => {
    const shop = shops.find(s => s.id === offer.shopId);
    
    return (
      <TouchableOpacity style={styles.featuredOffer}>
        <View style={styles.featuredImageContainer}>
          <View style={styles.featuredImagePlaceholder}>
            <Text style={styles.featuredImageText}>🌟</Text>
          </View>
          <View style={styles.featuredDiscountBadge}>
            <Text style={styles.featuredDiscountText}>{offer.discount}</Text>
          </View>
        </View>
        <View style={styles.featuredContent}>
          <Text style={styles.featuredTitle}>{offer.title}</Text>
          <Text style={styles.featuredShop}>{shop?.name || 'Shop'}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Offers & Deals</Text>
        <TouchableOpacity>
          <Icon name="filter-list" size={24} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={offersLoading || featuredLoading}
            onRefresh={() => {
              refetchOffers();
            }}
            colors={[theme.colors.primary]}
          />
        }
      >
        {/* Featured Offers */}
        <View style={styles.featuredSection}>
          <Text style={styles.sectionTitle}>🔥 Featured Deals</Text>
          {featuredLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={theme.colors.primary} />
            </View>
          ) : featuredError ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>Failed to load featured offers</Text>
            </View>
          ) : featuredOffers.length > 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.featuredContainer}
            >
              {featuredOffers.map((offer) => (
                <FeaturedOffer key={offer.id} offer={offer} />
              ))}
            </ScrollView>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No featured offers available</Text>
            </View>
          )}
        </View>

        {/* Categories */}
        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryChip,
                  selectedCategory === category.id && styles.categoryChipSelected,
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <Icon
                  name={category.icon}
                  size={16}
                  color={selectedCategory === category.id ? theme.colors.background : theme.colors.text}
                />
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

        {/* All Offers */}
        <View style={styles.offersSection}>
          <Text style={styles.sectionTitle}>All Offers ({filteredOffers.length})</Text>
          {offersLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
              <Text style={styles.loadingText}>Loading offers...</Text>
            </View>
          ) : offersError ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>Failed to load offers</Text>
              <Text style={styles.errorSubText}>Pull to refresh or try again later</Text>
            </View>
          ) : filteredOffers.length > 0 ? (
            <View style={styles.offersContainer}>
              {filteredOffers.map((offer) => (
                <OfferCard key={offer.id} offer={offer} />
              ))}
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No offers available</Text>
              <Text style={styles.emptySubText}>
                {selectedCategory !== 'all' 
                  ? 'Try selecting a different category'
                  : 'Check back later for new deals'
                }
              </Text>
            </View>
          )}
        </View>

        {/* Status Note */}
        <View style={styles.statusNote}>
          <Text style={styles.statusText}>
            ✅ Phase 16: Offers System - Completed
          </Text>
          <Text style={styles.statusSubText}>
            • Real offers data from backend API{'\n'}
            • Category filtering functionality{'\n'}
            • Featured offers carousel{'\n'}
            • Pull-to-refresh support{'\n'}
            • Loading and error states
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  featuredSection: {
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
  featuredContainer: {
    paddingHorizontal: theme.spacing.lg,
  },
  featuredOffer: {
    width: 280,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    marginRight: theme.spacing.md,
    overflow: 'hidden',
    ...theme.shadow,
  },
  featuredImageContainer: {
    position: 'relative',
    height: 120,
  },
  featuredImagePlaceholder: {
    flex: 1,
    backgroundColor: theme.colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featuredImageText: {
    fontSize: 32,
  },
  featuredDiscountBadge: {
    position: 'absolute',
    top: theme.spacing.sm,
    right: theme.spacing.sm,
    backgroundColor: theme.colors.error,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  featuredDiscountText: {
    color: theme.colors.background,
    fontSize: 12,
    fontWeight: 'bold',
  },
  featuredContent: {
    padding: theme.spacing.md,
  },
  featuredTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  featuredShop: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  categoriesSection: {
    paddingVertical: theme.spacing.md,
  },
  categoriesContainer: {
    paddingHorizontal: theme.spacing.lg,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
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
    marginLeft: theme.spacing.xs,
  },
  categoryTextSelected: {
    color: theme.colors.background,
  },
  offersSection: {
    paddingVertical: theme.spacing.md,
  },
  offersContainer: {
    paddingHorizontal: theme.spacing.lg,
  },
  offerCard: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    overflow: 'hidden',
    ...theme.shadow,
  },
  offerImageContainer: {
    position: 'relative',
    width: 100,
    height: 80,
  },
  offerImagePlaceholder: {
    flex: 1,
    backgroundColor: theme.colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  offerImageText: {
    fontSize: 24,
  },
  discountBadge: {
    position: 'absolute',
    top: theme.spacing.xs,
    right: theme.spacing.xs,
    backgroundColor: theme.colors.error,
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.sm,
  },
  discountText: {
    color: theme.colors.background,
    fontSize: 10,
    fontWeight: 'bold',
  },
  offerContent: {
    flex: 1,
    padding: theme.spacing.md,
    justifyContent: 'space-between',
  },
  offerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  offerShop: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  offerFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  validUntil: {
    fontSize: 12,
    color: theme.colors.textSecondary,
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
    paddingHorizontal: theme.spacing.lg,
  },
  errorText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.error,
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
    paddingHorizontal: theme.spacing.lg,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  emptySubText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
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

export default OffersScreen;