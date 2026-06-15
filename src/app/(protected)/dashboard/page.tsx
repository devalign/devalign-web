'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useUserCVs } from '@/hooks/use-user-cvs';
import { useUserProfile } from '@/hooks/use-user-profile';
import { toast } from 'sonner';
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
import { Sparkles, Search, CheckCircle2, AlertCircle, Loader2, Lightbulb } from 'lucide-react';

// Refactored modular subcomponents
import { DashboardEmptyState } from '@/components/diagnosis/dashboard-empty-state';
import { PriorityGapsCard } from '@/components/diagnosis/priority-gaps-card';
import { MarketScoreCard } from '@/components/diagnosis/market-score-card';
import { StrengthsCard } from '@/components/diagnosis/strengths-card';
import { AffinityRadarChart } from '@/components/diagnosis/affinity-radar-chart';
import { CompatibleRolesCard } from '@/components/diagnosis/compatible-roles-card';
import { AiInsightCard } from '@/components/diagnosis/ai-insight-card';
import { ClusterDemandCard } from '@/components/diagnosis/cluster-demand-card';
import { MarketImpactCard } from '@/components/diagnosis/market-impact-card';

const CLUSTER_SKILLS_MAP: Record<
  string,
  {
    name: string;
    category: string;
    importance: 'critical' | 'high' | 'medium';
    demandPercentage: number;
  }[]
> = {
  'Backend Java': [
    { name: 'Java', category: 'hard_skill', importance: 'critical', demandPercentage: 92 },
    { name: 'Spring Boot', category: 'hard_skill', importance: 'critical', demandPercentage: 88 },
    { name: 'REST APIs', category: 'hard_skill', importance: 'high', demandPercentage: 80 },
    { name: 'Microservicios', category: 'hard_skill', importance: 'high', demandPercentage: 82 },
    { name: 'PostgreSQL', category: 'hard_skill', importance: 'high', demandPercentage: 74 },
    { name: 'AWS', category: 'hard_skill', importance: 'high', demandPercentage: 62 },
    { name: 'Docker', category: 'tool', importance: 'high', demandPercentage: 70 },
    { name: 'Kubernetes', category: 'tool', importance: 'medium', demandPercentage: 55 },
    { name: 'Git', category: 'tool', importance: 'medium', demandPercentage: 90 },
  ],
  'Backend Python': [
    { name: 'Python', category: 'hard_skill', importance: 'critical', demandPercentage: 95 },
    { name: 'FastAPI', category: 'hard_skill', importance: 'critical', demandPercentage: 82 },
    { name: 'REST APIs', category: 'hard_skill', importance: 'high', demandPercentage: 85 },
    { name: 'PostgreSQL', category: 'hard_skill', importance: 'high', demandPercentage: 78 },
    { name: 'MongoDB', category: 'hard_skill', importance: 'high', demandPercentage: 60 },
    { name: 'AWS', category: 'hard_skill', importance: 'high', demandPercentage: 68 },
    { name: 'Docker', category: 'tool', importance: 'high', demandPercentage: 75 },
    { name: 'Redis', category: 'hard_skill', importance: 'medium', demandPercentage: 55 },
    { name: 'Git', category: 'tool', importance: 'medium', demandPercentage: 92 },
  ],
  'Frontend React': [
    { name: 'React', category: 'hard_skill', importance: 'critical', demandPercentage: 96 },
    { name: 'Next.js', category: 'hard_skill', importance: 'critical', demandPercentage: 85 },
    { name: 'JavaScript', category: 'hard_skill', importance: 'critical', demandPercentage: 94 },
    { name: 'TypeScript', category: 'hard_skill', importance: 'high', demandPercentage: 88 },
    { name: 'HTML5', category: 'hard_skill', importance: 'high', demandPercentage: 90 },
    { name: 'CSS3', category: 'hard_skill', importance: 'high', demandPercentage: 90 },
    { name: 'Tailwind CSS', category: 'tool', importance: 'medium', demandPercentage: 82 },
    { name: 'Git', category: 'tool', importance: 'medium', demandPercentage: 92 },
  ],
  'DevOps Cloud': [
    { name: 'Docker', category: 'tool', importance: 'critical', demandPercentage: 94 },
    { name: 'Kubernetes', category: 'tool', importance: 'critical', demandPercentage: 88 },
    { name: 'Terraform', category: 'tool', importance: 'critical', demandPercentage: 80 },
    { name: 'AWS', category: 'hard_skill', importance: 'high', demandPercentage: 85 },
    { name: 'Linux', category: 'hard_skill', importance: 'high', demandPercentage: 78 },
    { name: 'CI/CD', category: 'methodology', importance: 'high', demandPercentage: 90 },
    { name: 'Git', category: 'tool', importance: 'medium', demandPercentage: 95 },
  ],
  'Data Engineering': [
    { name: 'Python', category: 'hard_skill', importance: 'critical', demandPercentage: 92 },
    { name: 'Spark', category: 'hard_skill', importance: 'critical', demandPercentage: 88 },
    { name: 'SQL', category: 'hard_skill', importance: 'critical', demandPercentage: 90 },
    { name: 'Kafka', category: 'tool', importance: 'high', demandPercentage: 75 },
    { name: 'Airflow', category: 'tool', importance: 'high', demandPercentage: 80 },
    { name: 'Snowflake', category: 'tool', importance: 'high', demandPercentage: 65 },
    { name: 'NoSQL', category: 'hard_skill', importance: 'medium', demandPercentage: 70 },
    { name: 'Docker', category: 'tool', importance: 'medium', demandPercentage: 60 },
    { name: 'Git', category: 'tool', importance: 'medium', demandPercentage: 85 },
  ],
  'QA & Automation': [
    { name: 'QA', category: 'hard_skill', importance: 'critical', demandPercentage: 90 },
    { name: 'Selenium', category: 'tool', importance: 'critical', demandPercentage: 85 },
    { name: 'Cypress', category: 'tool', importance: 'high', demandPercentage: 78 },
    { name: 'SQL', category: 'hard_skill', importance: 'high', demandPercentage: 80 },
    { name: 'Postman', category: 'tool', importance: 'high', demandPercentage: 75 },
    { name: 'Python', category: 'hard_skill', importance: 'medium', demandPercentage: 70 },
    { name: 'Git', category: 'tool', importance: 'medium', demandPercentage: 88 },
  ],
};

const getClusterKey = (name: string): string => {
  const n = name.toLowerCase();
  if (n.includes('java')) return 'Backend Java';
  if (n.includes('python')) return 'Backend Python';
  if (n.includes('frontend') || n.includes('react')) return 'Frontend React';
  if (n.includes('devops') || n.includes('cloud')) return 'DevOps Cloud';
  if (n.includes('data')) return 'Data Engineering';
  if (n.includes('qa') || n.includes('automation')) return 'QA & Automation';
  return name;
};

function DashboardContent() {
  const { data: user, isLoading: isUserLoading } = useCurrentUser();
  const { data: cvData, isLoading: isCVLoading, refetch: refetchCVs } = useUserCVs();
  const { data: profile, refetch: refetchProfile } = useUserProfile();
  const { startAnalysis, isAnalysisReady, commitUpdate } = useCVAnalysis();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Onboarding & CV Upload Simulation State
  const [hasCV, setHasCV] = useState(true);

  // Drawers states
  const [isStrengthsDrawerOpen, setIsStrengthsDrawerOpen] = useState(false);
  const [isGapsDrawerOpen, setIsGapsDrawerOpen] = useState(false);
  const [isRolesDrawerOpen, setIsRolesDrawerOpen] = useState(false);
  const [isInsightDrawerOpen, setIsInsightDrawerOpen] = useState(false);

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

  // Skills Lists
  const [techSkills, setTechSkills] = useState<string[]>([]);
  const [softSkills, setSoftSkills] = useState<string[]>([]);
  const [toolsSkills, setToolsSkills] = useState<string[]>([]);

  // ML Gap items (skills the user DOES NOT have but the market demands)
  const [marketGaps, setMarketGaps] = useState<SkillItem[]>([]);

  // ML Engine simulated recalculating state
  const [isRecalculating, setIsRecalculating] = useState(false);

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
          },
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
            const tech = draft.detected_skills
              .filter((s: { name: string; skill_type: string }) => s.skill_type === 'hard_skill')
              .map((s: { name: string; skill_type: string }) => s.name);
            const soft = draft.detected_skills
              .filter((s: { name: string; skill_type: string }) => s.skill_type === 'soft_skill')
              .map((s: { name: string; skill_type: string }) => s.name);
            const tools = draft.detected_skills
              .filter((s: { name: string; skill_type: string }) => s.skill_type === 'tool')
              .map((s: { name: string; skill_type: string }) => s.name);

            if (tech.length > 0) setTechSkills(tech);
            if (soft.length > 0) setSoftSkills(soft);
            if (tools.length > 0) setToolsSkills(tools);

            // Dynamically adjust gaps: remove skills that are now in technical skills
            const originalGaps = [
              'Docker',
              'Kubernetes',
              'AWS',
              'Microservicios',
              'CI/CD',
              'Spark',
              'Hadoop',
              'NoSQL',
            ];
            const newGaps: SkillItem[] = originalGaps
              .filter((gap) => !tech.includes(gap))
              .map((name, idx) => ({
                name,
                skill_type: 'hard_skill',
                market_importance: idx < 3 ? 'critical' : 'high',
                market_demand_percentage: Math.max(74 - idx * 4, 38),
              }));
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
            .filter((s) => s.skill_type === 'hard_skill')
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
        setSoftSkills([]);
        setToolsSkills([]);
        setMarketGaps([]);
      }
    };

    const timeoutId = setTimeout(syncProfileData, 0);
    return () => clearTimeout(timeoutId);
  }, [profile, user]);

  // Active Cluster Index for navigation
  const [activeClusterIndex, setActiveClusterIndex] = useState(0);

  // Get all affinities with fallback if not provided by backend (Top 3 only)
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
        {
          cluster_id: '4',
          cluster_name: 'Frontend React',
          affinity_score: 0.3,
          is_primary: false,
          market_insights: {
            average_salary_pen: 7000,
            salary_differential_percentage: 15,
            market_share_percentage: 17,
            total_demand: 190,
            growth_percentage: 18,
          },
          compatible_roles: [
            { title: 'Frontend Developer', match: 'Alta' as const },
            { title: 'React Developer', match: 'Alta' as const },
            { title: 'UI Engineer', match: 'Media' as const },
          ],
        },
        {
          cluster_id: '5',
          cluster_name: 'QA & Automation',
          affinity_score: 0.25,
          is_primary: false,
          market_insights: {
            average_salary_pen: 6500,
            salary_differential_percentage: 12,
            market_share_percentage: 14,
            total_demand: 84,
            growth_percentage: 15,
          },
          compatible_roles: [
            { title: 'QA Automation Engineer', match: 'Alta' as const },
            { title: 'Software Development Engineer in Test (SDET)', match: 'Alta' as const },
            { title: 'QA Analyst', match: 'Media' as const },
          ],
        },
      ];
    }
    return list.slice(0, 3);
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

  const activeCluster = allAffinities[activeClusterIndex] || allAffinities[0];
  const activeScore = Math.round((activeCluster?.affinity_score || 0.5) * 100);

  // Dynamically calculate strengths and gaps based on active cluster
  const { strengths: activeStrengths, gaps: activeGaps } = React.useMemo(() => {
    if (!activeCluster) return { strengths: [], gaps: [] };
    const key = getClusterKey(activeCluster.cluster_name);
    const clusterSkills = CLUSTER_SKILLS_MAP[key] || [];

    interface TechStrength {
      name: string;
      level: string;
      score: number;
      demandPercentage: number;
    }
    interface SkillGap {
      name: string;
      skill_type: string;
      market_importance: string;
      market_demand_percentage: number;
    }
    const strengths: TechStrength[] = [];
    const gaps: SkillGap[] = [];

    // Normalize user tech skills for case-insensitive lookup
    const userSkillsSet = new Set(techSkills.map((s) => s.toLowerCase()));

    clusterSkills.forEach((skill) => {
      const isOwned = userSkillsSet.has(skill.name.toLowerCase());
      if (isOwned) {
        strengths.push({
          name: skill.name,
          level: skill.importance === 'critical' ? 'Avanzado' : 'Intermedio',
          score: skill.importance === 'critical' ? 3 : 2,
          demandPercentage: skill.demandPercentage,
        });
      } else {
        gaps.push({
          name: skill.name,
          skill_type: skill.category,
          market_importance: skill.importance,
          market_demand_percentage: skill.demandPercentage,
        });
      }
    });

    // Sort strengths by demand percentage descending
    strengths.sort((a, b) => b.demandPercentage - a.demandPercentage);
    // Sort gaps by demand percentage descending
    gaps.sort((a, b) => b.market_demand_percentage - a.market_demand_percentage);

    return { strengths, gaps };
  }, [activeCluster, techSkills]);

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
    alignment_score: activeScore,
    primary_specialty: activeCluster?.cluster_name || 'Data Engineering',
    secondary_affinities: allAffinities.filter((a) => !a.is_primary),
    all_affinities: allAffinities,
    domain_affinities: profile?.domain_affinities || [],
    detected_skills: [
      ...techSkills.map((name) => ({ name, skill_type: 'hard_skill' })),
      ...softSkills.map((name) => ({ name, skill_type: 'soft_skill' })),
      ...toolsSkills.map((name) => ({ name, skill_type: 'tool' })),
    ],
    skill_gaps: activeGaps,
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
      <DashboardEmptyState
        onUploadSuccess={(newCvId) => {
          setHasCV(true);
          if (newCvId) {
            startAnalysis(newCvId);
          }
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background relative">
      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 py-8 relative">
        {/* Banner de Sincronización Diferida */}
        <CVUpdateBanner />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna Izquierda: Perfil y Radar */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <AffinityRadarChart
              domainAffinities={dynamicProfile.domain_affinities}
              techSkills={techSkills}
              fullName={fullName}
              roleTitle={roleTitle}
              seniority={seniority}
              isLoading={isRecalculating}
            />
          </div>

          {/* Columna Derecha: Score, Fortalezas, Brechas */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <MarketScoreCard
              currentScore={activeScore}
              primarySpecialty={activeCluster?.cluster_name || 'Software Engineering'}
              secondaryAffinities={allAffinities.map((a) => ({
                name: a.cluster_name,
                score: Math.round(a.affinity_score * 100),
                isPrimary: a.is_primary,
              }))}
              isLoading={isRecalculating}
              currentIndex={activeClusterIndex}
              totalClusters={allAffinities.length}
              isPrimaryCluster={activeCluster?.is_primary}
              onNext={() =>
                handleSelectCluster(Math.min(allAffinities.length - 1, activeClusterIndex + 1))
              }
              onPrev={() => handleSelectCluster(Math.max(0, activeClusterIndex - 1))}
              onSelectSpecialty={(name) => {
                const idx = allAffinities.findIndex((a) => a.cluster_name === name);
                if (idx !== -1) handleSelectCluster(idx);
              }}
              onViewRoadmap={() => {
                router.push(
                  `/dashboard/action-plan?cluster=${encodeURIComponent(activeCluster?.cluster_name || '')}`,
                );
              }}
              onViewTopology={() => {
                router.push(
                  `/market?cluster=${encodeURIComponent(activeCluster?.cluster_name || '')}`,
                );
              }}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <StrengthsCard
                strengths={activeStrengths}
                onViewAll={() => {
                  setStrengthsSearch('');
                  setIsStrengthsDrawerOpen(true);
                }}
                isLoading={isRecalculating}
              />
              <PriorityGapsCard
                marketGaps={activeGaps}
                onViewAll={() => {
                  setGapsSearch('');
                  setIsGapsDrawerOpen(true);
                }}
                isLoading={isRecalculating}
              />
            </div>
          </div>

          {/* Fila 3: Análisis de Mercado (Roles, Demanda de Cluster, Impacto de Mercado) */}
          <div className="lg:col-span-1">
            <CompatibleRolesCard
              roles={activeCluster?.compatible_roles}
              onViewAll={() => setIsRolesDrawerOpen(true)}
              isLoading={isRecalculating}
            />
          </div>

          <div className="lg:col-span-1">
            <ClusterDemandCard
              clusterName={activeCluster?.cluster_name || dynamicProfile.primary_specialty}
              marketInsights={activeCluster?.market_insights}
              isLoading={isRecalculating}
            />
          </div>

          <div className="lg:col-span-1">
            <MarketImpactCard
              marketGaps={activeGaps}
              marketInsights={activeCluster?.market_insights}
              onViewAll={() => setIsInsightDrawerOpen(true)}
              isLoading={isRecalculating}
            />
          </div>

          {/* Fila 4: Recomendaciones IA */}
          <div className="lg:col-span-3">
            <AiInsightCard marketGaps={activeGaps} isLoading={isRecalculating} />
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
            <SheetTitle className="flex items-center gap-2 text-emerald-600 dark:text-emerald-500 font-bold">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
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
                    className="flex flex-col justify-between p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10 transition-colors hover:bg-emerald-500/10"
                  >
                    <div className="flex justify-between items-start gap-1">
                      <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs truncate">
                        {strength.name}
                      </span>
                      <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold shrink-0">
                        {strength.demandPercentage}% DEMANDA
                      </span>
                    </div>
                    <span className="text-[10px] text-muted-foreground mt-1">{strength.level}</span>
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
            <SheetTitle className="flex items-center gap-2 text-red-600 dark:text-red-500 font-bold">
              <AlertCircle className="h-5 w-5 text-red-500" />
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
                    ? 'border-red-500/30 bg-red-500/5 hover:border-red-500/50 hover:bg-red-500/10'
                    : 'border-amber-500/30 bg-amber-500/5 hover:border-amber-500/50 hover:bg-amber-500/10';
                const textClass =
                  crit === 'critical'
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-amber-600 dark:text-amber-400';
                const critLabel =
                  crit === 'critical'
                    ? 'Crítica'
                    : crit === 'high'
                      ? 'Alta'
                      : crit === 'medium'
                        ? 'Media'
                        : crit;

                return (
                  <div
                    key={gap.name}
                    className={`flex flex-col justify-between p-3 rounded-lg border border-dashed transition-colors ${borderClass}`}
                  >
                    <div className="flex justify-between items-start gap-1">
                      <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs truncate">
                        {gap.name}
                      </span>
                      <span className={`text-[9px] font-bold shrink-0 ${textClass}`}>
                        {demand}% DEMANDA
                      </span>
                    </div>
                    <span className="text-[10px] text-muted-foreground mt-1">
                      Brecha ({critLabel})
                    </span>
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

      {/* Drawer: Todos los Roles Compatibles */}
      <Sheet open={isRolesDrawerOpen} onOpenChange={setIsRolesDrawerOpen}>
        <SheetContent className="sm:max-w-md bg-card border-l border-border flex flex-col h-full">
          <SheetHeader className="pb-4">
            <SheetTitle className="flex items-center gap-2 text-primary font-bold">
              Roles Compatibles ({activeCluster?.cluster_name || 'Especialidad'})
            </SheetTitle>
            <SheetDescription className="text-xs text-muted-foreground mt-1">
              Estos son todos los roles del mercado que hacen match con esta especialidad evaluada.
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 scrollbar-none mt-4">
            {activeCluster?.compatible_roles?.map((role, idx) => {
              const badgeClass =
                role.match === 'Alta'
                  ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                  : role.match === 'Media'
                    ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                    : 'bg-red-500/10 text-red-600 border border-red-500/20';

              return (
                <div
                  key={idx}
                  className="flex justify-between items-center p-3 rounded-lg bg-secondary/35 border border-border/50 text-xs"
                >
                  <span className="font-semibold text-foreground truncate">{role.title}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[9px] font-bold shrink-0 ${badgeClass}`}
                  >
                    Afinidad {role.match}
                  </span>
                </div>
              );
            })}
          </div>
        </SheetContent>
      </Sheet>

      {/* Drawer: Detalle del Insight de Mercado */}
      <Sheet open={isInsightDrawerOpen} onOpenChange={setIsInsightDrawerOpen}>
        <SheetContent className="sm:max-w-md bg-card border-l border-border flex flex-col h-full">
          <SheetHeader className="pb-4">
            <SheetTitle className="flex items-center gap-2 text-amber-500 font-bold">
              <Lightbulb className="h-5 w-5" />
              Detalle del Insight de Mercado
            </SheetTitle>
            <SheetDescription className="text-xs text-muted-foreground mt-1">
              Desglose salarial y proyección para los perfiles que cubren las brechas actuales.
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto space-y-4 pr-1 mt-4 text-sm text-foreground">
            <div className="p-4 rounded-lg bg-secondary/35 border border-border">
              <h3 className="font-bold text-xs uppercase text-muted-foreground mb-2">
                Impacto Salarial
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Según nuestro modelo de Machine Learning entrenado con miles de ofertas locales,
                cerrar las brechas indicadas (especialmente aquellas marcadas como Críticas) te
                permite apuntar a roles Senior o Especializados.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 rounded-lg border border-border flex flex-col items-center justify-center text-center">
                <span className="text-xs text-muted-foreground font-semibold">
                  Salario Promedio Actual
                </span>
                <span className="text-lg font-bold">
                  S/.{' '}
                  {Math.round((activeCluster?.market_insights?.average_salary_pen || 0) * 0.75) ||
                    'N/A'}
                </span>
              </div>
              <div className="p-3 rounded-lg border border-emerald-500/30 bg-emerald-500/5 flex flex-col items-center justify-center text-center">
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                  Salario Proyectado
                </span>
                <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                  S/. {activeCluster?.market_insights?.average_salary_pen || 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
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
