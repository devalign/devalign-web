import { useQuery } from '@tanstack/react-query';
import { useCurrentUser } from './use-current-user';
import { apiClient } from '@/lib/api/api-client';
import { MarketInsights, CompatibleRoleItem } from '@/lib/api/types';

export interface DiagnosticDetail {
  user_id: string;
  full_name: string | null;
  current_job_role: string | null;
  seniority: string;
  last_analysis_date: string | null;
  cluster_name: string;
  affinity_score: number;
  job_offer_count: number;
  top_skills: string[];
  market_insights: MarketInsights | null;
  compatible_roles: CompatibleRoleItem[] | null;
  ai_insight: string | null;
  detected_skills: any[];
  skill_gaps: any[];
  domain_affinities: any[];
  total_profile_skills: number;
}

export function useClusterDiagnostic(clusterName: string | null) {
  const { data: user } = useCurrentUser();

  return useQuery<DiagnosticDetail, Error>({
    queryKey: ['clusterDiagnostic', user?.id, clusterName],
    queryFn: async () => {
      if (!clusterName) throw new Error('Cluster name is required');
      return apiClient<DiagnosticDetail>(`/me/diagnostics/${encodeURIComponent(clusterName)}`);
    },
    enabled: !!user?.id && !!clusterName,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
}
