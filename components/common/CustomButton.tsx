import type { ReactNode } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

import { colors, elevation, radius, spacing, typography } from '@/theme/tokens';

interface CustomButtonProps {
  label: string;
  onPress: () => void;
  icon?: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  disabled?: boolean;
  loading?: boolean;
}

export function CustomButton({
  label,
  onPress,
  icon,
  variant = 'primary',
  disabled = false,
  loading = false,
}: CustomButtonProps) {
  const isBlocked = disabled || loading;
  const isOutline = variant === 'outline';

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={isBlocked}
      style={({ pressed }) => [
        styles.base,
        variantStyles[variant],
        pressed && !isBlocked && styles.pressed,
        isBlocked && styles.disabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={isOutline ? colors.brand.primary : '#fff'} />
      ) : (
        icon
      )}
      <Text style={[styles.label, isOutline && styles.outlineLabel]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 44,
    alignSelf: 'stretch',
    backgroundColor: colors.brand.dark,
    borderWidth: 1,
    borderColor: '#243240',
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    ...elevation.sm,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    color: colors.text.inverted,
    fontFamily: typography.fontFamily,
    fontSize: 14,
    fontWeight: '700',
  },
  outlineLabel: {
    color: colors.brand.primary,
  },
});

const variantStyles = StyleSheet.create({
  primary: {
    backgroundColor: colors.brand.dark,
    borderWidth: 1,
    borderColor: '#243240',
  },
  secondary: {
    backgroundColor: colors.brand.primary,
  },
  outline: {
    backgroundColor: colors.surface.card,
    borderWidth: 1,
    borderColor: colors.border.brand,
    ...elevation.none,
  },
  danger: {
    backgroundColor: colors.status.danger,
  },
});
