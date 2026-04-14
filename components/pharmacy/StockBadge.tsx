import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors, radius, spacing, typography } from '@/theme/tokens';
import type { DrugStockStatus } from '@/types/pharmacy';

const stockConfig: Record<DrugStockStatus, { label: string; bg: string; text: string; icon: keyof typeof Ionicons.glyphMap }> = {
  in: { label: 'In Stock', bg: colors.status.successBg, text: colors.status.successText, icon: 'checkmark-circle' },
  low: { label: 'Low Stock', bg: colors.status.warningBg, text: colors.status.warningText, icon: 'alert-circle' },
  out: { label: 'Out of Stock', bg: colors.status.dangerBg, text: colors.status.dangerText, icon: 'close-circle' },
};

export function StockBadge({ status }: { status: DrugStockStatus }) {
  const config = stockConfig[status];

  return (
    <View
      style={[styles.badge, { backgroundColor: config.bg }]}
      accessibilityRole="text"
      accessibilityLabel={config.label}
    >
      <Ionicons name={config.icon} size={12} color={config.text} />
      <Text style={[styles.text, { color: config.text }]}>{config.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    minHeight: 24,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
  },
  text: {
    fontFamily: typography.fontFamily,
    fontSize: typography.badge.fontSize,
    fontWeight: typography.badge.fontWeight,
  },
});
