import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { clientFlowService } from '@/services/clientFlowService';
import { addTrackedOrder, getTrackedOrders } from '@/services/orderTracker';
import type { CreateOrderPayload } from '@/types/clientFlow';

export function useMedicineSuggestions(query: string) {
  return useQuery({
    queryKey: ['medicine-suggestions', query],
    queryFn: () => clientFlowService.searchSuggestions(query),
    enabled: query.trim().length >= 2,
    staleTime: 45_000,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateOrderPayload) => clientFlowService.createOrder(payload),
    onSuccess: async (result, payload) => {
      if (result?.order_id) {
        await addTrackedOrder({
          orderId: result.order_id,
          medicineName: payload.medicineName?.trim() || 'Prescription upload',
          quantity: payload.quantity,
          createdAt: new Date().toISOString(),
        });
      }

      await queryClient.invalidateQueries({ queryKey: ['tracked-orders'] });
    },
  });
}

export function useOrderStatus(orderId: number | null, polling = true) {
  return useQuery({
    queryKey: ['order-status', orderId],
    queryFn: () => clientFlowService.getOrderStatus(Number(orderId)),
    enabled: Boolean(orderId),
    refetchInterval: polling ? 3_000 : false,
  });
}

export function useConfirmPharmacist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, pharmacistId }: { orderId: number; pharmacistId: number }) =>
      clientFlowService.confirmPharmacist(orderId, pharmacistId),
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({ queryKey: ['order-status', variables.orderId] });
      await queryClient.invalidateQueries({ queryKey: ['tracked-orders'] });
    },
  });
}

export function useTrackedOrders() {
  return useQuery({
    queryKey: ['tracked-orders'],
    queryFn: async () => {
      const tracked = await getTrackedOrders();

      const statuses = await Promise.all(
        tracked.map(async (order) => {
          try {
            const status = await clientFlowService.getOrderStatus(order.orderId);
            return {
              ...order,
              status,
            };
          } catch {
            return {
              ...order,
              status: null,
            };
          }
        })
      );

      return statuses;
    },
  });
}
