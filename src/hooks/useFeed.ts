import { useCallback } from 'react';

import { useMockQuery } from '@/src/hooks/useMockQuery';
import { feedService } from '@/src/services/feedService';

export function useFeed() {
  const queryFn = useCallback(() => feedService.getFeed(), []);
  return useMockQuery({ queryFn });
}

export function useFeedDetails(itemId: string) {
  const queryFn = useCallback(() => feedService.getItemDetails(itemId), [itemId]);
  return useMockQuery({ queryFn, enabled: Boolean(itemId) });
}
