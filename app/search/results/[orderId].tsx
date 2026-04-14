import { FlatList, Pressable, Text, View } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import type { Href } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { NoConnectionState } from '@/components/common/NoConnectionState';
import { StatusBadge } from '@/components/common/StatusBadge';
import { useOrderStatus } from '@/hooks/useClientFlow';
import { isNetworkError } from '@/services/http';

export default function PharmacyListScreen() {
  const params = useLocalSearchParams<{ orderId: string; medicine?: string }>();
  const orderId = Number(params.orderId);
  const { data, isLoading, error, refetch } = useOrderStatus(orderId, true);

  if (error && isNetworkError(error)) {
    return (
      <View className="flex-1 bg-page p-4">
        <NoConnectionState onRetry={() => void refetch()} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-page p-4">
      <Text className="text-[22px] font-extrabold leading-7 text-dark">Searching pharmacies...</Text>
      <Text className="mt-1 text-[12px] font-medium text-text-secondary">
        {params.medicine || 'Prescription'}{data ? ` \u2022 ${data.accepted_count} responses` : ''}
      </Text>

      {isLoading ? (
        <View className="mt-4 rounded-2xl border border-border-default bg-card p-4">
          <Text className="text-[12px] font-medium text-text-secondary">Contacting nearby pharmacists...</Text>
        </View>
      ) : null}

      {!isLoading && !data?.accepted_count ? (
        <View className="mt-4 rounded-2xl border border-border-default bg-card p-4">
          <Text className="text-[13px] font-bold text-dark">No response yet</Text>
          <Text className="mt-1 text-[11px] font-medium text-text-secondary">We keep polling every 3 seconds.</Text>
        </View>
      ) : null}

      <FlatList
        className="mt-4"
        data={data?.accepted ?? []}
        keyExtractor={(item) => String(item.id)}
        initialNumToRender={8}
        maxToRenderPerBatch={10}
        windowSize={7}
        removeClippedSubviews
        ItemSeparatorComponent={() => <View className="h-2" />}
        renderItem={({ item }) => (
          <Pressable
            className="rounded-2xl border border-border-default bg-card p-3"
            onPress={() =>
              router.push({
                pathname: '/search/confirm/[orderId]',
                params: {
                  orderId: String(orderId),
                  pharmacistId: String(item.id),
                  pharmacy: item.pharmacy,
                  name: item.name,
                  address: item.address,
                  phone: item.phone,
                  medicine: params.medicine ?? 'Prescription',
                },
              } as Href)
            }
            style={{ minHeight: 44 }}
          >
            <View className="flex-row items-center justify-between gap-2">
              <View className="flex-1">
                <Text className="text-[14px] font-bold text-dark">{item.pharmacy}</Text>
                <Text className="mt-0.5 text-[11px] font-medium text-text-secondary">{item.name}</Text>
              </View>
              <StatusBadge label="Has stock" status="success" size="sm" />
            </View>
            <View className="mt-2 flex-row items-center">
              <Ionicons name="call-outline" size={13} color="#64748B" />
              <Text className="ml-1 text-[11px] font-medium text-text-secondary">{item.phone || 'No phone provided'}</Text>
            </View>
            <View className="mt-1 flex-row items-center">
              <Ionicons name="location-outline" size={13} color="#64748B" />
              <Text className="ml-1 text-[11px] font-medium text-text-secondary">{item.address || 'Address unavailable'}</Text>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}
