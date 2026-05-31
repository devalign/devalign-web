'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserProfile } from '@/hooks/use-user-profile';
import { useUserCVs } from '@/hooks/use-user-cvs';
import { mockDiagnosisData } from './mock-data';
import { SpecialtyHeroCard } from './specialty-hero-card';

import { StrengthsCard } from './strengths-card';
import { PriorityGapsCard } from './priority-gaps-card';
import { AffinityRadarChartCard } from './affinity-radar-chart';
import { ClusterDemandChartCard } from './cluster-demand-chart';
import { EstimatedSeniorityCard } from './estimated-seniority-card';
import { CompatibleRolesCard } from './compatible-roles-card';
import { AiInsightCard } from './ai-insight-card';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Sparkles,
  Loader2,
  FileText,
  Activity,
  ArrowRight,
  CheckCircle2,
  Map,
  Compass,
} from 'lucide-react';

export function DiagnosisDashboard() {
  const router = useRouter();
  const { data: profile, isLoading: isProfileLoading } = useUserProfile();
  const { data: cvData, isLoading: isCVLoading } = useUserCVs();

  // Local state for interactive generation simulation
  const [isGenerated, setIsGenerated] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);

  // Sync state with localStorage to persist generation
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('devalign_diagnosis_generated');
      if (saved === 'true') {
        setIsGenerated(true);
      }
    }
  }, []);

  const hasCV = cvData && cvData.cvs && cvData.cvs.length > 0;
  const hasProfile = !!profile;
  const isAnalyzing = hasCV && !hasProfile;

  // Simulate AI generation steps
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
        localStorage.setItem('devalign_diagnosis_generated', 'true');
      }, 3200),
    ];

    return () => timers.forEach((t) => clearTimeout(t));
  };

  // Loading state
  if (isProfileLoading || isCVLoading) {
    return (
      <div className="max-w-6xl mx-auto py-20 flex flex-col items-center justify-center min-h-[50vh] animate-pulse">
        <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
        <p className="text-xs text-muted-foreground">Cargando datos del diagnóstico...</p>
      </div>
    );
  }

  // CASO D: Diagnóstico generado (Muestra Dashboard)
  const data = mockDiagnosisData;

  // Let's dynamically override specialty from profile if available
  if (profile) {
    data.detectedSpecialty = profile.primary_specialty || data.detectedSpecialty;
    data.estimatedSeniority = profile.seniority || data.estimatedSeniority;
    if (profile.years_experience) {
      data.seniorityYearsBasis = profile.years_experience;
    }
  }

  return (
    <div className="max-w-6xl mx-auto pb-12 space-y-8 relative">
      {/* Hero Card Area (Conditional layout based on isGenerated) */}
      {!isGenerated ? (
        <>
          {!hasCV && (
            <div className="relative overflow-hidden rounded-[2rem] bg-white/60 dark:bg-slate-950/50 backdrop-blur-xl text-foreground dark:text-white p-8 mb-6 border border-white/80 dark:border-slate-800/60 shadow-xl shadow-primary/5 dark:shadow-none">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 dark:bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/50 dark:bg-secondary/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

              <div className="relative z-10 flex flex-col lg:flex-row gap-8 items-start lg:items-center justify-between">
                <div className="flex-1 space-y-6">
                  <div>
                    <h3 className="text-xs font-bold tracking-widest text-primary uppercase mb-2">
                      Especialidad detectada (Principal)
                    </h3>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-3xl font-bold text-muted-foreground/50 dark:text-slate-500">
                        Sin currículum
                      </h2>
                    </div>
                    <p className="text-muted-foreground/90 dark:text-slate-400 mt-2 text-sm leading-relaxed max-w-xl">
                      Para evaluar tu nivel de seniority, identificar tus brechas de habilidades y
                      medir tu afinidad con los roles del mercado, primero debes subir tu currículum
                      en tu perfil.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold tracking-widest text-muted-foreground/90 dark:text-slate-500 uppercase mb-3">
                      Afinidades Secundarias
                    </h4>
                    <p className="text-xs text-muted-foreground/60 dark:text-slate-500 italic">
                      Sube tu CV para calcular afinidades secundarias.
                    </p>
                  </div>
                </div>

                <div className="flex-shrink-0 flex flex-col items-start lg:items-end gap-6 w-full lg:w-auto">
                  <div className="text-left lg:text-right w-full lg:w-auto">
                    <h3 className="text-xs font-bold tracking-widest text-muted-foreground/90 dark:text-slate-500 uppercase mb-2">
                      Alineación con el mercado
                    </h3>
                    <div className="text-5xl font-bold mb-2 text-muted-foreground/40 dark:text-slate-600">
                      0%
                    </div>

                    {/* Empty progress bar */}
                    <div className="w-full lg:w-48 h-2 bg-secondary/50 dark:bg-slate-800 rounded-full overflow-hidden mb-2" />
                  </div>

                  <Button
                    onClick={() => router.push('/profile')}
                    className="w-full lg:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl h-12 px-6 gap-2 border-none cursor-pointer"
                  >
                    Ir a mi Perfil para subir CV
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {isAnalyzing && (
            <div className="relative overflow-hidden rounded-[2rem] bg-white/60 dark:bg-slate-950/50 backdrop-blur-xl text-foreground dark:text-white p-8 mb-6 border border-white/80 dark:border-slate-800/60 shadow-xl shadow-primary/5 dark:shadow-none">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 dark:bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/50 dark:bg-secondary/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

              <div className="relative z-10 flex flex-col lg:flex-row gap-8 items-start lg:items-center justify-between">
                <div className="flex-1 space-y-6">
                  <div>
                    <h3 className="text-xs font-bold tracking-widest text-primary uppercase mb-2">
                      Especialidad detectada (Principal)
                    </h3>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-3xl font-bold flex items-center gap-2">
                        Analizando perfil...
                        <Loader2 className="h-6 w-6 text-primary animate-spin" />
                      </h2>
                    </div>
                    <p className="text-muted-foreground/90 dark:text-slate-400 mt-2 text-sm leading-relaxed max-w-xl">
                      La Inteligencia Artificial está leyendo tu currículum para mapear tu
                      experiencia laboral y tus habilidades técnicas.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold tracking-widest text-muted-foreground/90 dark:text-slate-500 uppercase mb-3">
                      Afinidades Secundarias
                    </h4>
                    <p className="text-xs text-muted-foreground/60 dark:text-slate-500 italic">
                      Calculando afinidades secundarias...
                    </p>
                  </div>
                </div>

                <div className="flex-shrink-0 flex flex-col items-start lg:items-end gap-6 w-full lg:w-auto">
                  <div className="text-left lg:text-right w-full lg:w-auto">
                    <h3 className="text-xs font-bold tracking-widest text-muted-foreground/90 dark:text-slate-500 uppercase mb-2">
                      Alineación con el mercado
                    </h3>
                    <div className="text-5xl font-bold mb-2 text-muted-foreground/40 dark:text-slate-600">
                      ...
                    </div>
                    <div className="w-full lg:w-48 h-2 bg-secondary/50 dark:bg-slate-800 rounded-full overflow-hidden mb-2" />
                  </div>

                  <Button
                    disabled
                    className="w-full lg:w-auto bg-secondary dark:bg-slate-800 text-muted-foreground dark:text-slate-400 font-bold rounded-xl h-12 px-6 gap-2 border-none cursor-not-allowed select-none"
                  >
                    Procesando CV...
                  </Button>
                </div>
              </div>
            </div>
          )}

          {hasCV && !isAnalyzing && !isGenerating && (
            <div className="relative overflow-hidden rounded-lg bg-white/60 dark:bg-slate-950/80 backdrop-blur-xl text-foreground dark:text-white p-8 mb-6 border border-white/80 dark:border-slate-800/60 shadow-xl shadow-primary/5 dark:shadow-none">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 dark:bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/50 dark:bg-secondary/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

              <div className="relative z-10 flex flex-col lg:flex-row gap-8 items-start lg:items-center justify-between">
                <div className="flex-1 space-y-6">
                  <div>
                    <h3 className="text-xs font-bold tracking-widest text-primary uppercase mb-2">
                      Especialidad detectada (Principal)
                    </h3>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-3xl font-bold">Listo para el diagnóstico</h2>
                      <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-full border border-emerald-500/30">
                        Perfil cargado
                      </span>
                    </div>
                    <p className="text-muted-foreground/90 dark:text-slate-400 mt-2 text-sm leading-relaxed max-w-xl">
                      Hemos extraído tus datos profesionales de tu currículum. Ahora podemos cruzar
                      tu experiencia con la demanda del mercado de desarrollo de software para
                      generar tu diagnóstico detallado.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold tracking-widest text-muted-foreground/90 dark:text-slate-500 uppercase mb-3">
                      Afinidades Secundarias
                    </h4>
                    <p className="text-xs text-muted-foreground/60 dark:text-slate-500 italic">
                      Las afinidades de roles se calcularán al generar el diagnóstico.
                    </p>
                  </div>
                </div>

                <div className="flex-shrink-0 flex flex-col items-start lg:items-end gap-6 w-full lg:w-auto">
                  <div className="text-left lg:text-right w-full lg:w-auto">
                    <h3 className="text-xs font-bold tracking-widest text-muted-foreground/90 dark:text-slate-500 uppercase mb-2">
                      Alineación con el mercado
                    </h3>
                    <div className="text-5xl font-bold mb-2 text-muted-foreground/40 dark:text-slate-600">
                      0%
                    </div>

                    {/* Empty progress bar */}
                    <div className="w-full lg:w-48 h-2 bg-secondary/50 dark:bg-slate-800 rounded-full overflow-hidden mb-2" />
                  </div>

                  <Button
                    onClick={startGeneration}
                    className="w-full lg:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl h-12 px-6 gap-2 border-none cursor-pointer"
                  >
                    Generar Diagnóstico con IA
                    <Sparkles className="h-4 w-4 fill-primary-foreground/10" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {hasCV && isGenerating && (
            <div className="relative overflow-hidden rounded-[2rem] bg-white/60 dark:bg-slate-950/50 backdrop-blur-xl text-foreground dark:text-white p-8 mb-6 border border-white/80 dark:border-slate-800/60 shadow-xl shadow-primary/5 dark:shadow-none">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 dark:bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/50 dark:bg-secondary/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

              <div className="relative z-10 flex flex-col lg:flex-row gap-8 items-start lg:items-center justify-between">
                <div className="flex-1 space-y-6">
                  <div>
                    <h3 className="text-xs font-bold tracking-widest text-primary uppercase mb-2">
                      Procesando diagnóstico
                    </h3>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-3xl font-bold flex items-center gap-2">
                        Analizando competencias...
                        <Loader2 className="h-6 w-6 text-primary animate-spin" />
                      </h2>
                    </div>
                  </div>

                  {/* Generation steps in the hero card */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl">
                    {[
                      { id: 1, text: 'Extrayendo habilidades...' },
                      { id: 2, text: 'Mapeando brechas...' },
                      { id: 3, text: 'Calculando afinidades...' },
                      { id: 4, text: 'Optimizando seniority...' },
                    ].map((step) => {
                      const isDone = generationStep > step.id;
                      const isActive = generationStep === step.id;
                      return (
                        <div
                          key={step.id}
                          className={`flex items-center gap-2.5 py-2 px-3.5 rounded-xl border transition-all text-xs ${
                            isDone
                              ? 'border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                              : isActive
                                ? 'border-primary/45 bg-primary/20 text-foreground dark:text-white font-bold'
                                : 'border-border dark:border-slate-800 bg-transparent text-muted-foreground/60 dark:text-slate-500'
                          }`}
                        >
                          {isDone ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
                          ) : isActive ? (
                            <Loader2 className="h-4 w-4 text-primary animate-spin shrink-0" />
                          ) : (
                            <div className="h-4 w-4 rounded-full border border-border dark:border-slate-700 flex items-center justify-center text-[9px] font-mono shrink-0">
                              {step.id}
                            </div>
                          )}
                          <span className="truncate">{step.text}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex-shrink-0 flex flex-col items-start lg:items-end gap-6 w-full lg:w-auto">
                  <div className="text-left lg:text-right w-full lg:w-auto">
                    <h3 className="text-xs font-bold tracking-widest text-muted-foreground/90 dark:text-slate-500 uppercase mb-2">
                      Progreso del análisis
                    </h3>
                    <div className="text-5xl font-bold mb-2 text-primary">
                      {Math.round((generationStep / 4) * 100)}%
                    </div>

                    {/* Active progress bar */}
                    <div className="w-full lg:w-48 h-2 bg-secondary/50 dark:bg-slate-800 rounded-full overflow-hidden mb-2">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-300 ease-out"
                        style={{ width: `${(generationStep / 4) * 100}%` }}
                      />
                    </div>
                  </div>

                  <Button
                    disabled
                    className="w-full lg:w-auto bg-secondary dark:bg-slate-800 text-muted-foreground dark:text-slate-400 font-bold rounded-xl h-12 px-6 gap-2 border-none cursor-not-allowed select-none"
                  >
                    <Loader2 className="h-4 w-4 text-muted-foreground dark:text-slate-400 animate-spin" />
                    Generando...
                  </Button>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <SpecialtyHeroCard data={data} />
      )}

      {/* Dashboard Layout */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <StrengthsCard
              strengths={data.strengths}
              total={data.totalStrengthsCount}
              isEmpty={!isGenerated}
            />
          </div>

          <div className="lg:col-span-1">
            <PriorityGapsCard gaps={data.gaps} total={data.totalGapsCount} isEmpty={!isGenerated} />
          </div>

          <div className="lg:col-span-1">
            <AffinityRadarChartCard data={data.domainAffinities} isEmpty={!isGenerated} />
          </div>

          <div className="lg:col-span-1">
            <CompatibleRolesCard roles={data.compatibleRoles} isEmpty={!isGenerated} />
          </div>

          <div className="lg:col-span-1">
            <AiInsightCard insight={data.aiInsight} isEmpty={!isGenerated} />
          </div>

          <div className="lg:col-span-1 flex flex-col gap-6">
            <ClusterDemandChartCard
              growth={data.clusterDemandGrowth}
              data={data.clusterDemandData}
              isEmpty={!isGenerated}
            />
            <EstimatedSeniorityCard
              seniority={data.estimatedSeniority}
              yearsBasis={data.seniorityYearsBasis}
              isEmpty={!isGenerated}
            />
          </div>
        </div>

        {/* Roadmap CTA Card */}
        <Card
          className={cn(
            'border border-dashed border-primary/45 bg-primary/5 overflow-hidden shadow-xs transition-all duration-300',
            !isGenerated && 'opacity-40 pointer-events-none select-none',
          )}
        >
          <CardContent className="p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-left w-full md:max-w-2xl">
              <h3 className="text-base sm:text-lg font-extrabold text-foreground flex items-center gap-2">
                <Map className="h-5 w-5 text-primary shrink-0" />
                ¿Listo para cerrar tus brechas técnicas?
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Hemos identificado {profile?.skill_gaps?.length || data.gaps.length} brechas de
                habilidades en tu perfil (como{' '}
                {profile?.skill_gaps
                  ?.slice(0, 3)
                  .map((g) => g.name)
                  .join(', ') || 'Docker, AWS'}
                ). Genera un plan de estudio estructurado paso a paso para dominar estas
                tecnologías.
              </p>
            </div>
            <Button
              onClick={() => router.push('/roadmap?generate=true')}
              className="w-full md:w-auto shrink-0 font-semibold cursor-pointer h-10"
              disabled={!isGenerated}
            >
              Generar Roadmap de Aprendizaje
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
