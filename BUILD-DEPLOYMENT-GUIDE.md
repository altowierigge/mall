# Riyadh Park Mall App - Build & Deployment Guide

## Overview
This guide provides step-by-step instructions for building, testing, and deploying the Riyadh Park Mall React Native application to both iOS App Store and Google Play Store.

## Pre-Build Checklist

### Environment Setup
- [ ] Node.js 18+ installed
- [ ] React Native CLI installed (`npm install -g @react-native-community/cli`)
- [ ] Android Studio with SDK 34+ installed
- [ ] Xcode 14+ installed (for iOS builds)
- [ ] CocoaPods installed (`sudo gem install cocoapods`)

### Code Quality Checks
- [ ] Run `npm run lint` and fix all issues
- [ ] Run `npm test` and ensure all tests pass
- [ ] Verify TypeScript compilation: `npx tsc --noEmit`
- [ ] Check for unused dependencies: `npx depcheck`

### Configuration Verification
- [ ] App name updated in all configuration files
- [ ] Bundle ID/Package name matches store listings
- [ ] Version numbers consistent across platforms
- [ ] API endpoints point to production servers
- [ ] Debug logging disabled for production builds

## Android Build Process

### 1. Environment Preparation
```bash
# Navigate to project directory
cd /path/to/Mall/MallApp

# Clean previous builds
npm run clean:android

# Install dependencies
npm install

# Verify React Native setup
npx react-native doctor
```

### 2. Generate Release Keystore
```bash
# Navigate to Android app directory
cd android/app

# Generate release keystore (one-time setup)
keytool -genkey -v -keystore riyadhpark-release-key.keystore -alias riyadhpark-key-alias -keyalg RSA -keysize 2048 -validity 10000

# Store keystore details securely:
# Keystore password: [SECURE_PASSWORD]
# Key alias: riyadhpark-key-alias
# Key password: [SECURE_PASSWORD]
```

### 3. Configure Gradle for Release Signing
Create `android/gradle.properties` (if not exists):
```properties
# Release signing configuration
RIYADHPARK_RELEASE_STORE_FILE=riyadhpark-release-key.keystore
RIYADHPARK_RELEASE_KEY_ALIAS=riyadhpark-key-alias
RIYADHPARK_RELEASE_STORE_PASSWORD=YOUR_KEYSTORE_PASSWORD
RIYADHPARK_RELEASE_KEY_PASSWORD=YOUR_KEY_PASSWORD

# Build optimizations
org.gradle.jvmargs=-Xmx4g -XX:MaxMetaspaceSize=512m
org.gradle.parallel=true
org.gradle.configureondemand=true
org.gradle.daemon=true
android.useAndroidX=true
android.enableJetifier=true
```

Update `android/app/build.gradle` signing configs:
```gradle
android {
    ...
    signingConfigs {
        release {
            if (project.hasProperty('RIYADHPARK_RELEASE_STORE_FILE')) {
                storeFile file(RIYADHPARK_RELEASE_STORE_FILE)
                storePassword RIYADHPARK_RELEASE_STORE_PASSWORD
                keyAlias RIYADHPARK_RELEASE_KEY_ALIAS
                keyPassword RIYADHPARK_RELEASE_KEY_PASSWORD
            }
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            proguardFiles getDefaultProguardFile("proguard-android.txt"), "proguard-rules.pro"
        }
    }
}
```

### 4. Build Release APK
```bash
# Build release APK
npm run build:android

# Output location: android/app/build/outputs/apk/release/app-release.apk
```

### 5. Build Android App Bundle (AAB) for Play Store
```bash
# Build Android App Bundle (recommended for Play Store)
npm run build:android:bundle

# Output location: android/app/build/outputs/bundle/release/app-release.aab
```

### 6. Test Release Build
```bash
# Install release APK on device for testing
adb install android/app/build/outputs/apk/release/app-release.apk

# Test all core functionality:
# - App launches correctly
# - Shop listings load
# - Search functionality works
# - WebView navigation functions
# - Favorites persist across app restarts
# - Share functionality works
```

## iOS Build Process

### 1. Environment Preparation
```bash
# Navigate to iOS directory
cd ios

# Install CocoaPods dependencies
pod install --repo-update

# Return to root directory
cd ..
```

### 2. Xcode Configuration
1. Open `ios/MallApp.xcworkspace` in Xcode
2. Select MallApp project in navigator
3. Update **General** tab:
   - Display Name: "Riyadh Park Mall"
   - Bundle Identifier: "com.riyadhpark.mall"
   - Version: "1.0.0"
   - Build: "1"
   - Team: [Select your development team]

4. Configure **Signing & Capabilities**:
   - Enable "Automatically manage signing"
   - Select appropriate Team and Provisioning Profile
   - Ensure Bundle Identifier matches App Store Connect

### 3. Build Configuration
1. Select target device: **Any iOS Device (arm64)**
2. Select scheme: **MallApp**
3. Set build configuration to **Release**

### 4. Archive Build
```bash
# Command line archive (alternative to Xcode GUI)
cd ios
xcodebuild -workspace MallApp.xcworkspace \
  -scheme MallApp \
  -configuration Release \
  -destination generic/platform=iOS \
  -archivePath MallApp.xcarchive \
  archive
```

Or using Xcode:
1. Product → Archive
2. Wait for build completion
3. Archive will appear in Organizer

### 5. Export for App Store
1. Open Xcode Organizer
2. Select your archive
3. Click "Distribute App"
4. Choose "App Store Connect"
5. Follow export wizard
6. Upload to App Store Connect

## Build Optimization

### Bundle Size Analysis
```bash
# Analyze Android bundle
npm run analyze:bundle

# Check bundle contents
npx react-native bundle \
  --platform android \
  --dev false \
  --entry-file index.js \
  --bundle-output /tmp/index.android.bundle \
  --verbose

# Analyze bundle size
ls -lah /tmp/index.android.bundle
```

### Performance Optimizations Applied
- **ProGuard enabled** for Android release builds
- **Hermes JavaScript engine** enabled for better performance
- **Vector icons optimized** to reduce bundle size
- **Image assets optimized** for different screen densities
- **Unused dependencies removed** from bundle

### Memory and Performance Testing
```bash
# Start Metro bundler in production mode
npx react-native start --reset-cache

# Profile app performance
# - Monitor memory usage during navigation
# - Test WebView memory leaks
# - Verify smooth 60 FPS animations
# - Test app cold start time
```

## App Store Submission

### Google Play Store

#### 1. Prepare Store Listing
1. Log into [Google Play Console](https://play.google.com/console)
2. Create new app: "Riyadh Park Mall"
3. Complete store listing:
   - App name: "Riyadh Park Mall"
   - Short description: "Discover shops, find offers, and navigate Riyadh Park Mall"
   - Full description: [Use APP-STORE-LISTING.md content]
   - Screenshots: Upload phone and tablet screenshots
   - Feature graphic: 1024 x 500 banner image
   - App icon: 512 x 512 high-resolution icon

#### 2. Upload App Bundle
1. Navigate to "App releases" → "Production"
2. Click "Create new release"
3. Upload `app-release.aab` file
4. Add release notes from APP-STORE-LISTING.md
5. Set rollout percentage (start with 20% for initial release)

#### 3. Complete App Content
- Content rating: ESRB Everyone, PEGI 3
- Target audience: 13+ years
- Ads: No ads present
- In-app purchases: No in-app purchases
- Permissions: Internet access only

#### 4. Pricing & Distribution
- Free app
- Available in: Saudi Arabia (initially), expand later
- Device categories: Phone and Tablet
- Android requirements: API level 21+

### iOS App Store

#### 1. App Store Connect Setup
1. Log into [App Store Connect](https://appstoreconnect.apple.com)
2. Create new app:
   - Platform: iOS
   - Name: "Riyadh Park Mall"
   - Bundle ID: com.riyadhpark.mall
   - SKU: riyadh-park-mall-ios
   - User Access: Full Access

#### 2. Complete App Information
- **App Information**:
  - Name: Riyadh Park Mall
  - Subtitle: Shop, Discover, Navigate
  - Category: Shopping
  - Content Rights: Does not use third-party content

- **Pricing and Availability**:
  - Price: Free
  - Availability: Saudi Arabia (initially)

#### 3. Upload Build
1. Upload archive via Xcode Organizer
2. Select build in App Store Connect
3. Complete TestFlight testing if needed

#### 4. App Store Review Information
- Contact information: app-support@riyadhpark.com
- Demo account: Not required (public app)
- Notes: App showcases Riyadh Park Mall shops and offers

## Testing Checklist

### Pre-Submission Testing
- [ ] App launches on fresh install
- [ ] All navigation flows work correctly
- [ ] Shop WebView loads external websites
- [ ] Search functionality returns accurate results
- [ ] Favorites persist across app restarts
- [ ] Share functionality works on device
- [ ] Settings save and load correctly
- [ ] App handles network errors gracefully
- [ ] Performance meets 60 FPS target
- [ ] Memory usage stays within normal limits

### Device Testing Matrix
**Android:**
- Samsung Galaxy S21+ (Android 13)
- Google Pixel 6 (Android 13)
- OnePlus 9 (Android 12)
- Samsung Galaxy Tab S8 (Android 12)

**iOS:**
- iPhone 14 Pro Max (iOS 16)
- iPhone 13 (iOS 16)
- iPhone SE 3rd Gen (iOS 16)
- iPad Pro 12.9" (iPadOS 16)

## Post-Launch Monitoring

### Analytics Setup
```javascript
// Example analytics configuration (add to store/index.ts)
import Analytics from '@react-native-firebase/analytics';

// Track app launches
Analytics().logEvent('app_launch');

// Track shop views
Analytics().logEvent('shop_viewed', {
  shop_name: shopName,
  shop_category: shopCategory
});
```

### Crash Reporting
- Configure Crashlytics for crash monitoring
- Set up error boundaries in React components
- Monitor JavaScript errors and native crashes

### Performance Monitoring
- Track app startup time
- Monitor WebView loading performance
- Analyze user flow drop-off points
- Track search query performance

### User Feedback Collection
- In-app rating prompts after positive interactions
- Feedback form accessible from settings
- Monitor app store reviews and ratings
- Collect user suggestions for future features

## Maintenance Schedule

### Weekly Tasks
- Monitor crash reports and fix critical issues
- Review user feedback and app store reviews
- Update mall shop information as needed
- Check app performance metrics

### Monthly Tasks
- Update offers and promotional content
- Review analytics and user behavior patterns
- Plan feature updates based on user feedback
- Test app on latest OS versions

### Quarterly Tasks
- Major feature releases
- Security audits and dependency updates
- App store listing optimization
- Marketing campaign analysis

This comprehensive build and deployment guide ensures professional quality releases and successful app store submissions.