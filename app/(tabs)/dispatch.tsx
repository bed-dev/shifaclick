import { FlatList, StyleSheet, Text, View } from 'react-native';

import { ScreenWrapper } from '@/components/common/ScreenWrapper';
import { useDispatchItems } from '@/hooks/usePharmacy';
import { colors, radius, spacing, typography } from '@/theme/tokens';
import type { DispatchItem } from '@/types/pharmacy';

const statusTone: Record<DispatchItem['status'], { bg: string; text: string; label: string }> = {
  packing: { bg: '#FEF3C7', text: '#92400E', label: 'Packing' },
  out_for_delivery: { bg: '#DBEAFE', text: '#1D4ED8', label: 'Out for delivery' },
  delivered: { bg: '#DCFCE7', text: '#166534', label: 'Delivered' },
};

export default function DispatchScreen() {
  const { data, isLoading, error } = useDispatchItems();

  return (
    <ScreenWrapper>
      <Text style={styles.title}>Dispatch Board</Text>
      <Text style={styles.subtitle}>Monitor outbound routes and package status in real time.</Text>

      {isLoading ? <Text style={styles.stateText}>Loading dispatches...</Text> : null}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <FlatList
        data={data ?? []}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const tone = statusTone[item.status];

          return (
            <View style={styles.card}>
              <View style={styles.rowBetween}>
                <Text style={styles.destination}>{item.destination}</Text>
                <View style={[styles.statusChip, { backgroundColor: tone.bg }]}>
                  <Text style={[styles.statusText, { color: tone.text }]}>{tone.label}</Text>
                </View>
              </View>
              <Text style={styles.meta}>Driver: {item.driverName}</Text>
              <Text style={styles.meta}>{item.packageCount} packages • ETA {item.eta}</Text>
            </View>
          );
        }}
        ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.text.primary,
    fontFamily: typography.fontFamily,
    fontSize: 24,
    fontWeight: '800',
    marginTop: spacing.xs,
  },
  subtitle: {
    color: colors.text.secondary,
    fontFamily: typography.fontFamily,
    fontSize: 13,
    marginTop: 2,
    marginBottom: spacing.md,
  },
  stateText: {
    color: colors.text.secondary,
    fontFamily: typography.fontFamily,
    fontSize: 13,
  },
  errorText: {
    color: colors.status.danger,
    fontFamily: typography.fontFamily,
    fontSize: 13,
    fontWeight: '700',
  },
  listContent: {
    paddingTop: spacing.xs,
    paddingBottom: spacing.lg,
  },
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.surface.border,
    backgroundColor: '#FFFFFF',
    padding: spacing.md,
    gap: 4,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
  },
  destination: {
    color: colors.text.primary,
    fontFamily: typography.fontFamily,
    fontSize: 15,
    fontWeight: '800',
    flex: 1,
  },
  statusChip: {
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
  },
  statusText: {
    fontFamily: typography.fontFamily,
    fontSize: 11,
    fontWeight: '800',
  },
  meta: {
    color: colors.text.secondary,
    fontFamily: typography.fontFamily,
    fontSize: 12,
  },
});
