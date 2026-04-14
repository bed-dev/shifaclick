import { FlatList, StyleSheet, Text, View } from 'react-native';

import { ScreenWrapper } from '@/components/common/ScreenWrapper';
import { useDistributorKpis, useDistributorOrders } from '@/hooks/usePharmacy';
import { colors, radius, spacing, typography } from '@/theme/tokens';
import type { DistributorOrder } from '@/types/pharmacy';

const statusTone: Record<DistributorOrder['status'], { bg: string; text: string; label: string }> = {
  pending: { bg: '#FEF3C7', text: '#92400E', label: 'Pending' },
  allocated: { bg: '#DBEAFE', text: '#1D4ED8', label: 'Allocated' },
  in_transit: { bg: '#DCFCE7', text: '#166534', label: 'In transit' },
};

export default function DistributorDashboardScreen() {
  const { data: kpis } = useDistributorKpis();
  const { data: orders, isLoading, error } = useDistributorOrders();

  return (
    <ScreenWrapper>
      <Text style={styles.title}>Distributor Control</Text>
      <Text style={styles.subtitle}>Manage allocations and prioritize urgent pharmacy demand.</Text>

      <View style={styles.kpiGrid}>
        {(kpis ?? []).map((item) => (
          <View key={item.label} style={styles.kpiCard}>
            <Text style={styles.kpiValue}>{item.value}</Text>
            <Text style={styles.kpiLabel}>{item.label}</Text>
          </View>
        ))}
      </View>

      {isLoading ? <Text style={styles.stateText}>Loading distributor queue...</Text> : null}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <FlatList
        data={orders ?? []}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const tone = statusTone[item.status];

          return (
            <View style={styles.card}>
              <View style={styles.rowBetween}>
                <Text style={styles.pharmacyName}>{item.pharmacyName}</Text>
                <View style={[styles.statusChip, { backgroundColor: tone.bg }]}>
                  <Text style={[styles.statusText, { color: tone.text }]}>{tone.label}</Text>
                </View>
              </View>

              <Text style={styles.meta}>{item.city} • {item.drugName}</Text>
              <Text style={styles.meta}>Requested {item.requestedUnits} units • {item.priority.toUpperCase()} priority</Text>
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
    marginBottom: spacing.sm,
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  kpiCard: {
    width: '48%',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#CBE0EE',
    backgroundColor: '#F6FBFF',
    minHeight: 70,
    padding: spacing.sm,
    justifyContent: 'center',
  },
  kpiValue: {
    color: colors.brand.darkBlue,
    fontFamily: typography.fontFamily,
    fontSize: 22,
    fontWeight: '800',
  },
  kpiLabel: {
    color: colors.text.secondary,
    fontFamily: typography.fontFamily,
    fontSize: 11,
    fontWeight: '700',
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
  pharmacyName: {
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
