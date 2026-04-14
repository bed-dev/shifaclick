import type { PropsWithChildren, ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, spacing } from '@/theme/tokens';

interface ScreenWrapperProps extends PropsWithChildren {
  header?: ReactNode;
  padded?: boolean;
}

export function ScreenWrapper({ children, header, padded = true }: ScreenWrapperProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      {header ? <View style={styles.header}>{header}</View> : null}
      <View style={[styles.content, padded && styles.padded]}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surface.page,
  },
  header: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
  content: {
    flex: 1,
  },
  padded: {
    paddingHorizontal: spacing.md,
  },
});
