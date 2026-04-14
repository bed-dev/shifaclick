import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, typography } from '@/theme/tokens';
import type { FeedItem } from '@/types/models';

interface ContentCardProps {
  item: FeedItem;
  onPress: () => void;
}

export function ContentCard({ item, onPress }: ContentCardProps) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}>
      <View style={styles.topRow}>
        <View style={[styles.iconBlock, { backgroundColor: item.imageTint }]}>
          <Text style={styles.iconText}>{item.medicineName.slice(0, 2).toUpperCase()}</Text>
        </View>
        <View style={styles.titleWrap}>
          <Text style={styles.title}>{item.medicineName}</Text>
          <Text style={styles.subtitle}>{item.dosage}</Text>
        </View>
        <View style={styles.priceChip}>
          <Text style={styles.priceText}>from {item.minPriceDzd} DZD</Text>
        </View>
      </View>

      <Text style={styles.description} numberOfLines={2}>
        {item.description}
      </Text>

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
    borderColor: colors.surface.border,
    gap: spacing.sm,
  },
  cardPressed: {
    transform: [{ scale: 0.99 }],
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconBlock: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    color: '#fff',
    fontFamily: typography.fontFamily,
    fontWeight: '800',
    fontSize: 12,
  },
  titleWrap: {
    flex: 1,
  },
  title: {
    color: colors.text.primary,
    fontFamily: typography.fontFamily,
    fontSize: 16,
    fontWeight: '800',
  },
  subtitle: {
    color: colors.text.secondary,
    fontFamily: typography.fontFamily,
    fontSize: 13,
    fontWeight: '500',
  },
  priceChip: {
    paddingHorizontal: spacing.xs,
    paddingVertical: 6,
    borderRadius: radius.sm,
    backgroundColor: colors.surface.soft,
  },
  priceText: {
    color: colors.brand.aqua,
    fontFamily: typography.fontFamily,
    fontSize: 11,
    fontWeight: '700',
  },
  description: {
    color: colors.text.secondary,
    fontFamily: typography.fontFamily,
    fontSize: 13,
    lineHeight: 20,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tagChip: {
    borderRadius: radius.pill,
    backgroundColor: colors.surface.page,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
  },
  tagText: {
    color: colors.text.secondary,
    fontFamily: typography.fontFamily,
    fontSize: 12,
    fontWeight: '700',
  },
  availability: {
    color: colors.status.success,
    fontFamily: typography.fontFamily,
    fontSize: 12,
    fontWeight: '700',
  },
});
