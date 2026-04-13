import { useCallback } from 'react';

import { useMockQuery } from '@/src/hooks/useMockQuery';
import { pharmacyService } from '@/src/services/pharmacyService';
import type { SearchFilters } from '@/src/types/pharmacy';

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
