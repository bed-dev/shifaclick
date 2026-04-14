import { useCallback } from 'react';

import { useMockQuery } from '@/hooks/useMockQuery';
import { activityService } from '@/services/activityService';

export function useActivity() {
  const queryFn = useCallback(() => activityService.getActivity(), []);
  return useMockQuery({ queryFn });
}
