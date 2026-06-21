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

// Custom Overview components
import { OverviewEmptyState } from '@/components/overview/overview-empty-state';
import { OverviewSideDrawer } from '@/components/overview/overview-side-drawer';
import { GraphFilterDock, FilterMode } from '@/components/overview/graph-filter-dock';

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
  const { data: user, isLoading: isUserLoading } = useCurrentUser();
  const { data: cvData, isLoading: isCVLoading } = useUserCVs();
  const { data: profile } = useUserProfile();
  const { startAnalysis, isAnalysisReady, isAnalyzing } = useCVAnalysis();
  const { data: graphData, isLoading: isGraphLoading, error: graphError } = useKnowledgeGraph();

  const router = useRouter();
  const searchParams = useSearchParams();
  const clusterParam = searchParams.get('cluster');

  // Node selection & view states
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [highlightMode, setHighlightMode] = useState<FilterMode>('all');

  // Derived state
  const hasCV = !!(cvData && cvData.cvs && cvData.cvs.length > 0);

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

  // Cluster Affinities with fallback
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
    <div className="relative w-full h-full overflow-hidden bg-background flex flex-col">
      {/* 1. Background Neural Network Graph */}
      <div className="absolute inset-0 z-0 bg-transparent">
        {graphError ? (
          <div className="flex h-full w-full items-center justify-center bg-black/40">
            <p className="text-sm text-red-400 font-semibold">
              Hubo un error cargando el grafo de conocimiento.
            </p>
          </div>
        ) : (
          <KnowledgeGraphVisualization
            data={graphData || { nodes: [], links: [] }}
            isLoading={isGraphLoading}
            onNodeClick={(node) => setSelectedNode(node)}
            highlightMode={highlightMode}
          />
        )}
      </div>



      {/* 3. Empty State (Zero-state Overlay with Blur) */}
      {!hasCV && (
        <OverviewEmptyState
          onUploadSuccess={(newCvId) => {
            if (newCvId) {
              startAnalysis(newCvId);
            }
          }}
        />
      )}

      {/* 4. Controls & Side Details Stack */}
      {hasCV && (
        <>
          {/* Bottom Dock (Center, floating) */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
            <GraphFilterDock
              activeFilter={highlightMode}
              onFilterChange={(filter) => setHighlightMode(filter)}
            />
          </div>

          {/* Right Floating Stack (Drawer/Details Card) */}
          <div className="absolute top-24 right-6 bottom-6 z-20 pointer-events-none flex flex-col gap-4 items-end">
            <div className="flex-1 min-h-0 pointer-events-auto">
              {selectedNode ? (
                <Card className="card-glass w-96 h-full flex flex-col overflow-hidden transition-all duration-300">
                  <CardHeader className="pb-4 border-b border-border/40 bg-muted/[0.03] flex flex-row items-center justify-between space-y-0">
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
                            className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[9px] py-0 px-1.5 font-bold"
                          >
                            Adquirida
                          </Badge>
                        )}
                        {selectedNode.status === 'gap' && (
                          <Badge
                            variant="outline"
                            className="bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20 text-[9px] py-0 px-1.5 font-bold"
                          >
                            Brecha
                          </Badge>
                        )}
                        {selectedNode.status === 'neutral' && (
                          <Badge
                            variant="outline"
                            className="bg-indigo-500/10 text-indigo-400 dark:text-indigo-400 border-indigo-500/20 text-[9px] py-0 px-1.5 font-bold"
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
                  <CardContent className="pt-6 space-y-6 flex-1 overflow-y-auto scrollbar-none">
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

                    <div className="space-y-3 rounded-xl bg-indigo-500/5 border border-indigo-500/10 p-4 mt-6">
                      <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                        <Info className="h-3.5 w-3.5" />
                        <h4 className="text-[10px] font-bold uppercase tracking-wider">
                          Análisis Contextual
                        </h4>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Esta tecnología se conecta con otras herramientas en tu grafo basadas en la
                        demanda actual del mercado.
                        {selectedNode.status === 'gap'
                          ? ' Al ser una brecha en tu perfil, adquirir esta habilidad fortalecería tu posición para roles que demandan este stack.'
                          : selectedNode.status === 'acquired'
                            ? ' Ya posees esta habilidad, lo que te posiciona favorablemente en su respectivo dominio.'
                            : ' Es una tecnología relacionada frecuentemente con tu stack actual.'}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <OverviewSideDrawer
                  domainAffinities={profile?.domain_affinities || []}
                  techSkills={techSkills}
                  fullName={fullName}
                  roleTitle={roleTitle}
                  seniority={seniority}
                  alignmentScore={activeScore}
                  primarySpecialty={activeCluster?.cluster_name}
                  isLoading={isAnalyzing}
                />
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
