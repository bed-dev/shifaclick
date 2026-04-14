import type { Theme } from '@react-navigation/native';
import { Platform } from 'react-native';

export const colors = {
  brand: {
    aqua: '#3CA4AC',
    darkBlue: '#2D3E50',
    navy: '#0D1B2A',
    orange: '#F97316',
  },
  text: {
    primary: '#2D3E50',
    secondary: '#64748B',
    muted: '#94A3B8',
    inverted: '#FFFFFF',
  },
  surface: {
    page: '#F7F8FA',
    card: '#FFFFFF',
    soft: '#EEF6F7',
    border: '#E2E8F0',
  },
  status: {
    success: '#16A34A',
    warning: '#CA8A04',
    danger: '#DC2626',
    info: '#3CA4AC',
  },
};

export const spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
};

export const radius = {
  sm: 10,
  md: 14,
  lg: 20,
  xl: 28,
  pill: 999,
};

export const typography = {
  fontFamily: Platform.select({
    ios: 'Plus Jakarta Sans',
    android: 'Plus Jakarta Sans',
    default: 'system-ui',
  }),
};

export const appNavigationTheme: Theme = {
  dark: false,
  colors: {
    primary: colors.brand.aqua,
    background: colors.surface.page,
    card: colors.surface.card,
    text: colors.text.primary,
    border: colors.surface.border,
    notification: colors.brand.orange,
  },
  fonts: {
    regular: {
      fontFamily: typography.fontFamily,
      fontWeight: '400',
    },
    medium: {
      fontFamily: typography.fontFamily,
      fontWeight: '500',
    },
    bold: {
      fontFamily: typography.fontFamily,
      fontWeight: '700',
    },
    heavy: {
      fontFamily: typography.fontFamily,
      fontWeight: '800',
    },
  },
};
