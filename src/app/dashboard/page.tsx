'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useUserCVs } from '@/hooks/use-user-cvs';
import { useUserProfile } from '@/hooks/use-user-profile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Sparkles,
  TrendingUp,
  UploadCloud,
  Target,
  ArrowRight,
  User,
  Settings2,
} from 'lucide-react';
import { toast } from 'sonner';
import CVUploader from '@/components/profile/cv-uploader';
import CVAtsPreviewModal from '@/components/profile/cv-ats-preview-modal';
import { UserProfileData, EducationItem, WorkExperienceItem, CertificationItem } from '@/lib/api/types';

function DashboardContent() {
  const { data: user, isLoading: isUserLoading } = useCurrentUser();
  const { data: cvData, isLoading: isCVLoading } = useUserCVs();
  const { data: profile } = useUserProfile();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Onboarding & CV Upload Simulation State
  const [hasCV, setHasCV] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Active Tab for Habilidades
  const [activeTab, setActiveTab] = useState<'tech' | 'soft' | 'tools'>('tech');

  // Profile Data States
  const [fullName, setFullName] = useState('Willy Anderson Samata Ccoya');
  const [roleTitle, setRoleTitle] = useState('Practicante en Gestión de Información Financiera');
  const [seniority, setSeniority] = useState('mid');

  // Education, Experience, Certifications States (for ATS Preview modal generation)
  const [educationList, setEducationList] = useState<EducationItem[]>([]);
  const [experiences, setExperiences] = useState<WorkExperienceItem[]>([]);
  const [certifications, setCertifications] = useState<CertificationItem[]>([]);

  // Skills Lists
  const [techSkills, setTechSkills] = useState<string[]>([
    'SQL Server',
    'Python',
    'Databricks',
    'Power BI',
    'Power Apps',
    'Power Automate',
    'MS Excel',
    'Jupyter Notebooks',
  ]);
  const [softSkills, setSoftSkills] = useState<string[]>([
    'Trabajo en equipo',
    'Comunicación efectiva',
    'Resolución de problemas',
  ]);
  const [toolsSkills, setToolsSkills] = useState<string[]>(['Git', 'PostgreSQL', 'VS Code']);

  // ML Gap items (skills the user DOES NOT have but the market demands)
  const [marketGaps, setMarketGaps] = useState<string[]>([
    'Docker',
    'Kubernetes',
    'AWS',
    'Microservicios',
    'CI/CD',
    'Spark',
    'Hadoop',
    'NoSQL',
  ]);

  // ML Engine simulated recalculating state
  const [isRecalculating, setIsRecalculating] = useState(false);

  // Modal visibility states linked to URL query param
  const [isAtsOpen, setIsAtsOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const action = searchParams.get('action');
  const recalculateParam = searchParams.get('recalculate');

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

  // Simulate Recalculation on redirect from /profile
  useEffect(() => {
    if (recalculateParam === 'true') {
      const timeoutId = setTimeout(() => {
        setIsRecalculating(true);
      }, 0);
      const timer = setTimeout(() => {
        setIsRecalculating(false);
        // Clear query parameter
        router.replace('/dashboard');
        toast.success('Diagnóstico recalculado y actualizado con las nuevas habilidades.');
      }, 1800);
      return () => {
        clearTimeout(timeoutId);
        clearTimeout(timer);
      };
    }
  }, [recalculateParam, router]);

  const handleCloseAts = (open: boolean) => {
    setIsAtsOpen(open);
    if (!open && action === 'preview-ats') {
      router.push('/dashboard');
    }
  };

  const handleCloseUpload = (open: boolean) => {
    setIsUploadOpen(open);
    if (!open && action === 'update-cv') {
      router.push('/dashboard');
    }
  };

  // Roles compatibles accordion open
  const [rolesExpanded, setRolesExpanded] = useState(false);

  // Sync hasCV with hook data
  useEffect(() => {
    if (cvData && cvData.cvs && cvData.cvs.length > 0) {
      setTimeout(() => setHasCV(true), 0);
    } else {
      setTimeout(() => setHasCV(false), 0);
    }
  }, [cvData]);

  // Load data from profile hook OR fallback to localStorage draft if backend API is offline
  useEffect(() => {
    const syncProfileData = () => {
      // 1. Check if we have an offline draft first
      const draftStr = localStorage.getItem('devalign_profile_draft');
      if (draftStr) {
        try {
          const draft = JSON.parse(draftStr);
          if (draft.fullName) setFullName(draft.fullName);
          if (draft.roleTitle) setRoleTitle(draft.roleTitle);
          if (draft.seniority) setSeniority(draft.seniority);
          
          if (draft.work_experience) setExperiences(draft.work_experience);
          if (draft.education) setEducationList(draft.education);
          if (draft.certifications) setCertifications(draft.certifications);

          if (draft.detected_skills) {
            const tech = draft.detected_skills.filter((s: { name: string; skill_type: string }) => s.skill_type === 'technical').map((s: { name: string; skill_type: string }) => s.name);
            const soft = draft.detected_skills.filter((s: { name: string; skill_type: string }) => s.skill_type === 'soft_skill').map((s: { name: string; skill_type: string }) => s.name);
            const tools = draft.detected_skills.filter((s: { name: string; skill_type: string }) => s.skill_type === 'tool').map((s: { name: string; skill_type: string }) => s.name);

            if (tech.length > 0) setTechSkills(tech);
            if (soft.length > 0) setSoftSkills(soft);
            if (tools.length > 0) setToolsSkills(tools);

            // Dynamically adjust gaps: remove skills that are now in technical skills
            const originalGaps = ['Docker', 'Kubernetes', 'AWS', 'Microservicios', 'CI/CD', 'Spark', 'Hadoop', 'NoSQL'];
            const newGaps = originalGaps.filter(gap => !tech.includes(gap));
            setMarketGaps(newGaps);
          }
          return; // Skip reading base profile as draft has priority in simulation
        } catch (e) {
          console.error('Failed to parse profile draft:', e);
        }
      }

      // 2. Base sync with hook API
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
          const tech = profile.detected_skills
            .filter((s) => s.skill_type === 'technical')
            .map((s) => s.name);
          const soft = profile.detected_skills
            .filter((s) => s.skill_type === 'soft_skill')
            .map((s) => s.name);
          const tools = profile.detected_skills
            .filter((s) => s.skill_type === 'tool' || s.skill_type === 'methodology')
            .map((s) => s.name);

          if (tech.length > 0) setTechSkills(tech);
          if (soft.length > 0) setSoftSkills(soft);
          if (tools.length > 0) setToolsSkills(tools);
        }

        if (profile.skill_gaps && profile.skill_gaps.length > 0) {
          setMarketGaps(profile.skill_gaps.map((g) => g.name));
        }
      } else if (user) {
        if (user.full_name) {
          setFullName(user.full_name);
        }
      }
    };

    const timeoutId = setTimeout(syncProfileData, 0);
    return () => clearTimeout(timeoutId);
  }, [profile, user]);

  // Simulation: drag-and-drop file upload
  const handleFileUpload = (
    e: React.DragEvent<HTMLDivElement> | React.ChangeEvent<HTMLInputElement>,
  ) => {
    e.preventDefault();
    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsUploading(false);
            setHasCV(true);
            toast.success('¡CV analizado con éxito! El motor JIT ha cargado tus datos.');
          }, 400);
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  // DYNAMIC ALIGNMENT ENGINE SIMULATION
  const getDynamicScore = () => {
    let base = 42; // Base percentage
    base += techSkills.length * 3;
    if (techSkills.includes('Docker')) base += 5;
    if (techSkills.includes('Kubernetes')) base += 5;
    if (techSkills.includes('AWS')) base += 5;
    if (techSkills.includes('Spark')) base += 4;
    if (techSkills.includes('Hadoop')) base += 4;

    return Math.min(base, 98); // Max out at 98%
  };

  const currentScore = getDynamicScore();

  const getScoreState = (score: number) => {
    if (score >= 75)
      return {
        label: 'Alta afinidad',
        color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/35',
      };
    if (score >= 50)
      return {
        label: 'Media afinidad',
        color: 'text-amber-500 bg-amber-500/10 border-amber-500/35',
      };
    return { label: 'Baja afinidad', color: 'text-red-500 bg-red-500/10 border-red-500/35' };
  };

  const scoreState = getScoreState(currentScore);

  // DYNAMIC RADAR CHART COORDINATES CALCULATION
  const getRadarPoints = () => {
    const dataVal = Math.min(
      35 +
        techSkills.filter((s) => ['Databricks', 'Spark', 'Hadoop', 'SQL Server'].includes(s))
          .length *
          15,
      95,
    );
    const backendVal = Math.min(
      35 +
        techSkills.filter((s) => ['Python', 'PostgreSQL', 'Microservicios'].includes(s)).length *
          20,
      95,
    );
    const cloudVal = Math.min(
      20 + techSkills.filter((s) => ['AWS', 'Docker'].includes(s)).length * 35,
      95,
    );
    const devopsVal = Math.min(
      20 + techSkills.filter((s) => ['Kubernetes', 'CI/CD'].includes(s)).length * 35,
      95,
    );
    const frontendVal = Math.min(
      20 + techSkills.filter((s) => ['React', 'HTML', 'CSS', 'Power BI'].includes(s)).length * 20,
      85,
    );

    const convert = (val: number, angleDeg: number) => {
      const angleRad = (angleDeg - 90) * (Math.PI / 180);
      const r = (val / 100) * 70; // Map 100% to 70px radius
      const x = 100 + r * Math.cos(angleRad);
      const y = 100 + r * Math.sin(angleRad);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    };

    return {
      user: [
        convert(backendVal, 0), // Backend
        convert(frontendVal, 72), // Frontend
        convert(cloudVal, 144), // Cloud
        convert(devopsVal, 216), // DevOps
        convert(dataVal, 288), // Data
      ].join(' '),
      market: [
        convert(92, 0), // Backend market demand
        convert(42, 72), // Frontend market demand
        convert(78, 144), // Cloud market demand
        convert(64, 216), // DevOps market demand
        convert(64, 288), // Data market demand
      ].join(' '),
    };
  };

  const radarPoints = getRadarPoints();

  // Construct profile payload for ATS Modal preview
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
    alignment_score: currentScore,
    primary_specialty: profile?.primary_specialty || 'Data Engineering',
    secondary_affinities: profile?.secondary_affinities || [
      { cluster_id: 'devops', cluster_name: 'DevOps', affinity_score: 63, is_primary: false },
      { cluster_id: 'data', cluster_name: 'Data Engineering', affinity_score: 41, is_primary: true },
    ],
    detected_skills: [
      ...techSkills.map((name) => ({ name, skill_type: 'technical' })),
      ...softSkills.map((name) => ({ name, skill_type: 'soft_skill' })),
      ...toolsSkills.map((name) => ({ name, skill_type: 'tool' })),
    ],
    skill_gaps: marketGaps.map((name) => ({ name, skill_type: 'technical' })),
    education: educationList,
    work_experience: experiences,
    certifications: certifications,
  };

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

  // EMPTY STATE FLOW
  if (!hasCV) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-center items-center px-4 py-10">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
              Comienza tu Diagnóstico
            </h1>
            <p className="text-muted-foreground text-sm">
              Sube tu currículum para que nuestro motor de Machine Learning extraiga tus
              competencias e identifique tu alineación con el mercado IT.
            </p>
          </div>

          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleFileUpload}
            className="border-2 border-dashed border-border hover:border-primary/50 transition-colors bg-card p-10 rounded-2xl flex flex-col items-center justify-center gap-4 cursor-pointer relative"
          >
            {isUploading ? (
              <div className="w-full space-y-4 py-4">
                <Sparkles className="w-10 h-10 text-primary animate-pulse mx-auto" />
                <div className="text-sm font-semibold text-foreground">
                  Analizando currículum...
                </div>
                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-150"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <div className="text-[10px] text-muted-foreground font-mono">
                  {uploadProgress}% completado
                </div>
              </div>
            ) : (
              <>
                <div className="rounded-full bg-primary/10 p-4 text-primary">
                  <UploadCloud className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-foreground">Arrastra tu archivo aquí</p>
                  <p className="text-xs text-muted-foreground">
                    Soporta formatos PDF y DOCX hasta 5MB
                  </p>
                </div>
                <label className="mt-2">
                  <span className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-xs font-semibold text-primary-foreground hover:bg-primary/95 transition-colors cursor-pointer shadow-xs">
                    Seleccionar Archivo
                  </span>
                  <input
                    type="file"
                    accept=".pdf,.docx"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </label>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/65 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20">
              <Sparkles className="w-3 h-3" />
              MVP Tesis
            </span>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
            Motor ML: Activo
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 py-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* COLUMNA IZQUIERDA: RESUMEN DE PERFIL Y AFINIDAD (41.6% span-5) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* 1. Cabecera de Perfil y Habilidades Detectadas (FUSIONADOS) */}
            <Card className="shadow-lg shadow-black/5 border-border bg-card overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-primary/30 via-primary to-primary/60" />
              <CardContent className="pt-5 space-y-6">
                
                {/* Cabecera Perfil */}
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-primary/10 text-primary rounded-lg shrink-0">
                        <User className="w-4 h-4" />
                      </div>
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[9px] font-bold font-mono bg-secondary text-foreground uppercase">
                        {seniority}
                      </span>
                    </div>
                    <h2 className="text-lg font-bold tracking-tight text-foreground truncate mt-1">
                      {fullName}
                    </h2>
                    <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                      {roleTitle}
                    </p>
                  </div>
                  <Link href="/profile" className="shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-primary hover:bg-primary/10 text-xs h-8 cursor-pointer gap-1"
                    >
                      <Settings2 className="w-3.5 h-3.5" />
                      Ajustar
                    </Button>
                  </Link>
                </div>

                <Separator className="bg-border/60" />

                {/* Habilidades Detectadas */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span className="text-xs font-extrabold text-foreground uppercase tracking-wider">
                      Habilidades Detectadas
                    </span>
                  </div>

                  {/* Tabs */}
                  <div className="grid grid-cols-3 gap-1 bg-secondary/35 p-0.5 rounded-lg border border-border/50">
                    {(['tech', 'soft', 'tools'] as const).map((tab) => (
                      <button
                        key={tab}
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

                  {/* Chips Grid */}
                  <div className="flex flex-wrap gap-1.5 min-h-[100px] align-content-start">
                    {(activeTab === 'tech'
                      ? techSkills
                      : activeTab === 'soft'
                        ? softSkills
                        : toolsSkills
                    ).map((skill) => (
                      <div
                        key={skill}
                        className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-secondary text-foreground border border-border/70"
                      >
                        <span>{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </CardContent>
            </Card>

            {/* 2. Radar Chart (Movido a columna izquierda) */}
            <Card className="shadow-lg shadow-black/5 border-border bg-card">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-primary" />
                  <CardTitle className="text-xs font-extrabold text-foreground uppercase tracking-wider">
                    Afinidad Técnica por Dominio
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex justify-center py-4">
                <div className="relative w-full max-w-[200px] aspect-square">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 200 200">
                    {[20, 40, 60, 80, 100].map((r) => {
                      const rad = (r / 100) * 70;
                      const points = [0, 72, 144, 216, 288]
                        .map((angle) => {
                          const a = (angle - 90) * (Math.PI / 180);
                          return `${100 + rad * Math.cos(a)},${100 + rad * Math.sin(a)}`;
                        })
                        .join(' ');
                      return (
                        <polygon
                          key={r}
                          points={points}
                          className="fill-none stroke-border/40 stroke-1"
                        />
                      );
                    })}

                    {[0, 72, 144, 216, 288].map((angle) => {
                      const a = (angle - 90) * (Math.PI / 180);
                      return (
                        <line
                          key={angle}
                          x1={100}
                          y1={100}
                          x2={100 + 70 * Math.cos(a)}
                          y2={100 + 70 * Math.sin(a)}
                          className="stroke-border/40 stroke-1"
                        />
                      );
                    })}

                    <text x={100} y={15} textAnchor="middle" className="fill-muted-foreground text-[8px] font-bold font-mono">BACKEND</text>
                    <text x={178} y={75} textAnchor="start" className="fill-muted-foreground text-[8px] font-bold font-mono">FRONTEND</text>
                    <text x={155} y={185} textAnchor="start" className="fill-muted-foreground text-[8px] font-bold font-mono">CLOUD</text>
                    <text x={45} y={185} textAnchor="end" className="fill-muted-foreground text-[8px] font-bold font-mono">DEVOPS</text>
                    <text x={22} y={75} textAnchor="end" className="fill-muted-foreground text-[8px] font-bold font-mono">DATA</text>

                    <polygon points={radarPoints.market} className="fill-slate-800/10 stroke-slate-500/50 stroke-1.5" />
                    <polygon points={radarPoints.user} className="fill-primary/25 stroke-primary stroke-2 transition-all duration-300" />

                    {radarPoints.market.split(' ').map((p, idx) => {
                      const [x, y] = p.split(',');
                      return <circle key={idx} cx={x} cy={y} r={2.5} className="fill-slate-500" />;
                    })}

                    {radarPoints.user.split(' ').map((p, idx) => {
                      const [x, y] = p.split(',');
                      return <circle key={idx} cx={x} cy={y} r={3} className="fill-primary stroke-card stroke-1" />;
                    })}
                  </svg>

                  <div className="absolute -bottom-6 left-0 right-0 flex justify-center gap-4 text-[9px] font-mono text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
                      <span>Mercado</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      <span>Tu Perfil</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>

          {/* COLUMNA DERECHA: RESULTADOS DEL DIAGNÓSTICO (58.3% span-7) */}
          <div className="lg:col-span-7 space-y-6 relative">
            
            {/* SIMULATED RECALCULATING GLASS OVERLAY */}
            {isRecalculating && (
              <div className="absolute inset-0 bg-background/55 backdrop-blur-xs z-10 rounded-2xl flex flex-col items-center justify-center gap-3">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                <div className="text-center space-y-1">
                  <p className="text-xs font-bold text-foreground">Calibrando Diagnóstico...</p>
                  <p className="text-[10px] text-muted-foreground font-mono">El motor de IA está procesando las habilidades</p>
                </div>
              </div>
            )}

            {/* 1. Score & Especialidad */}
            <Card className="shadow-lg shadow-black/5 border-border bg-card">
              <CardContent>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                  {/* Score */}
                  <div className="text-center sm:text-left space-y-1">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                      Alineación con el mercado
                    </p>
                    <div className="flex items-baseline justify-center sm:justify-start gap-1">
                      <span className="text-5xl font-black text-foreground tracking-tight">
                        {currentScore}%
                      </span>
                    </div>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${scoreState.color}`}
                    >
                      {scoreState.label}
                    </span>
                  </div>

                  {/* Specialty */}
                  <div className="flex-1 text-center sm:text-right space-y-1.5 border-t sm:border-t-0 sm:border-l border-border pt-4 sm:pt-0 sm:pl-6">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                      Especialidad principal
                    </p>
                    <h3 className="text-lg font-black text-foreground tracking-tight">
                      Data Engineering
                    </h3>
                    <p className="text-[10px] text-muted-foreground">
                      Tu perfil tiene alta coincidencia con este cluster.
                    </p>
                    <div className="flex flex-wrap justify-center sm:justify-end gap-1.5 mt-2">
                      <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-secondary text-foreground">
                        DevOps 63%
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-secondary text-foreground">
                        Data Engineering 41%
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 2. Fortalezas & Brechas (Side-by-side) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Fortalezas Card */}
              <Card className="shadow-lg shadow-black/5 border-border bg-card flex flex-col h-full">
                <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold text-foreground uppercase tracking-wider">
                      Fortalezas principales
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-between pt-0 space-y-3">
                  <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1 scrollbar-none">
                    {techSkills.slice(0, 4).map((f, idx) => {
                      const levels = ['Avanzado', 'Intermedio - Avanzado', 'Intermedio', 'Intermedio'];
                      const demands = [92, 85, 78, 71];
                      const level = levels[idx] || 'Intermedio';
                      const demand = demands[idx] || 65;
                      return (
                        <div
                          key={f}
                          className="flex flex-col justify-between p-2.5 rounded-lg bg-emerald-500/5 border border-emerald-500/10"
                        >
                          <div className="flex justify-between items-start gap-1">
                            <span className="font-bold text-foreground truncate">{f}</span>
                            <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold shrink-0">
                              {demand}% DEMANDA
                            </span>
                          </div>
                          <span className="text-[10px] text-muted-foreground mt-1">{level}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="pt-2 text-right">
                    <button
                      onClick={() => setActiveTab('tech')}
                      className="text-[10px] font-bold text-primary hover:underline inline-flex items-center gap-1 cursor-pointer bg-transparent border-0"
                    >
                      Ver todas ({techSkills.length}) <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </CardContent>
              </Card>

              {/* Brechas Card */}
              <Card className="shadow-lg shadow-black/5 border-border bg-card flex flex-col h-full">
                <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold text-foreground uppercase tracking-wider">
                      Brechas prioritarias
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-between pt-0 space-y-3">
                  {marketGaps.length === 0 ? (
                    <div className="p-4 rounded-lg bg-emerald-500/5 border border-dashed border-emerald-500/30 text-center text-xs text-muted-foreground my-auto">
                      🎉 ¡Felicidades! Has cubierto todas las brechas detectadas.
                    </div>
                  ) : (
                    <>
                      <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1 scrollbar-none">
                        {marketGaps.slice(0, 4).map((bg, idx) => {
                          const criticalities = ['Crítica', 'Crítica', 'Alta', 'Alta'];
                          const demands = [74, 68, 61, 54];
                          const crit = criticalities[idx] || 'Media';
                          const demand = demands[idx] || 42;

                          const borderClass =
                            crit === 'Crítica'
                              ? 'border-red-500/30 bg-red-500/5 hover:border-red-500/50'
                              : 'border-amber-500/30 bg-amber-500/5 hover:border-amber-500/50';
                          const textClass =
                            crit === 'Crítica'
                              ? 'text-red-600 dark:text-red-400'
                              : 'text-amber-600 dark:text-amber-400';

                          return (
                            <div
                              key={bg}
                              className={`flex flex-col justify-between p-2.5 rounded-lg border border-dashed transition-colors ${borderClass}`}
                            >
                              <div className="flex justify-between items-start gap-1">
                                <span className="font-bold text-foreground truncate">{bg}</span>
                                <span className={`text-[9px] font-bold shrink-0 ${textClass}`}>
                                  {demand}% DEMANDA
                                </span>
                              </div>
                              <span className="text-[10px] text-muted-foreground mt-1">
                                Brecha ({crit})
                              </span>
                            </div>
                          );
                        })}
                      </div>
                      <div className="pt-2 text-right">
                        <Link
                          href="/dashboard/roadmap"
                          className="text-[10px] font-bold text-primary hover:underline inline-flex items-center gap-1 cursor-pointer"
                        >
                          Ver todas ({marketGaps.length}) <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

            </div>

            {/* Insight IA Box (Fuera de los cards y abajo) */}
            {marketGaps.length > 0 && (
              <div className="p-3.5 rounded-xl border border-primary/20 bg-primary/5 flex items-start gap-2.5">
                <Lightbulb className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="text-[10px] font-bold text-foreground">INSIGHT IA</p>
                  <p className="text-[10px] text-muted-foreground leading-normal">
                    Fortalecer habilidades clave como <strong>{marketGaps[0] || 'AWS'}</strong> y{' '}
                    <strong>{marketGaps[1] || 'Docker'}</strong> podría aumentar tu alineación con el
                    mercado en <strong>+18%</strong>.
                  </p>
                </div>
              </div>
            )}

            {/* 3. Roles Compatibles */}
            <Card className="shadow-lg shadow-black/5 border-border bg-card">
              <button
                onClick={() => setRolesExpanded(!rolesExpanded)}
                className="w-full text-left px-6 py-4 flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <span className="text-xs font-extrabold text-foreground uppercase tracking-wider">
                    Roles compatibles en el mercado
                  </span>
                </div>
                {rolesExpanded ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
              </button>
              {rolesExpanded && (
                <CardContent className="pt-0 pb-4 border-t border-border/50">
                  <div className="space-y-2 pt-4">
                    <div className="flex justify-between items-center p-2 rounded-lg bg-secondary/35 text-xs">
                      <span className="font-bold text-foreground">Backend Java Developer</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 text-[10px] font-bold">
                        Afinidad Alta
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded-lg bg-secondary/35 text-xs">
                      <span className="font-bold text-foreground">Java Cloud Engineer</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 text-[10px] font-bold">
                        Afinidad Alta
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded-lg bg-secondary/35 text-xs">
                      <span className="font-bold text-foreground">Data Engineer Junior</span>
                      <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 text-[10px] font-bold">
                        Afinidad Media
                      </span>
                    </div>
                  </div>
                </CardContent>
              )}
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

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-xs text-muted-foreground font-semibold">Cargando dashboard...</p>
          </div>
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
