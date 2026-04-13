import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { ScreenWrapper } from '@/components/common/ScreenWrapper';
import { useActivity } from '@/src/hooks/useActivity';
import { colors, radius, spacing, typography } from '@/src/theme/tokens';
import type { ActivityItem } from '@/src/types/models';

const statusConfig: Record<ActivityItem['status'], { label: string; bg: string; color: string }> = {
  pending: { label: 'Pending', bg: '#FEF9C3', color: '#A16207' },
  accepted: { label: 'Accepted', bg: '#DBEAFE', color: '#1D4ED8' },
  declined: { label: 'Declined', bg: '#FEE2E2', color: '#B91C1C' },
  ready: { label: 'Ready', bg: '#DCFCE7', color: '#166534' },
};

export default function ActivityScreen() {
  const { data, isLoading, error, refetch } = useActivity();

  if (isLoading) {
    return (
      <ScreenWrapper>
        <View style={styles.centerState}>
          <ActivityIndicator size="small" color={colors.brand.aqua} />
          <Text style={styles.stateText}>Loading your activity…</Text>
        </View>
      </ScreenWrapper>
    );
  }

  if (error) {
    return (
      <ScreenWrapper>
        <View style={styles.centerState}>
          <Text style={styles.errorTitle}>Could not load activity</Text>
          <Text style={styles.stateText}>{error}</Text>
          <Pressable onPress={refetch} style={styles.retryButton}>
            <Text style={styles.retryText}>Retry</Text>
          </Pressable>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Request activity</Text>
        <View style={styles.liveBadge}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>Mock live</Text>
        </View>
      </View>

      <FlatList
        data={data ?? []}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
        renderItem={({ item }) => {
          const status = statusConfig[item.status];

          return (
            <View style={styles.card}>
              <View style={styles.topRow}>
                <View style={styles.iconCircle}>
                  <Ionicons name="medical-outline" size={16} color={colors.brand.aqua} />
                </View>
                <View style={styles.titleWrap}>
                  <Text style={styles.cardTitle}>{item.medicineName}</Text>
                  <Text style={styles.cardSubtitle}>{item.pharmacyName}</Text>
                </View>
                <View style={[styles.statusPill, { backgroundColor: status.bg }]}>
                  <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
                </View>
              </View>

              <View style={styles.metaRow}>
                <Text style={styles.metaText}>Qty: {item.quantity}</Text>
                <Text style={styles.metaText}>{item.createdAt}</Text>
              </View>
            </View>
          );
        }}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
    marginBottom: spacing.md,
  },
  title: {
    color: colors.text.primary,
    fontFamily: typography.fontFamily,
    fontSize: 24,
    fontWeight: '800',
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#A7D9DD',
    borderRadius: radius.pill,
    backgroundColor: '#EBF8F9',
    paddingHorizontal: spacing.sm,
    minHeight: 32,
    gap: 6,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.status.success,
  },
  liveText: {
    color: colors.brand.aqua,
    fontFamily: typography.fontFamily,
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  listContent: {
    paddingBottom: spacing.xl,
  },
  card: {
    backgroundColor: colors.surface.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.surface.border,
    padding: spacing.md,
    gap: spacing.sm,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#EBF8F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleWrap: {
    flex: 1,
  },
  cardTitle: {
    color: colors.text.primary,
    fontFamily: typography.fontFamily,
    fontSize: 15,
    fontWeight: '800',
  },
  cardSubtitle: {
    color: colors.text.secondary,
    fontFamily: typography.fontFamily,
    fontSize: 13,
  },
  statusPill: {
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
  },
  statusText: {
    fontFamily: typography.fontFamily,
    fontSize: 11,
    fontWeight: '800',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaText: {
    color: colors.text.muted,
    fontFamily: typography.fontFamily,
    fontSize: 12,
    fontWeight: '600',
  },
  centerState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  stateText: {
    color: colors.text.secondary,
    fontFamily: typography.fontFamily,
    fontSize: 14,
  },
  errorTitle: {
    color: colors.status.danger,
    fontFamily: typography.fontFamily,
    fontSize: 16,
    fontWeight: '800',
  },
  retryButton: {
    minHeight: 44,
    minWidth: 96,
    borderRadius: radius.md,
    backgroundColor: colors.brand.darkBlue,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  retryText: {
    color: '#fff',
    fontFamily: typography.fontFamily,
    fontSize: 14,
    fontWeight: '700',
  },
});
