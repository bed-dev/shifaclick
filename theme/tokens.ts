import type { Theme } from '@react-navigation/native';
import { Platform } from 'react-native';

/* ------------------------------------------------------------------ */
/*  Color tokens                                                       */
/* ------------------------------------------------------------------ */

export const colors = {
  brand: {
    primary: '#3CA4AC',   // Aqua – primary actions, links, active states
    dark: '#2D3E50',      // Dark blue – headings, primary text, nav
    navy: '#0D1B2A',      // Deep navy – overlays, high-contrast bg
    orange: '#F97316',    // Notification accent
    // Legacy aliases (use semantic names above in new code)
    aqua: '#3CA4AC',
    darkBlue: '#2D3E50',
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
    subtle: '#F1F5F9',    // Subtle fill for inputs, inactive tabs
    soft: '#EEF6F7',      // Brand-tinted soft bg
    inputBg: '#F9FBFC',   // Calm input background
    // Legacy alias (use colors.border.default in new code)
    border: '#E2E8F0',
  },
  border: {
    default: '#E2E8F0',
    strong: '#CBD5E1',
    brand: '#B4DDE1',     // Brand-tinted border for active/focus
  },
  status: {
    success: '#16A34A',
    successBg: '#DCFCE7',
    successText: '#166534',
    warning: '#CA8A04',
    warningBg: '#FEF3C7',
    warningText: '#9A6700',
    danger: '#DC2626',
    dangerBg: '#FEE2E2',
    dangerText: '#B91C1C',
    info: '#3CA4AC',
    infoBg: '#E0F4F6',
    infoText: '#1A6D74',
  },
};

/* ------------------------------------------------------------------ */
/*  Spacing (compact-premium)                                          */
/* ------------------------------------------------------------------ */

export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
};

/* ------------------------------------------------------------------ */
/*  Border-radius (compact-premium)                                    */
/* ------------------------------------------------------------------ */

export const radius = {
  xs: 6,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 22,
  pill: 999,
};

/* ------------------------------------------------------------------ */
/*  Elevation presets (soft borders, low shadow)                       */
/* ------------------------------------------------------------------ */

export const elevation = {
  none: {},
  sm: {
    shadowColor: '#0F172A',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  md: {
    shadowColor: '#0F172A',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  lg: {
    shadowColor: '#0F172A',
    shadowOpacity: 0.08,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
} as const;

/* ------------------------------------------------------------------ */
/*  Typography                                                         */
/* ------------------------------------------------------------------ */

export const typography = {
  fontFamily: Platform.select({
    ios: 'Plus Jakarta Sans',
    android: 'Plus Jakarta Sans',
    default: 'system-ui',
  }),
  /** Standardized size/weight presets */
  title: { fontSize: 22, fontWeight: '800' as const, lineHeight: 28 },
  section: { fontSize: 17, fontWeight: '800' as const, lineHeight: 22 },
  body: { fontSize: 14, fontWeight: '500' as const, lineHeight: 20 },
  caption: { fontSize: 12, fontWeight: '600' as const, lineHeight: 16 },
  meta: { fontSize: 11, fontWeight: '600' as const, lineHeight: 14 },
  badge: { fontSize: 11, fontWeight: '700' as const, lineHeight: 14 },
};

/* ------------------------------------------------------------------ */
/*  React-Navigation theme                                             */
/* ------------------------------------------------------------------ */

export const appNavigationTheme: Theme = {
  dark: false,
  colors: {
    primary: colors.brand.primary,
    background: colors.surface.page,
    card: colors.surface.card,
    text: colors.text.primary,
    border: colors.border.default,
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
