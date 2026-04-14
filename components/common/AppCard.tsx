import type { PropsWithChildren } from 'react';
import { Pressable, StyleSheet, type ViewStyle } from 'react-native';

import { colors, elevation, radius, spacing } from '@/theme/tokens';

type CardVariant = 'default' | 'highlight' | 'urgent';

interface AppCardProps extends PropsWithChildren {
  variant?: CardVariant;
  onPress?: () => void;
  style?: ViewStyle;
}

export function AppCard({ children, variant = 'default', onPress, style }: AppCardProps) {
  const variantStyle = variantStyles[variant];

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.base, variantStyle, pressed && styles.pressed, style]}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <Pressable style={[styles.base, variantStyle, style]}>
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.md,
    gap: spacing.sm,
    ...elevation.sm,
  },
  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.99 }],
  },
});

const variantStyles = StyleSheet.create({
  default: {
    backgroundColor: colors.surface.card,
    borderColor: colors.border.default,
  },
  highlight: {
    backgroundColor: colors.surface.card,
    borderColor: colors.border.brand,
  },
  urgent: {
    backgroundColor: '#FFFBFB',
    borderColor: '#F5C6C6',
  },
});
