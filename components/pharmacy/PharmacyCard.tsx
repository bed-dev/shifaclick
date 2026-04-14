import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { StockBadge } from '@/components/pharmacy/StockBadge';
import { colors, radius, spacing, typography } from '@/theme/tokens';
import type { PharmacyMatch } from '@/types/pharmacy';

interface PharmacyCardProps {
  pharmacy: PharmacyMatch;
  onPress?: () => void;
}

export function PharmacyCard({ pharmacy, onPress }: PharmacyCardProps) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}>
      <View style={styles.topRow}>
        <View style={styles.grow}>
          <Text style={styles.name}>{pharmacy.pharmacyName}</Text>
          <Text style={styles.meta}>
            {pharmacy.distanceKm} km • {pharmacy.etaMinutes} min • {pharmacy.isOpen ? 'Open' : 'Closed'}
          </Text>
        </View>
        <StockBadge status={pharmacy.stockStatus} />
      </View>

      <View style={styles.bottomRow}>
        <View style={styles.priceRow}>
          <Ionicons name="cash-outline" size={14} color={colors.brand.aqua} />
          <Text style={styles.price}>{pharmacy.priceDzd} DZD</Text>
        </View>
        <Text style={styles.units}>{pharmacy.unitsLeft} units left</Text>
      </View>

      {pharmacy.stockStatus === 'out' && pharmacy.expectedRestockDate ? (
        <Text style={styles.restock}>Expected restock: {pharmacy.expectedRestockDate}</Text>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.surface.border,
    backgroundColor: colors.surface.card,
    padding: spacing.md,
    gap: spacing.sm,
    shadowColor: '#0F172A',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  cardPressed: {
    transform: [{ scale: 0.99 }],
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
  },
  grow: {
    flex: 1,
  },
  name: {
    color: colors.text.primary,
    fontFamily: typography.fontFamily,
    fontSize: 16,
    fontWeight: '800',
  },
  meta: {
    color: colors.text.secondary,
    fontFamily: typography.fontFamily,
    fontSize: 12,
    marginTop: 2,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  price: {
    color: colors.brand.aqua,
    fontFamily: typography.fontFamily,
    fontSize: 14,
    fontWeight: '800',
  },
  units: {
    color: colors.text.muted,
    fontFamily: typography.fontFamily,
    fontSize: 12,
    fontWeight: '700',
  },
  restock: {
    color: colors.status.danger,
    fontFamily: typography.fontFamily,
    fontSize: 12,
    fontWeight: '700',
  },
});
