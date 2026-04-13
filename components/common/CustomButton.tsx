import type { ReactNode } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

import { colors, radius, spacing, typography } from '@/src/theme/tokens';

interface CustomButtonProps {
  label: string;
  onPress: () => void;
  icon?: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
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
      {loading ? <ActivityIndicator size="small" color={variant === 'outline' ? colors.brand.aqua : '#fff'} /> : icon}
      <Text style={[styles.label, variant === 'outline' && styles.outlineLabel]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 48,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  pressed: {
    transform: [{ scale: 0.98 }],
  },
  disabled: {
    opacity: 0.6,
  },
  label: {
    color: colors.text.inverted,
    fontFamily: typography.fontFamily,
    fontSize: 15,
    fontWeight: '700',
  },
  outlineLabel: {
    color: colors.brand.aqua,
  },
});

const variantStyles = StyleSheet.create({
  primary: {
    backgroundColor: colors.brand.darkBlue,
  },
  secondary: {
    backgroundColor: colors.brand.aqua,
  },
  outline: {
    backgroundColor: colors.surface.card,
    borderWidth: 1.5,
    borderColor: colors.brand.aqua,
  },
});
