'use client';

import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Network,
  Cpu,
  Database,
  Binary,
  Info,
  ArrowLeft,
  Server,
  CloudLightning,
  Monitor,
  CheckSquare,
  Sparkles,
} from 'lucide-react';

const MARKET_CLUSTERS = [
  {
    id: 'data-engineering',
    name: 'Data Engineering',
    offers: 148,
    percent: 24.6,
    description: 'Procesamiento de datos a gran escala, pipelines ETL/ELT y almacenamiento distribuido relacional y no-relacional.',
    skills: ['SQL', 'Python', 'Spark', 'Hadoop', 'AWS', 'PostgreSQL'],
    icon: Database,
    colorClass: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
  },
  {
    id: 'backend',
    name: 'Backend Development',
    offers: 138,
    percent: 23.0,
    description: 'Diseño y construcción de APIs Robustas, lógica de negocio del lado del servidor, optimización de base de datos y arquitectura de microservicios.',
    skills: ['Java', 'Spring Boot', 'Node.js', 'SQL', 'PostgreSQL', 'Docker', 'Git'],
    icon: Server,
    colorClass: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20',
  },
  {
    id: 'devops',
    name: 'Cloud & DevOps Engineer',
    offers: 125,
    percent: 20.8,
    description: 'Automatización de despliegues (CI/CD), aprovisionamiento de infraestructura como código (IaC), contenedores y administración avanzada de nubes.',
    skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'Linux', 'Git', 'CI/CD'],
    icon: CloudLightning,
    colorClass: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
  },
  {
    id: 'frontend',
    name: 'Frontend Development',
    offers: 105,
    percent: 17.5,
    description: 'Desarrollo de interfaces de usuario interactivas y adaptativas, optimización del rendimiento del lado del cliente y web layouts modernos.',
    skills: ['React', 'TypeScript', 'JavaScript', 'CSS', 'HTML', 'Git', 'Tailwind'],
    icon: Monitor,
    colorClass: 'text-sky-500 bg-sky-500/10 border-sky-500/20',
  },
  {
    id: 'qa-automation',
    name: 'QA & Automation',
    offers: 84,
    percent: 14.0,
    description: 'Aseguramiento continuo de la calidad del software, diseño de pruebas automatizadas, pruebas de integración y pipelines de testing.',
    skills: ['QA', 'SQL', 'Selenium', 'Cypress', 'Git', 'Python', 'Postman'],
    icon: CheckSquare,
    colorClass: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
  },
];

function TopologyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeClusterParam = searchParams.get('cluster') || '';

  // Find if active cluster matches any of our topology clusters
  const isSelectedCluster = (clusterName: string) => {
    return activeClusterParam.toLowerCase() === clusterName.toLowerCase() ||
           (clusterName === 'Backend Development' && activeClusterParam.toLowerCase().includes('backend')) ||
           (clusterName === 'Cloud & DevOps Engineer' && (activeClusterParam.toLowerCase().includes('devops') || activeClusterParam.toLowerCase().includes('cloud')));
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header and Back Button */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground text-xs">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(`/dashboard${activeClusterParam ? `?cluster=${encodeURIComponent(activeClusterParam)}` : ''}`)}
              className="h-8 px-2 -ml-2 text-xs font-bold text-muted-foreground hover:text-foreground cursor-pointer gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Volver al Diagnóstico
            </Button>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-foreground flex items-center gap-2 mt-1">
            <Network className="w-6 h-6 text-primary shrink-0" />
            Topología del Mercado IT
          </h1>
          <p className="text-xs text-muted-foreground max-w-2xl leading-relaxed">
            Descubre los 5 clusters de especialidades técnicas que estructuran la demanda laboral de tecnología en el mercado local, identificados mediante algoritmos no supervisados.
          </p>
        </div>
      </div>

      {/* Grid: 2 Columns on desktop. Left column: Technical specs. Right/bottom: Grid of clusters */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Technical details & metadata */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="shadow-lg shadow-black/5 border-border bg-card overflow-hidden">
            <CardHeader className="border-b border-border/40 pb-4 bg-muted/20">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-primary" />
                <CardTitle className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">
                  Ficha Técnica del Modelo
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-5 space-y-4">
              <p className="text-xs text-muted-foreground leading-relaxed">
                Este análisis agrupa ofertas laborales de TI en base a la co-ocurrencia de habilidades técnicas utilizando técnicas avanzadas de minería de datos.
              </p>

              <div className="space-y-3.5 pt-2">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/5 text-primary border border-primary/10 shrink-0">
                    <Database className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-[10px] uppercase font-extrabold tracking-wider text-muted-foreground">Volumen Analizado</h4>
                    <p className="text-xs font-bold text-foreground mt-0.5">600 ofertas reales activas</p>
                    <p className="text-[10px] text-muted-foreground leading-normal mt-0.5">Extraídas directamente de portales y canales de empleo de tecnología.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/5 text-primary border border-primary/10 shrink-0">
                    <Binary className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-[10px] uppercase font-extrabold tracking-wider text-muted-foreground">Habilidades Únicas</h4>
                    <p className="text-xs font-bold text-foreground mt-0.5">73 tecnologías distintas</p>
                    <p className="text-[10px] text-muted-foreground leading-normal mt-0.5">Mapeadas y limpiadas a partir de los requisitos listados en las ofertas.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/5 text-primary border border-primary/10 shrink-0">
                    <Cpu className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-[10px] uppercase font-extrabold tracking-wider text-muted-foreground">Algoritmo Utilizado</h4>
                    <p className="text-xs font-bold text-foreground mt-0.5">Clustering K-Modes Multivariado</p>
                    <p className="text-[10px] text-muted-foreground leading-normal mt-0.5">Optimizado para datos categóricos (presencia/ausencia de habilidades).</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/5 text-blue-500 border border-blue-500/10 shrink-0">
                    <Info className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-[10px] uppercase font-extrabold tracking-wider text-muted-foreground">Frecuencia de Actualización</h4>
                    <p className="text-xs font-bold text-blue-600 dark:text-blue-400 mt-0.5">Semanal (Automatizada)</p>
                    <p className="text-[10px] text-muted-foreground leading-normal mt-0.5">El sistema sincroniza nuevos datos los domingos para mantener el pulso del mercado.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Active context panel */}
          {activeClusterParam && (
            <Card className="shadow-lg shadow-black/5 border-primary/20 bg-primary/5">
              <CardContent className="py-4 space-y-2">
                <div className="flex items-center gap-1.5 text-primary">
                  <Sparkles className="h-4 w-4" />
                  <span className="text-xs font-bold font-mono uppercase tracking-wider">Contexto de Análisis Activo</span>
                </div>
                <p className="text-xs text-foreground/80 leading-normal">
                  Actualmente estás comparando tu perfil con la especialidad de: <strong className="text-primary font-semibold">{activeClusterParam}</strong>.
                </p>
                <p className="text-[10px] text-muted-foreground leading-normal">
                  Puedes hacer clic en cualquier cluster para volver al diagnóstico con esa especialidad seleccionada.
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Columns: The spacious layout of clusters */}
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MARKET_CLUSTERS.map((cluster) => {
              const IconComponent = cluster.icon;
              const isSelected = isSelectedCluster(cluster.name);
              
              return (
                <div
                  key={cluster.id}
                  onClick={() => router.push(`/dashboard?cluster=${encodeURIComponent(cluster.name)}`)}
                  className={`group relative p-5 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between min-h-[260px] ${
                    isSelected
                      ? 'bg-primary/5 border-primary shadow-md scale-[1.01]'
                      : 'bg-card border-border/80 hover:border-primary/40 hover:bg-secondary/15 hover:shadow-xs'
                  }`}
                >
                  {/* Select Badge Indicator */}
                  {isSelected && (
                    <span className="absolute top-4 right-4 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold bg-primary text-primary-foreground border border-primary/20 animate-pulse uppercase tracking-wider">
                      <Sparkles className="h-2 w-2" />
                      Evaluando
                    </span>
                  )}

                  <div className="space-y-3">
                    {/* Icon and Name */}
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl border shrink-0 group-hover:scale-105 transition-transform ${cluster.colorClass}`}>
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-sm text-foreground tracking-tight group-hover:text-primary transition-colors">
                          {cluster.name}
                        </h3>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[10px] text-muted-foreground font-semibold">
                            {cluster.offers} ofertas
                          </span>
                          <span className="h-1 w-1 rounded-full bg-border" />
                          <span className="text-[10px] text-primary font-bold">
                            {cluster.percent}% del mercado
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-1.5 w-full bg-secondary overflow-hidden rounded-full mt-2">
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ease-out ${
                          isSelected ? 'bg-primary' : 'bg-primary/50 group-hover:bg-primary/70'
                        }`}
                        style={{ width: `${cluster.percent * 3.5}%` }} // Multiply to fill or represent it proportional to largest
                      />
                    </div>

                    {/* Description */}
                    <p className="text-xs text-muted-foreground leading-relaxed pt-1">
                      {cluster.description}
                    </p>
                  </div>

                  {/* Skills/Technologies Badges */}
                  <div className="space-y-2 mt-4 pt-3 border-t border-border/40">
                    <span className="text-[8px] font-extrabold text-muted-foreground uppercase tracking-widest block">
                      Habilidades Nucleares
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {cluster.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-0.5 rounded-md text-[9px] font-semibold bg-secondary text-foreground/80 hover:text-primary hover:bg-primary/5 transition-all"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 flex justify-end">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-[10px] font-bold h-7 gap-1 hover:bg-primary/10 hover:text-primary hover:border-primary/30"
                    >
                      <ArrowLeft className="w-3 h-3 rotate-180" />
                      Ver Detalles
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MarketTopologyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="flex flex-col items-center gap-3">
            <style jsx global>{`
              @keyframes spin {
                to { transform: rotate(360deg); }
              }
              .animate-spin-custom {
                animation: spin 1s linear infinite;
              }
            `}</style>
            <Cpu className="h-8 w-8 animate-spin-custom text-primary" />
            <p className="text-xs text-muted-foreground font-semibold">Cargando la Topología del Mercado...</p>
          </div>
        </div>
      }
    >
      <TopologyContent />
    </Suspense>
  );
}
