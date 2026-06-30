'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Network, Cpu, Layers, Info, X, Sparkles } from 'lucide-react';
import { LoadingScreen } from '@/components/shared/loading-screen';
import { ErrorFallback } from '@/components/shared/error-fallback';
import { CVUpdateBanner } from '@/components/shared/cv-update-banner';
import { useUserProfileSelector } from '@/hooks/use-user-profile-selector';
import { useCVAnalysis } from '@/contexts/cv-analysis-context';
import { useKnowledgeGraph } from '@/hooks/use-knowledge-graph';
import { useSidebar } from '@/components/layout/sidebar-context';

// Local Components
import { OverviewSideDrawer, FilterMode } from './_components/overview-side-drawer';
import { KnowledgeGraphVisualization, GraphNode } from '../profile/_components/graph/knowledge-graph-visualization';

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
    clusterParam || profile?.primary_specialty
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

  const allAffinities = profile.all_affinities || [];
  const activeCluster = allAffinities.find(
    (a) => clusterParam ? a.cluster_name.toLowerCase() === clusterParam.toLowerCase() : a.is_primary
  ) || allAffinities[0] || null;

  const activeScore = activeCluster ? Math.round(activeCluster.affinity_score * 100) : profile.alignment_score;

  return (
    <div className="relative w-full h-screen bg-background flex flex-col">
      {/* CV Update Banner */}
      <div className="absolute top-20 lg:top-24 left-3 lg:left-6 right-3 lg:right-6 z-10 max-w-2xl pointer-events-none">
        <div className="pointer-events-auto">
          <CVUpdateBanner />
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
              <Card className="card-glass! w-full min-h-[80vh] flex flex-col overflow-hidden rounded-3xl border shadow-2xl">
                <CardHeader className="pb-0 border-b border-border/80 bg-muted/[0.03] flex flex-row items-center justify-between space-y-0">
                  <div className="min-w-0 pr-4">
                    <CardTitle
                      className="text-base font-bold text-foreground leading-tight truncate"
                      title={selectedNode.label}
                    >
                      {selectedNode.label}
                    </CardTitle>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {selectedNode.status === 'acquired' && (
                        <Badge
                          variant="outline"
                          className="bg-success/10 text-success dark:text-success border-success/20 text-[9px] py-0 px-1.5 font-bold"
                        >
                          Adquirida
                        </Badge>
                      )}
                      {selectedNode.status === 'gap' && (
                        <Badge
                          variant="outline"
                          className="bg-warning/10 text-warning dark:text-warning border-warning/20 text-[9px] py-0 px-1.5 font-bold"
                        >
                          Brecha
                        </Badge>
                      )}
                      {selectedNode.status === 'neutral' && (
                        <Badge
                          variant="outline"
                          className="bg-info/10 text-info dark:text-info border-info/20 text-[9px] py-0 px-1.5 font-bold"
                        >
                          Relacionada
                        </Badge>
                      )}
                      {selectedNode.status === 'market' && (
                        <Badge
                          variant="outline"
                          className="bg-muted/30 text-muted-foreground border-border/30 text-[9px] py-0 px-1.5 font-bold"
                        >
                          Mercado
                        </Badge>
                      )}
                      <Badge
                        variant="secondary"
                        className="bg-muted/30 text-muted-foreground border border-border/30 text-[9px] py-0 px-1.5 hover:bg-muted/30"
                      >
                        {selectedNode.group}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 rounded-full hover:bg-muted text-muted-foreground shrink-0 cursor-pointer"
                    onClick={() => setSelectedNode(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="pt-2 space-y-6 flex-1 overflow-y-auto scrollbar-none">
                  <div className="space-y-2">
                    <h4 className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                      <Layers className="h-3.5 w-3.5" />
                      Dominios de Aplicación
                    </h4>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {selectedNode.domains.map((domain) => (
                        <span
                          key={domain}
                          className="px-2 py-0.5 text-[10px] font-medium rounded-lg bg-muted/30 text-foreground border border-border/30"
                        >
                          {domain}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3 rounded-xl bg-info/5 border border-info/10 p-4 mt-6 mb-4">
                    <div className="flex items-center gap-2 text-info dark:text-info">
                      <Info className="h-3.5 w-3.5" />
                      <h4 className="text-[10px] font-bold uppercase tracking-wider">
                        Análisis Contextual
                      </h4>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Esta tecnología se conecta con otras herramientas en tu grafo basadas en
                      la demanda actual del mercado.
                      {selectedNode.status === 'gap'
                        ? ' Al ser una brecha en tu perfil, adquirir esta habilidad fortalecería tu posición para roles que demandan este stack.'
                        : selectedNode.status === 'acquired'
                          ? ' Ya posees esta habilidad, lo que te posiciona favorablemente en su respectivo dominio.'
                          : selectedNode.status === 'neutral'
                            ? ' Es una tecnología relacionada frecuentemente con tu stack actual.'
                            : ' Es una habilidad general del mercado tecnológico no requerida por el cluster actual.'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="w-full pointer-events-auto">
              <OverviewSideDrawer
                domainAffinities={profile.domain_affinities || []}
                fullName={profile.full_name || 'Usuario'}
                roleTitle={profile.current_job_role || ''}
                seniority={profile.seniority}
                alignmentScore={activeScore}
                primarySpecialty={activeCluster?.cluster_name || profile.primary_specialty}
                isLoading={isAnalyzing}
                isOpen={isDrawerOpen}
                onOpenChange={setIsDrawerOpen}
                activeFilter={highlightMode}
                onFilterChange={setHighlightMode}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
