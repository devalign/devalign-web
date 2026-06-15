import { useQuery, useMutation } from '@tanstack/react-query';
import { listUserCVs, reanalyzeCV } from '@/lib/api';

export function useUserCVs() {
  return useQuery({
    queryKey: ['userCVs'],
    queryFn: listUserCVs,
    staleTime: 30 * 1000, // 30 seconds
    retry: 1,
  });
}

export function useReanalyzeCV() {
  return useMutation({
    mutationFn: (cvId: string) => reanalyzeCV(cvId),
  });
}
