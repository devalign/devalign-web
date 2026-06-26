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
  const { isAnalyzing } = useCVAnalysis();
  const router = useRouter();
  const searchParams = useSearchParams();
  const clusterParam = searchParams.get('cluster');

  const allAffinities = React.useMemo(() => {
    if (profile?.all_affinities && profile.all_affinities.length > 0) {
      return [...profile.all_affinities]
        .sort((a, b) => b.affinity_score - a.affinity_score)
        .slice(0, 3);
    }
    return [];
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
      lastAnalysisDate={formattedDate}
    />
  );
}
