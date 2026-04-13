import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';

import { CustomButton } from '@/components/common/CustomButton';
import { StockBadge } from '@/components/pharmacy/StockBadge';
import { useDrugDetails } from '@/src/hooks/usePharmacy';
import { colors, radius, spacing, typography } from '@/src/theme/tokens';

export default function DrugDetailsScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const { data, isLoading, error } = useDrugDetails(params.id ?? '');

  if (isLoading) {
    return (
      <View style={styles.centerState}>
        <ActivityIndicator size="small" color={colors.brand.aqua} />
        <Text style={styles.stateText}>Loading drug details...</Text>
      </View>
    );
  }

  if (!data || error) {
    return (
      <View style={styles.centerState}>
        <Text style={styles.errorTitle}>Could not load details</Text>
        <Text style={styles.stateText}>{error ?? 'Drug not found.'}</Text>
      </View>
    );
  }

  const nextRestock = data.matches.find((item) => item.expectedRestockDate)?.expectedRestockDate;

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <View style={styles.rowBetween}>
          <Text style={styles.heroTitle}>{data.name}</Text>
          <StockBadge status={data.stockStatus} />
        </View>
        <Text style={styles.heroSub}>{data.dosage} • {data.form.toUpperCase()} • {data.brand}</Text>
        <Text style={styles.heroDesc}>{data.description}</Text>
        {nextRestock ? <Text style={styles.restock}>Expected restock: {nextRestock}</Text> : null}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Alternatives</Text>
        {data.alternatives.map((alternative) => (
          <View key={alternative.id} style={styles.inlineCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.inlineTitle}>{alternative.name}</Text>
              <Text style={styles.inlineMeta}>{alternative.dosage}</Text>
            </View>
            <StockBadge status={alternative.stockStatus} />
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Insurance Pricing Tiers</Text>
        {data.insuranceTiers.map((tier) => (
          <View key={tier.tier} style={styles.inlineCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.inlineTitle}>{tier.label}</Text>
              <Text style={styles.inlineMeta}>{tier.coveragePercent}% coverage</Text>
            </View>
            <Text style={styles.price}>{tier.estimatedPriceDzd} DZD</Text>
          </View>
        ))}
      </View>

      <CustomButton
        label="Start Request"
        onPress={() => router.push(`/request/new?drugId=${data.id}` as any)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.md,
    gap: spacing.md,
    backgroundColor: colors.surface.page,
  },
  hero: {
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: '#C7DBE8',
    backgroundColor: '#F5FCFF',
    padding: spacing.md,
    gap: spacing.xs,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
  },
  heroTitle: {
    flex: 1,
    color: colors.text.primary,
    fontFamily: typography.fontFamily,
    fontSize: 26,
    fontWeight: '800',
  },
  heroSub: {
    color: colors.text.secondary,
    fontFamily: typography.fontFamily,
    fontSize: 14,
    fontWeight: '600',
  },
  heroDesc: {
    color: colors.text.primary,
    fontFamily: typography.fontFamily,
    fontSize: 14,
    lineHeight: 20,
  },
  restock: {
    color: colors.status.warning,
    fontFamily: typography.fontFamily,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 2,
  },
  section: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.surface.border,
    backgroundColor: '#fff',
    padding: spacing.md,
    gap: spacing.sm,
  },
  sectionTitle: {
    color: colors.text.primary,
    fontFamily: typography.fontFamily,
    fontSize: 18,
    fontWeight: '800',
  },
  inlineCard: {
    minHeight: 58,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#D4E2ED',
    backgroundColor: '#FAFDFF',
    paddingHorizontal: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  inlineTitle: {
    color: colors.text.primary,
    fontFamily: typography.fontFamily,
    fontSize: 14,
    fontWeight: '700',
  },
  inlineMeta: {
    color: colors.text.secondary,
    fontFamily: typography.fontFamily,
    fontSize: 12,
    marginTop: 1,
  },
  price: {
    color: colors.brand.aqua,
    fontFamily: typography.fontFamily,
    fontSize: 14,
    fontWeight: '800',
  },
  centerState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface.page,
    padding: spacing.md,
  },
  stateText: {
    color: colors.text.secondary,
    fontFamily: typography.fontFamily,
    fontSize: 14,
    textAlign: 'center',
  },
  errorTitle: {
    color: colors.status.danger,
    fontFamily: typography.fontFamily,
    fontSize: 16,
    fontWeight: '800',
  },
});
