# Product Requirements Document: Native React Native Mall App
## Version 4.0 - Native-First Architecture

## Executive Summary

We are building a **fully native React Native mobile application** that provides a premium mall shopping experience. The app features native screens for browsing shops, searching, managing favorites, and viewing offers, with WebViews used only when viewing individual shop content. This hybrid approach ensures optimal performance while maintaining flexibility for shop owners to manage their own content.

### Key Architecture Change
- **Previous**: Single WebView wrapping entire PWA
- **Current**: Native React Native app with WebViews only for shop pages

### Benefits of Native-First Approach
- **Performance**: 60 FPS animations, instant screen transitions
- **User Experience**: Platform-specific UI patterns, native gestures
- **Flexibility**: Easy to migrate shops to fully native later
- **Control**: Mall experience fully controlled, shops manage their content

## Product Overview

### Vision
Create a premium native mobile mall application that combines the performance of native components with the flexibility of web-based shop content, delivering the best possible shopping experience.

### Target Users
- **Primary**: Mall visitors aged 18-45 who prefer mobile shopping
- **Secondary**: Tourists and business visitors seeking mall information
- **Tertiary**: Mall employees and shop staff

### Success Metrics
- App store rating: 4.5+ stars
- Daily active users: 10,000+ within 6 months
- Shop engagement rate: 40%+ click-through from grid
- Average session duration: 8+ minutes
- Conversion to shop visit: 25%

## Native App Architecture

### Overall Structure
```
┌─────────────────────────────────────────┐
│          Native React Native App         │
├─────────────────────────────────────────┤
│  ┌─────────────────────────────────┐   │
│  │      Status Bar (Native)        │   │
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │      App Header (Native)        │   │
│  │   Riyadh Park  🔔 🔍            │   │
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │                                 │   │
│  │    Main Content (Native)        │   │
│  │                                 │   │
│  │  ┌───┐ ┌───┐ ┌───┐ ┌───┐     │   │
│  │  │👟 │ │👔 │ │🍔│ │💄 │     │   │
│  │  └───┘ └───┘ └───┘ └───┘     │   │
│  │  Adidas  Zara  KFC  Sephora   │   │
│  │                                 │   │
│  │  Native Shop Grid              │   │
│  │                                 │   │
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │      Tab Navigator (Native)     │   │
│  │  🏠    🔍    ❤️    🎯    👤   │   │
│  │  Home Search Fav  Offers Profile│   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

### Navigation Flow
```
App Launch
    ↓
Splash Screen (Native)
    ↓
Home Screen (Native)
    ├── Shop Grid (Native)
    │   └── Shop Tap → Shop WebView
    ├── Search (Native)
    ├── Favorites (Native)
    ├── Offers (Native)
    └── Profile (Native)
```

## Native Screens Specification

### 1. Home Screen
**Purpose**: Main entry point displaying all shops in an attractive grid

**Components**:
- Header with mall logo and notification bell
- Welcome message with user name (if logged in)
- Featured promotions carousel (optional)
- Shop grid (iPhone-style icons)
- Pull-to-refresh functionality

**Layout**:
```
┌─────────────────────────┐
│ Welcome to Riyadh Park  │
│ 320 stores to explore   │
├─────────────────────────┤
│ 🎯 Today's Deals ────▶  │
├─────────────────────────┤
│ All Shops               │
│ ┌──┐ ┌──┐ ┌──┐ ┌──┐  │
│ │  │ │  │ │  │ │  │  │
│ └──┘ └──┘ └──┘ └──┘  │
│ ┌──┐ ┌──┐ ┌──┐ ┌──┐  │
│ │  │ │  │ │  │ │  │  │
│ └──┘ └──┘ └──┘ └──┘  │
└─────────────────────────┘
```

**Technical Implementation**:
```javascript
// Native FlatList with optimized rendering
<FlatList
  data={shops}
  numColumns={4}
  renderItem={renderShopCard}
  keyExtractor={item => item.id}
  showsVerticalScrollIndicator={false}
  onRefresh={handleRefresh}
  refreshing={isRefreshing}
/>
```

### 2. Search Screen
**Purpose**: Native search with real-time filtering and categories

**Features**:
- Search bar with auto-complete
- Category filter pills
- Sort options (A-Z, Popular, New)
- Real-time results update
- Recent searches
- Search suggestions

**Layout**:
```
┌─────────────────────────┐
│ 🔍 Search shops...      │
├─────────────────────────┤
│ Categories:             │
│ [All] [Fashion] [Food]  │
│ [Electronics] [Beauty]  │
├─────────────────────────┤
│ Results (45)    Sort ▼  │
│ ┌──┐ Adidas            │
│ │👟│ Sports & Fashion   │
│ └──┘ Floor 2, Zone A   │
│ ─────────────────────   │
│ ┌──┐ Apple Store       │
│ │🍎│ Electronics        │
│ └──┘ Floor 1, Zone C   │
└─────────────────────────┘
```

### 3. Favorites Screen
**Purpose**: Locally stored favorite shops for quick access

**Features**:
- Grid/List view toggle
- Empty state with CTA
- Sync across devices (optional)
- Quick actions (remove, share)
- Offline access

**State Management**:
```javascript
// AsyncStorage for persistence
const favorites = {
  shops: ['shop-1', 'shop-2'],
  lastUpdated: '2024-01-20T10:00:00Z'
}
```

### 4. Offers Screen
**Purpose**: Native screen showing mall-wide promotions and deals

**Components**:
- Featured deals carousel
- Category-based offers
- Time-sensitive flash sales
- Offer details with shop info
- Save offer functionality

### 5. Profile Screen
**Purpose**: User account management and app settings

**Sections**:
- User info (optional login)
- Order history
- Notification preferences
- Language settings
- Mall information
- Help & Support
- App version

### 6. Shop WebView Screen
**Purpose**: Display individual shop content in a WebView

**Components**:
- Native header with shop name
- Back button navigation
- Share button
- Loading indicator
- Error handling
- WebView container

**Implementation**:
```javascript
const ShopWebView = ({ route, navigation }) => {
  const { shop } = route.params;
  
  return (
    <SafeAreaView style={styles.container}>
      <Header>
        <BackButton onPress={() => navigation.goBack()} />
        <Title>{shop.name}</Title>
        <ShareButton onPress={() => shareShop(shop)} />
      </Header>
      <WebView 
        source={{ uri: shop.websiteUrl }}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        onError={handleError}
      />
      {loading && <LoadingIndicator />}
    </SafeAreaView>
  );
};
```

## Technical Architecture

### Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | React Native 0.73+ | Core framework |
| **Navigation** | React Navigation 6 | Screen routing |
| **State** | Redux Toolkit + RTK Query | Global state & API |
| **Local Storage** | AsyncStorage | Favorites, cache |
| **UI Components** | Custom + React Native Elements | Consistent UI |
| **Animations** | Reanimated 3 | Smooth animations |
| **API Client** | Axios | HTTP requests |
| **Push Notifications** | OneSignal | Marketing & updates |
| **Analytics** | Firebase Analytics | User tracking |
| **Crash Reporting** | Sentry | Error monitoring |

### Project Structure
```
src/
├── screens/
│   ├── Home/
│   │   ├── HomeScreen.tsx
│   │   ├── components/
│   │   │   ├── ShopGrid.tsx
│   │   │   ├── ShopCard.tsx
│   │   │   └── PromotionBanner.tsx
│   │   └── styles.ts
│   ├── Search/
│   │   ├── SearchScreen.tsx
│   │   ├── components/
│   │   │   ├── SearchBar.tsx
│   │   │   ├── CategoryFilter.tsx
│   │   │   └── SearchResults.tsx
│   │   └── hooks/
│   │       └── useSearch.ts
│   ├── Favorites/
│   ├── Offers/
│   ├── Profile/
│   └── Shop/
│       └── ShopWebView.tsx
├── navigation/
│   ├── RootNavigator.tsx
│   ├── TabNavigator.tsx
│   └── types.ts
├── components/
│   ├── common/
│   │   ├── Header.tsx
│   │   ├── LoadingSpinner.tsx
│   │   └── ErrorBoundary.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── Card.tsx
│       └── Icon.tsx
├── store/
│   ├── index.ts
│   ├── slices/
│   │   ├── shopsSlice.ts
│   │   ├── favoritesSlice.ts
│   │   └── userSlice.ts
│   └── api/
│       └── mallApi.ts
├── services/
│   ├── firebase.ts
│   ├── analytics.ts
│   └── storage.ts
├── utils/
│   ├── constants.ts
│   └── helpers.ts
└── types/
    └── index.ts
```

## Data Model & State Management

### Local State (Redux)
```typescript
interface AppState {
  shops: {
    list: Shop[];
    loading: boolean;
    error: string | null;
    lastFetch: number;
  };
  favorites: {
    shopIds: string[];
    synced: boolean;
  };
  search: {
    query: string;
    category: string | null;
    results: Shop[];
  };
  user: {
    isLoggedIn: boolean;
    profile: UserProfile | null;
    preferences: UserPreferences;
  };
}
```

### API Integration
```typescript
// RTK Query for efficient data fetching
const mallApi = createApi({
  reducerPath: 'mallApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: 'https://api.riyadhpark.com/v1' 
  }),
  endpoints: (builder) => ({
    getShops: builder.query<Shop[], void>({
      query: () => `/malls/${MALL_ID}/shops`,
      transformResponse: (response) => 
        response.filter(shop => shop.isActive)
    }),
    getOffers: builder.query<Offer[], void>({
      query: () => `/malls/${MALL_ID}/offers`
    })
  })
});
```

### AsyncStorage Schema
```javascript
// Favorites
{
  key: '@favorites',
  value: {
    shops: ['shop-1', 'shop-2', 'shop-3'],
    lastModified: '2024-01-20T10:00:00Z'
  }
}

// User Preferences
{
  key: '@preferences',
  value: {
    language: 'en',
    notifications: true,
    theme: 'light'
  }
}

// Search History
{
  key: '@searchHistory',
  value: ['adidas', 'coffee', 'electronics']
}
```

## Shop Integration Model

### Shop WebView Requirements
Each shop must provide:
1. **Mobile-optimized website** or PWA
2. **Structured data** for native app integration
3. **Deep linking support** for specific pages

### Shop Data Structure
```typescript
interface Shop {
  id: string;
  mallId: string;
  name: string;
  nameAr: string;
  category: string;
  iconUrl: string;        // 512x512 PNG for grid
  websiteUrl: string;     // URL loaded in WebView
  description: string;
  location: {
    floor: string;
    zone: string;
    unit: string;
  };
  contact: {
    phone: string;
    whatsapp: string;
  };
  hours: BusinessHours;
  rating: number;
  isActive: boolean;
  subscription: {
    tier: 'basic' | 'professional' | 'premium';
    status: 'active' | 'suspended' | 'expired';
  };
  features: {
    hasOnlineOrdering: boolean;
    hasDelivery: boolean;
    acceptsOnlinePayment: boolean;
  };
}
```

## Native UI/UX Guidelines

### Design Principles
1. **Platform-Specific**: Follow iOS and Android design guidelines
2. **Performance-First**: Optimize for 60 FPS animations
3. **Accessible**: Support screen readers and large text
4. **Consistent**: Unified design language across screens
5. **Delightful**: Micro-interactions and smooth transitions

### Shop Grid Specifications
- **Grid Layout**: 4 columns on phones, 6 on tablets
- **Icon Size**: 60x60 with 10px padding
- **Icon Style**: Rounded corners (15px radius)
- **Typography**: Shop name below icon (12px, 2 lines max)
- **Touch Target**: Minimum 44x44 points
- **Animation**: Scale on press, fade on appear

### Color Palette
```javascript
const colors = {
  primary: '#1A1A1A',      // Mall brand color
  secondary: '#FFD700',    // Accent color
  background: '#FFFFFF',   // Main background
  surface: '#F5F5F5',     // Cards, sections
  text: '#333333',        // Primary text
  textSecondary: '#666666', // Secondary text
  error: '#FF3B30',       // Error states
  success: '#34C759'      // Success states
};
```

## Performance Requirements

### Native Screens
| Metric | Target | Maximum |
|--------|--------|---------|
| App Launch (Cold) | < 2s | 3s |
| App Launch (Warm) | < 1s | 1.5s |
| Screen Transition | < 200ms | 300ms |
| Shop Grid Scroll | 60 FPS | 55 FPS |
| Search Results | < 300ms | 500ms |
| Image Loading | < 1s | 2s |

### WebView Performance
| Metric | Target | Maximum |
|--------|--------|---------|
| Initial Load | < 2s | 3s |
| Page Navigation | < 1s | 2s |
| Interaction Delay | < 100ms | 200ms |

### Memory & Storage
- App Size: < 50MB initial download
- Cache Size: < 100MB
- Memory Usage: < 200MB active

## Development Phases

### Phase 1: Core Native App (Weeks 1-2)
**Goal**: Launch basic app with shop browsing

**Deliverables**:
- [ ] React Native project setup
- [ ] Navigation structure
- [ ] Home screen with shop grid
- [ ] Shop data integration (Firebase/API)
- [ ] Basic shop WebView
- [ ] App icons and splash screen

**Success Criteria**:
- App loads in < 3 seconds
- Displays 100+ shops smoothly
- Opens shop websites correctly

### Phase 2: Essential Features (Weeks 3-4)
**Goal**: Complete core user journey

**Deliverables**:
- [ ] Native search with filters
- [ ] Favorites system with persistence
- [ ] Pull-to-refresh
- [ ] Error states and offline handling
- [ ] Loading states and skeletons
- [ ] Share functionality

**Success Criteria**:
- Search returns results in < 500ms
- Favorites persist between sessions
- Graceful offline experience

### Phase 3: Enhanced Experience (Weeks 5-6)
**Goal**: Premium features and polish

**Deliverables**:
- [ ] Offers/deals screen
- [ ] Push notifications
- [ ] Deep linking
- [ ] Analytics integration
- [ ] Animations and transitions
- [ ] Accessibility improvements

**Success Criteria**:
- 60 FPS animations
- Push notification opt-in > 60%
- Accessibility score > 90%

### Phase 4: Shop Management (Weeks 7-8)
**Goal**: Complete shop ecosystem

**Deliverables**:
- [ ] Shop admin dashboard (web)
- [ ] Product management
- [ ] Analytics for shops
- [ ] Subscription management
- [ ] Content guidelines

**Success Criteria**:
- Shop onboarding < 30 minutes
- 90% shops active within 1 week

### Phase 5: Advanced Features (Weeks 9-10)
**Goal**: Differentiation and scale

**Deliverables**:
- [ ] Mall map integration
- [ ] Multi-language support
- [ ] Advanced analytics
- [ ] A/B testing framework
- [ ] Performance optimization

### Phase 6: Launch Preparation (Weeks 11-12)
**Goal**: App store ready

**Deliverables**:
- [ ] App store optimization
- [ ] Beta testing program
- [ ] Bug fixes and polish
- [ ] Marketing materials
- [ ] Documentation

## Monetization Strategy

### Revenue Streams

1. **Shop Subscriptions** (Primary)
   - Basic: 299 SAR/month
   - Professional: 599 SAR/month
   - Premium: 999 SAR/month

2. **Featured Placements**
   - Home screen features
   - Search priority
   - Promotional banners

3. **Transaction Fees** (Future)
   - 2-3% on in-app purchases
   - Payment processing

### Subscription Features
| Feature | Basic | Pro | Premium |
|---------|-------|-----|---------|
| Listing | ✅ | ✅ | ✅ |
| Products | 50 | 200 | Unlimited |
| Analytics | Basic | Advanced | Full |
| Featured | - | 1x/month | 4x/month |
| Support | Email | Priority | Dedicated |

## API Specifications

### Base URL
```
Production: https://api.riyadhpark.com/v1
Staging: https://api-staging.riyadhpark.com/v1
```

### Endpoints

#### Shops
```
GET /malls/{mallId}/shops
GET /malls/{mallId}/shops/{shopId}
GET /malls/{mallId}/shops/featured
GET /malls/{mallId}/shops/search?q={query}
```

#### Categories
```
GET /malls/{mallId}/categories
GET /malls/{mallId}/categories/{categoryId}/shops
```

#### Offers
```
GET /malls/{mallId}/offers
GET /malls/{mallId}/offers/{offerId}
```

#### User
```
POST /auth/login
POST /auth/logout
GET /users/profile
PUT /users/profile
GET /users/favorites
POST /users/favorites/{shopId}
DELETE /users/favorites/{shopId}
```

## Security Considerations

### App Security
- Certificate pinning for API calls
- Obfuscated API keys
- Secure storage for tokens
- WebView sandboxing
- Content Security Policy

### Data Privacy
- GDPR/CCPA compliance
- Minimal data collection
- Opt-in analytics
- Secure data transmission
- Regular security audits

## Testing Strategy

### Unit Testing
- Component testing with Jest
- Redux logic testing
- Utility function testing
- Coverage target: 80%

### Integration Testing
- API integration tests
- Navigation flow tests
- State persistence tests

### E2E Testing
- Critical user journeys
- Cross-platform testing
- Performance testing
- Accessibility testing

### Device Testing Matrix
- iOS: 13, 14, 15, 16, 17
- Android: 8, 9, 10, 11, 12, 13, 14
- Phones: Various sizes
- Tablets: iPad, Android tablets

## Success Metrics & KPIs

### User Metrics
- Daily Active Users (DAU)
- Monthly Active Users (MAU)
- Session duration
- Screens per session
- Retention rate (D1, D7, D30)

### Business Metrics
- Shop activation rate
- Subscription conversion
- Revenue per user
- Shop engagement rate
- Featured placement CTR

### Technical Metrics
- Crash-free rate (> 99.5%)
- App launch time
- API response time
- Error rate
- Performance scores

## Risk Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Poor WebView performance | High | Optimize shop sites, provide guidelines |
| Shop website compatibility | Medium | Testing suite, compatibility checker |
| Offline experience | Medium | Robust caching, offline states |
| App store rejection | High | Follow guidelines, thorough testing |
| Scalability issues | High | CDN, caching, load testing |

## Future Roadmap

### Version 2.0 (6 months)
- AR navigation in mall
- Social features
- Loyalty program
- Multi-mall support

### Version 3.0 (12 months)
- Native shop pages option
- In-app purchases
- Advanced personalization
- Voice search

## Conclusion

This native-first architecture provides the optimal balance between performance and flexibility. Users get a premium native experience for browsing and discovering shops, while shop owners maintain control over their content through WebViews. This approach is scalable, maintainable, and positions the platform for future growth.

---

**Document Version**: 4.0  
**Last Updated**: January 2025  
**Architecture**: Native + WebView Hybrid  
**Status**: Approved for Development