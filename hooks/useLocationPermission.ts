import { useQuery } from '@tanstack/react-query';
import * as Location from 'expo-location';

import { DEFAULT_CITY_CENTER } from '@/services/clientFlowService';

export interface LocationState {
  denied: boolean;
  label: string;
  latitude: number;
  longitude: number;
}

export function useLocationPermission() {
  return useQuery<LocationState>({
    queryKey: ['location-permission'],
    queryFn: async () => {
      try {
        const permission = await Location.requestForegroundPermissionsAsync();

        if (permission.status !== 'granted') {
          return {
            denied: true,
            label: DEFAULT_CITY_CENTER.label,
            latitude: DEFAULT_CITY_CENTER.latitude,
            longitude: DEFAULT_CITY_CENTER.longitude,
          };
        }

        const coords = await Location.getCurrentPositionAsync({});

        return {
          denied: false,
          label: 'Your location',
          latitude: coords.coords.latitude,
          longitude: coords.coords.longitude,
        };
      } catch {
        return {
          denied: true,
          label: DEFAULT_CITY_CENTER.label,
          latitude: DEFAULT_CITY_CENTER.latitude,
          longitude: DEFAULT_CITY_CENTER.longitude,
        };
      }
    },
    staleTime: 60_000,
  });
}
