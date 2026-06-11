'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUserProfile } from '@/hooks/use-user-profile';
import { useUserCVs } from '@/hooks/use-user-cvs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  Loader2,
  Sparkles,
  Map,
  Box,
  Compass,
  Cloud,
  GitBranch,
  Activity,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  BookOpen,
  CheckSquare,
  Bookmark
} from 'lucide-react';

interface TopicItem {
  id: string;
  text: string;
}

interface CourseItem {
  name: string;
  provider: string;
  price: string;
  url: string;
}

interface RoadmapPhase {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  hours: number;
  level: 'Crítico' | 'Alta' | 'Media';
  topics: TopicItem[];
  courses: CourseItem[];
}

export function RoadmapDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: profile, isLoading: isProfileLoading } = useUserProfile();
  const { data: cvData, isLoading: isCVLoading } = useUserCVs();

  // Local state for UI navigation and persistence
  const [isGenerated, setIsGenerated] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [checkedTopics, setCheckedTopics] = useState<string[]>([]);
  const [expandedPhase, setExpandedPhase] = useState<string | null>('docker');

  const hasCV = cvData && cvData.cvs && cvData.cvs.length > 0;
  const hasProfile = !!profile;

  // Retrieve states from localStorage on load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedRoadmap = localStorage.getItem('devalign_roadmap_generated');
      const savedChecked = localStorage.getItem('devalign_roadmap_checked');
      
      // Auto-trigger generation if query param '?generate=true' is present and diagnosis exists
      const shouldAutoGenerate = searchParams.get('generate') === 'true';
      const isDiagnosisGenerated = localStorage.getItem('devalign_diagnosis_generated') === 'true';

      if (savedRoadmap === 'true') {
        setIsGenerated(true);
      } else if (shouldAutoGenerate && isDiagnosisGenerated) {
        startGeneration();
      }

      if (savedChecked) {
        setCheckedTopics(JSON.parse(savedChecked));
      }
    }
  }, [searchParams]);

  // Simulate Roadmap generation steps
  const startGeneration = () => {
    setIsGenerating(true);
    setGenerationStep(1);

    const timers = [
      setTimeout(() => setGenerationStep(2), 800),
      setTimeout(() => setGenerationStep(3), 1600),
      setTimeout(() => setGenerationStep(4), 2400),
      setTimeout(() => {
        setIsGenerating(false);
        setIsGenerated(true);
        localStorage.setItem('devalign_roadmap_generated', 'true');
      }, 3200)
    ];

    return () => timers.forEach(t => clearTimeout(t));
  };

  // Toggle checkbox topic selection
  const handleToggleTopic = (topicId: string) => {
    const updated = checkedTopics.includes(topicId)
      ? checkedTopics.filter(id => id !== topicId)
      : [...checkedTopics, topicId];
    setCheckedTopics(updated);
    localStorage.setItem('devalign_roadmap_checked', JSON.stringify(updated));
  };

  // Predefined Roadmap template database mapped to typical skill gaps
  const roadmapTemplates: RoadmapPhase[] = useMemo(() => [
    {
      id: 'docker',
      title: 'Fase 1: Docker (Contenerización de Aplicaciones)',
      icon: Box,
      description: 'Aprende a empaquetar aplicaciones backend y frontend junto con todas sus dependencias en contenedores aislados y portables.',
      hours: 15,
      level: 'Crítico',
      topics: [
        { id: 'docker-1', text: 'Conceptos fundamentales: Contenedores vs Máquinas Virtuales, Imágenes y Capas.' },
        { id: 'docker-2', text: 'Dockerfile: Creación, comandos clave (FROM, RUN, COPY, ENV) y optimizaciones Multi-stage.' },
        { id: 'docker-3', text: 'Docker Volumes & Networking: Persistencia de datos y enrutamiento interno entre contenedores.' },
        { id: 'docker-4', text: 'Docker Compose: Orquestación local para levantar base de datos, APIs y clientes en un solo comando.' }
      ],
      courses: [
        { name: 'Docker y Compose para Desarrolladores', provider: 'YouTube / Open Source', price: 'Gratuito', url: 'https://youtube.com' },
        { name: 'Docker de cero a experto - F. Herrera', provider: 'Udemy / Recomendado', price: 'Pago', url: 'https://udemy.com' }
      ]
    },
    {
      id: 'kubernetes',
      title: 'Fase 2: Kubernetes (Orquestación en Producción)',
      icon: Compass,
      description: 'Aprende a desplegar, escalar y gestionar clústeres de contenedores con alta disponibilidad en producción.',
      hours: 25,
      level: 'Crítico',
      topics: [
        { id: 'k8s-1', text: 'Conceptos core: Pods, ReplicaSets, Deployments, StateSets y DaemonSets.' },
        { id: 'k8s-2', text: 'Servicios e Ingress: Configuración de acceso público, ClusterIP, NodePort y Balanceo de carga.' },
        { id: 'k8s-3', text: 'Configuraciones dinámicas: Uso seguro de ConfigMaps y Secrets.' },
        { id: 'k8s-4', text: 'Persistencia: Configuración de PersistentVolumes (PV) y Claims (PVC) para bases de datos.' }
      ],
      courses: [
        { name: 'Kubernetes Fundamentals (CKAD Training)', provider: 'CNCF / KodeKloud', price: 'Pago', url: 'https://kodekloud.com' },
        { name: 'Orquestación de Contenedores con K8s', provider: 'Platzi / EDteam', price: 'Pago', url: 'https://platzi.com' }
      ]
    },
    {
      id: 'aws',
      title: 'Fase 3: AWS Cloud Foundations',
      icon: Cloud,
      description: 'Domina los servicios de nube de AWS esenciales para alojar, asegurar y escalar tu arquitectura IT.',
      hours: 20,
      level: 'Alta',
      topics: [
        { id: 'aws-1', text: 'Infraestructura global de AWS: Regiones, Zonas de Disponibilidad e IAM (Roles y Políticas).' },
        { id: 'aws-2', text: 'Cómputo y Almacenamiento: Instancias EC2, buckets S3 y configuraciones de seguridad de red (VPC, SG).' },
        { id: 'aws-3', text: 'Bases de datos en la nube: RDS PostgreSQL/MySQL y DynamoDB Serverless.' },
        { id: 'aws-4', text: 'Arquitectura Serverless: Introducción a AWS Lambda y API Gateway.' }
      ],
      courses: [
        { name: 'AWS Certified Cloud Practitioner Course', provider: 'freeCodeCamp', price: 'Gratuito', url: 'https://freecodecamp.org' },
        { name: 'AWS Solutions Architect Associate - Stephane Maarek', provider: 'Udemy', price: 'Pago', url: 'https://udemy.com' }
      ]
    },
    {
      id: 'cicd',
      title: 'Fase 4: Pipelines CI/CD & Automatización',
      icon: GitBranch,
      description: 'Configura integraciones continuas para compilar, testear y desplegar tu código de forma automática en cada commit.',
      hours: 12,
      level: 'Media',
      topics: [
        { id: 'cicd-1', text: 'Principios de CI/CD: Automatización de builds, pruebas unitarias y análisis de calidad estática.' },
        { id: 'cicd-2', text: 'GitHub Actions: Creación de Workflows YAML, disparadores (triggers), variables y secretos.' },
        { id: 'cicd-3', text: 'Despliegue continuo (CD): Integración automática con servidores cloud o registries de contenedores.' }
      ],
      courses: [
        { name: 'Integración Continua con GitHub Actions', provider: 'YouTube / Open Source', price: 'Gratuito', url: 'https://youtube.com' },
        { name: 'DevOps & Git Bootcamp', provider: 'Platzi', price: 'Pago', url: 'https://platzi.com' }
      ]
    }
  ], []);

  // Filter templates: show phases matching user's skill gaps. If none detected, show all as template.
  const activePhases = useMemo(() => {
    if (!profile || !profile.skill_gaps || profile.skill_gaps.length === 0) {
      return roadmapTemplates;
    }

    const gapsLower = profile.skill_gaps.map(g => g.name.toLowerCase());
    
    // Always include a phase if it aligns with a gap, else keep it as fallback to ensure a robust plan
    const matched = roadmapTemplates.filter(phase => {
      if (phase.id === 'docker' && gapsLower.some(g => g.includes('docker') || g.includes('conteneri'))) return true;
      if (phase.id === 'kubernetes' && gapsLower.some(g => g.includes('kubernetes') || g.includes('k8s') || g.includes('orquest'))) return true;
      if (phase.id === 'aws' && gapsLower.some(g => g.includes('aws') || g.includes('cloud') || g.includes('nube') || g.includes('amazon'))) return true;
      if (phase.id === 'cicd' && gapsLower.some(g => g.includes('ci/cd') || g.includes('pipeline') || g.includes('actions') || g.includes('devops'))) return true;
      return false;
    });

    return matched.length > 0 ? matched : roadmapTemplates;
  }, [profile, roadmapTemplates]);

  // Aggregate all topics for total progress calculations
  const allRenderedTopics = useMemo(() => {
    return activePhases.flatMap(p => p.topics);
  }, [activePhases]);

  const totalTopicsCount = allRenderedTopics.length;
  const checkedTopicsCount = allRenderedTopics.filter(t => checkedTopics.includes(t.id)).length;
  const progressPercentage = totalTopicsCount > 0 ? Math.round((checkedTopicsCount / totalTopicsCount) * 100) : 0;

  // Loading state
  if (isProfileLoading || isCVLoading) {
    return (
      <div className="max-w-6xl mx-auto py-20 flex flex-col items-center justify-center min-h-[50vh] animate-pulse">
        <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
        <p className="text-xs text-muted-foreground">Cargando tu ruta de aprendizaje...</p>
      </div>
    );
  }

  const isDiagnosisGenerated = typeof window !== 'undefined' && localStorage.getItem('devalign_diagnosis_generated') === 'true';

  return (
    <div className="max-w-4xl mx-auto pb-12 space-y-8 relative">
      
      {/* Banner de Control / Acción (Solo visible si !isGenerated) */}
      {!isGenerated && (
        <div className="w-full max-w-xl mx-auto animate-in fade-in slide-in-from-top-4 duration-500 z-10 relative">
          {!hasCV ? (
            <Card className="border border-border bg-card p-6 shadow-md text-center space-y-6">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary-foreground border border-primary/20">
                <Map className="h-6 w-6 text-primary" />
              </div>
              <div className="space-y-2">
                <h2 className="text-lg font-extrabold text-foreground tracking-tight">
                  Ruta de Aprendizaje Personalizada
                </h2>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Para trazar tu plan de estudio individual, primero necesitamos procesar tu currículum. Con esto mapearemos tus brechas de habilidades y diseñaremos tus fases de aprendizaje paso a paso.
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
          ) : !isDiagnosisGenerated ? (
            <Card className="border border-border bg-card p-6 shadow-md text-center space-y-6">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary-foreground border border-primary/20">
                <Activity className="h-6 w-6 text-primary" />
              </div>
              <div className="space-y-2">
                <h2 className="text-lg font-extrabold text-foreground tracking-tight">
                  Diagnóstico Requerido
                </h2>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Para trazar una ruta de estudio efectiva, primero debemos detectar tus brechas y compararlas con las necesidades del mercado. Completa tu diagnóstico rápido.
                </p>
              </div>
              <Button
                onClick={() => router.push('/diagnosis')}
                className="gap-1.5 text-xs font-semibold cursor-pointer w-full h-10"
              >
                Generar mi Diagnóstico ahora
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Card>
          ) : !isGenerating ? (
            <Card className="border border-border bg-card p-6 sm:p-8 shadow-md text-center space-y-6">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary-foreground border border-primary/20">
                <Map className="h-6 w-6 text-primary fill-primary/10" />
              </div>
              <div className="space-y-2">
                <h2 className="text-lg font-extrabold text-foreground tracking-tight sm:text-xl">
                  Diseña tu Ruta de Aprendizaje
                </h2>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Tenemos tu diagnóstico listo. Ahora crearemos un roadmap de estudio estructurado con hitos de aprendizaje, temas marcables y cursos recomendados para cerrar tus brechas técnicas.
                </p>
              </div>

              <div className="border border-border/80 bg-secondary/10 rounded-2xl text-left p-4 space-y-2.5">
                <h4 className="text-[10px] font-bold text-foreground uppercase tracking-wider mb-1">
                  ¿Cómo funciona tu Roadmap?
                </h4>
                <ul className="space-y-2 text-xs text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span><strong>Fases de Estudio:</strong> Estructurado de forma lógica para avanzar gradualmente.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span><strong>Control de Progreso:</strong> Checkboxes interactivos para marcar temas dominados.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span><strong>Cursos Curados:</strong> Links a recursos oficiales y Bootcamps recomendados.</span>
                  </li>
                </ul>
              </div>

              <Button
                onClick={startGeneration}
                className="w-full gap-1.5 text-xs font-semibold cursor-pointer h-10"
              >
                Generar mi Roadmap de Aprendizaje
                <Sparkles className="h-3.5 w-3.5 fill-primary-foreground/10" />
              </Button>
            </Card>
          ) : (
            <Card className="border border-border bg-card p-6 sm:p-8 shadow-md text-left space-y-6">
              <div className="text-center space-y-2">
                <div className="relative mx-auto h-10 w-10 flex items-center justify-center">
                  <Loader2 className="h-8 w-8 text-primary animate-spin" />
                </div>
                <h3 className="text-sm font-bold text-foreground">
                  Diseñando tu plan de estudio personalizado...
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
                  { id: 3, text: 'Compilando listado de temas prácticos a dominar...' },
                  { id: 4, text: 'Asociando cursos recomendados gratuitos y de pago...' }
                ].map((step) => {
                  const isDone = generationStep > step.id;
                  const isActive = generationStep === step.id;

                  return (
                    <div 
                      key={step.id} 
                      className={`flex items-center gap-2.5 p-2 rounded-lg border transition-all text-xs ${
                        isDone 
                          ? 'border-emerald-200/50 bg-emerald-50/5 text-emerald-800 dark:border-emerald-950/20 dark:text-emerald-400' 
                          : isActive 
                            ? 'border-primary/30 bg-primary/5 text-foreground font-semibold' 
                            : 'border-border/50 bg-transparent text-muted-foreground/60'
                      }`}
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
        "transition-all duration-1000 space-y-6",
        !isGenerated && "opacity-20 blur-xs pointer-events-none select-none scale-[0.99]"
      )}>
        {/* Header and Progress Tracker */}
        <Card className="border border-border bg-card shadow-xs overflow-hidden">
          <CardContent className="p-6 sm:p-8 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5 text-left">
                <Badge className="bg-primary/5 text-primary-foreground dark:text-primary border border-primary/20 font-bold text-[10px] py-0.5 px-2.5 rounded-full mb-1">
                  Plan de Estudio Activo
                </Badge>
                <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
                  <Map className="h-5.5 w-5.5 text-primary shrink-0" />
                  Ruta de Aprendizaje
                </h2>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Este plan de estudio está enfocado en cerrar tus brechas de clúster técnico. Completa los temas prácticos para avanzar.
                </p>
              </div>
              
              {/* Progress Circle/Bar */}
              <div className="flex items-center gap-4 bg-secondary/20 border border-border/30 px-5 py-3 rounded-2xl md:max-w-xs w-full">
                <div className="h-12 w-12 rounded-full border-4 border-secondary border-t-primary flex items-center justify-center font-extrabold text-xs text-foreground shrink-0 select-none">
                  {progressPercentage}%
                </div>
                <div className="text-left space-y-0.5">
                  <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider block">
                    Progreso General
                  </span>
                  <p className="text-xs font-bold text-foreground">
                    {checkedTopicsCount} de {totalTopicsCount} temas completados
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Accordion / Timeline of Phases */}
        <div className="space-y-4">
          {activePhases.map((phase) => {
            const Icon = phase.icon;
            const isExpanded = expandedPhase === phase.id;
            
            // Calculate phase-specific progress
            const phaseCheckedCount = phase.topics.filter(t => checkedTopics.includes(t.id)).length;
            const phaseProgress = Math.round((phaseCheckedCount / phase.topics.length) * 100);

            return (
              <Card key={phase.id} className={`border border-border bg-card transition-all ${isExpanded ? 'shadow-md border-primary/30' : 'hover:border-border/80 shadow-xs'}`}>
                <button 
                  onClick={() => setExpandedPhase(isExpanded ? null : phase.id)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 cursor-pointer focus:outline-hidden select-none"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className={`p-2.5 rounded-xl border shrink-0 ${isExpanded ? 'bg-primary/10 border-primary/20 text-primary-foreground dark:text-primary' : 'bg-secondary/40 border-border/50 text-muted-foreground'}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="space-y-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-extrabold text-foreground truncate">{phase.title}</h3>
                        <Badge className={`text-[9px] font-bold py-0.5 px-2 rounded-full uppercase tracking-wider border ${
                          phase.level === 'Crítico' 
                            ? 'bg-destructive/5 text-destructive border-destructive/20' 
                            : phase.level === 'Alta'
                              ? 'bg-amber-50/10 text-amber-600 dark:text-amber-500 border-amber-300/35'
                              : 'bg-primary/5 text-primary-foreground dark:text-primary border-primary/20'
                        }`}>
                          {phase.level}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                        <span className="font-mono">{phase.hours} horas est.</span>
                        <span>&bull;</span>
                        <span>{phaseCheckedCount}/{phase.topics.length} temas</span>
                      </div>
                    </div>
                  </div>

                  {/* Progress bar inside button */}
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="hidden sm:block w-24 h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: `${phaseProgress}%` }} />
                    </div>
                    <span className="text-xs font-bold text-muted-foreground w-8 text-right">{phaseProgress}%</span>
                  </div>
                </button>

                {isExpanded && (
                  <CardContent className="px-5 pb-5 pt-0 border-t border-border/40 animate-in slide-in-from-top-2 duration-200">
                    <div className="grid gap-6 md:grid-cols-3 pt-5">
                      
                      {/* Left 2 Cols: Topics checklist */}
                      <div className="md:col-span-2 space-y-4">
                        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                          <CheckSquare className="h-4 w-4 text-primary" />
                          Temas a Desarrollar
                        </h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {phase.description}
                        </p>
                        
                        <div className="space-y-2.5 pt-2">
                          {phase.topics.map((topic) => {
                            const isChecked = checkedTopics.includes(topic.id);

                            return (
                              <label 
                                key={topic.id}
                                className={`flex items-start gap-3 p-3 rounded-xl border transition-colors cursor-pointer select-none ${
                                  isChecked 
                                    ? 'border-primary/20 bg-primary/5 text-foreground' 
                                    : 'border-border/50 bg-secondary/10 hover:bg-secondary/20 text-muted-foreground hover:text-foreground'
                                }`}
                              >
                                <input 
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => handleToggleTopic(topic.id)}
                                  className="mt-0.5 h-4.5 w-4.5 rounded-sm border-border text-primary focus:ring-primary accent-primary cursor-pointer shrink-0"
                                />
                                <span className={`text-xs font-medium leading-relaxed ${isChecked ? 'line-through opacity-70' : ''}`}>
                                  {topic.text}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      </div>

                      {/* Right 1 Col: Recommended Courses */}
                      <div className="md:col-span-1 space-y-4">
                        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                          <BookOpen className="h-4 w-4 text-primary" />
                          Cursos Recomendados
                        </h4>
                        <p className="text-[11px] text-muted-foreground">
                          Recursos educativos recomendados para dominar esta fase.
                        </p>

                        <div className="space-y-3 pt-2">
                          {phase.courses.map((course, idx) => (
                            <div key={idx} className="p-3 border border-border rounded-xl bg-card hover:bg-secondary/10 transition-colors flex flex-col justify-between gap-3 h-full max-h-[140px]">
                              <div className="space-y-1">
                                <div className="flex items-start justify-between gap-1.5">
                                  <span className="text-[10px] font-bold text-primary uppercase font-mono">{course.provider}</span>
                                  <Badge className="text-[8px] font-bold bg-primary/5 text-primary-foreground dark:text-primary border border-primary/20 py-px px-1.5 rounded-full uppercase shrink-0">
                                    {course.price}
                                  </Badge>
                                </div>
                                <h5 className="text-xs font-bold text-foreground leading-normal line-clamp-2">{course.name}</h5>
                              </div>
                              <a 
                                href={course.url} 
                                target="_blank" 
                                rel="noreferrer" 
                                className="text-[10px] font-bold text-primary hover:underline flex items-center gap-1 mt-1 shrink-0"
                              >
                                <span>Ver recurso</span>
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      </div>

    </div>
  );
}
