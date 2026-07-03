import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserProfile, updateUserProfile, updateUserProfileSkills, resetAccount, deleteAccount } from '@/lib/api';
import { UserProfileData, SkillItem } from '@/lib/api/types';

export function useUserProfile() {
  return useQuery({
    queryKey: ['userProfile'],
    queryFn: getUserProfile,
    staleTime: 5 * 60 * 1000,
    retry: 1,
    // Poll every 3s while profile exists but diagnosis hasn't completed yet.
    // Stops polling once is_diagnosed becomes true.
    refetchInterval: (query) =>
      query.state.data?.is_diagnosed === false ? 3000 : false,
  });
}

export function useUpdateUserProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<UserProfileData>) => updateUserProfile(data),
    onSuccess: (updatedProfile) => {
      // Direct cache updates for maximum responsiveness, plus invalidation to ensure sync
      queryClient.setQueryData(['userProfile'], updatedProfile);
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    },
  });
}

export function useUpdateUserSkills() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (skills: SkillItem[]) => updateUserProfileSkills(skills),
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(['userProfile'], updatedProfile);
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    },
  });
}

export function useResetAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: resetAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      queryClient.invalidateQueries({ queryKey: ['userCVs'] });
    },
    onSettled: () => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('devalign_cv_analysis_state');
      }
    },
  });
}

export function useDeleteAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => {
      queryClient.clear();
      if (typeof window !== 'undefined') {
        localStorage.clear();
      }
    },
  });
}

