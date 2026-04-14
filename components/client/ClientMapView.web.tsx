import { memo, useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors, radius, spacing, typography } from '@/theme/tokens';

interface MapPin {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  distanceKm: number;
}

interface ClientMapViewProps {
  pins: MapPin[];
  selectedPinId?: string;
  locationLabel: string;
  locationDenied: boolean;
  userLocation?: {
    latitude: number;
    longitude: number;
  };
  onSelectPin?: (pin: MapPin) => void;
}

function mapRange(value: number, min: number, max: number, outMin: number, outMax: number): number {
  if (max === min) {
    return (outMin + outMax) / 2;
  }

  return outMin + ((value - min) / (max - min)) * (outMax - outMin);
}

function ClientMapViewBase({
  pins,
  selectedPinId,
  locationLabel,
  locationDenied,
  userLocation,
  onSelectPin,
}: ClientMapViewProps) {
  const [expanded, setExpanded] = useState(false);

  const points = useMemo(() => {
    if (!pins.length) {
      return [];
    }

    const latitudes = pins.map((pin) => pin.latitude);
    const longitudes = pins.map((pin) => pin.longitude);

    if (userLocation) {
      latitudes.push(userLocation.latitude);
      longitudes.push(userLocation.longitude);
    }

    const minLat = Math.min(...latitudes);
    const maxLat = Math.max(...latitudes);
    const minLng = Math.min(...longitudes);
    const maxLng = Math.max(...longitudes);

    return pins.map((pin) => ({
      pin,
      x: mapRange(pin.longitude, minLng, maxLng, 12, 88),
      y: mapRange(pin.latitude, minLat, maxLat, 18, 80),
      selected: pin.id === selectedPinId,
    }));
  }, [pins, selectedPinId, userLocation]);

  const selectedPin = pins.find((pin) => pin.id === selectedPinId);

  const renderMapSurface = (big: boolean) => (
    <View style={[styles.mapArea, big && styles.mapAreaBig]}>
      <View style={styles.grid} />

      {points.map(({ pin, x, y, selected }) => (
        <Pressable
          key={pin.id}
          style={[
            styles.pinWrap,
            {
              left: `${x}%`,
              top: `${100 - y}%`,
            },
          ]}
          onPress={() => onSelectPin?.(pin)}
        >
          <View style={[styles.pin, selected && styles.pinSelected]}>
            <Ionicons name="medical" size={9} color="#fff" />
          </View>
          <Text style={[styles.pinLabel, selected && styles.pinLabelSelected]} numberOfLines={1}>
            {pin.name}
          </Text>
        </Pressable>
      ))}

      {selectedPin ? (
        <View style={styles.selectedPreview}>
          <Text style={styles.selectedName}>{selectedPin.name}</Text>
          <Text style={styles.selectedMeta}>{selectedPin.distanceKm.toFixed(1)} km away</Text>
        </View>
      ) : null}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>Nearby Pharmacies</Text>
        <View style={styles.headerActions}>
          <Text style={styles.headerMeta}>{locationLabel}</Text>
          <Pressable onPress={() => setExpanded(true)} style={styles.iconButton}>
            <Ionicons name="expand-outline" size={15} color={colors.text.primary} />
          </Pressable>
        </View>
      </View>

      {locationDenied ? (
        <View style={styles.warningBox}>
          <Text style={styles.warningText}>Location permission denied. Showing default city map.</Text>
        </View>
      ) : null}

      {renderMapSurface(false)}

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
        {pins.map((pin) => {
          const selected = pin.id === selectedPinId;

          return (
            <Pressable
              key={`chip-${pin.id}`}
              style={[styles.chip, selected && styles.chipSelected]}
              onPress={() => onSelectPin?.(pin)}
            >
              <Ionicons
                name="location"
                size={12}
                color={selected ? colors.brand.aqua : colors.text.secondary}
              />
              <Text style={[styles.chipLabel, selected && styles.chipLabelSelected]}>
                {pin.name} · {pin.distanceKm.toFixed(1)} km
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <Modal visible={expanded} animationType="slide" onRequestClose={() => setExpanded(false)}>
        <View style={styles.fullscreenRoot}>
          <View style={styles.fullscreenHeader}>
            <Pressable onPress={() => setExpanded(false)} style={styles.fullscreenButton}>
              <Ionicons name="close-outline" size={24} color={colors.text.primary} />
            </Pressable>

            <Text style={styles.fullscreenTitle}>Nearby Pharmacies</Text>

            <View style={styles.fullscreenButton} />
          </View>

          {renderMapSurface(true)}
        </View>
      </Modal>
    </View>
  );
}

export const ClientMapView = memo(ClientMapViewBase);

const styles = StyleSheet.create({
  container: {
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: '#CADFEC',
    backgroundColor: '#F3F8FC',
    overflow: 'hidden',
  },
  headerRow: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    color: colors.text.primary,
    fontFamily: typography.fontFamily,
    fontSize: 13,
    fontWeight: '800',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerMeta: {
    color: colors.text.secondary,
    fontFamily: typography.fontFamily,
    fontSize: 11,
    fontWeight: '700',
  },
  iconButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#DBE7F0',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFFE0',
  },
  warningBox: {
    marginHorizontal: spacing.sm,
    marginBottom: spacing.xs,
    borderRadius: radius.md,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
  },
  warningText: {
    color: '#92400E',
    fontFamily: typography.fontFamily,
    fontSize: 11,
    fontWeight: '600',
  },
  mapArea: {
    minHeight: 240,
    backgroundColor: '#E6EEF5',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#D7E5F0',
    position: 'relative',
    overflow: 'hidden',
  },
  mapAreaBig: {
    flex: 1,
    minHeight: 420,
  },
  grid: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#D7E8F4',
    opacity: 0.85,
  },
  pinWrap: {
    position: 'absolute',
    marginLeft: -42,
    width: 84,
    alignItems: 'center',
  },
  pin: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.brand.darkBlue,
    borderWidth: 2,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinSelected: {
    backgroundColor: colors.brand.aqua,
    transform: [{ scale: 1.08 }],
  },
  pinLabel: {
    marginTop: 4,
    backgroundColor: '#FFFFFFE6',
    borderRadius: radius.pill,
    paddingHorizontal: 6,
    paddingVertical: 2,
    maxWidth: 84,
    color: colors.text.primary,
    fontFamily: typography.fontFamily,
    fontSize: 10,
    fontWeight: '700',
    textAlign: 'center',
  },
  pinLabelSelected: {
    backgroundColor: '#DDF4F7',
    color: colors.brand.aqua,
  },
  selectedPreview: {
    position: 'absolute',
    left: spacing.sm,
    right: spacing.sm,
    bottom: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: '#FFFFFFE8',
    borderWidth: 1,
    borderColor: '#D6E6EF',
    paddingHorizontal: spacing.sm,
    paddingVertical: 7,
  },
  selectedName: {
    color: colors.text.primary,
    fontFamily: typography.fontFamily,
    fontSize: 12,
    fontWeight: '800',
  },
  selectedMeta: {
    marginTop: 2,
    color: colors.text.secondary,
    fontFamily: typography.fontFamily,
    fontSize: 11,
    fontWeight: '600',
  },
  chipsRow: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    gap: spacing.xs,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: '#D6E6EF',
    backgroundColor: '#FFFFFFD8',
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  chipSelected: {
    borderColor: '#A7D9DD',
    backgroundColor: '#EAF8FA',
  },
  chipLabel: {
    color: colors.text.secondary,
    fontFamily: typography.fontFamily,
    fontSize: 11,
    fontWeight: '700',
  },
  chipLabelSelected: {
    color: colors.brand.aqua,
  },
  fullscreenRoot: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  fullscreenHeader: {
    paddingTop: spacing.lg + spacing.sm,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#E3EDF3',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fullscreenButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F8FC',
  },
  fullscreenTitle: {
    color: colors.text.primary,
    fontFamily: typography.fontFamily,
    fontSize: 15,
    fontWeight: '800',
  },
});
