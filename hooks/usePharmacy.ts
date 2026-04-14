import { useCallback } from 'react';

import { useMockQuery } from '@/hooks/useMockQuery';
import { pharmacyService } from '@/services/pharmacyService';
import type { SearchFilters } from '@/types/pharmacy';

export function useDrugSearch(query: string, filters: Partial<SearchFilters>) {
  const queryFn = useCallback(() => pharmacyService.searchDrugs(query, filters), [filters, query]);
  return useMockQuery({ queryFn });
}

export function useDrugDetails(drugId: string) {
  const queryFn = useCallback(() => pharmacyService.getDrugDetails(drugId), [drugId]);
  return useMockQuery({ queryFn, enabled: Boolean(drugId) });
}

export function usePatientRequests() {
  const queryFn = useCallback(() => pharmacyService.getPatientRequests(), []);
  return useMockQuery({ queryFn });
}

export function useNotificationCenter() {
  const queryFn = useCallback(() => pharmacyService.getNotifications(), []);
  return useMockQuery({ queryFn });
}

export function useHighDemandRequests() {
  const queryFn = useCallback(() => pharmacyService.getHighDemandRequests(), []);
  return useMockQuery({ queryFn });
}

export function useDistributorKpis() {
  const queryFn = useCallback(() => pharmacyService.getDistributorKpis(), []);
  return useMockQuery({ queryFn });
}

export function useDistributorOrders() {
  const queryFn = useCallback(() => pharmacyService.getDistributorOrders(), []);
  return useMockQuery({ queryFn });
}

export function useDispatchItems() {
  const queryFn = useCallback(() => pharmacyService.getDispatchItems(), []);
  return useMockQuery({ queryFn });
}
