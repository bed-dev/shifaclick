import { useCallback } from 'react';

import { useMockQuery } from '@/src/hooks/useMockQuery';
import { activityService } from '@/src/services/activityService';

export function useActivity() {
  const queryFn = useCallback(() => activityService.getActivity(), []);
  return useMockQuery({ queryFn });
}
