import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { CustomButton } from '@/components/common/CustomButton';
import { ScreenWrapper } from '@/components/common/ScreenWrapper';
import { useFeedDetails } from '@/src/hooks/useFeed';
import { colors, radius, spacing, typography } from '@/src/theme/tokens';

const stockLabel: Record<'all' | 'partial' | 'none', string> = {
  all: 'All in stock',
  partial: 'Partial stock',
  none: 'Out of stock',
};

const stockColor: Record<'all' | 'partial' | 'none', string> = {
  all: '#DCFCE7',
  partial: '#FEF9C3',
  none: '#FEE2E2',
};

const stockTextColor: Record<'all' | 'partial' | 'none', string> = {
  all: '#166534',
  partial: '#A16207',
  none: '#B91C1C',
};

export default function ItemDetailScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const { data, isLoading, error } = useFeedDetails(params.id ?? '');

  if (isLoading) {
    return (
      <ScreenWrapper>
        <View style={styles.centerState}>
          <ActivityIndicator size="small" color={colors.brand.aqua} />
          <Text style={styles.stateText}>Loading details…</Text>
        </View>
      </ScreenWrapper>
    );
  }

  if (error || !data) {
    return (
      <ScreenWrapper>
        <View style={styles.centerState}>
          <Text style={styles.errorTitle}>Unable to load details</Text>
          <Text style={styles.stateText}>{error ?? 'Medicine not found.'}</Text>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.hero, { backgroundColor: data.imageTint }]}>
          <Text style={styles.heroTitle}>{data.medicineName}</Text>
          <Text style={styles.heroSubtitle}>{data.dosage} · {data.manufacturer}</Text>
          <Text style={styles.heroDescription}>{data.description}</Text>
        </View>

        <View style={styles.statsRow}>
          <StatCard label="Category" value={data.category} />
          <StatCard label="From" value={`${data.minPriceDzd} DZD`} />
        </View>

        <View style={styles.sectionHead}>
          <Text style={styles.sectionTitle}>Available pharmacies</Text>
          <Text style={styles.sectionMeta}>{data.pharmacies.length} matches</Text>
        </View>

        {data.pharmacies.map((pharmacy) => (
          <View key={pharmacy.id} style={styles.pharmacyCard}>
            <View style={styles.pharmacyTopRow}>
              <View>
                <Text style={styles.pharmacyName}>{pharmacy.name}</Text>
                <Text style={styles.pharmacyMeta}>
                  {pharmacy.distanceKm} km · {pharmacy.etaMinutes} min · ⭐ {pharmacy.rating}
                </Text>
              </View>
              <View
                style={[
                  styles.stockChip,
                  {
                    backgroundColor: stockColor[pharmacy.stockStatus],
                  },
                ]}
              >
                <Text
                  style={[
                    styles.stockText,
                    {
                      color: stockTextColor[pharmacy.stockStatus],
                    },
                  ]}
                >
                  {stockLabel[pharmacy.stockStatus]}
                </Text>
              </View>
            </View>

            <View style={styles.pharmacyFooter}>
              <Text style={styles.priceText}>{pharmacy.priceDzd} DZD</Text>
              <Text style={styles.openText}>Open until {pharmacy.openUntil}</Text>
            </View>
          </View>
        ))}

        <CustomButton
          label="Send request to selected pharmacy"
          icon={<Ionicons name="paper-plane-outline" size={16} color="#fff" />}
          onPress={() => undefined}
        />
      </ScrollView>
    </ScreenWrapper>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.md,
    paddingBottom: spacing.xl,
  },
  hero: {
    borderRadius: radius.xl,
    padding: spacing.lg,
    gap: spacing.xs,
  },
  heroTitle: {
    color: '#fff',
    fontFamily: typography.fontFamily,
    fontSize: 28,
    fontWeight: '800',
  },
  heroSubtitle: {
    color: '#E2E8F0',
    fontFamily: typography.fontFamily,
    fontSize: 14,
    fontWeight: '600',
  },
  heroDescription: {
    color: '#F8FAFC',
    fontFamily: typography.fontFamily,
    fontSize: 14,
    lineHeight: 20,
    marginTop: spacing.xs,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface.card,
    borderWidth: 1,
    borderColor: colors.surface.border,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  statLabel: {
    color: colors.text.muted,
    fontFamily: typography.fontFamily,
    fontSize: 12,
    fontWeight: '600',
  },
  statValue: {
    color: colors.text.primary,
    fontFamily: typography.fontFamily,
    fontSize: 16,
    fontWeight: '800',
    marginTop: 4,
  },
  sectionHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    color: colors.text.primary,
    fontFamily: typography.fontFamily,
    fontSize: 18,
    fontWeight: '800',
  },
  sectionMeta: {
    color: colors.text.secondary,
    fontFamily: typography.fontFamily,
    fontSize: 12,
    fontWeight: '700',
  },
  pharmacyCard: {
    backgroundColor: colors.surface.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.surface.border,
    padding: spacing.md,
    gap: spacing.sm,
  },
  pharmacyTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  pharmacyName: {
    color: colors.text.primary,
    fontFamily: typography.fontFamily,
    fontSize: 15,
    fontWeight: '800',
  },
  pharmacyMeta: {
    color: colors.text.secondary,
    fontFamily: typography.fontFamily,
    fontSize: 12,
    marginTop: 3,
  },
  stockChip: {
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
  },
  stockText: {
    fontFamily: typography.fontFamily,
    fontSize: 11,
    fontWeight: '800',
  },
  pharmacyFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceText: {
    color: colors.brand.aqua,
    fontFamily: typography.fontFamily,
    fontSize: 14,
    fontWeight: '800',
  },
  openText: {
    color: colors.text.secondary,
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
});
