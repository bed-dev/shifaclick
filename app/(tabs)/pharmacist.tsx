import { FlatList, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import { NoConnectionState } from '@/components/common/NoConnectionState';
import { StatusBadge } from '@/components/common/StatusBadge';
import {
  useAcceptOrderMutation,
  usePharmacistAcceptedOrders,
  usePharmacistPendingOrders,
  useRefuseOrderMutation,
} from '@/hooks/usePharmacist';
import type { PendingOrder } from '@/types/pharmacist';

export default function PharmacistDashboardScreen() {
  const pendingQuery = usePharmacistPendingOrders();
  const acceptedQuery = usePharmacistAcceptedOrders();
  const acceptMutation = useAcceptOrderMutation();
  const refuseMutation = useRefuseOrderMutation();

  const handleAccept = async (orderId: number) => {
    try {
      await acceptMutation.mutateAsync(orderId);
      Toast.show({ type: 'success', text1: 'Order accepted' });
    } catch {
      Toast.show({ type: 'error', text1: 'Could not accept order' });
    }
  };

  const handleRefuse = async (orderId: number) => {
    try {
      await refuseMutation.mutateAsync(orderId);
      Toast.show({ type: 'success', text1: 'Order refused' });
    } catch {
      Toast.show({ type: 'error', text1: 'Could not refuse order' });
    }
  };

  if (pendingQuery.error) {
    return (
      <SafeAreaView className="flex-1 bg-page" edges={['top']}>
        <View className="flex-1 p-4">
          <NoConnectionState onRetry={() => void pendingQuery.refetch()} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-page" edges={['top']}>
      <View className="flex-1 p-4">
      {/* Header */}
      <Text className="text-[22px] font-extrabold leading-7 text-dark">Pharmacist Dashboard</Text>
      <Text className="mt-1 text-[12px] font-medium text-text-secondary">
        Live client requests and accepted queue.
      </Text>

      {/* KPI cards */}
      <View className="mt-3 flex-row gap-2">
        <View className="flex-1 rounded-2xl border border-border-default bg-card p-3">
          <Text className="text-[20px] font-extrabold text-dark">{pendingQuery.data?.length ?? 0}</Text>
          <Text className="text-[11px] font-semibold text-text-secondary">Pending requests</Text>
        </View>
        <View className="flex-1 rounded-2xl border border-border-brand bg-card p-3">
          <Text className="text-[20px] font-extrabold text-brand">{acceptedQuery.data?.length ?? 0}</Text>
          <Text className="text-[11px] font-semibold text-text-secondary">Accepted orders</Text>
        </View>
      </View>

      {/* Pending order list */}
      <FlatList
        className="mt-4"
        data={pendingQuery.data ?? []}
        keyExtractor={(item) => String(item.id)}
        initialNumToRender={8}
        maxToRenderPerBatch={10}
        windowSize={7}
        removeClippedSubviews
        ItemSeparatorComponent={() => <View className="h-2" />}
        renderItem={({ item }) => (
          <PendingOrderCard
            item={item}
            onAccept={handleAccept}
            onRefuse={handleRefuse}
            disabled={acceptMutation.isPending || refuseMutation.isPending}
          />
        )}
        ListEmptyComponent={
          !pendingQuery.isLoading ? (
            <View className="rounded-2xl border border-border-default bg-card p-4">
              <Text className="text-[13px] font-bold text-dark">No pending client orders</Text>
              <Text className="mt-1 text-[11px] font-medium text-text-secondary">
                New requests will appear automatically.
              </Text>
            </View>
          ) : null
        }
      />
      </View>
    </SafeAreaView>
  );
}

function PendingOrderCard({
  item,
  onAccept,
  onRefuse,
  disabled,
}: {
  item: PendingOrder;
  onAccept: (orderId: number) => void;
  onRefuse: (orderId: number) => void;
  disabled: boolean;
}) {
  return (
    <View className="rounded-2xl border border-border-default bg-card p-3">
      {/* Title + status badge */}
      <View className="flex-row items-center justify-between gap-2">
        <Text className="flex-1 text-[14px] font-bold text-dark" numberOfLines={1}>
          {item.medicine_name || 'Prescription request'}
        </Text>
        <StatusBadge label={item.status} status="warning" size="sm" />
      </View>

      {/* Meta */}
      <Text className="mt-1 text-[11px] font-medium text-text-secondary">
        {item.client_name}  {item.client_phone || 'No phone'}
      </Text>
      <Text className="mt-0.5 text-[11px] font-medium text-text-muted">
        Qty: {item.quantity || '\u2014'}  {item.created_at}
      </Text>
      {item.notes ? (
        <Text className="mt-0.5 text-[11px] font-medium text-text-muted" numberOfLines={2}>
          Note: {item.notes}
        </Text>
      ) : null}

      {/* Action buttons */}
      <View className="mt-3 flex-row gap-2">
        <Pressable
          className={`flex-1 flex-row items-center justify-center rounded-xl ${disabled ? 'bg-subtle' : 'bg-status-success'}`}
          onPress={() => onAccept(item.id)}
          disabled={disabled}
          style={{ minHeight: 44 }}
          accessibilityLabel={`Accept order for ${item.medicine_name}`}
        >
          <Ionicons name="checkmark-circle" size={15} color="#fff" style={{ marginRight: 4 }} />
          <Text className="text-[12px] font-bold text-white">Accept</Text>
        </Pressable>
        <Pressable
          className={`flex-1 flex-row items-center justify-center rounded-xl ${disabled ? 'bg-subtle' : 'bg-status-danger'}`}
          onPress={() => onRefuse(item.id)}
          disabled={disabled}
          style={{ minHeight: 44 }}
          accessibilityLabel={`Refuse order for ${item.medicine_name}`}
        >
          <Ionicons name="close-circle" size={15} color="#fff" style={{ marginRight: 4 }} />
          <Text className="text-[12px] font-bold text-white">Refuse</Text>
        </Pressable>
      </View>
    </View>
  );
}
