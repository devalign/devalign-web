import { useQuery } from '@tanstack/react-query';
import { GraphData } from '@/app/(protected)/profile/_components/graph/knowledge-graph-visualization';
import { useCurrentUser } from '@/hooks/use-current-user';
import { apiClient } from '@/lib/api/api-client';

export function useKnowledgeGraph(clusterName?: string | null, enabled: boolean = true) {
  const { data: user } = useCurrentUser();

  return useQuery<GraphData, Error>({
    queryKey: ['knowledge-graph', user?.id, clusterName],
    queryFn: async () => {
      const endpoint = clusterName 
        ? `/market/skills-graph?cluster=${encodeURIComponent(clusterName)}`
        : `/market/skills-graph`;
      return apiClient<GraphData>(endpoint, { timeout: 30000 }); // 30s timeout para operaciones pesadas
    },
    enabled: enabled && !!user?.id,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });
}
