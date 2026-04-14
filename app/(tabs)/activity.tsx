import { FlatList, Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import type { Href } from 'expo-router';

import { NoConnectionState } from '@/components/common/NoConnectionState';
import { StatusBadge } from '@/components/common/StatusBadge';
import { useTrackedOrders } from '@/hooks/useClientFlow';

type OrderStatus = 'pending' | 'responded' | 'confirmed' | 'cancelled';

const statusMap: Record<OrderStatus, { label: string; tone: 'warning' | 'info' | 'success' | 'danger' }> = {
  pending: { label: 'Pending', tone: 'warning' },
  responded: { label: 'Responded', tone: 'info' },
  confirmed: { label: 'Confirmed', tone: 'success' },
  cancelled: { label: 'Cancelled', tone: 'danger' },
};

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
      <Text className="text-[22px] font-extrabold leading-7 text-dark">My Orders</Text>
      <Text className="mt-1 text-[12px] font-medium text-text-secondary">
        Track live responses and final pharmacy confirmations.
      </Text>

      {isLoading ? (
        <View className="mt-4 rounded-2xl border border-border-default bg-card p-4">
          <Text className="text-[12px] font-medium text-text-secondary">Loading orders...</Text>
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
        renderItem={({ item }) => {
          const raw = (item.status?.status ?? 'pending') as OrderStatus;
          const mapped = statusMap[raw] ?? statusMap.pending;

          return (
            <Pressable
              className="rounded-2xl border border-border-default bg-card p-3"
              onPress={() =>
                router.push({
                  pathname: '/search/results/[orderId]',
                  params: {
                    orderId: String(item.orderId),
                    medicine: item.medicineName,
                  },
                } as Href)
              }
              style={{ minHeight: 44 }}
            >
              <View className="flex-row items-center justify-between gap-2">
                <Text className="flex-1 text-[14px] font-bold text-dark" numberOfLines={1}>
                  {item.medicineName}
                </Text>
                <StatusBadge label={mapped.label} status={mapped.tone} size="sm" />
              </View>
              <Text className="mt-1 text-[11px] font-medium text-text-muted">Order #{item.orderId}</Text>
              <Text className="mt-0.5 text-[11px] font-medium text-text-secondary">
                {item.status ? `${item.status.accepted_count} pharmacies responded` : 'Waiting for sync...'}
              </Text>
            </Pressable>
          );
        }}
        ListEmptyComponent={
          !isLoading ? (
            <View className="rounded-2xl border border-border-default bg-card p-4">
              <Text className="text-[13px] font-bold text-dark">No orders yet</Text>
              <Text className="mt-1 text-[11px] font-medium text-text-secondary">
                Start a medicine search to create your first order.
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}
