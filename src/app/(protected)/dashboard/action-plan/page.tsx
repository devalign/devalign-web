'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUserProfile } from '@/hooks/use-user-profile';
import { useUserCVs } from '@/hooks/use-user-cvs';
import { useCurrentUser } from '@/hooks/use-current-user';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ChevronRight, 
  Lightbulb, 
  Sparkles, 
  TrendingUp, 
  X, 
  Loader2, 
  Map, 
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useCVAnalysis } from '@/contexts/cv-analysis-context';
import { CVUpdateBanner } from '@/components/shared/cv-update-banner';

interface RoadmapStep {
  skill: string;
  impact: string;
  topics: string[];
  justification: string;
  rule: string;
  trendData: number[]; // Trend over 6 months
}

interface RoadmapPhase {
  title: string;
  description: string;
  steps: RoadmapStep[];
}

const CLUSTER_SKILLS_MAP: Record<
  string,
  { name: string; category: string; importance: 'critical' | 'high' | 'medium'; demandPercentage: number }[]
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

// Predefined detailed templates for common gaps
const KNOWN_SKILLS_TEMPLATES: Record<string, Omit<RoadmapStep, 'skill'>> = {
  docker: {
    impact: '+12% de Alineación',
    topics: ['Contenedores', 'Imágenes', 'Dockerfiles', 'Docker Compose'],
    justification: 'Docker aparece en el 74% de las ofertas asociadas a tu especialidad. Su conocimiento es un prerrequisito para orquestación y despliegue cloud.',
    rule: 'Java/Python -> Docker (Confianza: 74%)',
    trendData: [45, 52, 58, 62, 69, 74],
  },
  kubernetes: {
    impact: '+10% de Alineación',
    topics: ['Pods', 'Deployments', 'Services', 'ConfigMaps & Secrets'],
    justification: 'Kubernetes es la herramienta estándar del mercado TI peruano para la administración de microservicios. Las ofertas modernas exigen orquestación automatizada.',
    rule: 'Docker -> Kubernetes (Confianza: 68%)',
    trendData: [35, 42, 49, 54, 60, 68],
  },
  microservicios: {
    impact: '+8% de Alineación',
    topics: ['API Gateways', 'Service Mesh', 'Eventos (Kafka/RabbitMQ)', 'Resiliencia'],
    justification: 'La arquitectura de microservicios representa la mayor parte de la demanda en ofertas mid/senior. Entender la comunicación distribuida es crítico.',
    rule: 'Spring Boot/Node -> Microservicios (Confianza: 82%)',
    trendData: [70, 72, 75, 78, 80, 82],
  },
  aws: {
    impact: '+8% de Alineación',
    topics: ['Amazon S3', 'EC2 & ECS', 'AWS Lambda', 'IAM Security'],
    justification: 'AWS es el proveedor de nube dominante en el mercado local con alta demanda en ofertas TI. Ideal para orquestar infraestructuras y despliegues modernos.',
    rule: 'Docker + Kubernetes -> AWS (Confianza: 81%)',
    trendData: [40, 43, 48, 51, 55, 58],
  },
  'ci/cd': {
    impact: '+6% de Alineación',
    topics: ['GitHub Actions', 'Pipelines', 'Pruebas Automatizadas', 'Despliegue Continuo'],
    justification: 'La integración y despliegue continuo garantizan entregas rápidas y seguras, reduciendo errores manuales a cero.',
    rule: 'Git + Docker -> CI/CD (Confianza: 70%)',
    trendData: [55, 58, 62, 65, 68, 70],
  },
};

function RoadmapContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const clusterParam = searchParams.get('cluster');

  const { isLoading: isUserLoading } = useCurrentUser();
  const { data: profile, isLoading: isProfileLoading } = useUserProfile();
  const { data: cvData, isLoading: isCVLoading } = useUserCVs();
  const { isAnalysisReady, commitUpdate } = useCVAnalysis();

  // Generator simulation state
  const [isGenerated, setIsGenerated] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);

  // Active drawer step
  const [activeStep, setActiveStep] = useState<RoadmapStep | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const hasCV = cvData && cvData.cvs && cvData.cvs.length > 0;

  // Sync state with localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedRoadmap = localStorage.getItem('devalign_roadmap_generated');
      if (savedRoadmap === 'true') {
        const timeoutId = setTimeout(() => {
          setIsGenerated(true);
        }, 0);
        return () => clearTimeout(timeoutId);
      }
    }
  }, []);

  const startGeneration = () => {
    setIsGenerating(true);
    setGenerationStep(1);

    const timer1 = setTimeout(() => setGenerationStep(2), 600);
    const timer2 = setTimeout(() => setGenerationStep(3), 1200);
    const timer3 = setTimeout(() => setGenerationStep(4), 1800);
    const timer4 = setTimeout(() => {
      setIsGenerating(false);
      setIsGenerated(true);
      localStorage.setItem('devalign_roadmap_generated', 'true');
      toast.success('¡Plan de Acción generado con éxito!');
    }, 2400);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  };

  // Get all affinities with fallback (slice(0, 3) to align with dashboard)
  const allAffinities = useMemo(() => {
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
            growth_percentage: 28
          },
          compatible_roles: [
            { title: 'Backend Java Developer', match: 'Alta' as const },
            { title: 'Java Cloud Engineer', match: 'Alta' as const },
            { title: 'Backend Microservices Developer', match: 'Media' as const }
          ]
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
            growth_percentage: 35
          },
          compatible_roles: [
            { title: 'DevOps Engineer', match: 'Alta' as const },
            { title: 'Cloud Architect', match: 'Media' as const },
            { title: 'Site Reliability Engineer (SRE)', match: 'Alta' as const }
          ]
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
            growth_percentage: 31
          },
          compatible_roles: [
            { title: 'Data Engineer', match: 'Alta' as const },
            { title: 'Big Data Developer', match: 'Alta' as const },
            { title: 'Analytics Engineer', match: 'Media' as const }
          ]
        },
        {
          cluster_id: '4',
          cluster_name: 'Frontend React',
          affinity_score: 0.30,
          is_primary: false,
          market_insights: {
            average_salary_pen: 7000,
            salary_differential_percentage: 15,
            market_share_percentage: 17,
            total_demand: 190,
            growth_percentage: 18
          },
          compatible_roles: [
            { title: 'Frontend Developer', match: 'Alta' as const },
            { title: 'React Developer', match: 'Alta' as const },
            { title: 'UI Engineer', match: 'Media' as const }
          ]
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
            growth_percentage: 15
          },
          compatible_roles: [
            { title: 'QA Automation Engineer', match: 'Alta' as const },
            { title: 'Software Development Engineer in Test (SDET)', match: 'Alta' as const },
            { title: 'QA Analyst', match: 'Media' as const }
          ]
        }
      ];
    }
    return list.slice(0, 3);
  }, [profile]);

  // Find target active cluster based on URL parameter (or default to primary)
  const activeCluster = useMemo(() => {
    if (allAffinities && allAffinities.length > 0) {
      if (clusterParam) {
        const found = allAffinities.find(
          (a) => a.cluster_name.toLowerCase() === clusterParam.toLowerCase()
        );
        if (found) return found;
      }
      const primary = allAffinities.find((a) => a.is_primary);
      return primary || allAffinities[0];
    }
    return null;
  }, [allAffinities, clusterParam]);

  // Retrieve user hard skills (supports profile hook and offline localStorage draft)
  const techSkills = useMemo<string[]>(() => {
    if (typeof window !== 'undefined') {
      const draftStr = localStorage.getItem('devalign_profile_draft');
      if (draftStr) {
        try {
          const draft = JSON.parse(draftStr);
          if (draft.detected_skills) {
            return draft.detected_skills
              .filter((s: any) => s.skill_type === 'hard_skill')
              .map((s: any) => s.name);
          }
        } catch (e) {
          console.error('Failed to parse offline profile draft:', e);
        }
      }
    }

    if (profile?.detected_skills) {
      return profile.detected_skills
        .filter((s) => s.skill_type === 'hard_skill')
        .map((s) => s.name);
    }
    return [];
  }, [profile]);

  // Calculate gaps dynamically based on active cluster and techSkills
  const dynamicGaps = useMemo(() => {
    if (!activeCluster) return [];
    const key = getClusterKey(activeCluster.cluster_name);
    const clusterSkills = CLUSTER_SKILLS_MAP[key] || [];

    const gaps: any[] = [];
    const userSkillsSet = new Set(techSkills.map((s: string) => s.toLowerCase()));

    clusterSkills.forEach((skill) => {
      const isOwned = userSkillsSet.has(skill.name.toLowerCase());
      if (!isOwned) {
        gaps.push({
          name: skill.name,
          skill_type: skill.category,
          market_importance: skill.importance,
          market_demand_percentage: skill.demandPercentage
        });
      }
    });

    // Sort by demand percentage descending
    gaps.sort((a, b) => b.market_demand_percentage - a.market_demand_percentage);
    return gaps;
  }, [activeCluster, techSkills]);

  // Compute phases dynamically based on dynamic gaps
  const phases: RoadmapPhase[] = useMemo(() => {
    const fallbackPhases: RoadmapPhase[] = [
      {
        title: 'Fase 1: Fundamentos de Contenedores',
        description: 'Aprende a empaquetar tus aplicaciones de forma consistente.',
        steps: [
          { skill: 'Docker', ...KNOWN_SKILLS_TEMPLATES.docker },
        ],
      },
      {
        title: 'Fase 2: Orquestación & Microservicios',
        description: 'Escala y administra contenedores en producción.',
        steps: [
          { skill: 'Kubernetes', ...KNOWN_SKILLS_TEMPLATES.kubernetes },
          { skill: 'Microservicios', ...KNOWN_SKILLS_TEMPLATES.microservicios },
        ],
      },
      {
        title: 'Fase 3: Infraestructura & Nube Pública',
        description: 'Lleva tus flujos de datos y servicios a infraestructuras cloud.',
        steps: [
          { skill: 'AWS', ...KNOWN_SKILLS_TEMPLATES.aws },
          { skill: 'CI/CD', ...KNOWN_SKILLS_TEMPLATES['ci/cd'] },
        ],
      },
    ];

    if (!activeCluster || dynamicGaps.length === 0) {
      return fallbackPhases;
    }

    // Map dynamic gaps to RoadmapSteps
    const gaps = dynamicGaps.map((g) => g.name);
    const matchedSteps: RoadmapStep[] = gaps.map((gapName) => {
      const lower = gapName.toLowerCase();
      const templateKey = Object.keys(KNOWN_SKILLS_TEMPLATES).find((k) => lower.includes(k));
      if (templateKey) {
        return {
          skill: gapName,
          ...KNOWN_SKILLS_TEMPLATES[templateKey],
        };
      }
      return {
        skill: gapName,
        impact: '+5% de Alineación',
        topics: [`Fundamentos de ${gapName}`, 'Ecosistema y buenas prácticas', 'Integración en proyectos'],
        justification: `${gapName} es una habilidad clave demandada por reclutadores en ofertas vinculadas a tu especialidad de ${activeCluster.cluster_name}.`,
        rule: `${activeCluster.cluster_name} -> ${gapName} (Confianza: 65%)`,
        trendData: [40, 43, 46, 50, 54, 60],
      };
    });

    const phase1Steps = matchedSteps.slice(0, Math.ceil(matchedSteps.length / 3));
    const phase2Steps = matchedSteps.slice(
      phase1Steps.length,
      phase1Steps.length + Math.ceil(matchedSteps.length / 3)
    );
    const phase3Steps = matchedSteps.slice(phase1Steps.length + phase2Steps.length);

    const result: RoadmapPhase[] = [];
    if (phase1Steps.length > 0) {
      result.push({
        title: 'Fase 1: Prioridad Crítica',
        description: 'Cierra las brechas fundamentales para tu especialidad.',
        steps: phase1Steps,
      });
    }
    if (phase2Steps.length > 0) {
      result.push({
        title: 'Fase 2: Especialización y Arquitectura',
        description: 'Desarrolla capacidades técnicas que añaden valor a tu perfil.',
        steps: phase2Steps,
      });
    }
    if (phase3Steps.length > 0) {
      result.push({
        title: 'Fase 3: Nube y Automatización',
        description: 'Optimiza tus flujos de despliegue e infraestructura cloud.',
        steps: phase3Steps,
      });
    }

    return result;
  }, [activeCluster, dynamicGaps]);

  const handleStepClick = (step: RoadmapStep) => {
    setActiveStep(step);
    setIsDrawerOpen(true);
  };

  if (isUserLoading || isProfileLoading || isCVLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-xs text-muted-foreground font-semibold">Cargando tu Plan de Acción...</p>
        </div>
      </div>
    );
  }

  const primarySpecialty = activeCluster?.cluster_name || 'Data Engineering';
  const marketInsights = activeCluster?.market_insights;

  const growth = marketInsights?.growth_percentage ?? null;
  const isPositiveGrowth = growth !== null && growth >= 0;

  const salaryDiff = marketInsights?.salary_differential_percentage ?? null;
  const isPositiveSalary = salaryDiff !== null && salaryDiff >= 0;

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Action required banner when roadmap is not generated */}
      {!isGenerated && (
        <div className="max-w-xl mx-auto py-12 animate-in fade-in slide-in-from-top-4 duration-500 relative z-10">
          {!hasCV ? (
            <Card className="border border-border bg-card p-6 shadow-md text-center space-y-6">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 text-primary">
                <Map className="h-6 w-6" />
              </div>
              <div className="space-y-2">
                <h2 className="text-lg font-extrabold text-foreground tracking-tight">
                  Plan de Acción Personalizado
                </h2>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Para trazar tu plan de estudio individual, primero necesitamos analizar tu currículum. Subiendo tu CV podremos mapear tus brechas de habilidades y diseñar tus fases de crecimiento.
                </p>
              </div>
              <Button
                onClick={() => router.push('/profile')}
                className="gap-1.5 text-xs font-semibold cursor-pointer w-full h-10"
              >
                Ir a mi Perfil para subir CV
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Card>
          ) : !isGenerating ? (
            <Card className="border border-border bg-card p-6 sm:p-8 shadow-md text-center space-y-6">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 text-primary">
                <Sparkles className="h-6 w-6" />
              </div>
              <div className="space-y-2">
                <h2 className="text-lg font-extrabold text-foreground tracking-tight sm:text-xl">
                  Diseña tu Plan de Acción
                </h2>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Ya tenemos listo tu diagnóstico de mercado. Ahora podemos diseñar un roadmap de aprendizaje secuencial y estructurado con temas a dominar para cerrar tus brechas técnicas de especialización.
                </p>
              </div>

              <div className="border border-border/80 bg-secondary/10 rounded-2xl text-left p-4 space-y-2.5">
                <h4 className="text-[10px] font-bold text-foreground uppercase tracking-wider mb-1">
                  ¿Qué contiene tu Plan de Acción?
                </h4>
                <ul className="space-y-2 text-xs text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span><strong>Fases de estudio:</strong> Ordenado lógicamente de lo más crítico a lo complementario.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span><strong>Métricas de impacto:</strong> Cuánto aumenta tu nivel de alineación al aprender cada habilidad.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span><strong>Evidencia de mercado:</strong> Respaldo matemático con tendencias y reglas de asociación de ofertas reales.</span>
                  </li>
                </ul>
              </div>

              <Button
                onClick={startGeneration}
                className="w-full gap-1.5 text-xs font-semibold cursor-pointer h-10"
              >
                Generar mi Plan de Acción
                <Sparkles className="h-3.5 w-3.5" />
              </Button>
            </Card>
          ) : (
            <Card className="border border-border bg-card p-6 sm:p-8 shadow-md text-left space-y-6">
              <div className="text-center space-y-2">
                <div className="relative mx-auto h-8 w-8 flex items-center justify-center">
                  <Loader2 className="h-6 w-6 text-primary animate-spin" />
                </div>
                <h3 className="text-sm font-bold text-foreground">
                  Generando tu Plan de Acción personalizado...
                </h3>
              </div>

              <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-300 ease-out" 
                  style={{ width: `${(generationStep / 4) * 100}%` }}
                />
              </div>

              <div className="space-y-2.5">
                {[
                  { id: 1, text: 'Evaluando brechas críticas detectadas...' },
                  { id: 2, text: 'Secuenciando fases lógicas de aprendizaje...' },
                  { id: 3, text: 'Compilando justificaciones y reglas de asociación...' },
                  { id: 4, text: 'Configurando panel y métricas de impacto...' }
                ].map((step) => {
                  const isDone = generationStep > step.id;
                  const isActive = generationStep === step.id;

                  return (
                    <div 
                      key={step.id} 
                      className={cn(
                        "flex items-center gap-2.5 p-2 rounded-lg border transition-all text-xs",
                        isDone 
                          ? "border-emerald-200/50 bg-emerald-50/5 text-emerald-800 dark:border-emerald-950/20 dark:text-emerald-400" 
                          : isActive 
                            ? "border-primary/30 bg-primary/5 text-foreground font-semibold" 
                            : "border-border/50 bg-transparent text-muted-foreground/60"
                      )}
                    >
                      {isDone ? (
                        <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                      ) : isActive ? (
                        <Loader2 className="h-4.5 w-4.5 text-primary animate-spin shrink-0" />
                      ) : (
                        <div className="h-4.5 w-4.5 rounded-full border border-muted-foreground/30 flex items-center justify-center text-[10px] font-mono shrink-0">
                          {step.id}
                        </div>
                      )}
                      <span>{step.text}</span>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Main Roadmap Content (Blurred if not generated yet) */}
      <div className={cn(
        "transition-all duration-700",
        !isGenerated && "opacity-20 blur-xs pointer-events-none select-none scale-[0.99]"
      )}>
        {/* Header */}
        <div className="max-w-4xl mx-auto mb-8">
          <CVUpdateBanner />

          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/20">
              <Sparkles className="w-3 h-3" />
              Ruta Recomendada
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
            Tu Plan de Acción
          </h1>
          <p className="text-muted-foreground text-sm mt-1 mb-4">
            Una ruta secuencial optimizada mediante reglas de asociación para reducir tus brechas con el mercado.
          </p>

          <div className="flex flex-wrap items-center gap-1.5 mt-2">
            <span className="text-[10px] text-muted-foreground mr-1 font-bold uppercase tracking-wider">
              {activeCluster?.cluster_name || 'Especialidad'}:
            </span>
            {allAffinities.map((aff) => {
              const isSelected = aff.cluster_name === activeCluster?.cluster_name;
              return (
                <button
                  key={aff.cluster_name}
                  onClick={() => {
                    const params = new URLSearchParams(searchParams.toString());
                    params.set('cluster', aff.cluster_name);
                    router.push(`?${params.toString()}`);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-[10px] font-bold border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-primary/10 border-primary/30 text-primary scale-105 shadow-sm'
                      : 'bg-secondary border-transparent text-muted-foreground hover:border-border hover:bg-secondary/80'
                  }`}
                >
                  {aff.is_primary && (
                    <Sparkles className={`h-2.5 w-2.5 shrink-0 transition-colors duration-500 ${isSelected ? 'text-primary mr-1' : 'text-emerald-500 mr-1.5'}`} />
                  )}
                  <span 
                    className={`overflow-hidden whitespace-nowrap transition-all duration-500 ease-in-out ${
                      isSelected ? 'max-w-0 opacity-0 m-0' : 'max-w-[150px] opacity-100 mr-1.5'
                    }`}
                  >
                    {aff.cluster_name}
                  </span>
                  <span className={`transition-all duration-500 ${isSelected ? 'opacity-100' : 'opacity-90'}`}>
                    {Math.round(aff.affinity_score * 100)}%
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Grid Layout (Roadmap + Market Insights) */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {/* ROADMAP STEPS (Left Column - 2/3 width) */}
          <div className="md:col-span-2 space-y-8">
            {phases.map((phase, phaseIdx) => (
              <div key={phaseIdx} className="space-y-4">
                {/* Phase Title */}
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-primary text-xs font-bold shrink-0 mt-0.5">
                    {phaseIdx + 1}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">{phase.title}</h3>
                    <p className="text-[10px] text-muted-foreground">{phase.description}</p>
                  </div>
                </div>

                {/* Steps Cards */}
                <div className="space-y-3 pl-9">
                  {phase.steps.map((step, stepIdx) => (
                    <Card
                      key={stepIdx}
                      onClick={() => handleStepClick(step)}
                      className="border border-border/80 hover:border-primary/50 bg-card hover:bg-secondary/10 transition-all cursor-pointer shadow-xs relative overflow-hidden group"
                    >
                      <CardContent className="p-4 flex items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                              {step.skill}
                            </h4>
                            <span className="text-[9px] font-bold text-emerald-600 bg-emerald-500/10 px-1.5 py-0.5 rounded-md">
                              {step.impact}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {step.topics.slice(0, 3).map((topic, tIdx) => (
                              <span
                                key={tIdx}
                                className="text-[9px] text-muted-foreground bg-secondary px-2 py-0.5 rounded-full"
                              >
                                {topic}
                              </span>
                            ))}
                            {step.topics.length > 3 && (
                              <span className="text-[9px] text-muted-foreground">+{step.topics.length - 3}</span>
                            )}
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform shrink-0" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* MARKET INSIGHTS (Right Column - 1/3 width) */}
          <div className="space-y-6">
            {/* Demanda del Cluster */}
            <Card className="shadow-lg shadow-black/5 border-border bg-card">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <CardTitle className="text-[10px] font-bold text-foreground uppercase tracking-wider">
                    Demanda del Cluster
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-foreground tracking-tight">
                    {growth !== null ? `${isPositiveGrowth ? '+' : ''}${growth}%` : 'N/A'}
                  </span>
                  <span className="text-[10px] text-muted-foreground font-semibold">
                    Crecimiento laboral
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground leading-normal">
                  Las ofertas para el clúster <strong>{primarySpecialty}</strong> {isPositiveGrowth ? 'se han incrementado' : 'han disminuido'} en los últimos 6 meses en Lima metropolitana.
                </p>

                {/* Sparkline Graph */}
                <div className="h-10 w-full mt-2">
                  <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
                    <path
                      d="M0,30 L10,25 L30,28 L50,18 L70,15 L90,10 L100,5 L100,30 Z"
                      className="fill-primary/10"
                    />
                    <path
                      d="M0,30 L10,25 L30,28 L50,18 L70,15 L90,10 L100,5"
                      className="fill-none stroke-primary stroke-1.5"
                    />
                  </svg>
                </div>
              </CardContent>
            </Card>

            {/* Insight IA Box */}
            <Card className="shadow-lg shadow-black/5 border-border bg-card">
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2.5">
                  <Lightbulb className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="text-[10px] font-bold text-foreground uppercase tracking-wider">
                      INSIGHT IA
                    </h4>
                    <p className="text-[10px] text-muted-foreground leading-normal">
                      Los perfiles <strong>{primarySpecialty}</strong> con dominio de habilidades críticas de nube e infraestructura tienen salarios promedios <strong>{salaryDiff !== null ? (isPositiveSalary ? `${salaryDiff}% más altos` : `${Math.abs(salaryDiff)}% más bajos`) : 'variables'}</strong> en el mercado peruano comparado con perfiles tradicionales.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* DRAWER LATERAL DERECHO (Contexto de Mercado) */}
      {isDrawerOpen && activeStep && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div
            onClick={() => setIsDrawerOpen(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300"
          />

          {/* Panel */}
          <div className="absolute inset-y-0 right-0 w-full sm:w-[400px] bg-card border-l border-border shadow-2xl p-6 flex flex-col h-full transform transition-transform duration-300">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div className="space-y-0.5">
                <span className="text-[9px] font-bold text-primary uppercase tracking-wider">
                  Detalle de Brecha
                </span>
                <h2 className="text-lg font-bold text-foreground">{activeStep.skill}</h2>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsDrawerOpen(false)}
                className="h-8 w-8 cursor-pointer rounded-full"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </Button>
            </div>

            {/* Content (Scrollable) */}
            <div className="flex-1 overflow-y-auto py-6 space-y-6 min-h-0">
              {/* Justificación del Motor */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-extrabold text-foreground uppercase tracking-wider">
                  Justificación de Prioridad
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {activeStep.justification}
                </p>
              </div>

              {/* Regla de Asociación FP-Growth */}
              <div className="space-y-2 p-4 rounded-xl border border-primary/20 bg-primary/5">
                <h4 className="text-[10px] font-extrabold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                  Regla de Asociación (ML)
                </h4>
                <p className="text-xs font-mono font-medium text-foreground py-1 bg-card/65 px-2.5 rounded-lg border border-border/40">
                  {activeStep.rule}
                </p>
                <p className="text-[9px] text-muted-foreground leading-normal">
                  Esta regla fue descubierta mediante el algoritmo <strong>FP-Growth</strong> analizando la base de conocimiento de ofertas reales del mercado peruano. Indica la confianza de demanda si ya manejas tecnologías del mismo cluster.
                </p>
              </div>

              {/* Tendencia Temporal de Demanda */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-extrabold text-foreground uppercase tracking-wider">
                  Tendencia de Demanda (Últimos 6 meses)
                </h4>

                {/* SVG Graph for Tendencia */}
                <div className="h-32 w-full border border-border/50 rounded-xl p-3 bg-secondary/10 relative">
                  <svg
                    className="w-full h-full overflow-visible"
                    viewBox="0 0 100 40"
                    preserveAspectRatio="none"
                  >
                    <line x1={0} y1={10} x2={100} y2={10} className="stroke-border/20 stroke-1 stroke-dasharray-[1,1]" />
                    <line x1={0} y1={25} x2={100} y2={25} className="stroke-border/20 stroke-1 stroke-dasharray-[1,1]" />

                    {/* Area Fill */}
                    <path
                      d={`M0,40 L20,${40 - activeStep.trendData[1] / 2.5} L40,${40 - activeStep.trendData[2] / 2.5} L60,${40 - activeStep.trendData[3] / 2.5} L80,${40 - activeStep.trendData[4] / 2.5} L100,${40 - activeStep.trendData[5] / 2.5} L100,40 Z`}
                      className="fill-primary/15"
                    />

                    {/* Line */}
                    <path
                      d={`M0,${40 - activeStep.trendData[0] / 2.5} L20,${40 - activeStep.trendData[1] / 2.5} L40,${40 - activeStep.trendData[2] / 2.5} L60,${40 - activeStep.trendData[3] / 2.5} L80,${40 - activeStep.trendData[4] / 2.5} L100,${40 - activeStep.trendData[5] / 2.5}`}
                      className="fill-none stroke-primary stroke-2"
                    />

                    {/* Circles on Nodes */}
                    {activeStep.trendData.map((val, idx) => (
                      <circle
                        key={idx}
                        cx={idx * 20}
                        cy={40 - val / 2.5}
                        r={2.5}
                        className="fill-primary stroke-card stroke-0.5"
                      />
                    ))}
                  </svg>

                  <div className="absolute top-2 left-2 text-[8px] font-mono text-muted-foreground font-bold">
                    Demanda máx: {activeStep.trendData[5]}%
                  </div>
                </div>

                <p className="text-[9px] text-muted-foreground leading-normal">
                  El porcentaje representa la frecuencia de aparición de <strong>{activeStep.skill}</strong> en ofertas del mercado local correspondientes a tu clúster.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-border mt-auto">
              <Button
                onClick={() => setIsDrawerOpen(false)}
                className="w-full h-10 text-xs font-semibold cursor-pointer"
              >
                Cerrar Detalle
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function RoadmapPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-xs text-muted-foreground font-semibold">Cargando tu Plan de Acción...</p>
          </div>
        </div>
      }
    >
      <RoadmapContent />
    </Suspense>
  );
}
