import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserProfile, updateUserProfile, updateUserProfileSkills } from '@/lib/api';
import { UserProfileData, SkillItem } from '@/lib/api/types';

export function useUserProfile() {
  return useQuery({
    queryKey: ['userProfile'],
    queryFn: getUserProfile,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
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
