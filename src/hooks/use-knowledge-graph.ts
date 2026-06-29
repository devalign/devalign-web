import { useQuery } from '@tanstack/react-query';
import { GraphData } from '@/components/profile/KnowledgeGraphVisualization';
import { useCurrentUser } from '@/hooks/use-current-user';
import { apiClient } from '@/lib/api/api-client';

export function useKnowledgeGraph(clusterName?: string | null) {
  const { data: user } = useCurrentUser();

  return useQuery<GraphData, Error>({
    queryKey: ['knowledge-graph', user?.id, clusterName],
    queryFn: async () => {
      const endpoint = clusterName 
        ? `/profile/skills-graph?cluster=${encodeURIComponent(clusterName)}`
        : `/profile/skills-graph`;
      return apiClient<GraphData>(endpoint);
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });
}
