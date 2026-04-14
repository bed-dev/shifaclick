import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { StockBadge } from '@/components/pharmacy/StockBadge';
import { colors, radius, spacing, typography } from '@/theme/tokens';
import type { PharmacyMatch } from '@/types/pharmacy';

interface MapPreviewProps {
  points: PharmacyMatch[];
  onSelect: (pharmacy: PharmacyMatch) => void;
}

function mapRange(value: number, min: number, max: number, outMin: number, outMax: number): number {
  if (max === min) {
    return (outMin + outMax) / 2;
  }

  return outMin + ((value - min) / (max - min)) * (outMax - outMin);
}

function MapPreviewBase({ points, onSelect }: MapPreviewProps) {
  if (!points.length) {
    return (
      <View style={[styles.container, styles.emptyWrap]}>
        <Text style={styles.emptyText}>No map points available</Text>
      </View>
    );
  }

  const latitudes = points.map((point) => point.latitude);
  const longitudes = points.map((point) => point.longitude);

  const minLat = Math.min(...latitudes);
  const maxLat = Math.max(...latitudes);
  const minLng = Math.min(...longitudes);
  const maxLng = Math.max(...longitudes);

  return (
    <View style={styles.container}>
      <View style={styles.overlay} />
      {points.map((point) => {
        const x = mapRange(point.longitude, minLng, maxLng, 12, 84);
        const y = mapRange(point.latitude, minLat, maxLat, 16, 74);

        return (
          <Pressable
            key={`${point.pharmacyId}-${point.latitude}`}
            style={[styles.pinWrap, { left: `${x}%`, top: `${100 - y}%` }]}
            onPress={() => onSelect(point)}
          >
            <View style={styles.pin}>
              <View style={styles.pinDot} />
            </View>
            <Text numberOfLines={1} style={styles.pinLabel}>
              {point.pharmacyName}
            </Text>
          </Pressable>
        );
      })}

      <View style={styles.legend}>
        <Text style={styles.legendTitle}>Availability</Text>
        <View style={styles.legendRow}>
          <StockBadge status="in" />
          <StockBadge status="low" />
          <StockBadge status="out" />
        </View>
      </View>
    </View>
  );
}

export const MapPreview = memo(MapPreviewBase);

const styles = StyleSheet.create({
  container: {
    minHeight: 250,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: '#CFE0EA',
    backgroundColor: '#EAF4FA',
    position: 'relative',
    overflow: 'hidden',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#C8DFEE66',
    borderRadius: radius.xl,
  },
  pinWrap: {
    position: 'absolute',
    alignItems: 'center',
    width: 104,
    marginLeft: -52,
  },
  pin: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.brand.darkBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#fff',
  },
  pinLabel: {
    color: colors.text.primary,
    fontFamily: typography.fontFamily,
    fontSize: 11,
    fontWeight: '700',
    backgroundColor: '#FFFFFFD9',
    borderRadius: radius.pill,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginTop: 4,
    maxWidth: 100,
  },
  legend: {
    position: 'absolute',
    left: spacing.sm,
    right: spacing.sm,
    bottom: spacing.sm,
    backgroundColor: '#FFFFFFE6',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#D8E5EE',
    padding: spacing.xs,
    gap: spacing.xs,
  },
  legendTitle: {
    color: colors.text.secondary,
    fontFamily: typography.fontFamily,
    fontSize: 11,
    fontWeight: '700',
  },
  legendRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    flexWrap: 'wrap',
  },
  emptyWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: colors.text.secondary,
    fontFamily: typography.fontFamily,
    fontSize: 14,
    fontWeight: '600',
  },
});
