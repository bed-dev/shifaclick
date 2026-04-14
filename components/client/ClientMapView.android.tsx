import { memo, useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';

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

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function buildMapHtml({
  pins,
  selectedPinId,
  userLocation,
}: Pick<ClientMapViewProps, 'pins' | 'selectedPinId' | 'userLocation'>) {
  const center = userLocation ?? pins[0] ?? { latitude: 35.6969, longitude: -0.6331 };
  const pinPayload = JSON.stringify(
    pins.map((pin) => ({
      id: pin.id,
      name: pin.name,
      latitude: pin.latitude,
      longitude: pin.longitude,
      distanceKm: pin.distanceKm,
      selected: pin.id === selectedPinId,
    }))
  );
  const userPayload = JSON.stringify(userLocation ?? null);
  const selectedName = escapeHtml(pins.find((pin) => pin.id === selectedPinId)?.name ?? '');

  return `<!doctype html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <style>
      html, body, #map { margin: 0; padding: 0; width: 100%; height: 100%; background: #E6EEF5; }
      .leaflet-control-container { display: none; }
      .pin {
        width: 18px;
        height: 18px;
        border-radius: 999px;
        background: #2D3E50;
        border: 2px solid #FFFFFF;
        box-shadow: 0 2px 8px rgba(15, 23, 42, 0.22);
      }
      .pin.selected { background: #3CA4AC; transform: scale(1.08); }
      .user-pin {
        width: 14px;
        height: 14px;
        border-radius: 999px;
        background: #2563EB;
        border: 3px solid rgba(255,255,255,0.95);
        box-shadow: 0 0 0 10px rgba(37,99,235,0.12);
      }
      .label {
        margin-top: 6px;
        padding: 2px 8px;
        border-radius: 999px;
        background: rgba(255,255,255,0.92);
        color: #2D3E50;
        font: 700 11px/1.2 -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        white-space: nowrap;
        box-shadow: 0 1px 4px rgba(15, 23, 42, 0.08);
      }
      .label.selected {
        background: #DDF4F7;
        color: #1A6D74;
      }
      .marker-wrap {
        display: flex;
        flex-direction: column;
        align-items: center;
        transform: translateY(-8px);
      }
    </style>
  </head>
  <body>
    <div id="map" aria-label="${selectedName || 'Nearby pharmacies map'}"></div>
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <script>
      const center = ${JSON.stringify([center.latitude, center.longitude])};
      const pins = ${pinPayload};
      const userLocation = ${userPayload};

      const map = L.map('map', {
        zoomControl: false,
        attributionControl: false,
      }).setView(center, 14);

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(map);

      const bounds = [];

      pins.forEach((pin) => {
        const marker = L.marker([pin.latitude, pin.longitude], {
          icon: L.divIcon({
            className: '',
            iconSize: [96, 36],
            iconAnchor: [48, 28],
            html:
              '<div class="marker-wrap">' +
              '<div class="pin ' + (pin.selected ? 'selected' : '') + '"></div>' +
              '<div class="label ' + (pin.selected ? 'selected' : '') + '">' + pin.name + ' · ' + pin.distanceKm.toFixed(1) + ' km</div>' +
              '</div>',
          }),
        }).addTo(map);

        marker.on('click', () => {
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'select-pin', id: pin.id }));
        });

        bounds.push([pin.latitude, pin.longitude]);
      });

      if (userLocation) {
        L.marker([userLocation.latitude, userLocation.longitude], {
          icon: L.divIcon({
            className: '',
            iconSize: [20, 20],
            iconAnchor: [10, 10],
            html: '<div class="user-pin"></div>',
          }),
        }).addTo(map);

        bounds.push([userLocation.latitude, userLocation.longitude]);
      }

      if (bounds.length > 1) {
        map.fitBounds(bounds, { padding: [28, 28] });
      }
    </script>
  </body>
</html>`;
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

  const mapHtml = useMemo(
    () => buildMapHtml({ pins, selectedPinId, userLocation }),
    [pins, selectedPinId, userLocation]
  );

  const selectedPin = pins.find((pin) => pin.id === selectedPinId);

  const handleMessage = (payload: string) => {
    try {
      const data = JSON.parse(payload) as { type?: string; id?: string };

      if (data.type !== 'select-pin' || !data.id) {
        return;
      }

      const pin = pins.find((item) => item.id === data.id);

      if (pin) {
        onSelectPin?.(pin);
      }
    } catch {
      // Ignore malformed bridge messages from the embedded map.
    }
  };

  const renderMapSurface = (big = false) => (
    <View style={[styles.mapArea, big && styles.mapAreaBig]}>
      <WebView
        originWhitelist={['*']}
        source={{ html: mapHtml }}
        onMessage={(event) => handleMessage(event.nativeEvent.data)}
        javaScriptEnabled
        domStorageEnabled
        scrollEnabled={false}
        bounces={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        mixedContentMode="always"
        setBuiltInZoomControls={false}
        style={styles.webview}
      />

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

      {renderMapSurface()}

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
                color={selected ? colors.brand.primary : colors.text.secondary}
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
    overflow: 'hidden',
  },
  mapAreaBig: {
    flex: 1,
    minHeight: 420,
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
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
    color: colors.brand.primary,
  },
  selectedPreview: {
    position: 'absolute',
    left: spacing.sm,
    right: spacing.sm,
    bottom: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: '#FFFFFFEA',
    borderWidth: 1,
    borderColor: '#D6E6EF',
    paddingHorizontal: spacing.sm,
    paddingVertical: 8,
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
  fullscreenRoot: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  fullscreenHeader: {
    paddingTop: spacing.xl,
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
