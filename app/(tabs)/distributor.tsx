import { FlatList, Pressable, Text, View } from 'react-native';
import Toast from 'react-native-toast-message';

import { NoConnectionState } from '@/components/common/NoConnectionState';
import {
  useAcceptSupplyMutation,
  useDistributorPendingRequests,
  useDistributorStats,
  useRefuseSupplyMutation,
} from '@/hooks/useDistributor';
import type { SupplyRequest } from '@/types/distributor';

export default function DistributorDashboardScreen() {
  const statsQuery = useDistributorStats();
  const pendingQuery = useDistributorPendingRequests();
  const acceptMutation = useAcceptSupplyMutation();
  const refuseMutation = useRefuseSupplyMutation();

  const handleAccept = async (supplyId: number) => {
    try {
      await acceptMutation.mutateAsync(supplyId);
      Toast.show({ type: 'success', text1: 'Supply accepted' });
    } catch {
      Toast.show({ type: 'error', text1: 'Could not accept request' });
    }
  };

  const handleRefuse = async (supplyId: number) => {
    try {
      await refuseMutation.mutateAsync(supplyId);
      Toast.show({ type: 'success', text1: 'Supply refused' });
    } catch {
      Toast.show({ type: 'error', text1: 'Could not refuse request' });
    }
  };

  if (pendingQuery.error && statsQuery.error) {
    return (
      <View className="flex-1 bg-page p-4">
        <NoConnectionState onRetry={() => {
          void pendingQuery.refetch();
          void statsQuery.refetch();
        }} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-page p-4">
      <Text className="text-[24px] font-extrabold text-dark">Distributor Dashboard</Text>
      <Text className="mt-1 text-[13px] text-slate-500">Live supply requests from partner pharmacies.</Text>

      <View className="mt-3 flex-row flex-wrap gap-2">
        <KpiCard label="Pending" value={String(statsQuery.data?.pending ?? 0)} tone="text-amber-600" />
        <KpiCard label="Accepted" value={String(statsQuery.data?.accepted ?? 0)} tone="text-blue-600" />
        <KpiCard label="Delivered" value={String(statsQuery.data?.delivered ?? 0)} tone="text-green-600" />
        <KpiCard label="Total" value={String(statsQuery.data?.total ?? 0)} tone="text-dark" />
      </View>

      {pendingQuery.isLoading ? (
        <View className="mt-4 rounded-2xl border border-[#D6E6EF] bg-white p-4">
          <Text className="text-[13px] text-slate-500">Loading pending requests...</Text>
        </View>
      ) : null}

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
          <PendingSupplyCard
            item={item}
            onAccept={handleAccept}
            onRefuse={handleRefuse}
            disabled={acceptMutation.isPending || refuseMutation.isPending}
          />
        )}
        ListEmptyComponent={
          !pendingQuery.isLoading ? (
            <View className="rounded-2xl border border-[#D6E6EF] bg-white p-4">
              <Text className="text-[14px] font-bold text-dark">No pending requests</Text>
              <Text className="mt-1 text-[12px] text-slate-500">New pharmacy supply requests will appear here.</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}

function KpiCard({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <View className="w-[48%] rounded-2xl border border-[#D6E6EF] bg-white px-3 py-3">
      <Text className={`text-[20px] font-extrabold ${tone}`}>{value}</Text>
      <Text className="text-[11px] font-semibold text-slate-500">{label}</Text>
    </View>
  );
}

function PendingSupplyCard({
  item,
  onAccept,
  onRefuse,
  disabled,
}: {
  item: SupplyRequest;
  onAccept: (supplyId: number) => void;
  onRefuse: (supplyId: number) => void;
  disabled: boolean;
}) {
  return (
    <View className="rounded-2xl border border-[#D6E6EF] bg-white p-4">
      <View className="flex-row items-center justify-between">
        <Text className="flex-1 text-[15px] font-extrabold text-dark">{item.pharmacy_name}</Text>
        <View className={`rounded-full px-2 py-1 ${item.priority === 'urgent' ? 'bg-red-100' : 'bg-slate-100'}`}>
          <Text className={`text-[10px] font-bold uppercase ${item.priority === 'urgent' ? 'text-red-700' : 'text-slate-600'}`}>
            {item.priority}
          </Text>
        </View>
      </View>

      <Text className="mt-1 text-[12px] text-slate-500">{item.created_at}</Text>

      <View className="mt-2 flex-row flex-wrap gap-1">
        {item.items.map((med) => (
          <View key={`${item.id}-${med.name}-${med.qty}`} className="rounded-full bg-[#F7F8FA] px-2 py-1">
            <Text className="text-[10px] font-semibold text-slate-600">{med.name} x{med.qty}</Text>
          </View>
        ))}
      </View>

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
