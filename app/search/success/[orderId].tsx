import { Pressable, Text, View } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';

export default function OrderSuccessScreen() {
  const params = useLocalSearchParams<{
    pharmacy: string;
    address: string;
    phone: string;
    medicine: string;
  }>();

  return (
    <View className="flex-1 bg-page p-4">
      {/* Success banner */}
      <View className="mt-2 rounded-2xl border border-status-success-bg bg-status-success-bg p-4">
        <Text className="text-[17px] font-extrabold text-status-success-text">You&apos;re all set</Text>
        <Text className="mt-1 text-[12px] font-medium text-status-success-text">
          The pharmacy is preparing your order now.
        </Text>
      </View>

      {/* Pharmacy details */}
      <View className="mt-3 rounded-2xl border border-border-default bg-card p-3">
        <Text className="text-[14px] font-bold text-dark">{params.pharmacy}</Text>
        <Text className="mt-1 text-[11px] font-medium text-text-secondary">{params.address || 'Address unavailable'}</Text>
        <Text className="mt-1 text-[11px] font-medium text-text-muted">{params.phone || 'Phone unavailable'}</Text>
      </View>

      {/* Medicine */}
      <View className="mt-3 rounded-2xl border border-border-default bg-card p-3">
        <Text className="text-[12px] font-bold text-dark">Requested medicine</Text>
        <Text className="mt-1 text-[11px] font-medium text-text-secondary">{params.medicine || 'Prescription upload'}</Text>
      </View>

      {/* Actions */}
      <Pressable
        className="mt-4 items-center justify-center rounded-xl bg-dark"
        onPress={() => router.replace('/(tabs)/feed')}
        style={{ minHeight: 44 }}
      >
        <Text className="text-[13px] font-bold text-white">New Search</Text>
      </Pressable>
      <Pressable
        className="mt-2 items-center justify-center rounded-xl border border-border-default bg-card"
        onPress={() => router.replace('/(tabs)/activity')}
        style={{ minHeight: 44 }}
      >
        <Text className="text-[13px] font-bold text-dark">Go to My Orders</Text>
      </Pressable>
    </View>
  );
}
