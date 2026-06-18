import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { listUserCVs, reanalyzeCV, deleteCV } from '@/lib/api';

export function useUserCVs() {
  return useQuery({
    queryKey: ['userCVs'],
    queryFn: listUserCVs,
    staleTime: 30 * 1000, // 30 seconds
    retry: 1,
  });
}

export function useReanalyzeCV() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (cvId: string) => reanalyzeCV(cvId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    },
  });
}

export function useDeleteCV() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (cvId: string) => deleteCV(cvId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userCVs'] });
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    },
  });
}
