import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { distributorService } from '@/services/distributorService';

export function useDistributorStats() {
  return useQuery({
    queryKey: ['distributor-stats'],
    queryFn: distributorService.getStats,
    refetchInterval: 8_000,
  });
}

export function useDistributorPendingRequests() {
  return useQuery({
    queryKey: ['distributor-pending'],
    queryFn: distributorService.getPending,
    refetchInterval: 6_000,
  });
}

export function useDistributorAcceptedRequests() {
  return useQuery({
    queryKey: ['distributor-accepted'],
    queryFn: distributorService.getAccepted,
    refetchInterval: 8_000,
  });
}

export function useDistributorHistory() {
  return useQuery({
    queryKey: ['distributor-history'],
    queryFn: distributorService.getHistory,
  });
}

export function useAcceptSupplyMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (supplyId: number) => distributorService.acceptSupply(supplyId),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['distributor-pending'] }),
        queryClient.invalidateQueries({ queryKey: ['distributor-accepted'] }),
        queryClient.invalidateQueries({ queryKey: ['distributor-stats'] }),
      ]);
    },
  });
}

export function useRefuseSupplyMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (supplyId: number) => distributorService.refuseSupply(supplyId),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['distributor-pending'] }),
        queryClient.invalidateQueries({ queryKey: ['distributor-stats'] }),
      ]);
    },
  });
}

export function useMarkDeliveredMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (supplyId: number) => distributorService.markDelivered(supplyId),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['distributor-accepted'] }),
        queryClient.invalidateQueries({ queryKey: ['distributor-history'] }),
        queryClient.invalidateQueries({ queryKey: ['distributor-stats'] }),
      ]);
    },
  });
}
