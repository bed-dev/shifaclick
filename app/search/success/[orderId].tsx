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
      <View className="mt-2 rounded-2xl border border-[#CFEAD6] bg-[#ECFDF3] p-4">
        <Text className="text-[18px] font-extrabold text-green-700">You&apos;re all set</Text>
        <Text className="mt-1 text-[13px] text-green-700">The pharmacy is preparing your order now.</Text>
      </View>

      <View className="mt-4 rounded-2xl border border-[#D6E6EF] bg-white p-4">
        <Text className="text-[15px] font-extrabold text-dark">{params.pharmacy}</Text>
        <Text className="mt-1 text-[12px] text-slate-500">{params.address || 'Address unavailable'}</Text>
        <Text className="mt-1 text-[12px] text-slate-500">{params.phone || 'Phone unavailable'}</Text>
      </View>

      <View className="mt-4 rounded-2xl border border-[#D6E6EF] bg-white p-4">
        <Text className="text-[13px] font-bold text-dark">Requested medicine</Text>
        <Text className="mt-1 text-[12px] text-slate-500">{params.medicine || 'Prescription upload'}</Text>
      </View>

      <Pressable className="mt-4 h-12 items-center justify-center rounded-xl bg-dark" onPress={() => router.replace('/(tabs)/feed')}>
        <Text className="text-sm font-extrabold text-white">New Search</Text>
      </Pressable>
      <Pressable className="mt-2 h-12 items-center justify-center rounded-xl border border-[#D6E6EF] bg-white" onPress={() => router.replace('/(tabs)/activity')}>
        <Text className="text-sm font-extrabold text-dark">Go to My Orders</Text>
      </Pressable>
    </View>
  );
}
