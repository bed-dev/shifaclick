import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { pharmacistService } from '@/services/pharmacistService';

export function usePharmacistPendingOrders() {
  return useQuery({
    queryKey: ['pharmacist-pending-orders'],
    queryFn: pharmacistService.getPendingOrders,
    refetchInterval: 5_000,
  });
}

export function usePharmacistAcceptedOrders() {
  return useQuery({
    queryKey: ['pharmacist-accepted-orders'],
    queryFn: pharmacistService.getAcceptedOrders,
    refetchInterval: 8_000,
  });
}

export function useAcceptOrderMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: number) => pharmacistService.acceptOrder(orderId),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['pharmacist-pending-orders'] }),
        queryClient.invalidateQueries({ queryKey: ['pharmacist-accepted-orders'] }),
      ]);
    },
  });
}

export function useRefuseOrderMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: number) => pharmacistService.refuseOrder(orderId),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['pharmacist-pending-orders'] }),
        queryClient.invalidateQueries({ queryKey: ['pharmacist-accepted-orders'] }),
      ]);
    },
  });
}
