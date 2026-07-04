'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Activity,
  BadgeCheck,
  CalendarClock,
  Clock3,
  Code2,
  Eye,
  FileText,
  History,
  Info,
  Loader2,
  MoreVertical,
  RefreshCw,
  Sparkles,
  Target,
  TrendingUp,
  Upload,
} from 'lucide-react';
import { toast } from 'sonner';
import { LoadingScreen } from '@/components/shared/loading-screen';
import { ProfileSkeleton } from './profile-skeleton';

import CVAtsPreviewModal from './cv/cv-ats-preview-modal';
import CVHistoryModal from './cv/cv-history-modal';
import SkillEvidenceModal from './skills/skill-evidence-modal';
import { DomainAffinityCard } from './domain-affinity-card';
import { ProfileUploadBanner } from '@/components/shared/profile-upload-banner';
import { DiagnosticLoadingBanner } from '@/components/shared/diagnostic-loading-banner';
import { EmptyProfileBanner } from '@/components/shared/empty-profile-banner';
import { ErrorFallback } from '@/components/shared/error-fallback';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCVAnalysis } from '@/contexts/cv-analysis-context';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useUserCVs } from '@/hooks/use-user-cvs';
import { useUserProfile, useUpdateUserSkills } from '@/hooks/use-user-profile';
import { useUserProfileSelector } from '@/hooks/use-user-profile-selector';
import type { ClusterAffinityItem, SkillItem, UserProfileData } from '@/types';

function formatDate(value?: string | null, includeTime = false) {
  if (!value) return 'Sin fecha';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Sin fecha';

  return new Intl.DateTimeFormat('es-PE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    ...(includeTime
      ? {
          hour: '2-digit',
          minute: '2-digit',
        }
      : {}),
  }).format(date);
}

function formatFileSize(bytes?: number) {
  if (!bytes) return '0 MB';
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) return 'DV';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function normalizeScore(score?: number | null) {
  if (!score) return 0;
  return Math.round(score > 1 ? score : score * 100);
}

function buildSkillItems(skills?: SkillItem[]) {
  return (skills || []).map((skill) => ({
    name: skill.name,
    skill_type: skill.skill_type || 'tech',
    market_importance: skill.market_importance ?? 'consolidated',
    market_demand_percentage: skill.market_demand_percentage ?? null,
    self_taught: skill.self_taught ?? false,
    personal_projects: skill.personal_projects ?? false,
    years_of_experience: skill.years_of_experience ?? 0,
    has_certification: skill.has_certification ?? false,
    ict_score: skill.ict_score ?? 0.0,
  }));
}

export default function ProfileDashboardView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: user } = useCurrentUser();
  const { data: profile, isLoading, error } = useUserProfileSelector();
  const { refetch: refetchProfile } = useUserProfile();
  const { data: cvData } = useUserCVs();
  const updateSkillsMutation = useUpdateUserSkills();
  const { startAnalysis, isAnalyzing, isAnalysisReady } = useCVAnalysis();

  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [skills, setSkills] = useState<SkillItem[]>([]);
  const [selectedSkillForEvidence, setSelectedSkillForEvidence] = useState<SkillItem | null>(null);
  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false);
  const [isBannerDismissed, setIsBannerDismissed] = useState(false);

  const action = searchParams.get('action');
  const statusParam = searchParams.get('status');
  const isUpdating = statusParam === 'updating';
  const isDiagnosed = profile?.is_diagnosed ?? false;
  const isAtsOpen = action === 'preview-ats';

  // Poll profile when waiting for diagnosis completion
  useEffect(() => {
    if (!isUpdating || isDiagnosed || isBannerDismissed) return;

    const interval = setInterval(async () => {
      const result = await refetchProfile();
      if (result.data?.is_diagnosed) {
        clearInterval(interval);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isUpdating, isDiagnosed, isBannerDismissed, refetchProfile]);

  // Clear the ?status=updating param when banner is dismissed
  useEffect(() => {
    if (isBannerDismissed) {
      router.replace('/profile');
    }
  }, [isBannerDismissed, router]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSkills(buildSkillItems(profile?.detected_skills));
    }, 0);
    return () => clearTimeout(timer);
  }, [profile?.detected_skills]);

  const cvs = useMemo(() => {
    return [...(cvData?.cvs || [])].sort((a, b) => {
      const dateA = a.uploaded_at ? new Date(a.uploaded_at).getTime() : 0;
      const dateB = b.uploaded_at ? new Date(b.uploaded_at).getTime() : 0;
      return dateB - dateA;
    });
  }, [cvData?.cvs]);

  const currentCV = profile?.cv_id ? cvs.find((cv) => cv.cv_id === profile.cv_id) : undefined;

  const fullName = profile?.full_name || user?.full_name || user?.email?.split('@')[0] || 'Usuario';
  const roleTitle = profile?.current_job_role || 'Rol pendiente de detectar';
  const primarySpecialty = profile?.primary_specialty || 'Especialidad pendiente';
  const summary = profile?.professional_summary ?? null;
  const initials = getInitials(fullName);

  const affinities = [...(profile?.all_affinities || [])]
    .filter((item) => item.cluster_name)
    .sort((a, b) => normalizeScore(b.affinity_score) - normalizeScore(a.affinity_score));

  const hasSkillChanges = useMemo(() => {
    const original = JSON.stringify(buildSkillItems(profile?.detected_skills));
    const current = JSON.stringify(skills);
    return original !== current;
  }, [profile?.detected_skills, skills]);

  const dynamicProfile: UserProfileData = {
    user_id: user?.id || profile?.user_id || '',
    cv_id: profile?.cv_id || currentCV?.cv_id || null,
    full_name: fullName,
    current_job_role: roleTitle,
    seniority: profile?.seniority || 'mid',
    years_experience: profile?.years_experience || null,
    location: profile?.location || null,
    preferred_modality: profile?.preferred_modality || null,
    availability: profile?.availability || null,
    alignment_score: profile?.alignment_score || normalizeScore(affinities[0]?.affinity_score),
    primary_specialty: primarySpecialty,
    secondary_affinities:
      profile?.secondary_affinities || affinities.filter((item) => !item.is_primary),
    all_affinities: profile?.all_affinities || affinities,
    domain_affinities: profile?.domain_affinities || [],
    detected_skills: skills,
    skill_gaps: profile?.skill_gaps || [],
    education: profile?.education || [],
    work_experience: profile?.work_experience || [],
    certifications: profile?.certifications || [],
  };

  const handleCloseAts = (open: boolean) => {
    if (!open && action === 'preview-ats') {
      router.push('/profile');
    }
  };

  const handleSaveSkills = async () => {
    const toastId = toast.loading('Guardando competencias...');
    try {
      await updateSkillsMutation.mutateAsync(skills);
      toast.dismiss(toastId);
      toast.success('Competencias actualizadas.');
    } catch (error) {
      console.error('Error saving skills:', error);
      toast.dismiss(toastId);
      toast.error('No se pudieron guardar las competencias.');
    }
  };

  const handleOpenDiagnosis = (clusterName: string) => {
    router.push(`/diagnosis?cluster=${encodeURIComponent(clusterName)}`);
  };

  if (error) {
    return (
      <ErrorFallback
        error={error}
        onRetry={() => window.location.reload()}
        onHome={() => (window.location.href = '/')}
        fullPage
      />
    );
  }

  // Show skeleton only during actual loading
  if (isLoading || !profile) {
    return <ProfileSkeleton />;
  }

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 md:px-6 space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between md:mt-10">
          <div className="space-y-1">
            <h1 className="text-2xl font-black tracking-tight text-foreground">Mi Perfil</h1>
            <p className="text-xs text-muted-foreground">
              Esta información proviene de tu CV y se utiliza para generar tus diagnósticos y
              recomendaciones.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" asChild className="h-10 gap-2 text-xs font-bold bg-card">
              <Link href="/profile/upload">
                <Upload className="h-4 w-4" />
                Subir nuevo CV
              </Link>
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsHistoryOpen(true)}
              className="h-10 gap-2 text-xs font-bold bg-card"
            >
              <History className="h-4 w-4" />
              Historial
            </Button>
          </div>
        </div>
        <ProfileUploadBanner />
        <DiagnosticLoadingBanner
          isUpdating={isUpdating}
          isDiagnosed={isDiagnosed}
          onDismiss={() => setIsBannerDismissed(true)}
        />
        <EmptyProfileBanner show={!profile?.cv_id} />

        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_360px] gap-5">
          <div className="space-y-5">
            <Card className="card-standard overflow-visible">
              <CardContent className="space-y-5">
                <div className="grid gap-5 lg:grid-cols-[1fr_auto]">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="min-w-0 space-y-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h2 className="text-lg font-black text-foreground truncate">
                            {fullName}
                          </h2>
                          <div className="group relative shrink-0">
                            <Info className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground cursor-help transition-colors" />
                            <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-52 rounded-md border border-border bg-card p-2 text-[10px] leading-relaxed text-muted-foreground opacity-0 shadow-lg transition-all group-hover:opacity-100 z-50">
                              Datos principales de tu perfil profesional generados desde tu CV.
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <p className="text-sm font-bold">{roleTitle}</p>
                          <Badge
                            variant="outline"
                            className="border-0 bg-info/10 text-info hover:bg-info/10"
                          >
                            {profile?.seniority || 'mid'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row lg:flex-col gap-3"></div>
                </div>

                {summary ? (
                  <div className="rounded-xl border border-primary/10 bg-primary/[0.04] p-4 md:p-5">
                    <p className="text-xs leading-7 text-foreground">{summary}</p>
                  </div>
                ) : isUpdating && !isDiagnosed ? (
                  <div className="w-full rounded-xl border border-primary/5 bg-muted/10 p-4 md:p-5 space-y-2 animate-pulse">
                    <div className="h-4 w-full bg-muted rounded" />
                    <div className="h-4 w-[85%] bg-muted rounded" />
                    <div className="h-4 w-[60%] bg-muted rounded" />
                  </div>
                ) : (
                  <div className="w-full rounded-xl border border-dashed border-border p-6 text-center">
                    <p className="text-xs font-semibold text-muted-foreground">
                      Aún no hay resumen profesional disponible.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="card-standard overflow-visible">
              <CardContent className="space-y-5">
                <div className="flex flex-col items-start gap-2">
                  <div className="flex items-center justify-center gap-2 shrink-0">
                    <div className="h-9 w-9 rounded-xl bg-info/10 text-info flex items-center justify-center shrink-0">
                      <Code2 className="h-4 w-4" />
                    </div>
                    <h3 className="text-md font-black text-foreground">Competencias técnicas</h3>
                    <div className="group relative">
                      <Info className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground cursor-help transition-colors" />
                      <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-52 rounded-md border border-border bg-card p-2 text-[10px] leading-relaxed text-muted-foreground opacity-0 shadow-lg transition-all group-hover:opacity-100 z-50">
                        Competencias técnicas detectadas en tu CV. Haz clic para editar evidencias y
                        puntuación ICT.
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Estas competencias se utilizan para el análisis de afinidad y diagnóstico. Haz
                    clic en una competencia para editar su evidencia y puntuación ICT.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {skills.length === 0 && isUpdating && !isDiagnosed ? (
                    <div className="flex flex-wrap gap-2 animate-pulse">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <div
                          key={i}
                          className="h-9 bg-muted rounded-lg"
                          style={{ width: `${Math.floor(Math.random() * (110 - 70) + 70)}px` }}
                        />
                      ))}
                    </div>
                  ) : skills.length === 0 ? (
                    <div className="w-full rounded-xl border border-dashed border-border p-6 text-center">
                      <p className="text-xs font-semibold text-muted-foreground">
                        Aún no hay competencias detectadas.
                      </p>
                    </div>
                  ) : (
                    skills.map((skill) => (
                      <span
                        key={`${skill.name}-${skill.skill_type}`}
                        onClick={() => {
                          setSelectedSkillForEvidence(skill);
                          setIsEvidenceModalOpen(true);
                        }}
                        className="inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-background px-3 text-xs font-bold text-foreground hover:border-primary/50 cursor-pointer transition-all select-none"
                        title="Haga clic para editar evidencias e ICT score"
                      >
                        <span className="max-w-[180px] truncate hover:text-primary transition-colors">
                          {skill.name}
                        </span>
                        {skill.ict_score !== undefined && isDiagnosed ? (
                          <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-medium">
                            ICT {skill.ict_score.toFixed(1)}
                          </span>
                        ) : !isDiagnosed ? (
                          <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded font-medium text-muted-foreground animate-pulse">
                            ICT --
                          </span>
                        ) : null}
                      </span>
                    ))
                  )}
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-border pt-4">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Info className="h-4 w-4 text-info shrink-0" />
                    <span>
                      Haz clic en cada competencia para ajustar su evidencia y puntuación ICT.
                    </span>
                  </div>
                  {hasSkillChanges && (
                    <Button
                      onClick={handleSaveSkills}
                      disabled={updateSkillsMutation.isPending}
                      className="h-9 gap-2 text-xs font-bold"
                    >
                      {updateSkillsMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <RefreshCw className="h-4 w-4" />
                      )}
                      Guardar competencias
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <aside className="space-y-5">
            <Card className="card-standard overflow-visible">
              <CardContent className="space-y-5">
                <div className="flex flex-col items-start gap-2">
                  <div className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-info" />
                    <h3 className="text-sm font-black text-foreground">Afinidades detectadas</h3>
                    <div className="group relative">
                      <Info className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground cursor-help transition-colors" />
                      <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-52 rounded-md border border-border bg-card p-2 text-[10px] leading-relaxed text-muted-foreground opacity-0 shadow-lg transition-all group-hover:opacity-100 z-50">
                        Especialidades del mercado con mayor coincidencia según tus competencias y
                        experiencia.
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-[11px] text-muted-foreground mt-1">
                      Especialidades con mayor afinidad según tu perfil.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {affinities.length === 0 && isUpdating && !isDiagnosed ? (
                    <div className="space-y-4 animate-pulse">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <div className="h-4 w-32 bg-muted rounded" />
                            <div className="h-4 w-8 bg-muted rounded" />
                          </div>
                          <div className="grid grid-cols-[1fr_auto] gap-3 items-center">
                            <div className="h-2 w-full bg-muted rounded-full" />
                            <div className="h-8 w-24 bg-muted rounded-lg" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : affinities.length === 0 ? (
                    <div className="w-full rounded-xl border border-dashed border-border p-6 text-center">
                      <p className="text-xs font-semibold text-muted-foreground">
                        Aún no hay afinidades detectadas.
                      </p>
                    </div>
                  ) : (
                    affinities.slice(0, 3).map((affinity) => {
                      const score = normalizeScore(affinity.affinity_score);
                      return (
                        <div
                          key={affinity.cluster_id || affinity.cluster_name}
                          className="space-y-2"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-black text-foreground truncate">
                              {affinity.cluster_name}
                            </span>
                            <span className="text-sm font-black text-success">{score}%</span>
                          </div>
                          <div className="grid grid-cols-[1fr_auto] gap-3 items-center">
                            <div className="h-2 rounded-full bg-muted overflow-hidden">
                              <div
                                className="h-full rounded-full bg-success transition-all"
                                style={{ width: `${Math.min(score, 100)}%` }}
                              />
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleOpenDiagnosis(affinity.cluster_name)}
                              className="h-8 text-[10px] font-bold bg-card"
                            >
                              Ver diagnóstico
                            </Button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {affinities.length > 3 ? (
                  <Button
                    variant="outline"
                    onClick={() => router.push('/diagnosis')}
                    className="w-full justify-between h-9 text-xs text-primary font-bold"
                  >
                    Ver todas las afinidades ({affinities.length})
                    <TrendingUp className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => router.push('/market')}
                    className="w-full justify-between h-9 text-xs text-primary font-bold border-dashed hover:bg-primary/5"
                  >
                    Explorar más especialidades
                    <TrendingUp className="h-4 w-4" />
                  </Button>
                )}
              </CardContent>
            </Card>

            <DomainAffinityCard
              domainAffinities={profile?.domain_affinities}
              isDiagnosed={isDiagnosed}
              isUpdating={isUpdating}
            />

            <Card className="card-standard overflow-visible">
              <CardContent className="space-y-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-col items-start gap-2">
                    <div className="flex gap-2 items-center">
                      <Clock3 className="h-5 w-5 text-info" />
                      <h3 className="text-sm font-black text-foreground">Curriculum base</h3>
                      <div className="group relative">
                        <Info className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground cursor-help transition-colors" />
                        <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-52 rounded-md border border-border bg-card p-2 text-[10px] leading-relaxed text-muted-foreground opacity-0 shadow-lg transition-all group-hover:opacity-100 z-50">
                          CV activo del cual se extraen las competencias y datos de tu perfil.
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="text-[11px] text-muted-foreground mt-1">
                        CV utilizado para el análisis de perfil.
                      </p>
                    </div>
                  </div>
                </div>

                {!currentCV ? (
                  <div className="w-full rounded-xl border border-dashed border-border p-6 text-center">
                    <p className="text-xs font-semibold text-muted-foreground">
                      Aún no hay curriculum cargado.
                    </p>
                  </div>
                ) : isUpdating && !isDiagnosed ? (
                  <div className="flex items-center gap-3 min-w-0 bg-secondary/10 p-3 rounded-xl border border-border animate-pulse">
                    <div className="h-9 w-9 rounded-lg bg-muted" />
                    <div className="min-w-0 flex-1 space-y-1.5">
                      <div className="h-4 w-48 bg-muted rounded" />
                      <div className="h-3 w-32 bg-muted/60 rounded" />
                    </div>
                    <div className="h-8 w-8 bg-muted rounded-lg" />
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3 min-w-0 bg-secondary/10 p-3 rounded-xl border border-border">
                      <div className="h-9 w-9 rounded-lg bg-destructive/10 text-destructive flex items-center justify-center shrink-0">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-black text-foreground flex items-center gap-1.5 min-w-0">
                          <span className="truncate">{currentCV.original_filename}</span>
                          <BadgeCheck className="h-3.5 w-3.5 text-success shrink-0" />
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {formatDate(currentCV.uploaded_at)} ·{' '}
                          {formatFileSize(currentCV.size_bytes)}
                        </p>
                      </div>
                      {currentCV.download_url && (
                        <Button
                          asChild
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer rounded-lg shrink-0"
                          title="Vista previa del CV"
                        >
                          <a href={currentCV.download_url} target="_blank" rel="noreferrer">
                            <Eye className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>

      <CVHistoryModal
        isOpen={isHistoryOpen}
        onOpenChange={setIsHistoryOpen}
        activeCvId={profile?.cv_id}
        onReanalyzeTriggered={(cvId) => {
          setIsHistoryOpen(false);
          router.push(`/profile/upload?cvId=${cvId}`);
        }}
      />

      <SkillEvidenceModal
        skill={selectedSkillForEvidence}
        isOpen={isEvidenceModalOpen}
        onOpenChange={setIsEvidenceModalOpen}
        onSave={(updatedSkill) => {
          setSkills((current) =>
            current.map((skill) =>
              skill.name.toLowerCase() === updatedSkill.name.toLowerCase() ? updatedSkill : skill,
            ),
          );
        }}
      />

      {isAtsOpen && (
        <CVAtsPreviewModal
          isOpen={isAtsOpen}
          onOpenChange={handleCloseAts}
          profile={dynamicProfile}
          userEmail={user?.email || undefined}
        />
      )}
    </>
  );
}
