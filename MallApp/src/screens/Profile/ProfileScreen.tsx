// Profile Screen
// User account management and app settings

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ProfileScreenProps } from '../../navigation/types';
import { theme } from '../../utils/theme';
import { useAppSelector, useAppDispatch } from '../../store';
import { clearFavorites } from '../../store/slices/favoritesSlice';
import { STORAGE_KEYS } from '../../types';

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('en');
  const [appVersion] = useState('1.0.0');
  
  const dispatch = useAppDispatch();
  const favoritesCount = useAppSelector(state => state.favorites.shopIds.length);

  const mockUser = {
    name: 'Mall Visitor',
    email: 'visitor@riyadhpark.com',
    phone: '+966 50 123 4567',
    memberSince: '2024',
    points: 1250,
    level: 'Gold Member',
  };

  // Load settings from AsyncStorage
  useEffect(() => {
    loadSettings();
  }, []);
  
  const loadSettings = async () => {
    try {
      const settings = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (settings) {
        const parsedSettings = JSON.parse(settings);
        setNotificationsEnabled(parsedSettings.notifications ?? true);
        setDarkMode(parsedSettings.darkMode ?? false);
        setLanguage(parsedSettings.language ?? 'en');
        setIsLoggedIn(parsedSettings.isLoggedIn ?? false);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };
  
  const saveSettings = async (newSettings: any) => {
    try {
      const currentSettings = {
        notifications: notificationsEnabled,
        darkMode,
        language,
        isLoggedIn,
        ...newSettings,
      };
      await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(currentSettings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };
  
  const handleLogin = () => {
    setIsLoggedIn(true);
    saveSettings({ isLoggedIn: true });
    Alert.alert(
      'Welcome!',
      'You are now signed in. Enjoy personalized features!',
      [{ text: 'OK' }]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout? This will clear your favorites and preferences.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            setIsLoggedIn(false);
            dispatch(clearFavorites());
            await saveSettings({ isLoggedIn: false });
            Alert.alert('Logged Out', 'You have been successfully logged out.');
          }
        },
      ]
    );
  };

  const ProfileHeader = () => (
    <View style={styles.profileHeader}>
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {isLoggedIn ? 'JD' : '👤'}
          </Text>
        </View>
      </View>
      <View style={styles.profileInfo}>
        <Text style={styles.profileName}>
          {isLoggedIn ? mockUser.name : 'Guest User'}
        </Text>
        <Text style={styles.profileEmail}>
          {isLoggedIn ? mockUser.email : 'Sign in to sync your data'}
        </Text>
        {isLoggedIn && (
          <>
            <Text style={styles.memberSince}>
              {mockUser.level} • {mockUser.points} points
            </Text>
            <Text style={styles.memberSince}>
              Member since {mockUser.memberSince}
            </Text>
          </>
        )}
      </View>
    </View>
  );

  const SettingsItem = ({ 
    icon, 
    title, 
    subtitle, 
    onPress, 
    showArrow = true, 
    rightComponent 
  }: {
    icon: string;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    showArrow?: boolean;
    rightComponent?: React.ReactNode;
  }) => (
    <TouchableOpacity style={styles.settingsItem} onPress={onPress}>
      <View style={styles.settingsLeft}>
        <View style={styles.settingsIcon}>
          <Icon name={icon} size={20} color={theme.colors.primary} />
        </View>
        <View style={styles.settingsText}>
          <Text style={styles.settingsTitle}>{title}</Text>
          {subtitle && (
            <Text style={styles.settingsSubtitle}>{subtitle}</Text>
          )}
        </View>
      </View>
      <View style={styles.settingsRight}>
        {rightComponent}
        {showArrow && (
          <Icon name="arrow-forward-ios" size={16} color={theme.colors.textSecondary} />
        )}
      </View>
    </TouchableOpacity>
  );

  const SectionHeader = ({ title }: { title: string }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        {isLoggedIn && (
          <TouchableOpacity onPress={() => Alert.alert('Settings', 'Edit profile coming soon')}>
            <Icon name="edit" size={24} color={theme.colors.text} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Header */}
        <ProfileHeader />

        {/* Login/Logout Button */}
        <View style={styles.authSection}>
          <TouchableOpacity
            style={[styles.authButton, isLoggedIn && styles.logoutButton]}
            onPress={isLoggedIn ? handleLogout : handleLogin}
          >
            <Text style={[styles.authButtonText, isLoggedIn && styles.logoutButtonText]}>
              {isLoggedIn ? 'Logout' : 'Sign In'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Account Settings */}
        {isLoggedIn && (
          <>
            <SectionHeader title="Account" />
            <View style={styles.settingsSection}>
              <SettingsItem
                icon="person"
                title="Personal Information"
                subtitle="Edit your profile details"
                onPress={() => Alert.alert('Profile', 'Edit profile coming soon')}
              />
              <SettingsItem
                icon="favorite"
                title="Favorites"
                subtitle={`${favoritesCount} shops saved`}
                onPress={() => navigation.navigate('Favorites')}
              />
              <SettingsItem
                icon="history"
                title="Activity"
                subtitle="View your shopping history"
                onPress={() => Alert.alert('Activity', 'Activity history coming soon')}
              />
            </View>
          </>
        )}

        {/* App Settings */}
        <SectionHeader title="Preferences" />
        <View style={styles.settingsSection}>
          <SettingsItem
            icon="notifications"
            title="Notifications"
            subtitle="Manage notification preferences"
            showArrow={false}
            rightComponent={
              <Switch
                value={notificationsEnabled}
                onValueChange={(value) => {
                  setNotificationsEnabled(value);
                  saveSettings({ notifications: value });
                }}
                trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                thumbColor={theme.colors.background}
              />
            }
          />
          <SettingsItem
            icon="language"
            title="Language"
            subtitle={language === 'en' ? 'English' : 'العربية'}
            onPress={() => {
              const newLanguage = language === 'en' ? 'ar' : 'en';
              setLanguage(newLanguage);
              saveSettings({ language: newLanguage });
              Alert.alert('Language', `Language changed to ${newLanguage === 'en' ? 'English' : 'العربية'}`);
            }}
          />
          <SettingsItem
            icon="dark-mode"
            title="Dark Mode"
            subtitle="Toggle app theme"
            showArrow={false}
            rightComponent={
              <Switch
                value={darkMode}
                onValueChange={(value) => {
                  setDarkMode(value);
                  saveSettings({ darkMode: value });
                  Alert.alert('Theme', `${value ? 'Dark' : 'Light'} mode will be available in a future update`);
                }}
                trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                thumbColor={theme.colors.background}
              />
            }
          />
        </View>

        {/* Mall Info */}
        <SectionHeader title="Mall Information" />
        <View style={styles.settingsSection}>
          <SettingsItem
            icon="store"
            title="About Riyadh Park"
            subtitle="Mall hours and location"
            onPress={() => Alert.alert('Mall Info', 'Mall information coming soon')}
          />
          <SettingsItem
            icon="map"
            title="Mall Map"
            subtitle="Interactive mall directory"
            onPress={() => Alert.alert('Mall Map', 'Interactive map coming soon')}
          />
          <SettingsItem
            icon="event"
            title="Events"
            subtitle="Upcoming mall events"
            onPress={() => Alert.alert('Events', 'Mall events coming soon')}
          />
        </View>

        {/* Support */}
        <SectionHeader title="Support" />
        <View style={styles.settingsSection}>
          <SettingsItem
            icon="help"
            title="Help Center"
            subtitle="Get help and support"
            onPress={() => Alert.alert(
              'Help Center', 
              'For assistance:\n\n📞 Mall Information: +966 11 123 4567\n📧 Email: help@riyadhpark.com\n🕒 Mall Hours: 10 AM - 12 AM\n📍 Location: King Fahd Road, Riyadh'
            )}
          />
          <SettingsItem
            icon="feedback"
            title="Send Feedback"
            subtitle="Help us improve the app"
            onPress={() => Alert.alert('Feedback', 'Feedback system coming soon')}
          />
          <SettingsItem
            icon="info"
            title="About"
            subtitle="App version and info"
            onPress={() => Alert.alert(
              'About Riyadh Park App', 
              `Version: ${appVersion}\nBuilt with React Native\n\nDeveloped for Riyadh Park Mall\n\n© 2024 All rights reserved`
            )}
          />
        </View>

        {/* Status Note */}
        <View style={styles.statusNote}>
          <Text style={styles.statusText}>
            ✅ Phase 16: Profile System - Completed
          </Text>
          <Text style={styles.statusSubText}>
            • User authentication simulation{'\n'}
            • Settings persistence with AsyncStorage{'\n'}
            • Favorites integration and management{'\n'}
            • Theme and language preferences{'\n'}
            • Comprehensive settings organization
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
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xl,
    backgroundColor: theme.colors.surface,
    marginBottom: theme.spacing.md,
  },
  avatarContainer: {
    marginRight: theme.spacing.md,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: theme.colors.background,
    fontSize: 20,
    fontWeight: 'bold',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  profileEmail: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  memberSince: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  authSection: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  authButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: theme.colors.error,
  },
  authButtonText: {
    color: theme.colors.background,
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButtonText: {
    color: theme.colors.background,
  },
  sectionHeader: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.background,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  settingsSection: {
    backgroundColor: theme.colors.surface,
    marginBottom: theme.spacing.md,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  settingsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingsIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  settingsText: {
    flex: 1,
  },
  settingsTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.text,
    marginBottom: 2,
  },
  settingsSubtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  settingsRight: {
    flexDirection: 'row',
    alignItems: 'center',
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

export default ProfileScreen;