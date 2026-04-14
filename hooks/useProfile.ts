import { useCallback, useState } from 'react';

import { useAuth } from '@/context/AuthContext';
import { useMockQuery } from '@/hooks/useMockQuery';
import { profileService } from '@/services/profileService';
import type { ProfileUpdatePayload } from '@/services/profileService';

export function useProfile() {
  const { isAuthenticated, updateCurrentUser } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const queryFn = useCallback(() => profileService.getProfile(), []);
  const query = useMockQuery({ queryFn, enabled: isAuthenticated });

  const saveProfile = useCallback(
    async (payload: ProfileUpdatePayload) => {
      setIsSaving(true);
      setSaveError(null);

      try {
        const nextProfile = await profileService.updateProfile(payload);
        updateCurrentUser(nextProfile);
        query.refetch();
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to update profile.';
        setSaveError(message);
      } finally {
        setIsSaving(false);
      }
    },
    [query, updateCurrentUser]
  );

  return {
    ...query,
    isSaving,
    saveError,
    saveProfile,
  };
}
