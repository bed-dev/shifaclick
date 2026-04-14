import { StyleSheet, Text, View } from 'react-native';

import { radius, spacing, typography } from '@/theme/tokens';
import type { DrugStockStatus } from '@/types/pharmacy';

const stockConfig: Record<DrugStockStatus, { label: string; bg: string; text: string }> = {
  in: { label: 'In Stock', bg: '#DCFCE7', text: '#166534' },
  low: { label: 'Low Stock', bg: '#FEF3C7', text: '#9A6700' },
  out: { label: 'Out of Stock', bg: '#FEE2E2', text: '#B91C1C' },
};

export function StockBadge({ status }: { status: DrugStockStatus }) {
  const config = stockConfig[status];

  return (
    <View style={[styles.badge, { backgroundColor: config.bg }]}>
      <View style={[styles.dot, { backgroundColor: config.text }]} />
      <Text style={[styles.text, { color: config.text }]}>{config.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    minHeight: 28,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  text: {
    fontFamily: typography.fontFamily,
    fontSize: 12,
    fontWeight: '800',
  },
});
