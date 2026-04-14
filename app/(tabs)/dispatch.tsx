import { FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import { NoConnectionState } from '@/components/common/NoConnectionState';
import {
  useDistributorAcceptedRequests,
  useDistributorHistory,
  useMarkDeliveredMutation,
} from '@/hooks/useDistributor';
import type { SupplyRequest } from '@/types/distributor';

export default function DispatchScreen() {
  const acceptedQuery = useDistributorAcceptedRequests();
  const historyQuery = useDistributorHistory();
  const deliverMutation = useMarkDeliveredMutation();

  const handleDeliver = async (supplyId: number) => {
    try {
      await deliverMutation.mutateAsync(supplyId);
      Toast.show({ type: 'success', text1: 'Marked as delivered' });
    } catch {
      Toast.show({ type: 'error', text1: 'Could not mark delivered' });
    }
  };

  if (acceptedQuery.error && historyQuery.error) {
    return (
      <SafeAreaView className="flex-1 bg-page" edges={['top']}>
        <View className="flex-1 p-4">
          <NoConnectionState onRetry={() => {
            void acceptedQuery.refetch();
            void historyQuery.refetch();
          }} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-page" edges={['top']}>
      <View className="flex-1 p-4">
      <Text className="text-[24px] font-extrabold text-dark">Dispatch & History</Text>
      <Text className="mt-1 text-[13px] text-slate-500">Finalize accepted orders and track delivered history.</Text>

      <Text className="mt-4 text-[13px] font-extrabold text-dark">Accepted (awaiting delivery)</Text>
      <FlatList
        className="mt-2"
        data={acceptedQuery.data ?? []}
        keyExtractor={(item) => String(item.id)}
        initialNumToRender={6}
        maxToRenderPerBatch={8}
        windowSize={6}
        removeClippedSubviews
        ItemSeparatorComponent={() => <View className="h-2" />}
        renderItem={({ item }) => (
          <AcceptedCard item={item} onDeliver={handleDeliver} disabled={deliverMutation.isPending} />
        )}
        ListEmptyComponent={
          !acceptedQuery.isLoading ? (
            <View className="rounded-2xl border border-[#D6E6EF] bg-white p-4">
              <Text className="text-[12px] text-slate-500">No accepted orders currently.</Text>
            </View>
          ) : null
        }
      />

      <Text className="mt-4 text-[13px] font-extrabold text-dark">Recent history</Text>
      <FlatList
        className="mt-2"
        data={(historyQuery.data ?? []).slice(0, 8)}
        keyExtractor={(item) => `history-${item.id}`}
        initialNumToRender={6}
        maxToRenderPerBatch={8}
        windowSize={6}
        removeClippedSubviews
        ItemSeparatorComponent={() => <View className="h-2" />}
        renderItem={({ item }) => <HistoryCard item={item} />}
      />
      </View>
    </SafeAreaView>
  );
}

function AcceptedCard({
  item,
  onDeliver,
  disabled,
}: {
  item: SupplyRequest;
  onDeliver: (supplyId: number) => void;
  disabled: boolean;
}) {
  return (
    <View className="rounded-2xl border border-[#D6E6EF] bg-white p-4">
      <Text className="text-[15px] font-extrabold text-dark">{item.pharmacy_name}</Text>
      <Text className="mt-1 text-[12px] text-slate-500">{item.item_count} items • {item.created_at}</Text>
      <Pressable
        className={`mt-3 h-10 items-center justify-center rounded-xl ${disabled ? 'bg-slate-300' : 'bg-aqua'}`}
        onPress={() => onDeliver(item.id)}
        disabled={disabled}
      >
        <Text className="text-[12px] font-extrabold text-white">Mark Delivered</Text>
      </Pressable>
    </View>
  );
}

function HistoryCard({ item }: { item: SupplyRequest }) {
  return (
    <View className="rounded-2xl border border-[#D6E6EF] bg-white p-4">
      <View className="flex-row items-center justify-between">
        <Text className="text-[14px] font-bold text-dark">{item.pharmacy_name}</Text>
        <View className="rounded-full bg-[#F1F5F9] px-2 py-1">
          <Text className="text-[10px] font-bold text-slate-600 uppercase">{item.status}</Text>
        </View>
      </View>
      <Text className="mt-1 text-[12px] text-slate-500">{item.created_at}</Text>
    </View>
  );
}
