'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUserProfile } from '@/hooks/use-user-profile';
import { useUserCVs } from '@/hooks/use-user-cvs';
import { useCVAnalysis } from '@/contexts/cv-analysis-context';
import { HeaderBar } from '@/components/layout/header-bar';

export function GlobalHeader() {
  const { data: profile } = useUserProfile();
  const { data: cvData } = useUserCVs();
  const { isAnalyzing, isAnalysisReady } = useCVAnalysis();
  const router = useRouter();
  const searchParams = useSearchParams();
  const clusterParam = searchParams.get('cluster');

  // Fallback affinities
  const allAffinities = React.useMemo(() => {
    let list = [];
    if (profile?.all_affinities && profile.all_affinities.length > 0) {
      list = [...profile.all_affinities].sort((a, b) => b.affinity_score - a.affinity_score);
    } else {
      list = [
        {
          cluster_id: '1',
          cluster_name: 'Backend Java',
          affinity_score: 0.78,
          is_primary: true,
          market_insights: {
            average_salary_pen: 8500,
            salary_differential_percentage: 32,
            market_share_percentage: 23,
            total_demand: 145,
            growth_percentage: 28,
          },
          compatible_roles: [
            { title: 'Backend Java Developer', match: 'Alta' as const },
            { title: 'Java Cloud Engineer', match: 'Alta' as const },
            { title: 'Backend Microservices Developer', match: 'Media' as const },
          ],
        },
        {
          cluster_id: '2',
          cluster_name: 'DevOps Cloud',
          affinity_score: 0.63,
          is_primary: false,
          market_insights: {
            average_salary_pen: 9500,
            salary_differential_percentage: 42,
            market_share_percentage: 20,
            total_demand: 125,
            growth_percentage: 35,
          },
          compatible_roles: [
            { title: 'DevOps Engineer', match: 'Alta' as const },
            { title: 'Cloud Architect', match: 'Media' as const },
            { title: 'Site Reliability Engineer (SRE)', match: 'Alta' as const },
          ],
        },
        {
          cluster_id: '3',
          cluster_name: 'Data Engineering',
          affinity_score: 0.41,
          is_primary: false,
          market_insights: {
            average_salary_pen: 9000,
            salary_differential_percentage: 38,
            market_share_percentage: 24,
            total_demand: 148,
            growth_percentage: 31,
          },
          compatible_roles: [
            { title: 'Data Engineer', match: 'Alta' as const },
            { title: 'Big Data Developer', match: 'Alta' as const },
            { title: 'Analytics Engineer', match: 'Media' as const },
          ],
        },
      ];
    }
    return list.slice(0, 3);
  }, [profile]);

  const activeClusterIndex = React.useMemo(() => {
    if (allAffinities && allAffinities.length > 0) {
      if (clusterParam) {
        const idx = allAffinities.findIndex(
          (a) => a.cluster_name.toLowerCase() === clusterParam.toLowerCase(),
        );
        if (idx !== -1) {
          return idx;
        }
      }
      const primaryIdx = allAffinities.findIndex((a) => a.is_primary);
      if (primaryIdx !== -1) {
        return primaryIdx;
      }
    }
    return 0;
  }, [allAffinities, clusterParam]);

  const activeCluster = allAffinities[activeClusterIndex] || allAffinities[0];

  const handleSelectCluster = (name: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('cluster', name);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const currentCV = cvData?.cvs?.[0];
  const formattedDate = currentCV?.uploaded_at
    ? new Date(currentCV.uploaded_at).toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : 'Recientemente';

  return (
    <HeaderBar
      clusters={allAffinities}
      activeCluster={activeCluster}
      onSelectCluster={handleSelectCluster}
      isAnalyzing={isAnalyzing}
      isAnalysisReady={isAnalysisReady}
      lastAnalysisDate={formattedDate}
    />
  );
}
