// Theme Configuration
// Design system colors, fonts, and spacing

import { Dimensions } from 'react-native';
import { Theme, Colors } from '../types';

const { width, height } = Dimensions.get('window');

// Color palette
const colors: Colors = {
  primary: '#1A1A1A',
  secondary: '#FFD700',
  background: '#FFFFFF',
  surface: '#F5F5F5',
  text: '#333333',
  textSecondary: '#666666',
  error: '#FF3B30',
  success: '#34C759',
  warning: '#FF9500',
  border: '#E1E1E1',
  shadow: '#000000',
};

// Dark theme colors
const darkColors: Colors = {
  primary: '#FFD700',
  secondary: '#1A1A1A',
  background: '#000000',
  surface: '#1C1C1E',
  text: '#FFFFFF',
  textSecondary: '#8E8E93',
  error: '#FF453A',
  success: '#30D158',
  warning: '#FF9F0A',
  border: '#38383A',
  shadow: '#000000',
};

// Theme object
export const theme: Theme = {
  colors,
  fonts: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
  },
  shadow: {
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
};

// Dark theme
export const darkTheme: Theme = {
  ...theme,
  colors: darkColors,
};

// Screen dimensions
export const screenWidth = width;
export const screenHeight = height;

// Grid dimensions for shop cards
export const shopGrid = {
  columns: 4,
  spacing: 16,
  cardWidth: (screenWidth - (5 * 16)) / 4, // 5 spaces (4 gaps + 2 margins)
  cardHeight: 80,
};

// Helper functions
export const getResponsiveSize = (size: number): number => {
  const scale = screenWidth / 375; // iPhone 6/7/8 base width
  return Math.ceil(size * scale);
};

export const isTablet = (): boolean => {
  return screenWidth >= 768;
};

export const getTabletColumns = (): number => {
  return isTablet() ? 6 : 4;
};

// Animation timing
export const animations = {
  fast: 200,
  normal: 300,
  slow: 500,
};

// Common styles
export const commonStyles = {
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  row: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
  shadow: {
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.sm + 4,
    paddingHorizontal: theme.spacing.md,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  buttonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '600' as const,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm + 4,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: theme.spacing.sm,
  },
};

// Category colors
export const categoryColors = {
  fashion: '#FF6B6B',
  electronics: '#4ECDC4',
  food: '#FFD93D',
  beauty: '#FF8CC8',
  sports: '#45B7D1',
  books: '#96CEB4',
  jewelry: '#FFEAA7',
  home: '#DDA0DD',
  kids: '#98D8C8',
  all: '#666666',
};

// Performance optimizations
export const performanceConfig = {
  initialNumToRender: 20,
  maxToRenderPerBatch: 10,
  windowSize: 10,
  removeClippedSubviews: true,
  getItemLayout: (data: any, index: number) => ({
    length: shopGrid.cardHeight + theme.spacing.sm,
    offset: (shopGrid.cardHeight + theme.spacing.sm) * index,
    index,
  }),
};

export default theme;