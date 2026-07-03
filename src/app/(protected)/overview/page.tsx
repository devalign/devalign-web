'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Network, Cpu, Layers, Info, X, Sparkles } from 'lucide-react';
import { LoadingScreen } from '@/components/shared/loading-screen';
import { ErrorFallback } from '@/components/shared/error-fallback';
import { CVUpdateBanner } from '@/components/shared/cv-update-banner';
import { EmptyProfileBanner } from '@/components/shared/empty-profile-banner';
import { useUserProfileSelector } from '@/hooks/use-user-profile-selector';
import { useCVAnalysis } from '@/contexts/cv-analysis-context';
import { useKnowledgeGraph } from '@/hooks/use-knowledge-graph';
import { useSidebar } from '@/components/layout/sidebar-context';

// Local Components
import { OverviewSideDrawer, FilterMode } from './_components/overview-side-drawer';
import { KnowledgeGraphVisualization, GraphNode } from '../profile/_components/graph/knowledge-graph-visualization';
import { NodeDetailCard } from './_components/node-detail-card';

// UI components
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function OverviewPage() {
  const { data: profile, isLoading, error } = useUserProfileSelector();
  const { isAnalyzing } = useCVAnalysis();
  const router = useRouter();
  const searchParams = useSearchParams();
  const clusterParam = searchParams.get('cluster');

  const { data: graphData, isLoading: isGraphLoading, error: graphError } = useKnowledgeGraph(
    clusterParam || profile?.primary_specialty,
    !!(clusterParam || profile?.primary_specialty)
  );

  // Node selection & view states
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [highlightMode, setHighlightMode] = useState<FilterMode>('all');
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);

  if (isLoading) {
    return <LoadingScreen message="Cargando Overview..." minHeight="min-h-[calc(100vh-1rem)]" />;
  }

  if (error || !profile) {
    return (
      <ErrorFallback
        error={error || new Error('No se pudo cargar el perfil del usuario')}
        onRetry={() => window.location.reload()}
        onHome={() => router.push('/')}
        fullPage
      />
    );
  }

  const hasProfileData = !!(profile.cv_id || (profile.detected_skills && profile.detected_skills.length > 0));

  const allAffinities = profile.all_affinities || [];
  const activeCluster = allAffinities.find(
    (a) => clusterParam ? a.cluster_name.toLowerCase() === clusterParam.toLowerCase() : a.is_primary
  ) || allAffinities[0] || null;

  const activeScore = activeCluster ? Math.round(activeCluster.affinity_score * 100) : profile.alignment_score;

  return (
    <div className="relative w-full h-screen bg-background flex flex-col">
      {/* CV Update / Empty Profile Banner */}
      <div className="absolute top-20 lg:top-24 left-3 lg:left-6 right-3 lg:right-6 z-10 max-w-2xl pointer-events-none flex flex-col gap-2">
        <div className="pointer-events-auto">
          <CVUpdateBanner mode="proactive" />
          <EmptyProfileBanner show={!hasProfileData} />
        </div>
      </div>

      {/* 1. Background Neural Network Graph */}
      <div className="absolute inset-0 z-0 bg-transparent">
        {graphError ? (
          <div className="flex h-full w-full items-center justify-center bg-black/40">
            <p className="text-sm text-destructive font-semibold">
              Hubo un error cargando el grafo de conocimiento.
            </p>
          </div>
        ) : (
          <KnowledgeGraphVisualization
            data={graphData || { nodes: [], links: [] }}
            isLoading={isGraphLoading}
            onNodeClick={(node) => setSelectedNode(node)}
            highlightMode={highlightMode}
            isLegendHidden={false}
          />
        )}
      </div>

      {/* 3. Controls & Side Details Stack */}
      <div className="absolute bottom-2 lg:bottom-6 left-0 right-0 lg:left-auto lg:right-6 top-auto z-20 pointer-events-none flex flex-col items-center lg:items-end justify-end px-2 lg:px-0">
        <div className="w-full h-full lg:w-96 pointer-events-none flex flex-col justify-end">
          {selectedNode ? (
            <div className="w-full pointer-events-auto animate-in slide-in-from-bottom duration-300">
              <NodeDetailCard
                node={selectedNode}
                activeCluster={activeCluster}
                profile={profile}
                onClose={() => setSelectedNode(null)}
              />
            </div>
          ) : (
            <div className="w-full pointer-events-auto">
              <OverviewSideDrawer
                activeCluster={activeCluster}
                domainAffinities={profile.domain_affinities || []}
                fullName={profile.full_name || 'Usuario'}
                roleTitle={profile.current_job_role || ''}
                seniority={profile.seniority}
                totalSkills={profile.detected_skills?.length || 0}
                isLoading={isAnalyzing}
                isOpen={isDrawerOpen}
                onOpenChange={setIsDrawerOpen}
                activeFilter={highlightMode}
                onFilterChange={setHighlightMode}
                graphNodes={graphData?.nodes || []}
                onNodeClick={(node) => setSelectedNode(node)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
