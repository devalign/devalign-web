'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
  Plus,
  RefreshCw,
  Sparkles,
  Target,
  TrendingUp,
  Upload,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { LoadingScreen } from '@/components/shared/loading-screen';

import CVAtsPreviewModal from '@/components/profile/cv-ats-preview-modal';
import CVHistoryModal from '@/components/profile/cv-history-modal';
import CVUploader from '@/components/profile/cv-uploader';
import SkillEvidenceModal from '@/components/profile/skill-evidence-modal';
import { CVUpdateBanner } from '@/components/shared/cv-update-banner';
import { ErrorFallback } from '@/components/shared/error-fallback';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useCVAnalysis } from '@/contexts/cv-analysis-context';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useUserCVs } from '@/hooks/use-user-cvs';
import { useUpdateUserSkills, useUserProfile } from '@/hooks/use-user-profile';
import { cn } from '@/lib/utils';
import type { ClusterAffinityItem, SkillItem, UserProfileData } from '@/lib/api/types';

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

function buildProfessionalSummary(profile?: UserProfileData, roleTitle?: string) {
  if (!profile) {
    return '';
  }

  const role = roleTitle || profile.current_job_role || 'profesional tecnológico';
  const specialty = profile.primary_specialty || 'desarrollo de software';
  const years = profile.years_experience;
  const skills = (profile.detected_skills || [])
    .slice(0, 5)
    .map((skill) => skill.name)
    .filter(Boolean);

  const experienceText =
    years && years > 0 ? `con ${years} años de experiencia` : 'con experiencia comprobable';
  const skillsText =
    skills.length > 0
      ? ` Especializado en ${skills.join(', ')}.`
      : ' Perfil listo para enriquecer con competencias técnicas.';

  return `${role} ${experienceText}, orientado a ${specialty}.${skillsText}`;
}

function EmptyProfileState({ onUploadSuccess }: { onUploadSuccess: (newCvId: string) => void }) {
  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-black tracking-tight text-foreground">Mi Perfil</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Sube tu CV para generar tu perfil, afinidades y recomendaciones.
        </p>
      </div>

      <Card className="card-standard overflow-hidden">
        <CardContent className="p-6 md:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-center">
            <div className="space-y-5">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                <FileText className="h-6 w-6" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-black text-foreground">Aún no hay CV activo</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Tu perfil se construye desde el CV. Al subirlo, Devalign detectará tus
                  competencias, especialidades y afinidades principales de forma automática.
                </p>
              </div>
              <div className="space-y-3.5 pt-2">
                {[
                  'Análisis técnico automático de competencias',
                  'Resumen profesional autogenerado',
                  'Afinidades y alineación con especialidades del mercado',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <BadgeCheck className="h-4 w-4 text-success shrink-0" />
                    <span className="text-xs font-semibold text-foreground/80">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="rounded-2xl border border-dashed border-border bg-muted/20 p-6 md:p-8">
              <div className="mb-4">
                <h3 className="text-sm font-bold text-foreground">Subir tu CV</h3>
                <p className="text-xs text-muted-foreground">Formatos PDF o Word, máx 5MB.</p>
              </div>
              <CVUploader onUploadSuccess={onUploadSuccess} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ProfileDashboardView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: user, isLoading: isUserLoading, error: userError } = useCurrentUser();
  const { data: profile, isLoading: isProfileLoading, error: profileError, refetch: refetchProfile } = useUserProfile();
  const { data: cvData, isLoading: isCvLoading } = useUserCVs();
  const updateSkillsMutation = useUpdateUserSkills();
  const { startAnalysis } = useCVAnalysis();

  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [skills, setSkills] = useState<SkillItem[]>([]);
  const [newSkillText, setNewSkillText] = useState('');
  const [selectedSkillForEvidence, setSelectedSkillForEvidence] = useState<SkillItem | null>(null);
  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false);

  const action = searchParams.get('action');
  const isAtsOpen = action === 'preview-ats';

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

  const currentCV = profile?.cv_id
    ? cvs.find((cv) => cv.cv_id === profile.cv_id) || cvs[0]
    : cvs[0];

  const fullName = profile?.full_name || user?.full_name || user?.email?.split('@')[0] || 'Usuario';
  const roleTitle = profile?.current_job_role || 'Rol pendiente de detectar';
  const primarySpecialty = profile?.primary_specialty || 'Especialidad pendiente';
  const summary = buildProfessionalSummary(profile, roleTitle);
  const initials = getInitials(fullName);

  const affinities = useMemo(() => {
    const list: ClusterAffinityItem[] =
      profile?.all_affinities && profile.all_affinities.length > 0
        ? profile.all_affinities
        : [
            ...(profile?.primary_specialty
              ? [
                  {
                    cluster_id: 'primary',
                    cluster_name: profile.primary_specialty,
                    affinity_score: (profile.alignment_score || 0) / 100,
                    is_primary: true,
                  } satisfies ClusterAffinityItem,
                ]
              : []),
            ...(profile?.secondary_affinities || []),
          ];

    return [...list]
      .filter((item) => item.cluster_name)
      .sort((a, b) => normalizeScore(b.affinity_score) - normalizeScore(a.affinity_score));
  }, [profile]);

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

  const handleAddSkill = (event: React.FormEvent) => {
    event.preventDefault();
    const skillName = newSkillText.trim();
    if (!skillName) return;

    const exists = skills.some((skill) => skill.name.toLowerCase() === skillName.toLowerCase());
    if (exists) {
      toast.error('Esta competencia ya está registrada.');
      return;
    }

    setSkills((current) => [
      ...current,
      {
        name: skillName,
        skill_type: 'tech',
        market_importance: 'consolidated',
        market_demand_percentage: null,
      },
    ]);
    setNewSkillText('');
  };

  const handleRemoveSkill = (skillName: string) => {
    setSkills((current) => current.filter((skill) => skill.name !== skillName));
  };

  const handleSaveSkills = async () => {
    const toastId = toast.loading('Guardando competencias...');
    try {
      await updateSkillsMutation.mutateAsync(skills);
      await refetchProfile();
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

  const isLoading = isUserLoading || isProfileLoading || isCvLoading;

  const queryError = userError || profileError;
  if (queryError) {
    return (
      <ErrorFallback
        error={queryError}
        onRetry={() => refetchProfile()}
        onHome={() => window.location.href = '/'}
        fullPage
      />
    );
  }

  if (isLoading) {
    return <LoadingScreen message="Cargando perfil..." minHeight="min-h-[70vh]" />;
  }

  if (cvs.length === 0) {
    return (
      <EmptyProfileState
        onUploadSuccess={(newCvId) => {
          startAnalysis(newCvId);
        }}
      />
    );
  }

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-6">
        <CVUpdateBanner />

        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between md:mt-10">
          <div className="space-y-1">
            <h1 className="text-2xl font-black tracking-tight text-foreground">Mi Perfil</h1>
            <p className="text-xs text-muted-foreground">
              Esta información proviene de tu CV y se utiliza para generar tus diagnósticos y
              recomendaciones.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setIsUploadOpen(true)}
              className="h-10 gap-2 text-xs font-bold bg-card"
            >
              <Upload className="h-4 w-4" />
              Subir nuevo CV
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

        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_360px] gap-5">
          <div className="space-y-5">
            <Card className="card-standard overflow-hidden">
              <CardContent className="space-y-5">
                <div className="grid gap-5 lg:grid-cols-[1fr_auto]">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="min-w-0 space-y-2">
                      <div className="space-y-1">
                        <h2 className="text-lg font-black text-foreground truncate">{fullName}</h2>
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

                  <div className="flex flex-col sm:flex-row lg:flex-col gap-3">
                    <Button
                      variant="outline"
                      onClick={() => router.push('/profile?action=preview-ats')}
                      className="h-9 gap-2 text-xs font-bold bg-card"
                    >
                      <FileText className="h-4 w-4" />
                      Exportar CV ATS
                    </Button>
                  </div>
                </div>

                <div className="rounded-xl border border-primary/10 bg-primary/[0.04] p-4 md:p-5">
                  <p className="text-xs leading-7 text-foreground">
                    {summary || 'Sube o actualiza tu CV para generar un resumen profesional.'}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="card-standard overflow-hidden">
              <CardContent className="space-y-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex flex-col items-start gap-3">
                    <div className="flex items-center justify-center gap-2 shrink-0">
                      <div className="h-9 w-9 rounded-xl bg-info/10 text-info flex items-center justify-center shrink-0">
                        <Code2 className="h-4 w-4" />
                      </div>
                      <h3 className="text-md font-black text-foreground">Competencias técnicas</h3>
                    </div>
                    <p className="text-xs text-muted-foreground my-1">
                      Estas competencias se utilizan para el análisis de afinidad y diagnóstico.
                    </p>
                  </div>

                  <form onSubmit={handleAddSkill} className="flex gap-2 sm:min-w-[320px]">
                    <Input
                      value={newSkillText}
                      onChange={(event) => setNewSkillText(event.target.value)}
                      placeholder="Ej. React, Docker, AWS..."
                      className="h-9 text-xs bg-card"
                    />
                    <Button type="submit" variant="outline" className="h-9 gap-2 text-xs bg-card">
                      <Plus className="h-4 w-4" />
                      Agregar
                    </Button>
                  </form>
                </div>

                <div className="flex flex-wrap gap-2">
                  {skills.length === 0 ? (
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
                        className="inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-background px-3 text-xs font-bold text-foreground hover:border-primary/50 cursor-pointer transition-all select-none group"
                        title="Haga clic para editar evidencias e ICT score"
                      >
                        <span className="h-2 w-2 rounded-full bg-success" />
                        <span className="max-w-[180px] truncate group-hover:text-primary transition-colors">{skill.name}</span>
                        {skill.ict_score !== undefined && (
                          <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-medium">
                            ICT {skill.ict_score.toFixed(1)}
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveSkill(skill.name);
                          }}
                          className="text-muted-foreground hover:text-destructive transition-colors ml-1"
                          aria-label={`Eliminar ${skill.name}`}
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </span>
                    ))
                  )}
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-border pt-4">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Info className="h-4 w-4 text-info shrink-0" />
                    <span>
                      Puedes agregar, editar o eliminar competencias para mejorar la precisión de
                      tus diagnósticos.
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
            <Card className="card-standard overflow-hidden">
              <CardContent className="space-y-5">
                <div className="flex flex-col items-start gap-2">
                  <div className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-info" />
                    <h3 className="text-sm font-black text-foreground">Afinidades detectadas</h3>
                  </div>
                  <div>
                    <p className="text-[11px] text-muted-foreground mt-1">
                      Especialidades con mayor afinidad según tu perfil.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {affinities.length === 0 ? (
                    <p className="text-xs text-muted-foreground text-center py-6">
                      Aún no hay afinidades detectadas.
                    </p>
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

            <Card className="card-standard overflow-hidden">
              <CardContent className="space-y-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-col items-start gap-2">
                    <div className="flex gap-2 items-center">
                      <Clock3 className="h-5 w-5 text-info" />
                      <h3 className="text-sm font-black text-foreground">Último análisis</h3>
                    </div>
                    <div>
                      <p className="text-[11px] text-muted-foreground mt-1">
                        CV analizado más recientemente.
                      </p>
                    </div>
                  </div>
                </div>

                {currentCV && (
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
                        {formatDate(currentCV.uploaded_at)} · {formatFileSize(currentCV.size_bytes)}
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
                )}
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>

      <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <DialogContent className="sm:max-w-[500px] border-border bg-card">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold text-foreground">Subir nuevo CV</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Carga una versión reciente para actualizar tu perfil y recalcular tus afinidades.
            </DialogDescription>
          </DialogHeader>
          <CVUploader
            onUploadSuccess={(newCvId) => {
              setIsUploadOpen(false);
              startAnalysis(newCvId);
            }}
          />
        </DialogContent>
      </Dialog>

      <CVHistoryModal
        isOpen={isHistoryOpen}
        onOpenChange={setIsHistoryOpen}
        activeCvId={profile?.cv_id}
        onReanalyzeTriggered={(cvId) => startAnalysis(cvId)}
      />

      <SkillEvidenceModal
        skill={selectedSkillForEvidence}
        isOpen={isEvidenceModalOpen}
        onOpenChange={setIsEvidenceModalOpen}
        onSave={(updatedSkill) => {
          setSkills((current) =>
            current.map((skill) =>
              skill.name.toLowerCase() === updatedSkill.name.toLowerCase() ? updatedSkill : skill
            )
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
