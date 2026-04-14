import { FlatList, Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import type { Href } from 'expo-router';

import { NoConnectionState } from '@/components/common/NoConnectionState';
import { useTrackedOrders } from '@/hooks/useClientFlow';

export default function OrdersScreen() {
  const { data, isLoading, error, refetch } = useTrackedOrders();

  if (error) {
    return (
      <View className="flex-1 bg-page p-4">
        <NoConnectionState title="Could not load orders" onRetry={() => void refetch()} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-page p-4">
      <Text className="text-[24px] font-extrabold text-dark">My Orders</Text>
      <Text className="mt-1 text-[13px] text-slate-500">Track live responses and final pharmacy confirmations.</Text>

      {isLoading ? (
        <View className="mt-4 rounded-2xl border border-[#D6E6EF] bg-white p-4">
          <Text className="text-[13px] text-slate-500">Loading orders...</Text>
        </View>
      ) : null}

      <FlatList
        className="mt-4"
        data={data ?? []}
        keyExtractor={(item) => String(item.orderId)}
        initialNumToRender={8}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews
        ItemSeparatorComponent={() => <View className="h-2" />}
        renderItem={({ item }) => (
          <Pressable
            className="rounded-2xl border border-[#D6E6EF] bg-white p-4"
            onPress={() =>
              router.push({
                pathname: '/search/results/[orderId]',
                params: {
                  orderId: String(item.orderId),
                  medicine: item.medicineName,
                },
              } as Href)
            }
          >
            <View className="flex-row items-center justify-between">
              <Text className="flex-1 text-[15px] font-extrabold text-dark">{item.medicineName}</Text>
              <StatusBadge status={item.status?.status ?? 'pending'} />
            </View>
            <Text className="mt-1 text-[12px] text-slate-500">Order #{item.orderId}</Text>
            <Text className="mt-1 text-[12px] text-slate-500">
              {item.status ? `${item.status.accepted_count} pharmacies responded` : 'Waiting for sync...'}
            </Text>
          </Pressable>
        )}
        ListEmptyComponent={
          !isLoading ? (
            <View className="rounded-2xl border border-[#D6E6EF] bg-white p-4">
              <Text className="text-[14px] font-bold text-dark">No orders yet</Text>
              <Text className="mt-1 text-[12px] text-slate-500">Start a medicine search to create your first order.</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}

function StatusBadge({ status }: { status: 'pending' | 'responded' | 'confirmed' | 'cancelled' }) {
  const tone =
    status === 'confirmed'
      ? 'bg-green-100 text-green-700'
      : status === 'responded'
        ? 'bg-blue-100 text-blue-700'
        : status === 'cancelled'
          ? 'bg-red-100 text-red-700'
          : 'bg-amber-100 text-amber-700';

  return (
    <View className={`rounded-full px-2 py-1 ${tone}`}>
      <Text className="text-[10px] font-bold uppercase">{status}</Text>
    </View>
  );
}
