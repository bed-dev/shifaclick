/* eslint-disable @typescript-eslint/no-require-imports */
import type { ComponentType } from 'react';
import { Platform } from 'react-native';

interface MapPin {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  distanceKm: number;
}

export interface ClientMapViewProps {
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

const ClientMapViewImpl =
  Platform.OS === 'web'
    ? require('./ClientMapView.web').ClientMapView
    : Platform.OS === 'android'
      ? require('./ClientMapView.android').ClientMapView
      : require('./ClientMapView.native').ClientMapView;

export const ClientMapView = ClientMapViewImpl as ComponentType<ClientMapViewProps>;
