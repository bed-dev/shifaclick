import { delay } from '@/lib/delay';
import { mockStore } from '@/services/mockStore';
import type { ActivityItem } from '@/types/models';

export const activityService = {
  async getActivity(): Promise<ActivityItem[]> {
    await delay(400);
    return mockStore.getActivityItems();
  },
};
