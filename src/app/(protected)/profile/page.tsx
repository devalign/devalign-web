'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useUserProfile, useUpdateUserProfile } from '@/hooks/use-user-profile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Award,
  Briefcase,
  GraduationCap,
  Plus,
  Sparkles,
  X,
  ChevronLeft,
  Save,
  Trash2,
  Pencil,
  Check,
  FileText,
  HardDrive,
  Download,
  ShieldCheck,
  Upload,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import CVAtsPreviewModal from '@/components/profile/cv-ats-preview-modal';
import CVUploader from '@/components/profile/cv-uploader';
import { useUserCVs } from '@/hooks/use-user-cvs';
import { UserProfileData } from '@/lib/api/types';

interface Experience {
  role: string;
  company: string;
  period: string;
  description: string;
}

interface Certification {
  name: string;
  issuer: string;
  date: string;
}

interface Education {
  degree: string;
  institution: string;
  start_date: string;
  end_date: string | null;
}

function ProfileContent() {
  const { data: user, isLoading: isUserLoading } = useCurrentUser();
  const { data: profile, isLoading: isProfileLoading, refetch: refetchProfile } = useUserProfile();
  const { data: cvData, isLoading: isCvLoading, refetch: refetchCVs } = useUserCVs();
  const currentCV = profile?.cv_id 
    ? cvData?.cvs?.find((cv) => cv.cv_id === profile.cv_id) || cvData?.cvs?.[0]
    : cvData?.cvs?.[0];
  const updateProfileMutation = useUpdateUserProfile();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Local States
  const [fullName, setFullName] = useState('');
  const [roleTitle, setRoleTitle] = useState('');
  const [seniority, setSeniority] = useState('mid');

  // Edit states
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [editingExperienceIdx, setEditingExperienceIdx] = useState<number | null>(null);
  const [editingEducationIdx, setEditingEducationIdx] = useState<number | null>(null);
  const [editingCertIdx, setEditingCertIdx] = useState<number | null>(null);

  // Education State
  const [educationList, setEducationList] = useState<Education[]>([]);

  // Experience State
  const [experiences, setExperiences] = useState<Experience[]>([]);

  // Certifications State
  const [certifications, setCertifications] = useState<Certification[]>([]);

  // Skills Lists
  const [techSkills, setTechSkills] = useState<string[]>([]);
  const [softSkills, setSoftSkills] = useState<string[]>([]);
  const [toolsSkills, setToolsSkills] = useState<string[]>([]);
  const [methodologySkills, setMethodologySkills] = useState<string[]>([]);

  // Active Tab for Skills editing
  const [activeTab, setActiveTab] = useState<'tech' | 'soft' | 'tools' | 'methodologies'>('tech');
  const [newSkillText, setNewSkillText] = useState('');

  const [isSaving, setIsSaving] = useState(false);

  // Modal actions from query parameters
  const action = searchParams.get('action');
  const [isCVManagerOpen, setIsCVManagerOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isUpdatingFromCV, setIsUpdatingFromCV] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (action === 'preview-ats') {
        setIsCVManagerOpen(true);
      } else {
        setIsCVManagerOpen(false);
      }
    }, 0);
    return () => clearTimeout(timeoutId);
  }, [action]);

  const handleCloseCVManager = (open: boolean) => {
    setIsCVManagerOpen(open);
    if (!open && action === 'preview-ats') {
      router.push('/profile');
    }
  };

  // Check backend connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1';
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);
        await fetch(API_BASE_URL, {
          method: 'GET',
          signal: controller.signal,
          mode: 'no-cors',
        });
        clearTimeout(timeoutId);
      } catch {
        toast.warning(
          'El servidor de análisis (backend) está fuera de línea. Operando en modo de simulación local.',
          {
            duration: 8000,
            id: 'backend-offline-warning',
          },
        );
      }
    };
    checkConnection();
  }, []);

  // Load profile data into state once loaded
  useEffect(() => {
    const loadProfileData = () => {
      if (profile) {
        setFullName(profile.full_name || user?.full_name || user?.email?.split('@')[0] || 'Desarrollador');
        setRoleTitle(profile.current_job_role || '');
        setSeniority(profile.seniority || 'mid');

        if (profile.education && profile.education.length > 0) {
          setEducationList(
            profile.education.map((edu) => ({
              degree: edu.degree,
              institution: edu.institution,
              start_date: edu.start_date || '2021',
              end_date: edu.end_date || '2026',
            })),
          );
        } else {
          setEducationList([]);
        }

        if (profile.work_experience && profile.work_experience.length > 0) {
          setExperiences(
            profile.work_experience.map((exp) => ({
              role: exp.role,
              company: exp.company,
              period: `${exp.start_date} — ${exp.current ? 'Presente' : exp.end_date || ''}`,
              description: exp.description || '',
            })),
          );
        } else {
          setExperiences([]);
        }

        if (profile.certifications && profile.certifications.length > 0) {
          setCertifications(
            profile.certifications.map((c) => ({
              name: c.name,
              issuer: c.issuer || '',
              date: c.date || '',
            })),
          );
        } else {
          setCertifications([]);
        }

        if (profile.detected_skills && profile.detected_skills.length > 0) {
          const tech = profile.detected_skills
            .filter((s) => s.skill_type === 'hard_skill')
            .map((s) => s.name);
          const soft = profile.detected_skills
            .filter((s) => s.skill_type === 'soft_skill')
            .map((s) => s.name);
          const tools = profile.detected_skills
            .filter((s) => s.skill_type === 'tool')
            .map((s) => s.name);
          const methodologies = profile.detected_skills
            .filter((s) => s.skill_type === 'methodology')
            .map((s) => s.name);

          setTechSkills(tech);
          setSoftSkills(soft);
          setToolsSkills(tools);
          setMethodologySkills(methodologies);
        } else {
          setTechSkills([]);
          setSoftSkills([]);
          setToolsSkills([]);
          setMethodologySkills([]);
        }
      } else if (user) {
        setFullName(user.full_name || user.email?.split('@')[0] || 'Desarrollador');
        setRoleTitle('');
        setSeniority('mid');
        setEducationList([]);
        setExperiences([]);
        setCertifications([]);
        setTechSkills([]);
        setSoftSkills([]);
        setToolsSkills([]);
        setMethodologySkills([]);
      }
    };

    const timeoutId = setTimeout(loadProfileData, 0);
    return () => clearTimeout(timeoutId);
  }, [profile, user]);

  // Skill Handling Actions
  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillText.trim()) return;
    const skillName = newSkillText.trim();

    if (activeTab === 'tech') {
      if (techSkills.includes(skillName)) return toast.error('Habilidad ya añadida');
      setTechSkills([...techSkills, skillName]);
    } else if (activeTab === 'soft') {
      if (softSkills.includes(skillName)) return toast.error('Habilidad ya añadida');
      setSoftSkills([...softSkills, skillName]);
    } else if (activeTab === 'tools') {
      if (toolsSkills.includes(skillName)) return toast.error('Habilidad ya añadida');
      setToolsSkills([...toolsSkills, skillName]);
    } else {
      if (methodologySkills.includes(skillName)) return toast.error('Habilidad ya añadida');
      setMethodologySkills([...methodologySkills, skillName]);
    }

    setNewSkillText('');
    toast.success(`Habilidad "${skillName}" añadida localmente.`);
  };

  const handleDeleteSkill = (skillName: string, type: 'tech' | 'soft' | 'tools' | 'methodologies') => {
    if (type === 'tech') setTechSkills(techSkills.filter((s) => s !== skillName));
    if (type === 'soft') setSoftSkills(softSkills.filter((s) => s !== skillName));
    if (type === 'tools') setToolsSkills(toolsSkills.filter((s) => s !== skillName));
    if (type === 'methodologies') setMethodologySkills(methodologySkills.filter((s) => s !== skillName));
    toast.info(`Habilidad "${skillName}" removida.`);
  };

  // List Modification Actions
  const handleAddExperience = () => {
    const newIdx = experiences.length;
    setExperiences([...experiences, { role: '', company: '', period: '', description: '' }]);
    setEditingExperienceIdx(newIdx);
  };

  const handleRemoveExperience = (idx: number) => {
    setExperiences(experiences.filter((_, i) => i !== idx));
    if (editingExperienceIdx === idx) {
      setEditingExperienceIdx(null);
    } else if (editingExperienceIdx !== null && editingExperienceIdx > idx) {
      setEditingExperienceIdx(editingExperienceIdx - 1);
    }
  };

  const handleAddEducation = () => {
    const newIdx = educationList.length;
    setEducationList([
      ...educationList,
      { degree: '', institution: '', start_date: '2021', end_date: '2026' },
    ]);
    setEditingEducationIdx(newIdx);
  };

  const handleRemoveEducation = (idx: number) => {
    setEducationList(educationList.filter((_, i) => i !== idx));
    if (editingEducationIdx === idx) {
      setEditingEducationIdx(null);
    } else if (editingEducationIdx !== null && editingEducationIdx > idx) {
      setEditingEducationIdx(editingEducationIdx - 1);
    }
  };

  const handleAddCertification = () => {
    const newIdx = certifications.length;
    setCertifications([...certifications, { name: '', issuer: '', date: '' }]);
    setEditingCertIdx(newIdx);
  };

  const handleRemoveCertification = (idx: number) => {
    setCertifications(certifications.filter((_, i) => i !== idx));
    if (editingCertIdx === idx) {
      setEditingCertIdx(null);
    } else if (editingCertIdx !== null && editingCertIdx > idx) {
      setEditingCertIdx(editingCertIdx - 1);
    }
  };

  // Construct payload formatted for backend/API
  const workExperiencePayload = experiences.map((exp) => {
    const parts = exp.period.split('—').map((p) => p.trim());
    const isCurrent = parts[1]?.toLowerCase().includes('presente') || false;
    return {
      company: exp.company,
      role: exp.role,
      description: exp.description,
      start_date: parts[0] || '2025',
      end_date: isCurrent ? null : parts[1] || null,
      current: isCurrent,
    };
  });

  const educationPayload = educationList.map((edu) => ({
    degree: edu.degree,
    institution: edu.institution,
    start_date: edu.start_date || '2021',
    end_date: edu.end_date || null,
  }));

  const certificationsPayload = certifications.map((c) => ({
    name: c.name,
    issuer: c.issuer,
    date: c.date,
  }));

  const detectedSkillsPayload = [
    ...techSkills.map((s) => ({ name: s, skill_type: 'hard_skill', market_importance: 'consolidated' })),
    ...softSkills.map((s) => ({ name: s, skill_type: 'soft_skill', market_importance: 'consolidated' })),
    ...toolsSkills.map((s) => ({ name: s, skill_type: 'tool', market_importance: 'consolidated' })),
    ...methodologySkills.map((s) => ({ name: s, skill_type: 'methodology', market_importance: 'consolidated' })),
  ];

  // Construct dynamicProfile for ATS PDF Preview
  const dynamicProfile: UserProfileData = {
    user_id: user?.id || 'mock-user-id',
    cv_id: profile?.cv_id || 'mock-cv-id',
    full_name: fullName,
    current_job_role: roleTitle,
    seniority: seniority,
    years_experience: profile?.years_experience || 2,
    location: profile?.location || 'Lima, Peru',
    preferred_modality: profile?.preferred_modality || 'Híbrido / Presencial',
    availability: profile?.availability || 'Inmediata',
    alignment_score: profile?.alignment_score || 72,
    primary_specialty: profile?.primary_specialty || 'Data Engineering',
    secondary_affinities: profile?.secondary_affinities || [],
    detected_skills: detectedSkillsPayload,
    skill_gaps: profile?.skill_gaps || [],
    education: educationPayload,
    work_experience: workExperiencePayload,
    certifications: certificationsPayload,
  };

  // Submit profile updates
  const handleSaveProfile = async () => {
    setIsSaving(true);
    const toastId = toast.loading('Guardando perfil y recalculando diagnóstico...');

    try {
      // Execute Mutation with API
      await updateProfileMutation.mutateAsync({
        full_name: fullName,
        current_job_role: roleTitle,
        seniority: seniority,
        work_experience: workExperiencePayload,
        education: educationPayload,
        certifications: certificationsPayload,
        detected_skills: detectedSkillsPayload,
      });

      // Simulation delay for ML Engine Recalculation (1.5 seconds)
      setTimeout(() => {
        toast.dismiss(toastId);
        toast.success('¡Perfil guardado! Motor ML recalculó el diagnóstico con éxito.');
        router.push('/dashboard?recalculate=true');
      }, 1500);
    } catch (error) {
      console.warn('API error updating profile, falling back to local simulation:', error);

      // Fallback local simulation if backend API is not responding/stubbed
      setTimeout(() => {
        toast.dismiss(toastId);
        toast.success('¡Perfil guardado localmente! Redirigiendo a vista Diagnóstico...');

        // Save to localStorage so that page.tsx can read it in MVP if backend is mocked
        const localData = {
          fullName,
          roleTitle,
          seniority,
          work_experience: workExperiencePayload,
          education: educationPayload,
          certifications: certificationsPayload,
          detected_skills: detectedSkillsPayload,
        };
        localStorage.setItem('devalign_profile_draft', JSON.stringify(localData));

        router.push('/dashboard?recalculate=true');
      }, 1500);
    }
  };

  if (isUserLoading || isProfileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-xs text-muted-foreground font-semibold">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 py-6 relative">
        {/* Carga Reactiva tras Subir CV */}
        {isUpdatingFromCV && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/60 backdrop-blur-sm transition-all duration-300">
            <div className="flex flex-col items-center gap-3 p-6 bg-card border border-border shadow-2xl rounded-2xl animate-in zoom-in-95 fade-in-0 duration-300">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
              <div className="text-center">
                <p className="text-sm font-bold text-foreground">Actualizando Perfil</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Sincronizando los datos extraídos de tu nuevo CV...
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Back Button & CV Export Action */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/dashboard')}
            className="text-muted-foreground hover:text-foreground hover:bg-secondary/40 text-xs gap-1 h-8 cursor-pointer pl-2 pr-3"
          >
            <ChevronLeft className="w-4 h-4" />
            Volver al Diagnóstico
          </Button>

          <Button
            variant="default"
            size="sm"
            onClick={() => router.push('/profile?action=preview-ats')}
            className="text-xs font-semibold gap-1.5 h-8 cursor-pointer pl-3 pr-4"
          >
            <FileText className="w-4 h-4" />
            Exportar CV ATS
          </Button>
        </div>
        <div className={cn("grid grid-cols-1 lg:grid-cols-12 gap-8 items-start transition-opacity duration-300", isUpdatingFromCV && "opacity-40 pointer-events-none")}>
          {/* Left Column (Info Principal, Habilidades, Educación) - Width 5/12 */}
          <div className="lg:col-span-5 space-y-6">
            {/* 1. Información Principal */}
            <Card className="shadow-lg shadow-black/5 border-border bg-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-xs font-extrabold text-foreground uppercase tracking-wider">
                  Información Profesional
                </CardTitle>
                {!isEditingInfo ? (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsEditingInfo(true)}
                    className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-lg cursor-pointer"
                    title="Editar información principal"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsEditingInfo(false)}
                    className="h-8 w-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded-lg cursor-pointer"
                    title="Listo"
                  >
                    <Check className="w-4 h-4" />
                  </Button>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                {!isEditingInfo ? (
                  <div className="space-y-3">
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                        Nombre Completo
                      </p>
                      <p className="text-sm font-semibold text-foreground mt-0.5">
                        {fullName || 'Sin nombre registrado'}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                        Cargo / Rol de Interés
                      </p>
                      <p className="text-sm font-semibold text-foreground mt-0.5">
                        {roleTitle || 'Sin cargo registrado'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                        Nombre Completo
                      </label>
                      <Input
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="h-10 text-sm font-semibold bg-secondary/20 hover:bg-secondary/35 focus:bg-card transition-colors"
                        placeholder="Tu nombre completo"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                        Cargo / Rol de Interés
                      </label>
                      <Input
                        value={roleTitle}
                        onChange={(e) => setRoleTitle(e.target.value)}
                        className="h-10 text-sm font-semibold bg-secondary/20 hover:bg-secondary/35 focus:bg-card transition-colors"
                        placeholder="Ej. Data Engineer, Backend Developer..."
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Currículum Base Card */}
            <Card className="shadow-lg shadow-black/5 border-border bg-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-xs font-extrabold text-foreground uppercase tracking-wider">
                  Currículum Base
                </CardTitle>
                {currentCV && (
                  <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/5 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                    Analizado
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                {isCvLoading ? (
                  <div className="space-y-2 py-2">
                    <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                    <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
                  </div>
                ) : currentCV ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 min-w-0 bg-secondary/10 p-3 rounded-xl border border-border/40">
                      <div className="rounded-xl bg-red-50 p-2 text-red-500 shrink-0 dark:bg-red-950/30">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div className="space-y-0.5 min-w-0 flex-1">
                        <p
                          className="text-xs font-semibold text-foreground truncate max-w-[180px] sm:max-w-[220px]"
                          title={currentCV.original_filename}
                        >
                          {currentCV.original_filename}
                        </p>
                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-mono">
                          <span className="flex items-center gap-0.5 shrink-0">
                            <HardDrive className="h-3 w-3 text-muted-foreground/60" />
                            {(currentCV.size_bytes / 1024 / 1024).toFixed(2)} MB
                          </span>
                          {currentCV.uploaded_at && (
                            <>
                              <span>&bull;</span>
                              <span>{new Date(currentCV.uploaded_at).toLocaleDateString()}</span>
                            </>
                          )}
                        </div>
                      </div>
                      {currentCV.download_url && (
                        <Button
                          asChild
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer rounded-lg shrink-0"
                          title="Descargar PDF original"
                        >
                          <a href={currentCV.download_url} download target="_blank" rel="noreferrer">
                            <Download className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-border bg-secondary/5 p-4 text-center">
                    <FileText className="h-6 w-6 text-muted-foreground/50 mx-auto mb-2" />
                    <p className="text-xs font-semibold text-foreground">No tienes ningún currículum activo</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">
                      Sube tu CV en PDF o Word para calcular tu diagnóstico técnico de forma automática.
                    </p>
                  </div>
                )}

                <div className="pt-2 border-t border-border/50">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsUploadModalOpen(true)}
                    className="w-full text-xs font-semibold gap-1.5 h-9 cursor-pointer border-dashed border-primary/30 hover:border-primary/50 text-primary hover:bg-primary/5 transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    Actualizar CV
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* 2. Habilidades e Idiomas */}
            <Card className="shadow-lg shadow-black/5 border-border bg-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xs font-extrabold text-foreground uppercase tracking-wider">
                    Habilidades e Idiomas
                  </CardTitle>
                </div>

                {/* Tabs */}
                <div className="grid grid-cols-4 gap-1 bg-secondary/35 p-0.5 rounded-lg border border-border/50 mt-3">
                  {(['tech', 'soft', 'tools', 'methodologies'] as const).map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveTab(tab)}
                      className={`py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                        activeTab === tab
                          ? 'bg-card text-foreground shadow-xs'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {tab === 'tech' ? 'Técnicas' : tab === 'soft' ? 'Blandas' : tab === 'methodologies' ? 'Metodologías' : 'Herramientas'}
                    </button>
                  ))}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Chips Grid */}
                <div className="flex flex-wrap items-start content-start gap-1.5 min-h-24 p-3 rounded-lg border border-dashed border-border bg-secondary/5">
                  {(activeTab === 'tech'
                    ? techSkills
                    : activeTab === 'soft'
                      ? softSkills
                      : activeTab === 'tools'
                        ? toolsSkills
                        : methodologySkills
                  ).length === 0 ? (
                    <p className="text-[10px] text-muted-foreground m-auto">
                      No hay habilidades en esta categoría.
                    </p>
                  ) : (
                    (activeTab === 'tech'
                      ? techSkills
                      : activeTab === 'soft'
                        ? softSkills
                        : activeTab === 'tools'
                          ? toolsSkills
                          : methodologySkills
                    ).map((skill) => (
                      <div
                        key={skill}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20 transition-all hover:bg-primary/20 group"
                      >
                        <span>{skill}</span>
                        <button
                          type="button"
                          onClick={() => handleDeleteSkill(skill, activeTab)}
                          className="opacity-50 hover:opacity-100 hover:text-destructive transition-opacity cursor-pointer focus:outline-hidden"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>

                {/* Add Skill Form */}
                <form onSubmit={handleAddSkill} className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Ej. Docker, AWS, React, Inglés..."
                    value={newSkillText}
                    onChange={(e) => setNewSkillText(e.target.value)}
                    className="h-9 text-xs bg-secondary/20 hover:bg-secondary/35 focus:bg-card transition-colors"
                  />
                  <Button
                    type="submit"
                    size="sm"
                    className="h-9 px-4 text-xs font-semibold cursor-pointer shrink-0"
                  >
                    <Plus className="w-4 h-4 mr-1" /> Añadir
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* 3. Educación Académica (Movido aquí para balancear el scroll) */}
            <Card className="shadow-lg shadow-black/5 border-border bg-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4.5 h-4.5 text-primary" />
                  <CardTitle className="text-xs font-extrabold text-foreground uppercase tracking-wider">
                    Educación Académica
                  </CardTitle>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddEducation}
                  className="text-primary hover:bg-primary/10 border-primary/30 text-xs h-7 gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Añadir
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {educationList.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-4">
                    No has registrado educación académica.
                  </p>
                ) : (
                  educationList.map((edu, idx) => {
                    const isEditing = editingEducationIdx === idx;
                    return (
                      <div
                        key={idx}
                        className="p-3 rounded-xl border border-border bg-secondary/5 space-y-2 relative group transition-all duration-200"
                      >
                        {!isEditing ? (
                          <div className="flex items-start justify-between gap-4">
                            <div className="space-y-1">
                              <h4 className="text-xs font-bold text-foreground">
                                {edu.degree || 'Sin título registrado'}
                              </h4>
                              <p className="text-[11px] text-muted-foreground">
                                {edu.institution || 'Sin institución registrada'}
                              </p>
                              {(edu.start_date || edu.end_date) && (
                                <p className="text-[10px] text-muted-foreground/85 font-medium">
                                  {edu.start_date} — {edu.end_date || 'Presente'}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => setEditingEducationIdx(idx)}
                                className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-secondary/80 rounded-lg cursor-pointer"
                                title="Editar educación"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemoveEducation(idx)}
                                className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg cursor-pointer"
                                title="Eliminar educación"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                                Editando Educación
                              </span>
                              <div className="flex items-center gap-1">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setEditingEducationIdx(null)}
                                  className="h-7 w-7 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded-lg cursor-pointer"
                                  title="Listo"
                                >
                                  <Check className="w-4 h-4" />
                                </Button>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleRemoveEducation(idx)}
                                  className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg cursor-pointer"
                                  title="Eliminar educación"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                              </div>
                            </div>

                            <div className="space-y-2 pr-6">
                              <div className="space-y-0.5">
                                <label className="text-[9px] font-bold text-muted-foreground uppercase">
                                  Título / Carrera
                                </label>
                                <Input
                                  value={edu.degree}
                                  onChange={(e) => {
                                    const newEdus = [...educationList];
                                    newEdus[idx].degree = e.target.value;
                                    setEducationList(newEdus);
                                  }}
                                  placeholder="Ej. Ingeniería de Sistemas..."
                                  className="h-8 text-xs bg-card"
                                />
                              </div>

                              <div className="space-y-0.5">
                                <label className="text-[9px] font-bold text-muted-foreground uppercase">
                                  Institución
                                </label>
                                <Input
                                  value={edu.institution}
                                  onChange={(e) => {
                                    const newEdus = [...educationList];
                                    newEdus[idx].institution = e.target.value;
                                    setEducationList(newEdus);
                                  }}
                                  placeholder="Ej. Universidad UPC..."
                                  className="h-8 text-xs bg-card"
                                />
                              </div>

                              <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-0.5">
                                  <label className="text-[9px] font-bold text-muted-foreground uppercase">
                                    Año Inicio
                                  </label>
                                  <Input
                                    value={edu.start_date || ''}
                                    onChange={(e) => {
                                      const newEdus = [...educationList];
                                      newEdus[idx].start_date = e.target.value;
                                      setEducationList(newEdus);
                                    }}
                                    placeholder="Ej. 2021"
                                    className="h-8 text-xs bg-card"
                                  />
                                </div>
                                <div className="space-y-0.5">
                                  <label className="text-[9px] font-bold text-muted-foreground uppercase">
                                    Año Fin
                                  </label>
                                  <Input
                                    value={edu.end_date || ''}
                                    onChange={(e) => {
                                      const newEdus = [...educationList];
                                      newEdus[idx].end_date = e.target.value || null;
                                      setEducationList(newEdus);
                                    }}
                                    placeholder="Ej. 2026"
                                    className="h-8 text-xs bg-card"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column (Experience & Certifications) - Width 7/12 */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. Experiencia Laboral (Diseño Minimalista y Compacto) */}
            <Card className="shadow-lg shadow-black/5 border-border bg-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-primary" />
                  <CardTitle className="text-xs font-extrabold text-foreground uppercase tracking-wider">
                    Experiencia Laboral
                  </CardTitle>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddExperience}
                  className="text-primary hover:bg-primary/10 border-primary/30 text-xs h-7 gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Añadir puesto
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {experiences.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-4">
                    No has registrado puestos laborales.
                  </p>
                ) : (
                  experiences.map((exp, idx) => {
                    const isEditing = editingExperienceIdx === idx;
                    return (
                      <div
                        key={idx}
                        className="p-3 rounded-xl border border-border bg-secondary/5 space-y-2 relative group transition-all duration-200"
                      >
                        {!isEditing ? (
                          <div className="flex items-start justify-between gap-4">
                            <div className="space-y-1">
                              <h4 className="text-xs font-bold text-foreground">
                                {exp.role || 'Sin cargo registrado'}
                              </h4>
                              <p className="text-[11px] text-muted-foreground font-medium">
                                {exp.company || 'Sin empresa registrada'} &bull;{' '}
                                <span className="text-[10px] text-muted-foreground/85 font-normal">
                                  {exp.period || 'Sin periodo'}
                                </span>
                              </p>
                              {exp.description && (
                                <p className="text-[11px] text-muted-foreground/80 leading-normal line-clamp-2 mt-1 whitespace-pre-line">
                                  {exp.description}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => setEditingExperienceIdx(idx)}
                                className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-secondary/80 rounded-lg cursor-pointer"
                                title="Editar experiencia"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemoveExperience(idx)}
                                className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg cursor-pointer"
                                title="Eliminar experiencia"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                                Editando Experiencia
                              </span>
                              <div className="flex items-center gap-1">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setEditingExperienceIdx(null)}
                                  className="h-7 w-7 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded-lg cursor-pointer"
                                  title="Listo"
                                >
                                  <Check className="w-4 h-4" />
                                </Button>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleRemoveExperience(idx)}
                                  className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg cursor-pointer"
                                  title="Eliminar experiencia"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pr-6">
                              <div className="space-y-0.5">
                                <label className="text-[9px] font-bold text-muted-foreground uppercase">
                                  Cargo
                                </label>
                                <Input
                                  value={exp.role}
                                  onChange={(e) => {
                                    const newExps = [...experiences];
                                    newExps[idx].role = e.target.value;
                                    setExperiences(newExps);
                                  }}
                                  placeholder="Ej. Líder Técnico..."
                                  className="h-8 text-xs bg-card"
                                />
                              </div>

                              <div className="space-y-0.5">
                                <label className="text-[9px] font-bold text-muted-foreground uppercase">
                                  Empresa
                                </label>
                                <Input
                                  value={exp.company}
                                  onChange={(e) => {
                                    const newExps = [...experiences];
                                    newExps[idx].company = e.target.value;
                                    setExperiences(newExps);
                                  }}
                                  placeholder="Ej. BCP..."
                                  className="h-8 text-xs bg-card"
                                />
                              </div>

                              <div className="space-y-0.5">
                                <label className="text-[9px] font-bold text-muted-foreground uppercase">
                                  Periodo
                                </label>
                                <Input
                                  value={exp.period}
                                  onChange={(e) => {
                                    const newExps = [...experiences];
                                    newExps[idx].period = e.target.value;
                                    setExperiences(newExps);
                                  }}
                                  placeholder="Ej. Junio 2025 — Presente"
                                  className="h-8 text-xs bg-card"
                                />
                              </div>
                            </div>

                            <div className="space-y-0.5 pr-6">
                              <label className="text-[9px] font-bold text-muted-foreground uppercase">
                                Descripción del Cargo
                              </label>
                              <textarea
                                value={exp.description}
                                onChange={(e) => {
                                  const newExps = [...experiences];
                                  newExps[idx].description = e.target.value;
                                  setExperiences(newExps);
                                }}
                                className="w-full text-xs bg-card border border-border rounded-lg p-2 min-h-12 focus:outline-primary/50"
                                placeholder="Describe tus principales responsabilidades y logros..."
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </CardContent>
            </Card>

            {/* 2. Certificaciones (Diseño Minimalista y Compacto) */}
            <Card className="shadow-lg shadow-black/5 border-border bg-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-primary" />
                  <CardTitle className="text-xs font-extrabold text-foreground uppercase tracking-wider">
                    Certificaciones
                  </CardTitle>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddCertification}
                  className="text-primary hover:bg-primary/10 border-primary/30 text-xs h-7 gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Añadir certificación
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {certifications.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-4">
                    No has registrado certificaciones.
                  </p>
                ) : (
                  certifications.map((c, idx) => {
                    const isEditing = editingCertIdx === idx;
                    return (
                      <div
                        key={idx}
                        className="p-3 rounded-xl border border-border bg-secondary/5 space-y-2 relative group transition-all duration-200"
                      >
                        {!isEditing ? (
                          <div className="flex items-start justify-between gap-4">
                            <div className="space-y-1">
                              <h4 className="text-xs font-bold text-foreground">
                                {c.name || 'Sin nombre de certificación'}
                              </h4>
                              <p className="text-[11px] text-muted-foreground font-medium">
                                {c.issuer || 'Sin emisor registrado'} &bull;{' '}
                                <span className="text-[10px] text-muted-foreground/85 font-normal">
                                  {c.date || 'Sin fecha'}
                                </span>
                              </p>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => setEditingCertIdx(idx)}
                                className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-secondary/80 rounded-lg cursor-pointer"
                                title="Editar certificación"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemoveCertification(idx)}
                                className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg cursor-pointer"
                                title="Eliminar certificación"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                                Editando Certificación
                              </span>
                              <div className="flex items-center gap-1">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setEditingCertIdx(null)}
                                  className="h-7 w-7 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded-lg cursor-pointer"
                                  title="Listo"
                                >
                                  <Check className="w-4 h-4" />
                                </Button>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleRemoveCertification(idx)}
                                  className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg cursor-pointer"
                                  title="Eliminar certificación"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pr-6">
                              <div className="space-y-0.5">
                                <label className="text-[9px] font-bold text-muted-foreground uppercase">
                                  Nombre de Certificación
                                </label>
                                <Input
                                  value={c.name}
                                  onChange={(e) => {
                                    const newCerts = [...certifications];
                                    newCerts[idx].name = e.target.value;
                                    setCertifications(newCerts);
                                  }}
                                  placeholder="Ej. AWS Solutions Architect..."
                                  className="h-8 text-xs bg-card"
                                />
                              </div>

                              <div className="space-y-0.5">
                                <label className="text-[9px] font-bold text-muted-foreground uppercase">
                                  Emisor
                                </label>
                                <Input
                                  value={c.issuer}
                                  onChange={(e) => {
                                    const newCerts = [...certifications];
                                    newCerts[idx].issuer = e.target.value;
                                    setCertifications(newCerts);
                                  }}
                                  placeholder="Ej. AWS, IBM..."
                                  className="h-8 text-xs bg-card"
                                />
                              </div>

                              <div className="space-y-0.5">
                                <label className="text-[9px] font-bold text-muted-foreground uppercase">
                                  Fecha
                                </label>
                                <Input
                                  value={c.date}
                                  onChange={(e) => {
                                    const newCerts = [...certifications];
                                    newCerts[idx].date = e.target.value;
                                    setCertifications(newCerts);
                                  }}
                                  placeholder="Ej. Octubre 2025"
                                  className="h-8 text-xs bg-card"
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </CardContent>
            </Card>

            {/* Global Actions Card */}
            <Card className="sticky bottom-6 z-10 border-primary/20 bg-primary/5 shadow-lg shadow-primary/10 backdrop-blur-xl">
              <CardContent className="py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                  <h4 className="text-xs font-bold text-foreground flex items-center justify-center sm:justify-start gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span>Calibración de Diagnóstico por IA</span>
                  </h4>
                  <p className="text-[10px] text-muted-foreground leading-normal mt-0.5">
                    Al guardar, el motor recalculará tu porcentaje de afinidad con el mercado.
                  </p>
                </div>

                <div className="flex gap-2 w-full sm:w-auto shrink-0">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push('/dashboard')}
                    className="flex-1 sm:flex-initial text-xs h-9 cursor-pointer"
                  >
                    Descartar
                  </Button>
                  <Button
                    type="button"
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="flex-1 sm:flex-initial text-xs h-9 font-bold bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer gap-1.5"
                  >
                    {isSaving ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                        <span>Recalculando...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Guardar y Recalcular</span>
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Unified CV Manager Modal */}
      {isCVManagerOpen && (
        <CVAtsPreviewModal
          isOpen={isCVManagerOpen}
          onOpenChange={handleCloseCVManager}
          profile={dynamicProfile}
          userEmail={user?.email || undefined}
        />
      )}

      {/* Actualizar CV Modal */}
      <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
        <DialogContent className="sm:max-w-[500px] border-none shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-sm font-extrabold uppercase tracking-wider text-foreground">
              Actualizar Currículum
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Carga tu CV más reciente (PDF o Word) para actualizar tu diagnóstico técnico de forma automática.
            </DialogDescription>
          </DialogHeader>
          <div className="pt-4">
            <CVUploader
              onUploadSuccess={async (newCvId: string) => {
                setIsUploadModalOpen(false);
                setIsUpdatingFromCV(true);
                toast.success('Tu CV ha sido cargado. Analizando tu perfil con IA...');
                
                try {
                  // Refetch CV list immediately to update the file card
                  await refetchCVs();

                  let attempts = 0;
                  let isUpdated = false;
                  
                  // Poll the profile until cv_id matches the new one (up to 60s)
                  while (attempts < 30 && !isUpdated) {
                    await new Promise((resolve) => setTimeout(resolve, 2000));
                    const result = await refetchProfile();
                    if (result.data && result.data.cv_id === newCvId) {
                      isUpdated = true;
                    }
                    attempts++;
                  }

                  if (!isUpdated) {
                    toast.warning('El análisis está tomando más de lo esperado. Los datos se actualizarán en breve.');
                  } else {
                    toast.success('Perfil sincronizado exitosamente con tu nuevo CV.');
                  }
                } catch (error) {
                  console.error('Error refetching profile:', error);
                  toast.error('Ocurrió un error al sincronizar tu perfil.');
                } finally {
                  setIsUpdatingFromCV(false);
                }
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-xs text-muted-foreground font-semibold">Cargando perfil...</p>
          </div>
        </div>
      }
    >
      <ProfileContent />
    </Suspense>
  );
}
