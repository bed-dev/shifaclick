import { useQuery } from "@tanstack/react-query";
import * as Location from "expo-location";

import { DEFAULT_CITY_CENTER } from "@/services/clientFlowService";

export interface LocationState {
  denied: boolean;
  label: string;
  latitude: number;
  longitude: number;
}

export function useLocationPermission() {
  return useQuery<LocationState>({
    queryKey: ["location-permission"],
    queryFn: async () => {
      let permission: Location.LocationPermissionResponse;

      try {
        permission = await Location.requestForegroundPermissionsAsync();
      } catch {
        return {
          denied: true,
          label: DEFAULT_CITY_CENTER.label,
          latitude: DEFAULT_CITY_CENTER.latitude,
          longitude: DEFAULT_CITY_CENTER.longitude,
        };
      }

      if (permission.status !== "granted") {
        return {
          denied: true,
          label: DEFAULT_CITY_CENTER.label,
          latitude: DEFAULT_CITY_CENTER.latitude,
          longitude: DEFAULT_CITY_CENTER.longitude,
        };
      }

      // Permission granted — try to get actual position.
      // If GPS times out or fails, fall back to city center but keep denied=false
      // so the map still shows "location enabled" state.
      try {
        const coords = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        return {
          denied: false,
          label: "Your location",
          latitude: coords.coords.latitude,
          longitude: coords.coords.longitude,
        };
      } catch {
        // Permission was granted but position fetch failed (GPS off, timeout, emulator).
        // Use last known position as fallback before defaulting to city center.
        try {
          const last = await Location.getLastKnownPositionAsync();
          if (last) {
            return {
              denied: false,
              label: "Last known location",
              latitude: last.coords.latitude,
              longitude: last.coords.longitude,
            };
          }
        } catch {
          // ignore — fall through to default
        }

        return {
          denied: false,
          label: DEFAULT_CITY_CENTER.label,
          latitude: DEFAULT_CITY_CENTER.latitude,
          longitude: DEFAULT_CITY_CENTER.longitude,
        };
      }
    },
    staleTime: 60_000,
    retry: 1,
  });
}
