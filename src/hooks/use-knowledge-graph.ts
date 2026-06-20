import { useQuery } from '@tanstack/react-query';
import { GraphData } from '@/components/profile/KnowledgeGraphVisualization';
import { useCurrentUser } from '@/hooks/use-current-user';

export function useKnowledgeGraph() {
  const { data: user } = useCurrentUser();

  return useQuery<GraphData, Error>({
    queryKey: ['knowledge-graph', user?.id],
    queryFn: async () => {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1';
      
      let token = null;
      try {
        const sessionStr = localStorage.getItem('sb-yqzntvvwxptzohwndqbx-auth-token');
        if (sessionStr) {
          const session = JSON.parse(sessionStr);
          token = session?.access_token;
        }
      } catch (e) {
        // ignore
      }

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/profile/skills-graph`, {
        headers,
      });

      if (!response.ok) {
        throw new Error('Failed to fetch knowledge graph');
      }

      return response.json();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });
}
