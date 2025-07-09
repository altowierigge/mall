// Navigation Types
// Type definitions for React Navigation

import { StackNavigationProp } from '@react-navigation/stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { Shop } from '../types';

// Root Stack Navigator
export type RootStackParamList = {
  Main: undefined;
  Shop: { shop: Shop };
  ShopWebView: { shop: Shop };
  Search: undefined;
  Notifications: undefined;
};

// Main Tab Navigator
export type MainTabParamList = {
  Home: undefined;
  Search: undefined;
  Favorites: undefined;
  Offers: undefined;
  Profile: undefined;
};

// Navigation Props for Stack Screens
export type RootStackNavigationProp = StackNavigationProp<RootStackParamList>;

export type ShopScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Shop'
>;

export type ShopWebViewNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ShopWebView'
>;

// Navigation Props for Tab Screens
export type MainTabNavigationProp = BottomTabNavigationProp<MainTabParamList>;

export type HomeNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Home'>,
  StackNavigationProp<RootStackParamList>
>;

export type SearchNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Search'>,
  StackNavigationProp<RootStackParamList>
>;

export type FavoritesNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Favorites'>,
  StackNavigationProp<RootStackParamList>
>;

export type OffersNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Offers'>,
  StackNavigationProp<RootStackParamList>
>;

export type ProfileNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Profile'>,
  StackNavigationProp<RootStackParamList>
>;

// Route Props
export type ShopScreenRouteProp = RouteProp<RootStackParamList, 'Shop'>;
export type ShopWebViewRouteProp = RouteProp<RootStackParamList, 'ShopWebView'>;

// Screen Props
export interface ShopScreenProps {
  navigation: ShopScreenNavigationProp;
  route: ShopScreenRouteProp;
}

export interface ShopWebViewProps {
  navigation: ShopWebViewNavigationProp;
  route: ShopWebViewRouteProp;
}

export interface HomeScreenProps {
  navigation: HomeNavigationProp;
}

export interface SearchScreenProps {
  navigation: SearchNavigationProp;
}

export interface FavoritesScreenProps {
  navigation: FavoritesNavigationProp;
}

export interface OffersScreenProps {
  navigation: OffersNavigationProp;
}

export interface ProfileScreenProps {
  navigation: ProfileNavigationProp;
}

// Navigation State Types
export interface NavigationState {
  key: string;
  index: number;
  routeNames: string[];
  history?: unknown[];
  routes: Route[];
  type: string;
  stale: false;
}

export interface Route {
  key: string;
  name: string;
  params?: object;
  path?: string;
}