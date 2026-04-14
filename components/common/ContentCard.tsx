import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, elevation, radius, spacing, typography } from '@/theme/tokens';
import type { FeedItem } from '@/types/models';

interface ContentCardProps {
  item: FeedItem;
  onPress: () => void;
}

export function ContentCard({ item, onPress }: ContentCardProps) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}>
      {/* Title + icon block + price chip */}
      <View style={styles.topRow}>
        <View style={[styles.iconBlock, { backgroundColor: item.imageTint }]}>
          <Text style={styles.iconText}>{item.medicineName.slice(0, 2).toUpperCase()}</Text>
        </View>
        <View style={styles.titleWrap}>
          <Text style={styles.title} numberOfLines={1}>{item.medicineName}</Text>
          <Text style={styles.subtitle} numberOfLines={1}>{item.dosage}</Text>
        </View>
        <View style={styles.priceChip}>
          <Text style={styles.priceText}>from {item.minPriceDzd} DZD</Text>
        </View>
      </View>

      {/* Description */}
      <Text style={styles.description} numberOfLines={2}>
        {item.description}
      </Text>

      {/* Category + availability */}
      <View style={styles.bottomRow}>
        <View style={styles.tagChip}>
          <Text style={styles.tagText}>{item.category}</Text>
        </View>
        <Text style={styles.availability}>{item.availablePharmacies} pharmacies</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface.card,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.default,
    gap: spacing.sm,
    ...elevation.sm,
  },
  cardPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.99 }],
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconBlock: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    color: '#fff',
    fontFamily: typography.fontFamily,
    fontWeight: '800',
    fontSize: 11,
  },
  titleWrap: {
    flex: 1,
  },
  title: {
    color: colors.text.primary,
    fontFamily: typography.fontFamily,
    fontSize: typography.body.fontSize,
    fontWeight: '700',
  },
  subtitle: {
    color: colors.text.secondary,
    fontFamily: typography.fontFamily,
    fontSize: typography.caption.fontSize,
    fontWeight: '500',
    marginTop: 1,
  },
  priceChip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
    backgroundColor: colors.surface.soft,
  },
  priceText: {
    color: colors.brand.primary,
    fontFamily: typography.fontFamily,
    fontSize: typography.meta.fontSize,
    fontWeight: '700',
  },
  description: {
    color: colors.text.secondary,
    fontFamily: typography.fontFamily,
    fontSize: typography.caption.fontSize,
    lineHeight: typography.caption.lineHeight + 2,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tagChip: {
    borderRadius: radius.pill,
    backgroundColor: colors.surface.subtle,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  tagText: {
    color: colors.text.secondary,
    fontFamily: typography.fontFamily,
    fontSize: typography.meta.fontSize,
    fontWeight: '700',
  },
  availability: {
    color: colors.status.success,
    fontFamily: typography.fontFamily,
    fontSize: typography.meta.fontSize,
    fontWeight: '700',
  },
});
