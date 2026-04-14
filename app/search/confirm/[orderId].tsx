import { Pressable, Text, View } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import type { Href } from 'expo-router';
import Toast from 'react-native-toast-message';

import { NoConnectionState } from '@/components/common/NoConnectionState';
import { useConfirmPharmacist } from '@/hooks/useClientFlow';
import { isNetworkError } from '@/services/http';

export default function ConfirmPharmacyScreen() {
  const params = useLocalSearchParams<{
    orderId: string;
    pharmacistId: string;
    pharmacy: string;
    name: string;
    address: string;
    phone: string;
    medicine: string;
  }>();

  const confirmMutation = useConfirmPharmacist();

  const handleConfirm = async () => {
    try {
      const result = await confirmMutation.mutateAsync({
        orderId: Number(params.orderId),
        pharmacistId: Number(params.pharmacistId),
      });

      Toast.show({
        type: 'success',
        text1: 'Confirmed',
        text2: 'Your pharmacy selection is locked in.',
      });

      router.replace({
        pathname: '/search/success/[orderId]',
        params: {
          orderId: params.orderId,
          pharmacy: result.pharmacy,
          address: result.address,
          phone: result.phone,
          medicine: params.medicine,
        },
      } as Href);
    } catch (error) {
      if (isNetworkError(error)) {
        Toast.show({
          type: 'error',
          text1: 'No Connection',
          text2: 'Please reconnect and retry.',
        });
        return;
      }

      Toast.show({
        type: 'error',
        text1: 'Confirmation failed',
        text2: 'Please try another pharmacy.',
      });
    }
  };

  return (
    <View className="flex-1 bg-page p-4">
      <Text className="text-[22px] font-extrabold leading-7 text-dark">Confirm your pharmacy</Text>
      <Text className="mt-1 text-[12px] font-medium text-text-secondary">One final step before pickup.</Text>

      {/* Pharmacy details */}
      <View className="mt-4 rounded-2xl border border-border-default bg-card p-3">
        <Text className="text-[15px] font-bold text-dark">{params.pharmacy}</Text>
        <Text className="mt-1 text-[11px] font-medium text-text-secondary">{params.name}</Text>
        <Text className="mt-1 text-[11px] font-medium text-text-muted">{params.address || 'Address unavailable'}</Text>
        <Text className="mt-1 text-[11px] font-medium text-text-muted">{params.phone || 'Phone unavailable'}</Text>
      </View>

      {/* Order summary */}
      <View className="mt-3 rounded-2xl border border-border-default bg-card p-3">
        <Text className="text-[12px] font-bold text-dark">Order</Text>
        <Text className="mt-1 text-[11px] font-medium text-text-secondary">{params.medicine}</Text>
      </View>

      {confirmMutation.isError && isNetworkError(confirmMutation.error) ? (
        <View className="mt-4">
          <NoConnectionState onRetry={() => void handleConfirm()} />
        </View>
      ) : null}

      {/* CTA */}
      <Pressable
        className={`mt-4 items-center justify-center rounded-xl ${confirmMutation.isPending ? 'bg-text-muted' : 'bg-brand'}`}
        onPress={() => void handleConfirm()}
        disabled={confirmMutation.isPending}
        style={{ minHeight: 44 }}
      >
        <Text className="text-[13px] font-bold text-white">
          {confirmMutation.isPending ? 'Confirming...' : "Confirm \u2014 I'm heading there"}
        </Text>
      </Pressable>
    </View>
  );
}
