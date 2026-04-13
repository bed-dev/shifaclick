import { FlatList, StyleSheet, Text, View } from 'react-native';

import { ScreenWrapper } from '@/components/common/ScreenWrapper';
import { useHighDemandRequests } from '@/src/hooks/usePharmacy';
import { colors, radius, spacing, typography } from '@/src/theme/tokens';
import type { HighDemandRequest } from '@/src/types/pharmacy';

const urgencyStyle: Record<HighDemandRequest['urgency'], { bg: string; text: string; label: string }> = {
  high: { bg: '#FEE2E2', text: '#991B1B', label: 'High urgency' },
  medium: { bg: '#FEF3C7', text: '#92400E', label: 'Medium urgency' },
};

export default function PharmacistDashboardScreen() {
  const { data, isLoading, error } = useHighDemandRequests();

  return (
    <ScreenWrapper>
      <Text style={styles.title}>Local Demand Radar</Text>
      <Text style={styles.subtitle}>Prioritized local requests to help restock high-need medicines.</Text>

      {isLoading ? <Text style={styles.stateText}>Loading demand list...</Text> : null}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <FlatList
        data={data ?? []}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const urgency = urgencyStyle[item.urgency];

          return (
            <View style={styles.card}>
              <View style={styles.rowBetween}>
                <Text style={styles.drugName}>{item.drugName}</Text>
                <View style={[styles.urgencyBadge, { backgroundColor: urgency.bg }]}>
                  <Text style={[styles.urgencyText, { color: urgency.text }]}>{urgency.label}</Text>
                </View>
              </View>

              <View style={styles.metricsRow}>
                <Metric label="Requests" value={item.requestedCount.toString()} />
                <Metric label="Patients Nearby" value={item.nearbyPatients.toString()} />
              </View>
            </View>
          );
        }}
        ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
      />
    </ScreenWrapper>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metricBox}>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.text.primary,
    fontFamily: typography.fontFamily,
    fontSize: 28,
    fontWeight: '800',
    marginTop: spacing.xs,
  },
  subtitle: {
    color: colors.text.secondary,
    fontFamily: typography.fontFamily,
    fontSize: 14,
    marginTop: 2,
    marginBottom: spacing.md,
  },
  stateText: {
    color: colors.text.secondary,
    fontFamily: typography.fontFamily,
    fontSize: 14,
  },
  errorText: {
    color: colors.status.danger,
    fontFamily: typography.fontFamily,
    fontSize: 13,
    fontWeight: '700',
  },
  listContent: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
  },
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.surface.border,
    backgroundColor: '#FFFFFF',
    padding: spacing.md,
    gap: spacing.sm,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
  },
  drugName: {
    flex: 1,
    color: colors.text.primary,
    fontFamily: typography.fontFamily,
    fontSize: 16,
    fontWeight: '800',
  },
  urgencyBadge: {
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
  },
  urgencyText: {
    fontFamily: typography.fontFamily,
    fontSize: 11,
    fontWeight: '800',
  },
  metricsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  metricBox: {
    flex: 1,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#D4E2EE',
    backgroundColor: '#F8FCFF',
    minHeight: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricValue: {
    color: colors.brand.darkBlue,
    fontFamily: typography.fontFamily,
    fontSize: 19,
    fontWeight: '800',
  },
  metricLabel: {
    color: colors.text.secondary,
    fontFamily: typography.fontFamily,
    fontSize: 11,
    fontWeight: '700',
  },
});
