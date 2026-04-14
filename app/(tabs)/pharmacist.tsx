import { FlatList, Pressable, Text, View } from 'react-native';
import Toast from 'react-native-toast-message';

import { NoConnectionState } from '@/components/common/NoConnectionState';
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
      <View className="flex-1 bg-page p-4">
        <NoConnectionState onRetry={() => void pendingQuery.refetch()} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-page p-4">
      <Text className="text-[24px] font-extrabold text-dark">Pharmacist Dashboard</Text>
      <Text className="mt-1 text-[13px] text-slate-500">Live client requests and accepted queue.</Text>

      <View className="mt-3 flex-row gap-2">
        <View className="flex-1 rounded-2xl border border-[#D6E6EF] bg-white p-3">
          <Text className="text-[20px] font-extrabold text-dark">{pendingQuery.data?.length ?? 0}</Text>
          <Text className="text-[11px] font-semibold text-slate-500">Pending requests</Text>
        </View>
        <View className="flex-1 rounded-2xl border border-[#D6E6EF] bg-white p-3">
          <Text className="text-[20px] font-extrabold text-aqua">{acceptedQuery.data?.length ?? 0}</Text>
          <Text className="text-[11px] font-semibold text-slate-500">Accepted orders</Text>
        </View>
      </View>

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
            <View className="rounded-2xl border border-[#D6E6EF] bg-white p-4">
              <Text className="text-[14px] font-bold text-dark">No pending client orders</Text>
              <Text className="mt-1 text-[12px] text-slate-500">New requests will appear automatically.</Text>
            </View>
          ) : null
        }
      />
    </View>
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
    <View className="rounded-2xl border border-[#D6E6EF] bg-white p-4">
      <View className="flex-row items-center justify-between">
        <Text className="flex-1 text-[15px] font-extrabold text-dark">{item.medicine_name || 'Prescription request'}</Text>
        <View className="rounded-full bg-amber-100 px-2 py-1">
          <Text className="text-[10px] font-bold text-amber-700">{item.status}</Text>
        </View>
      </View>
      <Text className="mt-1 text-[12px] text-slate-500">{item.client_name} • {item.client_phone || 'No phone'}</Text>
      <Text className="mt-1 text-[12px] text-slate-500">Qty: {item.quantity || '—'} • {item.created_at}</Text>
      {item.notes ? <Text className="mt-1 text-[12px] text-slate-500">Note: {item.notes}</Text> : null}
      <View className="mt-3 flex-row gap-2">
        <Pressable
          className={`h-10 flex-1 items-center justify-center rounded-xl ${disabled ? 'bg-slate-300' : 'bg-green-600'}`}
          onPress={() => onAccept(item.id)}
          disabled={disabled}
        >
          <Text className="text-[12px] font-extrabold text-white">Accept</Text>
        </Pressable>
        <Pressable
          className={`h-10 flex-1 items-center justify-center rounded-xl ${disabled ? 'bg-slate-300' : 'bg-red-600'}`}
          onPress={() => onRefuse(item.id)}
          disabled={disabled}
        >
          <Text className="text-[12px] font-extrabold text-white">Refuse</Text>
        </Pressable>
      </View>
    </View>
  );
}
