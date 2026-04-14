import { memo, useCallback, useMemo, useRef, useState } from 'react';
import { Modal, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Callout, Marker, UrlTile } from 'react-native-maps';

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

function ClientMapViewBase({
  pins,
  selectedPinId,
  locationLabel,
  locationDenied,
  userLocation,
  onSelectPin,
}: ClientMapViewProps) {
  const [expanded, setExpanded] = useState(false);
  const inlineMapRef = useRef<MapView | null>(null);
  const fullMapRef = useRef<MapView | null>(null);

  const mapCoordinates = useMemo(
    () =>
      pins.map((pin) => ({
        latitude: pin.latitude,
        longitude: pin.longitude,
      })),
    [pins]
  );

  const initialRegion = useMemo(() => {
    const latitudes = pins.map((pin) => pin.latitude);
    const longitudes = pins.map((pin) => pin.longitude);

    if (userLocation) {
      latitudes.push(userLocation.latitude);
      longitudes.push(userLocation.longitude);
    }

    if (latitudes.length === 0 || longitudes.length === 0) {
      return {
        latitude: 35.6969,
        longitude: -0.6331,
        latitudeDelta: 0.03,
        longitudeDelta: 0.03,
      };
    }

    const minLat = Math.min(...latitudes);
    const maxLat = Math.max(...latitudes);
    const minLng = Math.min(...longitudes);
    const maxLng = Math.max(...longitudes);

    const centerLat = (minLat + maxLat) / 2;
    const centerLng = (minLng + maxLng) / 2;
    const latDelta = Math.max((maxLat - minLat) * 1.9, 0.02);
    const lngDelta = Math.max((maxLng - minLng) * 1.9, 0.02);

    return {
      latitude: centerLat,
      longitude: centerLng,
      latitudeDelta: latDelta,
      longitudeDelta: lngDelta,
    };
  }, [pins, userLocation]);

  const focusOnSelected = useCallback(
    (mapRef: MapView | null) => {
      const selected = pins.find((pin) => pin.id === selectedPinId);

      if (!mapRef || !selected) {
        return;
      }

      mapRef.animateToRegion(
        {
          latitude: selected.latitude,
          longitude: selected.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        300
      );
    },
    [pins, selectedPinId]
  );

  const focusOnPin = useCallback((mapRef: MapView | null, pin: MapPin) => {
    if (!mapRef) {
      return;
    }

    mapRef.animateToRegion(
      {
        latitude: pin.latitude,
        longitude: pin.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      300
    );
  }, []);

  const fitToPharmacies = useCallback(
    (mapRef: MapView | null) => {
      if (!mapRef || mapCoordinates.length === 0) {
        return;
      }

      mapRef.fitToCoordinates(mapCoordinates, {
        edgePadding: {
          top: 60,
          right: 60,
          bottom: 60,
          left: 60,
        },
        animated: true,
      });
    },
    [mapCoordinates]
  );

  const handleSelectPin = useCallback(
    (pin: MapPin) => {
      onSelectPin?.(pin);
      focusOnPin(inlineMapRef.current, pin);
      focusOnPin(fullMapRef.current, pin);
    },
    [focusOnPin, onSelectPin]
  );

  const renderMap = (mapRef: React.RefObject<MapView | null>) => (
    <MapView
      ref={mapRef}
      style={StyleSheet.absoluteFill}
      initialRegion={initialRegion}
      loadingEnabled
      rotateEnabled={false}
      pitchEnabled={false}
      toolbarEnabled={false}
      moveOnMarkerPress={false}
      onMapReady={() => {
        fitToPharmacies(mapRef.current);
        focusOnSelected(mapRef.current);
      }}
      showsUserLocation={Boolean(userLocation && !locationDenied)}
      showsMyLocationButton={false}
      showsCompass={false}
      showsBuildings={false}
      mapType={Platform.OS === 'android' ? 'none' : 'standard'}
    >
      <UrlTile
        urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        maximumZ={19}
        flipY={false}
        shouldReplaceMapContent
        zIndex={-1}
      />

      {pins.map((pin) => {
        const selected = pin.id === selectedPinId;

        return (
          <Marker
            key={pin.id}
            coordinate={{ latitude: pin.latitude, longitude: pin.longitude }}
            onPress={() => handleSelectPin(pin)}
            pinColor={selected ? colors.brand.aqua : colors.brand.darkBlue}
          >
            <Callout tooltip={false}>
              <View style={styles.calloutCard}>
                <Text style={styles.calloutTitle}>{pin.name}</Text>
                <Text style={styles.calloutMeta}>{pin.distanceKm.toFixed(1)} km away</Text>
              </View>
            </Callout>
          </Marker>
        );
      })}
    </MapView>
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

      <View style={styles.mapArea}>{renderMap(inlineMapRef)}</View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
        {pins.map((pin) => {
          const selected = pin.id === selectedPinId;

          return (
            <Pressable
              key={`chip-${pin.id}`}
              style={[styles.chip, selected && styles.chipSelected]}
              onPress={() => handleSelectPin(pin)}
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

            <Pressable onPress={() => fitToPharmacies(fullMapRef.current)} style={styles.fullscreenButton}>
              <Ionicons name="locate-outline" size={20} color={colors.text.primary} />
            </Pressable>
          </View>

          <View style={styles.fullscreenMap}>{renderMap(fullMapRef)}</View>
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
    height: 240,
    backgroundColor: '#E6EEF5',
  },
  calloutCard: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  calloutTitle: {
    color: colors.text.primary,
    fontFamily: typography.fontFamily,
    fontSize: 12,
    fontWeight: '700',
  },
  calloutMeta: {
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
  fullscreenMap: {
    flex: 1,
    backgroundColor: '#E6EEF5',
  },
});
