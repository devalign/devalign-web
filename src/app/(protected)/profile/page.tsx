'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useUserProfile, useUpdateUserProfile } from '@/hooks/use-user-profile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
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
} from 'lucide-react';
import { toast } from 'sonner';
import CVUploader from '@/components/profile/cv-uploader';
import CVAtsPreviewModal from '@/components/profile/cv-ats-preview-modal';
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
  const { data: profile, isLoading: isProfileLoading } = useUserProfile();
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

  // Active Tab for Skills editing
  const [activeTab, setActiveTab] = useState<'tech' | 'soft' | 'tools'>('tech');
  const [newSkillText, setNewSkillText] = useState('');

  const [isSaving, setIsSaving] = useState(false);

  // Modal actions from query parameters
  const action = searchParams.get('action');
  const [isAtsOpen, setIsAtsOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

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
      router.push('/profile');
    }
  };

  const handleCloseUpload = (open: boolean) => {
    setIsUploadOpen(open);
    if (!open && action === 'update-cv') {
      router.push('/profile');
    }
  };

  // Load profile data into state once loaded
  useEffect(() => {
    const loadProfileData = () => {
      if (profile) {
        setFullName(profile.full_name || user?.full_name || 'Willy Anderson Samata Ccoya');
        setRoleTitle(profile.current_job_role || 'Practicante en Gestión de Información Financiera');
        setSeniority(profile.seniority || 'mid');

        if (profile.education && profile.education.length > 0) {
          setEducationList(
            profile.education.map((edu) => ({
              degree: edu.degree,
              institution: edu.institution,
              start_date: edu.start_date || '2021',
              end_date: edu.end_date || '2026',
            }))
          );
        } else {
          setEducationList([
            {
              degree: 'Ingeniería de Sistemas de Información',
              institution: 'Universidad Peruana de Ciencias Aplicadas - UPC',
              start_date: '2021',
              end_date: '2026',
            },
          ]);
        }

        if (profile.work_experience && profile.work_experience.length > 0) {
          setExperiences(
            profile.work_experience.map((exp) => ({
              role: exp.role,
              company: exp.company,
              period: `${exp.start_date} — ${exp.current ? 'Presente' : exp.end_date || ''}`,
              description: exp.description || '',
            }))
          );
        } else {
          setExperiences([
            {
              role: 'Practicante en Gestión de Información Financiera',
              company: 'Banco de Crédito del Perú — BCP',
              period: 'Junio 2025 — Presente',
              description:
                'Ejecutar y monitorear jobs en Databricks de forma diaria y mensual, garantizando la operación continua del modelo financiero. Documentar procesos y dar soporte en la solución de incidencias menores.',
            },
            {
              role: 'Desarrollador Independiente',
              company: 'Proyecto Categorización de productos de Saga Falabella',
              period: 'Agosto 2025 — Diciembre 2025',
              description:
                'Realizar el preprocesamiento y el analisis exploratorio de datos (EDA) de diversas fuentes de datos empleando Python en Jupyter Notebooks.',
            },
          ]);
        }

        if (profile.certifications && profile.certifications.length > 0) {
          setCertifications(
            profile.certifications.map((c) => ({
              name: c.name,
              issuer: c.issuer || '',
              date: c.date || '',
            }))
          );
        } else {
          setCertifications([
            { name: 'Data Analysis with Python', issuer: 'IBM', date: 'Octubre 2025' },
            { name: 'Data Visualization with Python', issuer: 'IBM', date: 'Octubre 2025' },
            { name: 'Python para ciencia de datos, IA y desarrollo', issuer: 'IBM', date: 'Febrero 2025' },
          ]);
        }

        if (profile.detected_skills && profile.detected_skills.length > 0) {
          const tech = profile.detected_skills
            .filter((s) => s.skill_type === 'technical')
            .map((s) => s.name);
          const soft = profile.detected_skills
            .filter((s) => s.skill_type === 'soft_skill')
            .map((s) => s.name);
          const tools = profile.detected_skills
            .filter((s) => s.skill_type === 'tool' || s.skill_type === 'methodology')
            .map((s) => s.name);

          setTechSkills(tech.length > 0 ? tech : ['SQL Server', 'Python', 'Databricks', 'Power BI', 'Power Apps', 'Power Automate', 'MS Excel', 'Jupyter Notebooks']);
          setSoftSkills(soft.length > 0 ? soft : ['Trabajo en equipo', 'Comunicación efectiva', 'Resolución de problemas']);
          setToolsSkills(tools.length > 0 ? tools : ['Git', 'PostgreSQL', 'VS Code']);
        } else {
          setTechSkills(['SQL Server', 'Python', 'Databricks', 'Power BI', 'Power Apps', 'Power Automate', 'MS Excel', 'Jupyter Notebooks']);
          setSoftSkills(['Trabajo en equipo', 'Comunicación efectiva', 'Resolución de problemas']);
          setToolsSkills(['Git', 'PostgreSQL', 'VS Code']);
        }
      } else if (user) {
        setFullName(user.full_name || 'Willy Anderson Samata Ccoya');
        setRoleTitle('Practicante en Gestión de Información Financiera');
        setSeniority('mid');
        setEducationList([
          {
            degree: 'Ingeniería de Sistemas de Información',
            institution: 'Universidad Peruana de Ciencias Aplicadas - UPC',
            start_date: '2021',
            end_date: '2026',
          },
        ]);
        setExperiences([
          {
            role: 'Practicante en Gestión de Información Financiera',
            company: 'Banco de Crédito del Perú — BCP',
            period: 'Junio 2025 — Presente',
            description:
              'Ejecutar y monitorear jobs en Databricks de forma diaria y mensual, garantizando la operación continua del modelo financiero. Documentar procesos y dar soporte en la solución de incidencias menores.',
          },
        ]);
        setCertifications([
          { name: 'Data Analysis with Python', issuer: 'IBM', date: 'Octubre 2025' },
        ]);
        setTechSkills(['SQL Server', 'Python', 'Databricks', 'Power BI', 'Power Apps', 'Power Automate', 'MS Excel', 'Jupyter Notebooks']);
        setSoftSkills(['Trabajo en equipo', 'Comunicación efectiva', 'Resolución de problemas']);
        setToolsSkills(['Git', 'PostgreSQL', 'VS Code']);
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
    } else {
      if (toolsSkills.includes(skillName)) return toast.error('Habilidad ya añadida');
      setToolsSkills([...toolsSkills, skillName]);
    }

    setNewSkillText('');
    toast.success(`Habilidad "${skillName}" añadida localmente.`);
  };

  const handleDeleteSkill = (name: string, type: 'tech' | 'soft' | 'tools') => {
    if (type === 'tech') setTechSkills(techSkills.filter((s) => s !== name));
    else if (type === 'soft') setSoftSkills(softSkills.filter((s) => s !== name));
    else setToolsSkills(toolsSkills.filter((s) => s !== name));
    toast.info(`Habilidad "${name}" removida.`);
  };

  // List Modification Actions
  const handleAddExperience = () => {
    const newIdx = experiences.length;
    setExperiences([
      ...experiences,
      { role: '', company: '', period: '', description: '' },
    ]);
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
    setCertifications([
      ...certifications,
      { name: '', issuer: '', date: '' },
    ]);
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
    ...techSkills.map((name) => ({ name, skill_type: 'technical' })),
    ...softSkills.map((name) => ({ name, skill_type: 'soft_skill' })),
    ...toolsSkills.map((name) => ({ name, skill_type: 'tool' })),
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
      {/* Header */}
      <header className="border-b border-border bg-card/65 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/dashboard')}
              className="text-muted-foreground hover:text-foreground hover:bg-secondary/40 text-xs gap-1 h-8 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              Volver al Diagnóstico
            </Button>
            <Separator orientation="vertical" className="h-4 bg-border" />
            <h1 className="text-sm font-bold tracking-tight text-foreground flex items-center gap-1.5">
              Ajustes de Perfil Profesional
            </h1>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            Motor ML: Calibración
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column (Info Principal, Habilidades, Educación) - Width 5/12 */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* 1. Información Principal */}
            <Card className="shadow-lg shadow-black/5 border-border bg-card">
              <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
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
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Nombre Completo</p>
                      <p className="text-sm font-semibold text-foreground mt-0.5">{fullName || 'Sin nombre registrado'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Cargo / Rol de Interés</p>
                      <p className="text-sm font-semibold text-foreground mt-0.5">{roleTitle || 'Sin cargo registrado'}</p>
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

            {/* 2. Habilidades e Idiomas */}
            <Card className="shadow-lg shadow-black/5 border-border bg-card">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xs font-extrabold text-foreground uppercase tracking-wider">
                    Habilidades e Idiomas
                  </CardTitle>
                </div>

                {/* Tabs */}
                <div className="grid grid-cols-3 gap-1 bg-secondary/35 p-0.5 rounded-lg border border-border/50 mt-3">
                  {(['tech', 'soft', 'tools'] as const).map((tab) => (
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
                      {tab === 'tech' ? 'Técnicas' : tab === 'soft' ? 'Blandas' : 'Herramientas'}
                    </button>
                  ))}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Chips Grid */}
                <div className="flex flex-wrap gap-1.5 min-h-24 p-3 rounded-lg border border-dashed border-border bg-secondary/5">
                  {(activeTab === 'tech'
                    ? techSkills
                    : activeTab === 'soft'
                      ? softSkills
                      : toolsSkills
                  ).length === 0 ? (
                    <p className="text-[10px] text-muted-foreground m-auto">No hay habilidades en esta categoría.</p>
                  ) : (
                    (activeTab === 'tech'
                      ? techSkills
                      : activeTab === 'soft'
                        ? softSkills
                        : toolsSkills
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
              <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
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
                  <p className="text-xs text-muted-foreground text-center py-4">No has registrado educación académica.</p>
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
                              <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Editando Educación</span>
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
                                <label className="text-[9px] font-bold text-muted-foreground uppercase">Título / Carrera</label>
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
                                <label className="text-[9px] font-bold text-muted-foreground uppercase">Institución</label>
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
                                  <label className="text-[9px] font-bold text-muted-foreground uppercase">Año Inicio</label>
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
                                  <label className="text-[9px] font-bold text-muted-foreground uppercase">Año Fin</label>
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
              <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
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
                  <p className="text-xs text-muted-foreground text-center py-4">No has registrado puestos laborales.</p>
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
                                {exp.company || 'Sin empresa registrada'} &bull; <span className="text-[10px] text-muted-foreground/85 font-normal">{exp.period || 'Sin periodo'}</span>
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
                              <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Editando Experiencia</span>
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
                                <label className="text-[9px] font-bold text-muted-foreground uppercase">Cargo</label>
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
                                <label className="text-[9px] font-bold text-muted-foreground uppercase">Empresa</label>
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
                                <label className="text-[9px] font-bold text-muted-foreground uppercase">Periodo</label>
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
                              <label className="text-[9px] font-bold text-muted-foreground uppercase">Descripción del Cargo</label>
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
              <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
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
                  <p className="text-xs text-muted-foreground text-center py-4">No has registrado certificaciones.</p>
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
                                {c.issuer || 'Sin emisor registrado'} &bull; <span className="text-[10px] text-muted-foreground/85 font-normal">{c.date || 'Sin fecha'}</span>
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
                              <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Editando Certificación</span>
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
                                <label className="text-[9px] font-bold text-muted-foreground uppercase">Nombre de Certificación</label>
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
                                <label className="text-[9px] font-bold text-muted-foreground uppercase">Emisor</label>
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
                                <label className="text-[9px] font-bold text-muted-foreground uppercase">Fecha</label>
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
            <Card className="border-primary/20 bg-primary/5 shadow-md">
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

      {/* Actualizar CV Modal */}
      <Dialog open={isUploadOpen} onOpenChange={handleCloseUpload}>
        <DialogContent className="sm:max-w-md border-border bg-card">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-bold text-foreground text-emerald-600 dark:text-emerald-500">
              <Sparkles className="h-5 w-5 text-emerald-600 dark:text-emerald-500" />
              Actualizar Currículum Vitae
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Sube una versión más reciente de tu CV. Sincronizaremos tus datos profesionales
              automáticamente y recalcularemos tu alineación técnica.
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <CVUploader
              onUploadSuccess={() => {
                handleCloseUpload(false);
                toast.success('CV cargado y analizado exitosamente.');
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
