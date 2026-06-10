import { useQuery } from '@tanstack/react-query';
import { listUserCVs } from '@/lib/api';

export function useUserCVs() {
  return useQuery({
    queryKey: ['userCVs'],
    queryFn: listUserCVs,
    staleTime: 30 * 1000, // 30 seconds
    retry: 1,
  });
}
