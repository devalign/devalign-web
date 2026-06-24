import { useQuery } from '@tanstack/react-query';
import { GraphData } from '@/components/profile/KnowledgeGraphVisualization';
import { useCurrentUser } from '@/hooks/use-current-user';
import { apiClient } from '@/lib/api/api-client';

export function useKnowledgeGraph() {
  const { data: user } = useCurrentUser();

  return useQuery<GraphData, Error>({
    queryKey: ['knowledge-graph', user?.id],
    queryFn: async () => {
      return apiClient<GraphData>('/profile/skills-graph');
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });
}
