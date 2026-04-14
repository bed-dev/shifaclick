import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useAuth } from '@/context/AuthContext';
import { profileService } from '@/services/profileService';
import type { ProfileUpdatePayload } from '@/services/profileService';

export function useProfile() {
  const { isAuthenticated, updateCurrentUser } = useAuth();
  const queryClient = useQueryClient();
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const query = useQuery({
    queryKey: ['profile'],
    queryFn: profileService.getProfile,
    enabled: isAuthenticated,
  });

  const saveMutation = useMutation({
    mutationFn: (payload: ProfileUpdatePayload) => profileService.updateProfile(payload),
    onSuccess: async (nextProfile) => {
      updateCurrentUser(nextProfile);
      await queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });

  const saveProfile = async (payload: ProfileUpdatePayload) => {
    setIsSaving(true);
    setSaveError(null);

    try {
      await saveMutation.mutateAsync(payload);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update profile.';
      setSaveError(message);
    } finally {
      setIsSaving(false);
    }
  };

  return {
    data: query.data ?? null,
    isLoading: query.isLoading,
    error: query.error ? (query.error instanceof Error ? query.error.message : 'Failed to load profile.') : null,
    refetch: query.refetch,
    isSaving,
    saveError,
    saveProfile,
  };
}
