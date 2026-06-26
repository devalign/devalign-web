'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useUserCVs } from '@/hooks/use-user-cvs';
import { useUserProfile } from '@/hooks/use-user-profile';
import { toast } from 'sonner';
import { ErrorFallback } from '@/components/shared/error-fallback';
import CVUploader from '@/components/profile/cv-uploader';
import { CVUpdateBanner } from '@/components/shared/cv-update-banner';
import CVAtsPreviewModal from '@/components/profile/cv-ats-preview-modal';
import { useCVAnalysis } from '@/contexts/cv-analysis-context';
import { Button } from '@/components/ui/button';
import {
  UserProfileData,
  EducationItem,
  WorkExperienceItem,
  CertificationItem,
  SkillItem,
} from '@/lib/api/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import {
  Sparkles,
  Search,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Lightbulb,
  ChevronLeft,
  RefreshCw,
  ChevronDown,
} from 'lucide-react';

// Refactored modular subcomponents
import { PriorityGapsCard } from '@/components/diagnosis/priority-gaps-card';

import { StrengthsCard } from '@/components/diagnosis/strengths-card';
import { AffinityRadarChart } from '@/components/diagnosis/affinity-radar-chart';
import { UserHeroCard } from '@/components/diagnosis/user-hero-card';

import { AiInsightCard } from '@/components/diagnosis/ai-insight-card';
import { ClusterDemandCard } from '@/components/diagnosis/cluster-demand-card';
import { MarketImpactCard } from '@/components/diagnosis/market-impact-card';
import { KnowledgeGraphCard } from '@/components/profile/KnowledgeGraphCard';

function DiagnosisContent() {
  const { data: user, isLoading: isUserLoading, error: userError } = useCurrentUser();
  const { data: cvData, isLoading: isCVLoading, refetch: refetchCVs } = useUserCVs();
  const { data: profile, error: profileError, refetch: refetchProfile } = useUserProfile();
  const { startAnalysis, isAnalysisReady, isAnalyzing, commitUpdate } = useCVAnalysis();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Drawers states
  const [isStrengthsDrawerOpen, setIsStrengthsDrawerOpen] = useState(false);
  const [isGapsDrawerOpen, setIsGapsDrawerOpen] = useState(false);

  // Specialty dropdown state
  const [isSpecialtyOpen, setIsSpecialtyOpen] = useState(false);

  // Search states for drawers
  const [strengthsSearch, setStrengthsSearch] = useState('');
  const [gapsSearch, setGapsSearch] = useState('');

  // Profile Data States
  const [fullName, setFullName] = useState('');
  const [roleTitle, setRoleTitle] = useState('');
  const [seniority, setSeniority] = useState('mid');

  // Education, Experience, Certifications States (for ATS Preview modal generation)
  const [educationList, setEducationList] = useState<EducationItem[]>([]);
  const [experiences, setExperiences] = useState<WorkExperienceItem[]>([]);
  const [certifications, setCertifications] = useState<CertificationItem[]>([]);

  // Calculate total years of experience
  const yearsOfExperience = React.useMemo(() => {
    if (!experiences || experiences.length === 0) return 0;
    let totalMonths = 0;
    experiences.forEach((exp) => {
      if (!exp.start_date) return;
      const start = new Date(exp.start_date);
      const end = exp.current || !exp.end_date ? new Date() : new Date(exp.end_date);
      if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        totalMonths += diffDays / 30.44;
      }
    });
    return Math.max(0, Math.round(totalMonths / 12));
  }, [experiences]);

  // Skills Lists
  const [techSkills, setTechSkills] = useState<string[]>([]);
  const [conceptSkills, setConceptSkills] = useState<string[]>([]);
  const [softSkills, setSoftSkills] = useState<string[]>([]);

  // ML Gap items (skills the user DOES NOT have but the market demands)
  const [marketGaps, setMarketGaps] = useState<SkillItem[]>([]);

  // Modal visibility states linked to URL query param
  const [isAtsOpen, setIsAtsOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const action = searchParams.get('action');
  const recalculateParam = searchParams.get('recalculate');
  const clusterParam = searchParams.get('cluster');

  // Handle URL actions
  useEffect(() => {
    const timeoutId = setTimeout(() => {
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
    }, 0);
    return () => clearTimeout(timeoutId);
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

  // Synchronize profile data with API hook
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

        if (profile.education && profile.education.length > 0) {
          setEducationList(profile.education);
        }
        if (profile.work_experience && profile.work_experience.length > 0) {
          setExperiences(profile.work_experience);
        }
        if (profile.certifications && profile.certifications.length > 0) {
          setCertifications(profile.certifications);
        }

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

        if (profile.skill_gaps && profile.skill_gaps.length > 0) {
          setMarketGaps(profile.skill_gaps);
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
        setMarketGaps([]);
      }
    };

    const timer = setTimeout(syncProfileData, 0);
    return () => clearTimeout(timer);
  }, [profile, user]);

  // Active Cluster Index for navigation
  const [activeClusterIndex, setActiveClusterIndex] = useState(0);

  const allAffinities = React.useMemo(() => {
    if (profile?.all_affinities && profile.all_affinities.length > 0) {
      return [...profile.all_affinities]
        .sort((a, b) => b.affinity_score - a.affinity_score)
        .slice(0, 3);
    }
    return [];
  }, [profile]);

  // Sync activeClusterIndex with primary specialty or URL parameter on load/change
  useEffect(() => {
    if (allAffinities && allAffinities.length > 0) {
      if (clusterParam) {
        const idx = allAffinities.findIndex(
          (a) => a.cluster_name.toLowerCase() === clusterParam.toLowerCase(),
        );
        if (idx !== -1) {
          const timer = setTimeout(() => setActiveClusterIndex(idx), 0);
          return () => clearTimeout(timer);
        }
      }
      const primaryIdx = allAffinities.findIndex((a) => a.is_primary);
      if (primaryIdx !== -1) {
        const timer = setTimeout(() => setActiveClusterIndex(primaryIdx), 0);
        return () => clearTimeout(timer);
      }
    }
  }, [allAffinities, clusterParam]);

  const handleSelectCluster = (index: number) => {
    const cluster = allAffinities[index];
    if (cluster) {
      const params = new URLSearchParams(searchParams.toString());
      params.set('cluster', cluster.cluster_name);
      router.push(`?${params.toString()}`, { scroll: false });
    }
  };

  const handleChangeSpecialty = (clusterName: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('cluster', clusterName);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const activeCluster = allAffinities[activeClusterIndex] || allAffinities[0];
  const activeScore = Math.round((activeCluster?.affinity_score || 0.5) * 100);

  // Dynamically calculate strengths and gaps based on active cluster
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

    // Sort strengths: by demand desc, secondary by level (Avanzado > Intermedio)
    const levelOrder: Record<string, number> = { Avanzado: 3, Intermedio: 2, Básico: 1 };
    strengths.sort((a, b) => {
      const demandDiff = b.demandPercentage - a.demandPercentage;
      if (demandDiff !== 0) return demandDiff;
      return (levelOrder[b.level] || 0) - (levelOrder[a.level] || 0);
    });

    // Sort gaps: by importance desc, secondary by demand desc
    const impOrder: Record<string, number> = { critical: 3, high: 2, medium: 1 };
    gaps.sort((a, b) => {
      const impDiff = (impOrder[b.market_importance] || 0) - (impOrder[a.market_importance] || 0);
      if (impDiff !== 0) return impDiff;
      return b.market_demand_percentage - a.market_demand_percentage;
    });

    return { strengths, gaps };
  }, [activeCluster]);

  // Construct profile payload for ATS Modal preview
  const dynamicProfile: UserProfileData = {
    user_id: user?.id || profile?.user_id || '',
    cv_id: profile?.cv_id || cvData?.cvs?.[0]?.cv_id || null,
    full_name: fullName,
    current_job_role: roleTitle,
    seniority: seniority,
    years_experience: profile?.years_experience || 2,
    location: profile?.location || 'Lima, Peru',
    preferred_modality: profile?.preferred_modality || 'Híbrido / Presencial',
    availability: profile?.availability || 'Inmediata',
    alignment_score: activeScore,
    primary_specialty: activeCluster?.cluster_name || 'Data Engineering',
    secondary_affinities: allAffinities.filter((a) => !a.is_primary),
    all_affinities: allAffinities,
    domain_affinities: profile?.domain_affinities || [],
    detected_skills: [
      ...techSkills.map((name) => ({ name, skill_type: 'tech' })),
      ...softSkills.map((name) => ({ name, skill_type: 'soft' })),
      ...conceptSkills.map((name) => ({ name, skill_type: 'concept' })),
    ],
    skill_gaps: activeGaps,
    education: educationList,
    work_experience: experiences,
    certifications: certifications,
  };

  // Error State
  const queryError = userError || profileError;
  if (queryError) {
    return (
      <ErrorFallback
        error={queryError}
        onRetry={() => refetchProfile()}
        onHome={() => (window.location.href = '/')}
        fullPage
      />
    );
  }

  if (isUserLoading || isCVLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-xs text-muted-foreground font-semibold">
            Cargando sesión de Devalign...
          </p>
        </div>
      </div>
    );
  }

  // Get formatted date for header
  const currentCV = cvData?.cvs?.[0];
  const formattedDate = currentCV?.uploaded_at
    ? new Date(currentCV.uploaded_at).toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : 'Recientemente';

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        {/* Banner de Sincronización Diferida */}
        <CVUpdateBanner />

        {/* Page header: back arrow in title + cambiar especialidad dropdown */}
        <div className="flex flex-col gap-2 my-10">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground flex items-center gap-1">
              <button
                onClick={() => router.push('/overview')}
                className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer -ml-1"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              Diagnóstico ·{' '}
              {activeCluster?.cluster_name ||
                dynamicProfile.primary_specialty ||
                'Software Engineering'}
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
                      const isActive = cluster.cluster_name === activeCluster?.cluster_name;
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
                      <span>Explorar más especialidades...</span>
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

        {/* Hero card with diagnostic info blocks */}
        <UserHeroCard
          fullName={fullName}
          roleTitle={roleTitle}
          seniority={seniority}
          currentScore={activeScore}
          primarySpecialty={
            activeCluster?.cluster_name ||
            dynamicProfile.primary_specialty ||
            'Software Engineering'
          }
          totalSkills={techSkills.length + conceptSkills.length + softSkills.length}
          totalStrengths={activeStrengths.length}
          totalGaps={activeGaps.length}
          isLoading={false}
          lastAnalysisDate={formattedDate}
        />

        {/* Main two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-6">
          {/* Left column (narrower): Fortalezas + Brechas */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <StrengthsCard
              strengths={activeStrengths}
              onViewAll={() => {
                setStrengthsSearch('');
                setIsStrengthsDrawerOpen(true);
              }}
              isLoading={false}
            />
            <PriorityGapsCard
              marketGaps={activeGaps}
              onViewAll={() => {
                setGapsSearch('');
                setIsGapsDrawerOpen(true);
              }}
              isLoading={false}
            />
          </div>

          {/* Right column (wider): Radar */}
          <div className="lg:col-span-3">
            <AffinityRadarChart
              domainAffinities={dynamicProfile.domain_affinities}
              techSkills={techSkills}
              isLoading={false}
              className="w-full"
            />
          </div>
        </div>

        {/* Bottom section: Contexto de mercado */}
        <div className="mt-8 space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">
              Contexto de mercado
            </span>
            <div className="h-px flex-1 bg-border/40" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ClusterDemandCard
              clusterName={activeCluster?.cluster_name || dynamicProfile.primary_specialty}
              marketInsights={activeCluster?.market_insights}
              isLoading={false}
            />
            <MarketImpactCard
              marketGaps={activeGaps}
              marketInsights={activeCluster?.market_insights}
              isLoading={false}
            />
            <AiInsightCard marketGaps={activeGaps} isLoading={false} />
          </div>
        </div>
      </div>

      {/* Actualizar CV Modal */}
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

      {/* CV ATS Generator / Export preview modal */}
      {isAtsOpen && (
        <CVAtsPreviewModal
          isOpen={isAtsOpen}
          onOpenChange={handleCloseAts}
          profile={dynamicProfile}
          userEmail={user?.email || undefined}
        />
      )}

      {/* Drawer: Todas las Fortalezas */}
      <Sheet open={isStrengthsDrawerOpen} onOpenChange={setIsStrengthsDrawerOpen}>
        <SheetContent className="sm:max-w-md bg-card border-l border-border flex flex-col h-full">
          <SheetHeader className="pb-4">
            <SheetTitle className="flex items-center gap-2 text-success dark:text-success font-bold">
              <CheckCircle2 className="h-5 w-5 text-success" />
              Todas las Fortalezas
            </SheetTitle>
            <SheetDescription className="text-xs text-muted-foreground mt-1">
              Habilidades técnicas en las que demuestras dominio según el análisis de tu CV.
            </SheetDescription>
          </SheetHeader>

          {/* Search bar */}
          <div className="relative my-4">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar fortaleza..."
              value={strengthsSearch}
              onChange={(e) => setStrengthsSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-border bg-secondary/35 text-foreground placeholder-muted-foreground focus:outline-hidden focus:ring-1 focus:ring-primary focus:border-primary"
            />
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 scrollbar-none">
            {activeStrengths
              .filter((s) => s.name.toLowerCase().includes(strengthsSearch.toLowerCase()))
              .map((strength, idx) => {
                return (
                  <div
                    key={`${strength.name}-${idx}`}
                    className="flex flex-col justify-between p-3 rounded-lg bg-success/5 border border-success/10 transition-colors hover:bg-success/10"
                  >
                    <div className="flex justify-between items-start gap-1">
                      <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs truncate">
                        {strength.name}
                      </span>
                      <span className="text-[9px] text-success/80 dark:text-success/80 font-bold shrink-0">
                        {strength.demandPercentage}% DEMANDA
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[10px] text-muted-foreground">{strength.level}</span>
                      {strength.category && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-success/10 text-success dark:text-success font-medium">
                          {strength.category === 'hard_skill'
                            ? 'Habilidad'
                            : strength.category === 'tool'
                              ? 'Herramienta'
                              : strength.category === 'methodology'
                                ? 'Metodología'
                                : strength.category}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            {activeStrengths.filter((s) =>
              s.name.toLowerCase().includes(strengthsSearch.toLowerCase()),
            ).length === 0 && (
              <p className="text-center text-xs text-muted-foreground py-8">
                No se encontraron fortalezas con ese nombre.
              </p>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Drawer: Todas las Brechas */}
      <Sheet open={isGapsDrawerOpen} onOpenChange={setIsGapsDrawerOpen}>
        <SheetContent className="sm:max-w-md bg-card border-l border-border flex flex-col h-full">
          <SheetHeader className="pb-4">
            <SheetTitle className="flex items-center gap-2 text-destructive dark:text-destructive font-bold">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Brechas Prioritarias
            </SheetTitle>
            <SheetDescription className="text-xs text-muted-foreground mt-1">
              Habilidades recomendadas para aumentar tu alineación técnica y compatibilidad en el
              mercado.
            </SheetDescription>
          </SheetHeader>

          {/* Search bar */}
          <div className="relative my-4">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar brecha..."
              value={gapsSearch}
              onChange={(e) => setGapsSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-border bg-secondary/35 text-foreground placeholder-muted-foreground focus:outline-hidden focus:ring-1 focus:ring-primary focus:border-primary"
            />
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 scrollbar-none">
            {activeGaps
              .filter((g) => g.name.toLowerCase().includes(gapsSearch.toLowerCase()))
              .map((gap) => {
                const crit = gap.market_importance || 'medium';
                const demand = gap.market_demand_percentage || 50;
                const borderClass =
                  crit === 'critical'
                    ? 'border-destructive/30 bg-destructive/5 hover:border-destructive/50 hover:bg-destructive/10'
                    : 'border-warning/30 bg-warning/5 hover:border-amber-500/50 hover:bg-warning/10';
                const textClass =
                  crit === 'critical'
                    ? 'text-destructive dark:text-destructive'
                    : 'text-warning dark:text-warning';
                const critLabel =
                  crit === 'critical'
                    ? 'Crítica'
                    : crit === 'high'
                      ? 'Alta'
                      : crit === 'medium'
                        ? 'Media'
                        : crit;
                const tagClass =
                  crit === 'critical'
                    ? 'bg-destructive/10 text-destructive dark:text-destructive'
                    : 'bg-warning/10 text-warning dark:text-warning';

                return (
                  <div
                    key={gap.name}
                    className={`flex flex-col justify-between p-3 rounded-lg border border-dashed transition-colors ${borderClass}`}
                  >
                    <div className="flex justify-between items-start gap-1">
                      <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs truncate">
                        {gap.name}
                      </span>
                      <span className={`text-[9px] font-bold shrink-0 ${textClass} opacity-80`}>
                        {demand}% DEMANDA
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className={`text-[10px] font-medium ${textClass}`}>{critLabel}</span>
                      {gap.skill_type && (
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${tagClass}`}
                        >
                          {gap.skill_type === 'hard_skill'
                            ? 'Habilidad'
                            : gap.skill_type === 'tool'
                              ? 'Herramienta'
                              : gap.skill_type === 'methodology'
                                ? 'Metodología'
                                : gap.skill_type}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            {activeGaps.filter((g) => g.name.toLowerCase().includes(gapsSearch.toLowerCase()))
              .length === 0 && (
              <p className="text-center text-xs text-muted-foreground py-8">
                No se encontraron brechas con ese nombre.
              </p>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

export default function DiagnosisPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-xs text-muted-foreground font-semibold">Cargando diagnóstico...</p>
          </div>
        </div>
      }
    >
      <DiagnosisContent />
    </Suspense>
  );
}
