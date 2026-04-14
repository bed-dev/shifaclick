import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { StockBadge } from '@/components/pharmacy/StockBadge';
import { colors, elevation, radius, spacing, typography } from '@/theme/tokens';
import type { PharmacyMatch } from '@/types/pharmacy';

interface PharmacyCardProps {
  pharmacy: PharmacyMatch;
  onPress?: () => void;
}

export function PharmacyCard({ pharmacy, onPress }: PharmacyCardProps) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}>
      {/* Name + stock badge */}
      <View style={styles.topRow}>
        <View style={styles.grow}>
          <Text style={styles.name} numberOfLines={1}>{pharmacy.pharmacyName}</Text>
          <Text style={styles.meta}>
            {pharmacy.distanceKm} km  {pharmacy.etaMinutes} min  {pharmacy.isOpen ? 'Open' : 'Closed'}
          </Text>
        </View>
        <StockBadge status={pharmacy.stockStatus} />
      </View>

      {/* Price + units row */}
      <View style={styles.bottomRow}>
        <View style={styles.priceRow}>
          <Ionicons name="cash-outline" size={13} color={colors.brand.primary} />
          <Text style={styles.price}>{pharmacy.priceDzd} DZD</Text>
        </View>
        <Text style={styles.units}>{pharmacy.unitsLeft} units left</Text>
      </View>

      {/* Optional restock line */}
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
    borderColor: colors.border.default,
    backgroundColor: colors.surface.card,
    padding: spacing.md,
    gap: spacing.sm,
    ...elevation.sm,
  },
  cardPressed: {
    opacity: 0.92,
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
    fontSize: typography.body.fontSize,
    fontWeight: '700',
  },
  meta: {
    color: colors.text.secondary,
    fontFamily: typography.fontFamily,
    fontSize: typography.meta.fontSize,
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
    color: colors.brand.primary,
    fontFamily: typography.fontFamily,
    fontSize: typography.caption.fontSize,
    fontWeight: '700',
  },
  units: {
    color: colors.text.muted,
    fontFamily: typography.fontFamily,
    fontSize: typography.meta.fontSize,
    fontWeight: '600',
  },
  restock: {
    color: colors.status.danger,
    fontFamily: typography.fontFamily,
    fontSize: typography.meta.fontSize,
    fontWeight: '700',
  },
});
