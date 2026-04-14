import { getStoredUser, setStoredUser } from '@/services/tokenStorage';
import type { UserProfile } from '@/types/models';

export type ProfileUpdatePayload = Pick<UserProfile, 'firstName' | 'lastName' | 'phone' | 'city'>;

export const profileService = {
  async getProfile(): Promise<UserProfile> {
    const stored = await getStoredUser();

    if (!stored) {
      throw new Error('No active session found.');
    }

    return JSON.parse(stored) as UserProfile;
  },

  async updateProfile(payload: ProfileUpdatePayload): Promise<UserProfile> {
    const stored = await getStoredUser();

    if (!stored) {
      throw new Error('No active session found.');
    }

    const current = JSON.parse(stored) as UserProfile;

    const updated: UserProfile = {
      ...current,
      ...payload,
    };

    await setStoredUser(JSON.stringify(updated));
    return updated;
  },
};
