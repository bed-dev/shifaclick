import { delay } from '@/src/lib/delay';
import { mockStore } from '@/src/services/mockStore';
import type { ActivityItem } from '@/src/types/models';

export const activityService = {
  async getActivity(): Promise<ActivityItem[]> {
    await delay(400);
    return mockStore.getActivityItems();
  },
};
