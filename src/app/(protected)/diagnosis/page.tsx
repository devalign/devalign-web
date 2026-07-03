'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUserProfileSelector } from '@/hooks/use-user-profile-selector';
import { useCVAnalysis } from '@/contexts/cv-analysis-context';
import { toast } from 'sonner';

// UI Layout Components
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Sparkles, Loader2, ChevronLeft, ChevronDown, RefreshCw } from 'lucide-react';
import { LoadingScreen } from '@/components/shared/loading-screen';
import { ErrorFallback } from '@/components/shared/error-fallback';
import { CVUpdateBanner } from '@/components/shared/cv-update-banner';
import { EmptyProfileBanner } from '@/components/shared/empty-profile-banner';
import { InsightCard } from '@/components/shared/insight-card';

// Local _components (Diagnosis)
import { UserHeroCard } from './_components/user-hero-card';
import { StrengthsCard } from './_components/strengths-card';
import { PriorityGapsCard } from './_components/priority-gaps-card';
import { ClusterDemandCard } from './_components/cluster-demand-card';
import { MarketImpactCard } from './_components/market-impact-card';
import { AiInsightCard } from './_components/ai-insight-card';
import { StrengthsDrawer } from './_components/strengths-drawer';
import { GapsDrawer } from './_components/gaps-drawer';
import { ProfileRadarCard } from './_components/profile-radar-card';
import { ClusterHeaderCard } from './_components/cluster-header-card';
import { useClusterDiagnostic, DiagnosticDetail } from '@/hooks/use-cluster-diagnostic';

// Reallocated Profile Components (CV & Graph)
import CVUploader from '../profile/_components/cv/cv-uploader';
import CVAtsPreviewModal from '../profile/_components/cv/cv-ats-preview-modal';

function DiagnosisContent() {
  const { data: profile, isLoading: isProfileLoading, error: profileError } = useUserProfileSelector();
  const { startAnalysis, isAnalyzing } = useCVAnalysis();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Navigation and drawers states
  const [isStrengthsDrawerOpen, setIsStrengthsDrawerOpen] = useState(false);
  const [isGapsDrawerOpen, setIsGapsDrawerOpen] = useState(false);
  const [isSpecialtyOpen, setIsSpecialtyOpen] = useState(false);

  // Modal visibility states linked to URL query param
  const [isAtsOpen, setIsAtsOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const action = searchParams.get('action');
  const clusterParam = searchParams.get('cluster');

  // Handle URL actions
  useEffect(() => {
    if (action === 'preview-ats') {
      setIsAtsOpen(true);
      setIsUploadOpen(false);
    } else if (action === 'update-cv') {
      setIsUploadOpen(true);
      setIsAtsOpen(false);
    } else {
      setIsAtsOpen(false);
      setIsUploadOpen(false);
    }
  }, [action]);

  const handleCloseAts = (open: boolean) => {
    setIsAtsOpen(open);
    if (!open && action === 'preview-ats') {
      router.push('/diagnosis');
    }
  };

  const handleCloseUpload = (open: boolean) => {
    setIsUploadOpen(open);
    if (!open && action === 'update-cv') {
      router.push('/diagnosis');
    }
  };

  const handleChangeSpecialty = (clusterName: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('cluster', clusterName);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  // Determine active cluster name
  const allAffinities = profile?.all_affinities || [];
  const activeCluster =
    allAffinities.find((a) =>
      clusterParam ? a.cluster_name.toLowerCase() === clusterParam.toLowerCase() : a.is_primary,
    ) ||
    allAffinities[0] ||
    null;
  const activeClusterName = activeCluster?.cluster_name || profile?.primary_specialty || null;

  // Load diagnostic details
  const {
    data: apiDiagnostic,
    isLoading: isDiagLoading,
    error: diagError,
  } = useClusterDiagnostic(activeClusterName);

  const isLoading = isProfileLoading || isDiagLoading;
  const error = profileError || diagError;

  const hasProfileData = !!(profile?.cv_id || (profile?.detected_skills && profile.detected_skills.length > 0));

  const fallbackDiagnostic: DiagnosticDetail = {
    user_id: '',
    full_name: null,
    current_job_role: null,
    seniority: 'mid',
    total_profile_skills: 0,
    domain_affinities: [],
    market_insights: null,
    compatible_roles: null,
    ai_insight: null,
    cluster_name: 'Pendiente de CV',
    affinity_score: 0,
    detected_skills: [],
    skill_gaps: [],
    last_analysis_date: null,
    job_offer_count: 0,
    top_skills: []
  };

  const diagnostic = apiDiagnostic || (!hasProfileData ? fallbackDiagnostic : null);

  if (isLoading) {
    return <LoadingScreen message="Cargando tu diagnóstico..." />;
  }

  if (error || !profile || !diagnostic) {
    return (
      <ErrorFallback
        error={error || new Error('No se pudo cargar el diagnóstico')}
        onRetry={() => window.location.reload()}
        onHome={() => router.push('/')}
        fullPage
      />
    );
  }

  const activeScore = Math.round(diagnostic.affinity_score * 100);

  // Process strengths and gaps for listing
  const strengths = (diagnostic.detected_skills || [])
    .map((s) => {
      const ict = s.ict_score ?? 0;
      let level = 'Básico';
      let score = 1;
      if (ict >= 7.0) {
        level = 'Avanzado';
        score = 3;
      } else if (ict >= 4.0) {
        level = 'Intermedio';
        score = 2;
      }

      return {
        name: s.name,
        level,
        score,
        demandPercentage: s.market_demand_percentage ?? 100,
        category: s.skill_type,
        ict_score: s.ict_score,
        trend: s.trend,
      };
    })
    .sort((a, b) => {
      // Sort by candidate proficiency score (Avanzado > Intermedio > Básico) first
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      // Tie breaker: market demand percentage descending
      return b.demandPercentage - a.demandPercentage;
    });

  const gaps = (diagnostic.skill_gaps || [])
    .map((g) => {
      const importanceMap: Record<string, number> = {
        critical: 3,
        high: 2,
        medium: 1,
      };
      const importanceScore = importanceMap[g.market_importance ?? 'medium'] ?? 1;

      return {
        name: g.name,
        skill_type: g.skill_type,
        market_importance: g.market_importance ?? 'medium',
        importanceScore,
        market_demand_percentage: g.market_demand_percentage ?? 50,
        trend: g.trend,
      };
    })
    .sort((a, b) => {
      // Sort by importance priority score (Alta > Media > Baja) first
      if (b.importanceScore !== a.importanceScore) {
        return b.importanceScore - a.importanceScore;
      }
      // Tie breaker: market demand percentage descending
      return b.market_demand_percentage - a.market_demand_percentage;
    });

  // Header date formatting
  const formattedDate = diagnostic.last_analysis_date
    ? new Date(diagnostic.last_analysis_date).toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : 'Recientemente';

  // Matching cluster for market stats
  const jobOfferCount = diagnostic.job_offer_count;
  const totalOffers = profile.all_affinities?.reduce((sum, c) => sum + (c.job_offer_count ?? 0), 0) || 0;
  const marketPercent =
    totalOffers > 0 ? parseFloat(((jobOfferCount / totalOffers) * 100).toFixed(1)) : 0;
  const topSkills = diagnostic.top_skills || [];

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <CVUpdateBanner mode="proactive" />

        {/* Page Header */}
        <div className="flex flex-col gap-2 my-10">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground flex items-center gap-1">
              <button
                onClick={() => router.push('/overview')}
                className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer -ml-1"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              Diagnóstico · {diagnostic.cluster_name}
            </h1>

            <div className="relative shrink-0">
              <button
                onClick={() => setIsSpecialtyOpen(!isSpecialtyOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-[11px] font-bold text-primary hover:bg-primary/10 transition-colors cursor-pointer border border-primary/20"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Cambiar especialidad
                <ChevronDown
                  className={`w-3 h-3 transition-transform duration-200 ${isSpecialtyOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {isSpecialtyOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsSpecialtyOpen(false)} />
                  <div className="absolute right-0 top-full mt-1.5 w-56 bg-card border border-border rounded-lg shadow-lg z-50 p-1">
                    {allAffinities.map((cluster) => {
                      const isActive = cluster.cluster_name === diagnostic.cluster_name;
                      return (
                        <button
                          key={cluster.cluster_name}
                          onClick={() => {
                            handleChangeSpecialty(cluster.cluster_name);
                            setIsSpecialtyOpen(false);
                          }}
                          className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs font-semibold text-left transition-colors cursor-pointer ${
                            isActive
                              ? 'bg-primary/10 text-primary'
                              : 'text-foreground hover:bg-secondary/50'
                          }`}
                        >
                          {cluster.cluster_name}
                        </button>
                      );
                    })}
                    <div className="border-t border-border/60 my-1" />
                    <button
                      onClick={() => {
                        router.push('/market');
                        setIsSpecialtyOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-left text-primary hover:bg-primary/10 transition-colors font-semibold text-xs cursor-pointer"
                    >
                      <Sparkles className="h-3.5 w-3.5 text-primary shrink-0 animate-pulse" />
                      <span>Agregar especialidad</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
          <p className="text-xs text-muted-foreground max-w-2xl leading-relaxed">
            Análisis de tu perfil frente a las competencias más demandadas en esta especialidad.
          </p>
        </div>

        <EmptyProfileBanner show={!hasProfileData} />

        {/* Main Grid: Left (Profile & Radar) / Right (Details & Insights) */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mt-6">
          {/* Left Column (col-span-4): Perfil y Radar */}
          <div className="xl:col-span-4 flex flex-col">
            <ProfileRadarCard
              fullName={diagnostic.full_name || 'Desarrollador'}
              roleTitle={diagnostic.current_job_role || ''}
              seniority={diagnostic.seniority}
              totalSkills={diagnostic.total_profile_skills}
              domainAffinities={diagnostic.domain_affinities || []}
              isLoading={isAnalyzing}
              className="h-full"
            />
          </div>

          {/* Right Column (col-span-8): Header + Strengths/Gaps + Vertical Insights */}
          <div className="xl:col-span-8 flex flex-col gap-6">
            {/* Header: Especialidad analizada y estadísticas de mercado */}
            <ClusterHeaderCard
              primarySpecialty={diagnostic.cluster_name}
              currentScore={activeScore}
              lastAnalysisDate={formattedDate}
              jobOfferCount={jobOfferCount}
              marketPercent={marketPercent}
              topSkills={topSkills}
              isLoading={isAnalyzing}
            />

            {/* Split bottom of right column: Left (Strengths & Gaps) / Right (Insights) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Sub-column: Strengths & Gaps */}
              <div className="flex flex-col gap-6">
                <StrengthsCard
                  strengths={strengths}
                  onViewAll={() => setIsStrengthsDrawerOpen(true)}
                  isLoading={isAnalyzing}
                />
                <PriorityGapsCard
                  marketGaps={gaps}
                  onViewAll={() => setIsGapsDrawerOpen(true)}
                  isLoading={isAnalyzing}
                />
              </div>

              {/* Right Sub-column: Vertical Market Insights (Blue Rectangle 1) */}
              <div className="flex flex-col gap-6">
                <ClusterDemandCard
                  clusterName={diagnostic.cluster_name}
                  marketInsights={diagnostic.market_insights || undefined}
                  isLoading={isAnalyzing}
                />
                <MarketImpactCard
                  marketGaps={gaps}
                  marketInsights={diagnostic.market_insights || undefined}
                  isLoading={isAnalyzing}
                />
                <AiInsightCard marketGaps={gaps} isLoading={isAnalyzing} />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section (Blue Rectangle 2: full width horizontal insights) */}
        <div className="mt-8 space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">
              Contexto de mercado adicional
            </span>
            <div className="h-px flex-1 bg-border/40" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InsightCard
              title="Cumplimiento de Perfiles"
              description={
                <>
                  En promedio, los postulantes a{' '}
                  <strong className="text-foreground">
                    {diagnostic.cluster_name}
                  </strong>{' '}
                  solo cumplen con el <strong className="text-emerald-500">58%</strong> del perfil
                  técnico ideal. ¡Destacar aquí te da una gran ventaja!
                </>
              }
              type="compliance"
              value="Benchmarking"
            />

            <InsightCard
              title="Competencias Críticas"
              description={
                <>
                  El mercado requiere alto nivel en <strong>Arquitectura en la Nube y CI/CD</strong>{' '}
                  para tu perfil, pero el nivel promedio de los candidatos es muy bajo. Enfócate en
                  esto.
                </>
              }
              type="critical"
              value="Oportunidad"
            />
          </div>
        </div>
      </div>

      {/* Upload CV Dialog */}
      <Dialog open={isUploadOpen} onOpenChange={handleCloseUpload}>
        <DialogContent className="sm:max-w-md border-border bg-card">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-bold text-foreground text-success dark:text-success">
              <Sparkles className="h-5 w-5 text-success dark:text-success" />
              Actualizar Currículum Vitae
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Sube una versión más reciente de tu CV. Sincronizaremos tus datos profesionales
              automáticamente y recalcularemos tu alineación técnica.
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <CVUploader
              onUploadSuccess={(newCvId) => {
                handleCloseUpload(false);
                if (newCvId) {
                  startAnalysis(newCvId);
                }
              }}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* ATS CV Preview Modal */}
      {isAtsOpen && (
        <CVAtsPreviewModal isOpen={isAtsOpen} onOpenChange={handleCloseAts} profile={profile} />
      )}

      {/* Drawers */}
      <StrengthsDrawer
        isOpen={isStrengthsDrawerOpen}
        onOpenChange={setIsStrengthsDrawerOpen}
        strengths={strengths}
      />

      <GapsDrawer isOpen={isGapsDrawerOpen} onOpenChange={setIsGapsDrawerOpen} gaps={gaps} />
    </>
  );
}

export default function DiagnosisPage() {
  return (
    <Suspense fallback={<LoadingScreen message="Cargando diagnóstico..." />}>
      <DiagnosisContent />
    </Suspense>
  );
}
