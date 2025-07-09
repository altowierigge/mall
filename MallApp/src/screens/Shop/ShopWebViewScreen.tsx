// Shop WebView Screen
// Display individual shop content in WebView

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  BackHandler,
} from 'react-native';
import { WebView, WebViewNavigation } from 'react-native-webview';
import Share from 'react-native-share';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ShopWebViewProps } from '../../navigation/types';
import { theme } from '../../utils/theme';
import { useAppDispatch, useAppSelector } from '../../store';
import { addFavorite, removeFavorite } from '../../store/slices/favoritesSlice';
import { useFocusEffect } from '@react-navigation/native';

const ShopWebViewScreen: React.FC<ShopWebViewProps> = ({ navigation, route }) => {
  const { shop } = route.params;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const [currentUrl, setCurrentUrl] = useState(shop.websiteUrl);
  const webViewRef = useRef<WebView>(null);
  
  const dispatch = useAppDispatch();
  const favorites = useAppSelector(state => state.favorites.shopIds);
  const isFavorite = favorites.includes(shop.id);

  const handleBack = () => {
    navigation.goBack();
  };

  // Handle Android back button
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (canGoBack && webViewRef.current) {
          webViewRef.current.goBack();
          return true; // Prevent default behavior
        }
        return false; // Let default behavior happen
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, [canGoBack])
  );
  
  const handleShare = async () => {
    try {
      const shareOptions = {
        title: `Check out ${shop.name}`,
        message: `I found this great shop at Riyadh Park Mall: ${shop.name}`,
        url: currentUrl,
        subject: `${shop.name} - Riyadh Park Mall`,
      };
      
      await Share.open(shareOptions);
    } catch (error: any) {
      if (error?.message !== 'User did not share') {
        console.error('Share error:', error);
        Alert.alert('Share Error', 'Unable to share at the moment. Please try again.');
      }
    }
  };

  const handleRefresh = () => {
    setError(false);
    setLoading(true);
    if (webViewRef.current) {
      webViewRef.current.reload();
    }
  };
  
  const handleGoBack = () => {
    if (canGoBack && webViewRef.current) {
      webViewRef.current.goBack();
    }
  };
  
  const handleGoForward = () => {
    if (canGoForward && webViewRef.current) {
      webViewRef.current.goForward();
    }
  };
  
  const handleFavoriteToggle = () => {
    if (isFavorite) {
      dispatch(removeFavorite(shop.id));
    } else {
      dispatch(addFavorite(shop.id));
    }
  };

  const handleWebViewError = () => {
    setError(true);
    setLoading(false);
  };

  const handleWebViewLoad = () => {
    setLoading(false);
    setError(false);
  };
  
  const handleNavigationStateChange = (navState: WebViewNavigation) => {
    setCanGoBack(navState.canGoBack);
    setCanGoForward(navState.canGoForward);
    setCurrentUrl(navState.url);
  };

  const ErrorView = () => (
    <View style={styles.errorContainer}>
      <Icon name="error-outline" size={64} color={theme.colors.error} />
      <Text style={styles.errorTitle}>Unable to load shop</Text>
      <Text style={styles.errorMessage}>
        There was a problem loading {shop.name}. Please check your internet connection and try again.
      </Text>
      <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
        <Text style={styles.retryButtonText}>Try Again</Text>
      </TouchableOpacity>
    </View>
  );

  const PlaceholderView = () => (
    <View style={styles.placeholderContainer}>
      <View style={styles.shopHeader}>
        <View style={styles.shopIconPlaceholder}>
          <Text style={styles.shopIconText}>🏪</Text>
        </View>
        <View style={styles.shopInfo}>
          <Text style={styles.shopName}>{shop.name}</Text>
          <Text style={styles.shopCategory}>{shop.category}</Text>
          <Text style={styles.shopLocation}>
            {shop.location?.floor}, {shop.location?.zone}
          </Text>
        </View>
      </View>
      
      <View style={styles.shopContent}>
        <Text style={styles.contentTitle}>Shop Content</Text>
        <Text style={styles.contentDescription}>
          This is where {shop.name}'s website content would be displayed in a WebView.
        </Text>
        
        <View style={styles.featuresList}>
          <Text style={styles.featuresTitle}>Available Features:</Text>
          <View style={styles.featureItem}>
            <Icon name="shopping-cart" size={20} color={theme.colors.primary} />
            <Text style={styles.featureText}>
              {shop.features?.hasOnlineOrdering ? 'Online Ordering Available' : 'In-Store Only'}
            </Text>
          </View>
          <View style={styles.featureItem}>
            <Icon name="local-shipping" size={20} color={theme.colors.primary} />
            <Text style={styles.featureText}>
              {shop.features?.hasDelivery ? 'Delivery Available' : 'No Delivery'}
            </Text>
          </View>
          <View style={styles.featureItem}>
            <Icon name="payment" size={20} color={theme.colors.primary} />
            <Text style={styles.featureText}>
              {shop.features?.acceptsOnlinePayment ? 'Online Payment' : 'Cash Only'}
            </Text>
          </View>
        </View>
        
        <View style={styles.contactInfo}>
          <Text style={styles.contactTitle}>Contact Information</Text>
          <View style={styles.contactItem}>
            <Icon name="phone" size={20} color={theme.colors.primary} />
            <Text style={styles.contactText}>{shop.contact?.phone || 'N/A'}</Text>
          </View>
          <View style={styles.contactItem}>
            <Icon name="chat" size={20} color={theme.colors.primary} />
            <Text style={styles.contactText}>{shop.contact?.whatsapp || 'N/A'}</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.statusNote}>
        <Text style={styles.statusText}>
          ⚠️ No Website Available
        </Text>
        <Text style={styles.statusSubText}>
          This shop doesn't have a website configured yet.{'\n'}
          Contact information and features are shown above.{'\n'}{'\n'}
          ✅ Phase 17: WebView Integration - Completed{'\n'}
          • Real WebView implementation{'\n'}
          • Navigation controls and error handling{'\n'}
          • Share functionality with native sharing{'\n'}
          • Favorites integration and persistence
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.surface} />
      
      {/* Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {shop.name}
        </Text>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={handleFavoriteToggle} style={styles.actionButton}>
            <Icon 
              name={isFavorite ? "favorite" : "favorite-border"} 
              size={24} 
              color={isFavorite ? theme.colors.error : theme.colors.text} 
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleShare} style={styles.actionButton}>
            <Icon name="share" size={24} color={theme.colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* WebView Container */}
      {error ? (
        <ErrorView />
      ) : shop.websiteUrl && shop.websiteUrl !== '' ? (
        <View style={styles.webViewContainer}>
          <WebView
            ref={webViewRef}
            source={{ uri: shop.websiteUrl }}
            onLoadStart={() => setLoading(true)}
            onLoadEnd={handleWebViewLoad}
            onError={handleWebViewError}
            onNavigationStateChange={handleNavigationStateChange}
            style={styles.webView}
            javaScriptEnabled
            domStorageEnabled
            startInLoadingState
            allowsBackForwardNavigationGestures
            decelerationRate="normal"
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            bounces={false}
            overScrollMode="never"
            renderError={(errorName) => (
              <View style={styles.errorContainer}>
                <Icon name="error-outline" size={64} color={theme.colors.error} />
                <Text style={styles.errorTitle}>Website Error</Text>
                <Text style={styles.errorMessage}>
                  {errorName}: Failed to load {shop.name}'s website.
                </Text>
                <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
                  <Text style={styles.retryButtonText}>Retry</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      ) : (
        <PlaceholderView />
      )}
      
      {/* WebView Navigation Bar */}
      {!error && shop.websiteUrl && (
        <View style={styles.navigationBar}>
          <TouchableOpacity
            onPress={handleGoBack}
            style={[styles.navButton, !canGoBack && styles.navButtonDisabled]}
            disabled={!canGoBack}
          >
            <Icon 
              name="arrow-back" 
              size={24} 
              color={canGoBack ? theme.colors.primary : theme.colors.textSecondary} 
            />
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={handleGoForward}
            style={[styles.navButton, !canGoForward && styles.navButtonDisabled]}
            disabled={!canGoForward}
          >
            <Icon 
              name="arrow-forward" 
              size={24} 
              color={canGoForward ? theme.colors.primary : theme.colors.textSecondary} 
            />
          </TouchableOpacity>
          
          <TouchableOpacity onPress={handleRefresh} style={styles.navButton}>
            <Icon name="refresh" size={24} color={theme.colors.primary} />
          </TouchableOpacity>
          
          <View style={styles.urlContainer}>
            <Text style={styles.urlText} numberOfLines={1}>
              {currentUrl}
            </Text>
          </View>
        </View>
      )}

      {/* Loading Indicator */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading {shop.name}...</Text>
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
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  backButton: {
    padding: theme.spacing.xs,
    marginRight: theme.spacing.sm,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: theme.spacing.xs,
    marginLeft: theme.spacing.sm,
  },
  webViewContainer: {
    flex: 1,
  },
  webView: {
    flex: 1,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: 16,
    color: theme.colors.text,
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
    color: theme.colors.text,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  errorMessage: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: theme.spacing.xl,
  },
  retryButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  retryButtonText: {
    color: theme.colors.background,
    fontSize: 16,
    fontWeight: '600',
  },
  placeholderContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  shopHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  shopIconPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 15,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  shopIconText: {
    fontSize: 24,
  },
  shopInfo: {
    flex: 1,
  },
  shopName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  shopCategory: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textTransform: 'capitalize',
    marginBottom: theme.spacing.xs,
  },
  shopLocation: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  shopContent: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
  },
  contentTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  contentDescription: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    lineHeight: 24,
    marginBottom: theme.spacing.xl,
  },
  featuresList: {
    marginBottom: theme.spacing.xl,
  },
  featuresTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  featureText: {
    fontSize: 14,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },
  contactInfo: {
    marginBottom: theme.spacing.xl,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  contactText: {
    fontSize: 14,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },
  navigationBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  navButton: {
    padding: theme.spacing.sm,
    marginHorizontal: theme.spacing.xs,
  },
  navButtonDisabled: {
    opacity: 0.3,
  },
  urlContainer: {
    flex: 1,
    marginLeft: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  urlText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  statusNote: {
    margin: theme.spacing.lg,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.warning,
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

export default ShopWebViewScreen;