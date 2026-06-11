'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useUserCVs } from '@/hooks/use-user-cvs';
import { useUserProfile } from '@/hooks/use-user-profile';
import { toast } from 'sonner';
import CVUploader from '@/components/profile/cv-uploader';
import CVAtsPreviewModal from '@/components/profile/cv-ats-preview-modal';
import { UserProfileData, EducationItem, WorkExperienceItem, CertificationItem } from '@/lib/api/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Sparkles } from 'lucide-react';

// Refactored modular subcomponents
import { DashboardEmptyState } from '@/components/diagnosis/dashboard-empty-state';
import { ProfileSkillsCard } from '@/components/diagnosis/profile-skills-card';
import { AffinityRadarChart } from '@/components/diagnosis/affinity-radar-chart';
import { MarketScoreCard } from '@/components/diagnosis/market-score-card';
import { StrengthsCard } from '@/components/diagnosis/strengths-card';
import { PriorityGapsCard } from '@/components/diagnosis/priority-gaps-card';
import { CompatibleRolesCard } from '@/components/diagnosis/compatible-roles-card';
import { AiInsightCard } from '@/components/diagnosis/ai-insight-card';

function DashboardContent() {
  const { data: user, isLoading: isUserLoading } = useCurrentUser();
  const { data: cvData, isLoading: isCVLoading } = useUserCVs();
  const { data: profile } = useUserProfile();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Onboarding & CV Upload Simulation State
  const [hasCV, setHasCV] = useState(true);

  // Active Tab for Habilidades (shared state to support switching via StrengthsCard View All)
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
          }
        );
      }
    };
    checkConnection();
  }, []);

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
    return <DashboardEmptyState onUploadSuccess={() => setHasCV(true)} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 py-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* COLUMNA IZQUIERDA: RESUMEN DE PERFIL Y AFINIDAD (41.6% span-5) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* 1. Cabecera de Perfil y Habilidades Detectadas (FUSIONADOS) */}
            <ProfileSkillsCard
              fullName={fullName}
              roleTitle={roleTitle}
              seniority={seniority}
              techSkills={techSkills}
              softSkills={softSkills}
              toolsSkills={toolsSkills}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              isLoading={isRecalculating}
            />

            {/* 2. Radar Chart (Movido a columna izquierda) */}
            <AffinityRadarChart
              techSkills={techSkills}
              isLoading={isRecalculating}
            />

          </div>

          {/* COLUMNA DERECHA: RESULTADOS DEL DIAGNÓSTICO (58.3% span-7) */}
          <div className="lg:col-span-7 space-y-6 relative">
            
            {/* 1. Score & Especialidad */}
            <MarketScoreCard
              currentScore={currentScore}
              isLoading={isRecalculating}
            />

            {/* 2. Fortalezas & Brechas (Side-by-side) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Fortalezas Card */}
              <StrengthsCard
                techSkills={techSkills}
                onViewAll={() => setActiveTab('tech')}
                isLoading={isRecalculating}
              />

              {/* Brechas Card */}
              <PriorityGapsCard
                marketGaps={marketGaps}
                isLoading={isRecalculating}
              />

            </div>

            {/* Insight IA Box (Fuera de los cards y abajo) */}
            <AiInsightCard
              marketGaps={marketGaps}
              isLoading={isRecalculating}
            />

            {/* 3. Roles Compatibles */}
            <CompatibleRolesCard
              isLoading={isRecalculating}
            />

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
