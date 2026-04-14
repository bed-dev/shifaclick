import { useMemo, useState } from "react";
import {
  Keyboard,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { router } from "expo-router";
import type { Href } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-toast-message";

import { NoConnectionState } from "@/components/common/NoConnectionState";
import { UploadBox } from "@/components/pharmacy/UploadBox";
import { ClientMapView } from "@/components/client/ClientMapView";
import { useCreateOrder, useMedicineSuggestions } from "@/hooks/useClientFlow";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useLocationPermission } from "@/hooks/useLocationPermission";
import { NEARBY_PHARMACY_PINS } from "@/services/clientFlowService";
import { isNetworkError } from "@/services/http";

export default function ClientHomeScreen() {
  const [inputMode, setInputMode] = useState<"text" | "scan">("text");
  const [medicineName, setMedicineName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [notes, setNotes] = useState("");
  const [prescriptionUri, setPrescriptionUri] = useState<string | undefined>();
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [selectedPinId, setSelectedPinId] = useState<string>(
    NEARBY_PHARMACY_PINS[0].id,
  );

  const debouncedQuery = useDebouncedValue(medicineName, 300);

  const {
    data: suggestionData,
    isLoading: suggestionsLoading,
    isError: suggestionsError,
    refetch: refetchSuggestions,
  } = useMedicineSuggestions(debouncedQuery);

  const createOrder = useCreateOrder();
  const locationQuery = useLocationPermission();

  const suggestions = useMemo(() => {
    return suggestionData?.medicines ?? [];
  }, [suggestionData]);

  const selectedPin =
    NEARBY_PHARMACY_PINS.find((pin) => pin.id === selectedPinId) ??
    NEARBY_PHARMACY_PINS[0];
  const mapPins = useMemo(
    () => NEARBY_PHARMACY_PINS.map((pin) => ({ ...pin })),
    [],
  );

  const hasSuggestionPanel = suggestionsOpen && medicineName.trim().length >= 2;

  const pickFromCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      Toast.show({
        type: "error",
        text1: "Permission denied",
        text2: "Camera access is required to scan a prescription.",
      });
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
    });

    if (!result.canceled) {
      setPrescriptionUri(result.assets[0]?.uri);
    }
  };

  const pickFromGallery = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Toast.show({
        type: "error",
        text1: "Permission denied",
        text2: "Gallery access is required to upload a prescription.",
      });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
    });

    if (!result.canceled) {
      setPrescriptionUri(result.assets[0]?.uri);
    }
  };

  const handleSubmit = async () => {
    if (inputMode === "text" && !medicineName.trim()) {
      Toast.show({
        type: "error",
        text1: "Medicine required",
        text2: "Enter a medicine name to continue.",
      });
      return;
    }

    if (inputMode === "scan" && !prescriptionUri) {
      Toast.show({
        type: "error",
        text1: "Prescription required",
        text2: "Please upload or capture a doctor note.",
      });
      return;
    }

    try {
      const response = await createOrder.mutateAsync({
        medicineName,
        quantity,
        notes,
        prescriptionUri,
      });

      Toast.show({
        type: "success",
        text1: "Request sent",
        text2: "Contacting nearby pharmacies now.",
      });

      router.push({
        pathname: "/search/results/[orderId]",
        params: {
          orderId: String(response.order_id),
          medicine: medicineName.trim() || "Prescription upload",
        },
      } as Href);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Unable to send request",
        text2: isNetworkError(error)
          ? "No network connection. Please retry."
          : "Please try again.",
      });
    }
  };

  return (
    <ScrollView className="flex-1 bg-page" keyboardShouldPersistTaps="handled">
      <View className="px-4 pb-4 pt-3">
        {/* --- Page title --- */}
        <Text className="text-[22px] font-extrabold leading-7 text-dark">
          Find your medicine fast
        </Text>

        {/* --- Map --- */}
        <View className="mt-3">
          <ClientMapView
            pins={mapPins}
            selectedPinId={selectedPinId}
            locationLabel={locationQuery.data?.label ?? "Locating..."}
            locationDenied={Boolean(locationQuery.data?.denied)}
            userLocation={
              locationQuery.data
                ? {
                    latitude: locationQuery.data.latitude,
                    longitude: locationQuery.data.longitude,
                  }
                : undefined
            }
            onSelectPin={(pin) => setSelectedPinId(pin.id)}
          />
        </View>

        {/* --- Search panel card --- */}
        <View className="mt-3 rounded-2xl border border-border-default bg-card p-3">
          {/* Segmented mode switch */}
          <View className="flex-row rounded-xl bg-subtle p-1">
            <Pressable
              className={`flex-1 items-center rounded-lg py-2.5 ${inputMode === "text" ? "bg-card" : ""}`}
              onPress={() => setInputMode("text")}
              style={{ minHeight: 36 }}
            >
              <Text
                className={`text-xs font-bold ${inputMode === "text" ? "text-dark" : "text-text-muted"}`}
              >
                Medicine
              </Text>
            </Pressable>
            <Pressable
              className={`flex-1 items-center rounded-lg py-2.5 ${inputMode === "scan" ? "bg-card" : ""}`}
              onPress={() => setInputMode("scan")}
              style={{ minHeight: 36 }}
            >
              <Text
                className={`text-xs font-bold ${inputMode === "scan" ? "text-dark" : "text-text-muted"}`}
              >
                Prescription
              </Text>
            </Pressable>
          </View>

          {inputMode === "text" ? (
            <View className="mt-3">
              {/* Search input */}
              <View className="relative">
                <View className="flex-row items-center rounded-xl border border-border-default bg-input-bg px-3">
                  <Ionicons name="search-outline" size={16} color="#94A3B8" />
                  <TextInput
                    value={medicineName}
                    onChangeText={setMedicineName}
                    onFocus={() => setSuggestionsOpen(true)}
                    placeholder="Search medicine"
                    placeholderTextColor="#94A3B8"
                    className="ml-2 flex-1 text-[14px] font-medium text-dark"
                    style={{ minHeight: 44 }}
                  />
                </View>

                {/* Suggestions dropdown */}
                {hasSuggestionPanel ? (
                  <View className="absolute left-0 right-0 top-12 z-20 max-h-72 overflow-hidden rounded-xl border border-border-default bg-card">
                    {suggestionsError ? (
                      <View className="p-3">
                        <NoConnectionState
                          title="No Connection"
                          message="Could not load suggestions."
                          onRetry={() => {
                            void refetchSuggestions();
                          }}
                        />
                      </View>
                    ) : (
                      <ScrollView
                        keyboardShouldPersistTaps="handled"
                        nestedScrollEnabled
                      >
                        <View className="border-b border-subtle px-3 py-2">
                          <Text className="text-[11px] font-semibold text-text-muted">
                            {suggestionsLoading
                              ? "Searching..."
                              : "Suggestions"}
                          </Text>
                        </View>
                        {suggestions.map((item) => (
                          <Pressable
                            key={String(item.id)}
                            className="border-b border-subtle px-3 py-2.5"
                            onPress={() => {
                              setMedicineName(item.text);
                              setSuggestionsOpen(false);
                              Keyboard.dismiss();
                            }}
                            style={{ minHeight: 44 }}
                          >
                            <Text className="text-[13px] font-bold text-dark">
                              {item.text}
                            </Text>
                            <Text className="mt-0.5 text-[11px] text-text-muted">
                              {item.subtitle}
                            </Text>
                          </Pressable>
                        ))}
                        {!suggestionsLoading && suggestions.length === 0 ? (
                          <View className="px-3 py-4">
                            <Text className="text-xs text-text-muted">
                              No medicines found.
                            </Text>
                          </View>
                        ) : null}
                      </ScrollView>
                    )}
                  </View>
                ) : null}
              </View>

              {/* Quantity + Notes */}
              <TextInput
                value={quantity}
                onChangeText={setQuantity}
                placeholder="Quantity (optional)"
                placeholderTextColor="#94A3B8"
                className="mt-2 rounded-xl border border-border-default bg-input-bg px-3 text-[14px] font-medium text-dark"
                style={{ minHeight: 44 }}
              />

              <TextInput
                value={notes}
                onChangeText={setNotes}
                placeholder="Notes for pharmacist (optional)"
                placeholderTextColor="#94A3B8"
                className="mt-2 rounded-xl border border-border-default bg-input-bg px-3 text-[14px] font-medium text-dark"
                style={{ minHeight: 44 }}
              />
            </View>
          ) : (
            <View className="mt-3">
              <UploadBox
                uri={prescriptionUri}
                onCameraPress={pickFromCamera}
                onGalleryPress={pickFromGallery}
              />
            </View>
          )}

          {/* CTA button */}
          <Pressable
            className={`mt-3 items-center justify-center rounded-xl ${createOrder.isPending ? "bg-text-muted" : "bg-dark"}`}
            onPress={() => {
              setSuggestionsOpen(false);
              Keyboard.dismiss();
              void handleSubmit();
            }}
            disabled={createOrder.isPending}
            style={{ minHeight: 44 }}
          >
            <Text className="text-[13px] font-extrabold text-white">
              {createOrder.isPending
                ? "Sending..."
                : "Search Nearby Pharmacies"}
            </Text>
          </Pressable>

          {/* Closest pharmacy hint */}
          <View className="mt-2 flex-row items-center justify-center">
            <Ionicons name="location-outline" size={12} color="#64748B" />
            <Text className="ml-1 text-[11px] font-semibold text-text-secondary">
              Closest: {selectedPin.name} ({selectedPin.distanceKm} km)
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
