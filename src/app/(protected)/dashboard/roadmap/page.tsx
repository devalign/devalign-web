'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ChevronRight, 
  Lightbulb, 
  Sparkles, 
  TrendingUp, 
  X
} from 'lucide-react';

interface RoadmapStep {
  skill: string;
  impact: string;
  topics: string[];
  justification: string;
  rule: string;
  trendData: number[]; // Trend over 6 months
}

export default function RoadmapPage() {
  const [activeStep, setActiveStep] = useState<RoadmapStep | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Phases of roadmap
  const phases = [
    {
      title: 'Fase 1: Fundamentos de Contenedores',
      description: 'Aprende a empaquetar tus aplicaciones de forma consistente.',
      steps: [
        {
          skill: 'Docker',
          impact: '+12% de Alineación',
          topics: ['Contenedores', 'Imágenes', 'Dockerfiles', 'Docker Compose'],
          justification: 'Docker aparece en el 74% de las ofertas asociadas a tu especialidad de Data Engineering y Backend. Su conocimiento es un prerrequisito para orquestación y despliegue cloud.',
          rule: 'Java + Spring Boot -> Docker (Confianza: 74%)',
          trendData: [45, 52, 58, 62, 69, 74]
        }
      ]
    },
    {
      title: 'Fase 2: Orquestación & Microservicios',
      description: 'Escala y administra contenedores en producción.',
      steps: [
        {
          skill: 'Kubernetes',
          impact: '+10% de Alineación',
          topics: ['Pods', 'Deployments', 'Services', 'ConfigMaps & Secrets'],
          justification: 'Kubernetes es la herramienta estándar del mercado TI peruano para la administración de microservicios en la nube. Las ofertas de arquitecturas de datos modernas exigen orquestación automatizada.',
          rule: 'Docker + Java -> Kubernetes (Confianza: 68%)',
          trendData: [35, 42, 49, 54, 60, 68]
        },
        {
          skill: 'Microservicios',
          impact: '+8% de Alineación',
          topics: ['API Gateways', 'Service Mesh', 'Eventos (Kafka/RabbitMQ)', 'Patrones de Resiliencia'],
          justification: 'La arquitectura de microservicios representa el 82% de la demanda en ofertas para ingenieros Mid/Senior. Entender la comunicación distribuida es crítico.',
          rule: 'Spring Boot + Docker -> Microservicios (Confianza: 82%)',
          trendData: [70, 72, 75, 78, 80, 82]
        }
      ]
    },
    {
      title: 'Fase 3: Infraestructura & Nube Pública',
      description: 'Lleva tus flujos de datos y servicios a infraestructuras cloud.',
      steps: [
        {
          skill: 'AWS',
          impact: '+8% de Alineación',
          topics: ['Amazon S3', 'EC2 & ECS', 'AWS Lambda', 'IAM Security'],
          justification: 'AWS es el proveedor de nube dominante en el mercado local con 58% de las ofertas exigiendo experiencia cloud directa. Ideal para orquestar pipelines de datos.',
          rule: 'Docker + Kubernetes -> AWS (Confianza: 81%)',
          trendData: [40, 43, 48, 51, 55, 58]
        },
        {
          skill: 'CI/CD',
          impact: '+6% de Alineación',
          topics: ['GitHub Actions', 'Pipelines', 'Automatización de Pruebas', 'Despliegue Continuo'],
          justification: 'La integración continua garantiza despliegues seguros y ágiles. Redundancia de errores manuales reducida a cero.',
          rule: 'Git + Docker -> CI/CD (Confianza: 70%)',
          trendData: [55, 58, 62, 65, 68, 70]
        }
      ]
    }
  ];

  const handleStepClick = (step: RoadmapStep) => {
    setActiveStep(step);
    setIsDrawerOpen(true);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/20">
            <Sparkles className="w-3 h-3" />
            Ruta Recomendada
          </span>
        </div>
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Tu Ruta de Aprendizaje</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Una ruta secuencial optimizada mediante reglas de asociación para reducir tus brechas con el mercado.
        </p>
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
                          <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{step.skill}</h4>
                          <span className="text-[9px] font-bold text-emerald-600 bg-emerald-500/10 px-1.5 py-0.5 rounded-md">
                            {step.impact}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {step.topics.slice(0, 3).map((topic, tIdx) => (
                            <span key={tIdx} className="text-[9px] text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                              {topic}
                            </span>
                          ))}
                          {step.topics.length > 3 && (
                            <span className="text-[9px] text-muted-foreground">+1</span>
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
                <span className="text-3xl font-black text-foreground tracking-tight">+28%</span>
                <span className="text-[10px] text-muted-foreground font-semibold">Crecimiento laboral</span>
              </div>
              <p className="text-[10px] text-muted-foreground leading-normal">
                Las ofertas para la especialidad <strong>Data Engineering</strong> se han incrementado en los últimos 6 meses en Lima metropolitana.
              </p>
              
              {/* Sparkline Graph */}
              <div className="h-10 w-full mt-2">
                <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
                  {/* Area fill */}
                  <path 
                    d="M0,30 L10,25 L30,28 L50,18 L70,15 L90,10 L100,5 L100,30 Z" 
                    className="fill-primary/10"
                  />
                  {/* Line path */}
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
            <CardContent className="pt-6 space-y-3">
              <div className="flex items-start gap-2.5">
                <Lightbulb className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-[10px] font-bold text-foreground uppercase tracking-wider">INSIGHT IA</h4>
                  <p className="text-[10px] text-muted-foreground leading-normal">
                    Los perfiles Backend Java con <strong>Kubernetes</strong> y <strong>AWS</strong> tienen salarios promedios <strong>32% más altos (2.3x)</strong> en el mercado peruano comparado con perfiles tradicionales sin experiencia cloud.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
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
                <span className="text-[9px] font-bold text-primary uppercase tracking-wider">Detalle de Brecha</span>
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
                <h4 className="text-[10px] font-extrabold text-foreground uppercase tracking-wider">Justificación de Prioridad</h4>
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
                  Esta regla fue descubierta mediante el algoritmo <strong>FP-Growth</strong> analizando 450+ ofertas del mercado local. Indica una alta co-ocurrencia de estas habilidades.
                </p>
              </div>

              {/* Tendencia Temporal de Demanda */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-extrabold text-foreground uppercase tracking-wider">Tendencia de Demanda (Últimos 6 meses)</h4>
                
                {/* SVG Graph for Tendencia */}
                <div className="h-32 w-full border border-border/50 rounded-xl p-3 bg-secondary/10 relative">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 100 40" preserveAspectRatio="none">
                    {/* Grid Lines */}
                    <line x1={0} y1={10} x2={100} y2={100} className="stroke-border/20 stroke-1 stroke-dasharray-[1,1]" />
                    <line x1={0} y1={25} x2={100} y2={100} className="stroke-border/20 stroke-1 stroke-dasharray-[1,1]" />

                    {/* Area Fill */}
                    <path 
                      d={`M0,40 L20,${40 - (activeStep.trendData[1]/2.5)} L40,${40 - (activeStep.trendData[2]/2.5)} L60,${40 - (activeStep.trendData[3]/2.5)} L80,${40 - (activeStep.trendData[4]/2.5)} L100,${40 - (activeStep.trendData[5]/2.5)} L100,40 Z`} 
                      className="fill-primary/15"
                    />

                    {/* Line */}
                    <path 
                      d={`M0,${40 - (activeStep.trendData[0]/2.5)} L20,${40 - (activeStep.trendData[1]/2.5)} L40,${40 - (activeStep.trendData[2]/2.5)} L60,${40 - (activeStep.trendData[3]/2.5)} L80,${40 - (activeStep.trendData[4]/2.5)} L100,${40 - (activeStep.trendData[5]/2.5)}`} 
                      className="fill-none stroke-primary stroke-2"
                    />

                    {/* Circles on Nodes */}
                    {activeStep.trendData.map((val, idx) => (
                      <circle 
                        key={idx}
                        cx={idx * 20} 
                        cy={40 - (val / 2.5)} 
                        r={2} 
                        className="fill-primary stroke-card stroke-0.5" 
                      />
                    ))}
                  </svg>

                  {/* Graph Labels */}
                  <div className="absolute top-2 left-2 text-[8px] font-mono text-muted-foreground font-bold">
                    Demanda máx: {activeStep.trendData[5]}%
                  </div>
                </div>

                <p className="text-[9px] text-muted-foreground leading-normal">
                  El porcentaje representa la frecuencia de aparición de <strong>{activeStep.skill}</strong> en ofertas de especialidades técnicas TI similares en el Perú.
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
