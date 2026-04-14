import { useMemo, useState } from 'react';
import {
  FlatList,
  Keyboard,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router } from 'expo-router';
import type { Href } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import Toast from 'react-native-toast-message';

import { NoConnectionState } from '@/components/common/NoConnectionState';
import { UploadBox } from '@/components/pharmacy/UploadBox';
import { ClientMapView } from '@/components/client/ClientMapView';
import { useCreateOrder, useMedicineSuggestions } from '@/hooks/useClientFlow';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useLocationPermission } from '@/hooks/useLocationPermission';
import { NEARBY_PHARMACY_PINS } from '@/services/clientFlowService';
import { isNetworkError } from '@/services/http';

export default function ClientHomeScreen() {
  const [inputMode, setInputMode] = useState<'text' | 'scan'>('text');
  const [medicineName, setMedicineName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [notes, setNotes] = useState('');
  const [prescriptionUri, setPrescriptionUri] = useState<string | undefined>();
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [selectedPinId, setSelectedPinId] = useState<string>(NEARBY_PHARMACY_PINS[0].id);

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

  const selectedPin = NEARBY_PHARMACY_PINS.find((pin) => pin.id === selectedPinId) ?? NEARBY_PHARMACY_PINS[0];
  const mapPins = useMemo(() => NEARBY_PHARMACY_PINS.map((pin) => ({ ...pin })), []);

  const hasSuggestionPanel = suggestionsOpen && medicineName.trim().length >= 2;

  const pickFromCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      Toast.show({
        type: 'error',
        text1: 'Permission denied',
        text2: 'Camera access is required to scan a prescription.',
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
        type: 'error',
        text1: 'Permission denied',
        text2: 'Gallery access is required to upload a prescription.',
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
    if (inputMode === 'text' && !medicineName.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Medicine required',
        text2: 'Enter a medicine name to continue.',
      });
      return;
    }

    if (inputMode === 'scan' && !prescriptionUri) {
      Toast.show({
        type: 'error',
        text1: 'Prescription required',
        text2: 'Please upload or capture a doctor note.',
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
        type: 'success',
        text1: 'Request sent',
        text2: 'Contacting nearby pharmacies now.',
      });

      router.push({
        pathname: '/search/results/[orderId]',
        params: {
          orderId: String(response.order_id),
          medicine: medicineName.trim() || 'Prescription upload',
        },
      } as Href);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Unable to send request',
        text2: isNetworkError(error) ? 'No network connection. Please retry.' : 'Please try again.',
      });
    }
  };

  return (
    <ScrollView className="flex-1 bg-page" keyboardShouldPersistTaps="handled">
      <View className="px-4 pt-3 pb-4">
        <Text className="text-dark text-[22px] font-extrabold">Find your medicine fast</Text>

        <View className="mt-3">
          <ClientMapView
            pins={mapPins}
            selectedPinId={selectedPinId}
            locationLabel={locationQuery.data?.label ?? 'Locating...'}
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

        <View className="mt-3 rounded-2xl border border-[#D6E6EF] bg-white p-3">
          <View className="flex-row rounded-xl bg-[#F7F8FA] p-1">
            <Pressable
              className={`flex-1 items-center rounded-lg py-2 ${inputMode === 'text' ? 'bg-white' : ''}`}
              onPress={() => setInputMode('text')}
            >
              <Text className={`text-xs font-bold ${inputMode === 'text' ? 'text-dark' : 'text-slate-400'}`}>Medicine</Text>
            </Pressable>
            <Pressable
              className={`flex-1 items-center rounded-lg py-2 ${inputMode === 'scan' ? 'bg-white' : ''}`}
              onPress={() => setInputMode('scan')}
            >
              <Text className={`text-xs font-bold ${inputMode === 'scan' ? 'text-dark' : 'text-slate-400'}`}>Prescription</Text>
            </Pressable>
          </View>

          {inputMode === 'text' ? (
            <View className="mt-3">
              <View className="relative">
                <View className="flex-row items-center rounded-xl border border-[#D6E6EF] bg-[#FBFDFF] px-3">
                  <Ionicons name="search-outline" size={16} color="#94A3B8" />
                  <TextInput
                    value={medicineName}
                    onChangeText={setMedicineName}
                    onFocus={() => setSuggestionsOpen(true)}
                    placeholder="Search medicine"
                    placeholderTextColor="#94A3B8"
                    className="ml-2 h-11 flex-1 text-[14px] font-semibold text-dark"
                  />
                </View>

                {hasSuggestionPanel ? (
                  <View className="absolute left-0 right-0 top-12 z-20 max-h-72 overflow-hidden rounded-xl border border-[#D6E6EF] bg-white">
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
                      <FlatList
                        data={suggestions}
                        keyExtractor={(item) => String(item.id)}
                        keyboardShouldPersistTaps="handled"
                        initialNumToRender={8}
                        maxToRenderPerBatch={10}
                        windowSize={5}
                        removeClippedSubviews
                        ListHeaderComponent={
                          suggestionsLoading ? (
                            <View className="border-b border-[#F1F5F9] px-3 py-2">
                              <Text className="text-xs font-semibold text-slate-400">Searching...</Text>
                            </View>
                          ) : (
                            <View className="border-b border-[#F1F5F9] px-3 py-2">
                              <Text className="text-xs font-semibold text-slate-400">Suggestions</Text>
                            </View>
                          )
                        }
                        renderItem={({ item }) => (
                          <Pressable
                            className="border-b border-[#F8FAFC] px-3 py-2"
                            onPress={() => {
                              setMedicineName(item.text);
                              setSuggestionsOpen(false);
                              Keyboard.dismiss();
                            }}
                          >
                            <Text className="text-[13px] font-bold text-dark">{item.text}</Text>
                            <Text className="mt-0.5 text-[11px] text-slate-400">{item.subtitle}</Text>
                          </Pressable>
                        )}
                        ListEmptyComponent={
                          !suggestionsLoading ? (
                            <View className="px-3 py-4">
                              <Text className="text-xs text-slate-400">No medicines found.</Text>
                            </View>
                          ) : null
                        }
                      />
                    )}
                  </View>
                ) : null}
              </View>

              <TextInput
                value={quantity}
                onChangeText={setQuantity}
                placeholder="Quantity (optional)"
                placeholderTextColor="#94A3B8"
                className="mt-2 h-11 rounded-xl border border-[#D6E6EF] bg-[#FBFDFF] px-3 text-[14px] font-semibold text-dark"
              />

              <TextInput
                value={notes}
                onChangeText={setNotes}
                placeholder="Notes for pharmacist (optional)"
                placeholderTextColor="#94A3B8"
                className="mt-2 h-11 rounded-xl border border-[#D6E6EF] bg-[#FBFDFF] px-3 text-[14px] font-semibold text-dark"
              />
            </View>
          ) : (
            <View className="mt-3">
              <UploadBox uri={prescriptionUri} onCameraPress={pickFromCamera} onGalleryPress={pickFromGallery} />
            </View>
          )}

          <Pressable
            className={`mt-3 h-12 items-center justify-center rounded-xl ${createOrder.isPending ? 'bg-slate-400' : 'bg-dark'}`}
            onPress={() => {
              setSuggestionsOpen(false);
              Keyboard.dismiss();
              void handleSubmit();
            }}
            disabled={createOrder.isPending}
          >
            <Text className="text-sm font-extrabold text-white">
              {createOrder.isPending ? 'Sending...' : 'Search Nearby Pharmacies'}
            </Text>
          </Pressable>

          <View className="mt-2 flex-row items-center justify-center">
            <Ionicons name="location-outline" size={12} color="#64748B" />
            <Text className="ml-1 text-[11px] font-semibold text-slate-500">
              Closest: {selectedPin.name} ({selectedPin.distanceKm} km)
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
