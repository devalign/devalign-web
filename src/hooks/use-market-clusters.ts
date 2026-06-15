import { useQuery } from '@tanstack/react-query';
import { getMarketClusters } from '@/lib/api';

export function useMarketClusters() {
  return useQuery({
    queryKey: ['marketClusters'],
    queryFn: getMarketClusters,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
  });
}
