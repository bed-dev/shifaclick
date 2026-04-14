import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, elevation, radius, spacing, typography } from '@/theme/tokens';

interface NoConnectionStateProps {
  title?: string;
  message?: string;
  onRetry: () => void;
}

export function NoConnectionState({
  title = 'No Connection',
  message = 'Please check your internet connection and try again.',
  onRetry,
}: NoConnectionStateProps) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      <Pressable style={styles.button} onPress={onRetry} accessibilityRole="button">
        <Text style={styles.buttonText}>Try Again</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border.default,
    backgroundColor: colors.surface.card,
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.sm,
    ...elevation.sm,
  },
  title: {
    color: colors.text.primary,
    fontFamily: typography.fontFamily,
    ...typography.section,
    fontSize: 15,
  },
  message: {
    color: colors.text.secondary,
    fontFamily: typography.fontFamily,
    fontSize: typography.caption.fontSize,
    textAlign: 'center',
    lineHeight: 18,
  },
  button: {
    minHeight: 44,
    borderRadius: radius.md,
    backgroundColor: colors.brand.dark,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    marginTop: spacing.xs,
  },
  buttonText: {
    color: colors.text.inverted,
    fontFamily: typography.fontFamily,
    fontSize: typography.caption.fontSize,
    fontWeight: '700',
  },
});
