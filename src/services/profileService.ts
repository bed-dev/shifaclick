import { delay } from '@/src/lib/delay';
import { mockStore } from '@/src/services/mockStore';
import type { UserProfile } from '@/src/types/models';

export type ProfileUpdatePayload = Pick<UserProfile, 'firstName' | 'lastName' | 'phone' | 'city'>;

export const profileService = {
  async getProfile(): Promise<UserProfile> {
    await delay(350);
    return mockStore.getCurrentUser();
  },

  async updateProfile(payload: ProfileUpdatePayload): Promise<UserProfile> {
    await delay(500);
    const current = mockStore.getCurrentUser();

    const updated: UserProfile = {
      ...current,
      ...payload,
    };

    mockStore.setCurrentUser(updated);
    return updated;
  },
};
