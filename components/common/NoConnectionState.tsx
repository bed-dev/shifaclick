import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, typography } from '@/theme/tokens';

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
      <Pressable style={styles.button} onPress={onRetry}>
        <Text style={styles.buttonText}>Try Again</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: '#D9E6EF',
    backgroundColor: '#FFFFFF',
    padding: spacing.md,
    alignItems: 'center',
    gap: spacing.xs,
  },
  title: {
    color: colors.text.primary,
    fontFamily: typography.fontFamily,
    fontSize: 16,
    fontWeight: '800',
  },
  message: {
    color: colors.text.secondary,
    fontFamily: typography.fontFamily,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
  button: {
    minHeight: 40,
    borderRadius: radius.md,
    backgroundColor: colors.brand.darkBlue,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    marginTop: 6,
  },
  buttonText: {
    color: '#fff',
    fontFamily: typography.fontFamily,
    fontSize: 13,
    fontWeight: '700',
  },
});
