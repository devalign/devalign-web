'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Network, Cpu, Layers, Info, X, Sparkles, Loader2 } from 'lucide-react';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useUserCVs } from '@/hooks/use-user-cvs';
import { useUserProfile } from '@/hooks/use-user-profile';
import { useCVAnalysis } from '@/contexts/cv-analysis-context';
import { useKnowledgeGraph } from '@/hooks/use-knowledge-graph';
import { toast } from 'sonner';
import { ErrorFallback } from '@/components/shared/error-fallback';
import { CVUpdateBanner } from '@/components/shared/cv-update-banner';

// Custom Overview components
import { OverviewSideDrawer, FilterMode } from '@/components/overview/overview-side-drawer';
import { useSidebar } from '@/components/layout/sidebar-context';
import { cn } from '@/lib/utils';

// UI components
import {
  KnowledgeGraphVisualization,
  GraphNode,
} from '@/components/profile/KnowledgeGraphVisualization';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// Helper libraries
import { EducationItem, WorkExperienceItem, CertificationItem, SkillItem } from '@/lib/api/types';

export default function OverviewPage() {
  const { data: user, isLoading: isUserLoading, error: userError } = useCurrentUser();
  const { data: cvData, isLoading: isCVLoading, error: cvError, refetch: refetchCVs } = useUserCVs();
  const { data: profile, error: profileError, refetch: refetchProfile } = useUserProfile();
  const { isAnalyzing } = useCVAnalysis();
  const { data: graphData, isLoading: isGraphLoading, error: graphError } = useKnowledgeGraph();

  const router = useRouter();
  const searchParams = useSearchParams();
  const clusterParam = searchParams.get('cluster');

  // Node selection & view states
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [highlightMode, setHighlightMode] = useState<FilterMode>('all');
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const { isMobile } = useSidebar();

  // Profile data states for sync
  const [fullName, setFullName] = useState('');
  const [roleTitle, setRoleTitle] = useState('');
  const [seniority, setSeniority] = useState('mid');

  const [educationList, setEducationList] = useState<EducationItem[]>([]);
  const [experiences, setExperiences] = useState<WorkExperienceItem[]>([]);
  const [certifications, setCertifications] = useState<CertificationItem[]>([]);

  const [techSkills, setTechSkills] = useState<string[]>([]);
  const [conceptSkills, setConceptSkills] = useState<string[]>([]);
  const [softSkills, setSoftSkills] = useState<string[]>([]);

  // Sync profile details
  useEffect(() => {
    const syncProfileData = () => {
      if (profile) {
        if (profile.full_name) {
          setFullName(profile.full_name);
        } else if (user?.full_name) {
          setFullName(user.full_name);
        }
        if (profile.current_job_role) setRoleTitle(profile.current_job_role);
        if (profile.seniority) setSeniority(profile.seniority);
        if (profile.education) setEducationList(profile.education);
        if (profile.work_experience) setExperiences(profile.work_experience);
        if (profile.certifications) setCertifications(profile.certifications);

        if (profile.detected_skills && profile.detected_skills.length > 0) {
          const tech: string[] = [];
          const concept: string[] = [];
          const soft: string[] = [];
          profile.detected_skills.forEach((s) => {
            const t = s.skill_type ? s.skill_type.toLowerCase() : '';
            if (t === 'soft' || t === 'soft_skill') soft.push(s.name);
            else if (t === 'concept' || t === 'methodology') concept.push(s.name);
            else tech.push(s.name);
          });
          setTechSkills(tech);
          setConceptSkills(concept);
          setSoftSkills(soft);
        }
      } else if (user) {
        setFullName(user.full_name || user.email?.split('@')[0] || 'Usuario');
        setRoleTitle('');
        setSeniority('mid');
        setExperiences([]);
        setEducationList([]);
        setCertifications([]);
        setTechSkills([]);
        setConceptSkills([]);
        setSoftSkills([]);
      }
    };
    syncProfileData();
  }, [profile, user]);

  const allAffinities = React.useMemo(() => {
    if (profile?.all_affinities && profile.all_affinities.length > 0) {
      return [...profile.all_affinities]
        .sort((a, b) => b.affinity_score - a.affinity_score)
        .slice(0, 3);
    }
    return [];
  }, [profile]);

  // Derive activeClusterIndex from URL parameter or default specialty
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

  const handleSelectCluster = (index: number) => {
    const cluster = allAffinities[index];
    if (cluster) {
      const params = new URLSearchParams(searchParams.toString());
      params.set('cluster', cluster.cluster_name);
      router.push(`?${params.toString()}`, { scroll: false });
    }
  };

  const activeCluster = allAffinities[activeClusterIndex] || allAffinities[0];
  const activeScore = Math.round((activeCluster?.affinity_score || 0.5) * 100);

  // Calculate active strengths and gaps
  const { strengths: activeStrengths, gaps: activeGaps } = React.useMemo(() => {
    if (!activeCluster) return { strengths: [], gaps: [] };

    interface TechStrength {
      name: string;
      level: string;
      score: number;
      demandPercentage: number;
      category: string;
    }
    interface SkillGap {
      name: string;
      skill_type: string;
      market_importance: string;
      market_demand_percentage: number;
    }

    const strengths: TechStrength[] = (activeCluster.detected_skills || []).map((s) => {
      const level = s.market_importance === 'critical' ? 'Avanzado' : 'Intermedio';
      return {
        name: s.name,
        level,
        score: level === 'Avanzado' ? 3 : 2,
        demandPercentage: s.market_demand_percentage ?? 100,
        category: s.skill_type,
      };
    });

    const gaps: SkillGap[] = (activeCluster.skill_gaps || []).map((g) => ({
      name: g.name,
      skill_type: g.skill_type,
      market_importance: g.market_importance ?? 'medium',
      market_demand_percentage: g.market_demand_percentage ?? 100,
    }));

    strengths.sort((a, b) => b.demandPercentage - a.demandPercentage);
    gaps.sort((a, b) => b.market_demand_percentage - a.market_demand_percentage);

    return { strengths, gaps };
  }, [activeCluster]);

  // Error State
  const queryError = cvError || profileError || userError || graphError;
  if (queryError) {
    return (
      <ErrorFallback
        error={queryError}
        onRetry={() => {
          refetchCVs();
          refetchProfile();
        }}
        onHome={() => window.location.href = '/'}
        fullPage
      />
    );
  }

  // Loading Session
  if (isUserLoading || isCVLoading) {
    return (
      <div className="min-h-[calc(100vh-1rem)] flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-xs text-muted-foreground font-semibold">Cargando Overview...</p>
        </div>
      </div>
    );
  }

  // Get formatted date
  const currentCV = cvData?.cvs?.[0];
  const formattedDate = currentCV?.uploaded_at
    ? new Date(currentCV.uploaded_at).toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : 'Recientemente';

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
          {/* Global Bottom Sheet / Right Panel Wrapper */}
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
                              : ' Es una tecnología relacionada frecuentemente con tu stack actual.'}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="w-full pointer-events-auto">
                  <OverviewSideDrawer
                    domainAffinities={profile?.domain_affinities || []}
                    fullName={fullName}
                    roleTitle={roleTitle}
                    seniority={seniority}
                    alignmentScore={activeScore}
                    primarySpecialty={activeCluster?.cluster_name}
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
