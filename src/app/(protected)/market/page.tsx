'use client';

import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Cpu,
  Database,
  Binary,
  Info,
  ArrowLeft,
  ChevronLeft,
  Server,
  CloudLightning,
  Monitor,
  CheckSquare,
  Sparkles,
} from 'lucide-react';
import { useMarketClusters } from '@/hooks/use-market-clusters';
import { useUserProfile } from '@/hooks/use-user-profile';

function getClusterMetadata(name: string) {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('data')) {
    return {
      icon: Database,
      colorClass: 'text-warning bg-warning/10 border-warning/20',
    };
  }
  if (
    lowerName.includes('backend') ||
    lowerName.includes('back-end') ||
    lowerName.includes('java')
  ) {
    return {
      icon: Server,
      colorClass: 'text-info bg-info/10 border-info/20',
    };
  }
  if (lowerName.includes('devops') || lowerName.includes('cloud') || lowerName.includes('sre')) {
    return {
      icon: CloudLightning,
      colorClass: 'text-success bg-success/10 border-success/20',
    };
  }
  if (lowerName.includes('frontend') || lowerName.includes('front-end')) {
    return {
      icon: Monitor,
      colorClass: 'text-sky-500 bg-sky-500/10 border-sky-500/20',
    };
  }
  if (lowerName.includes('qa') || lowerName.includes('test') || lowerName.includes('automation')) {
    return {
      icon: CheckSquare,
      colorClass: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
    };
  }
  if (
    lowerName.includes('full stack') ||
    lowerName.includes('fullstack') ||
    lowerName.includes('developer')
  ) {
    return {
      icon: Cpu,
      colorClass: 'text-sky-500 bg-sky-500/10 border-sky-500/20',
    };
  }
  return {
    icon: Cpu,
    colorClass: 'text-muted-foreground bg-muted/10 border-muted/20',
  };
}

function TopologyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeClusterParam = searchParams.get('cluster') || '';

  const { data: clusters = [], isLoading, error } = useMarketClusters();
  const { data: profile } = useUserProfile();

  const initialCluster = activeClusterParam || profile?.primary_specialty || '';
  const [selectedCluster, setSelectedCluster] = React.useState(initialCluster);

  // Find if active cluster matches any of our topology clusters
  const isSelectedCluster = (clusterName: string) => {
    if (!selectedCluster) return false;
    const nameLow = clusterName.toLowerCase();
    const paramLow = selectedCluster.toLowerCase();
    return nameLow === paramLow || nameLow.includes(paramLow) || paramLow.includes(nameLow);
  };

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Cpu className="h-8 w-8 animate-spin text-primary" />
          <p className="text-xs text-muted-foreground font-semibold">
            Cargando la Topología del Mercado...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3 max-w-md text-center p-6 bg-destructive/5 border border-destructive/10 rounded-2xl">
          <Info className="h-8 w-8 text-destructive" />
          <h3 className="font-extrabold text-sm text-foreground">Error al cargar la topología</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {error instanceof Error
              ? error.message
              : 'No se pudieron recuperar los datos de clústeres del servidor.'}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.reload()}
            className="mt-2 text-xs font-bold"
          >
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  const totalOffers = clusters.reduce((sum, c) => sum + c.job_offer_count, 0);

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-2 mt-6">
        <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground flex items-center gap-1">
          <button
            onClick={() => router.push('/overview')}
            className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer -ml-1"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          Topología del Mercado IT
        </h1>
        <p className="text-xs text-muted-foreground max-w-2xl leading-relaxed">
          Descubre los {clusters.length} clusters de especialidades técnicas que estructuran la
          demanda laboral de tecnología en el mercado local, identificados mediante algoritmos no
          supervisados.
        </p>
      </div>

      {/* Grid: 2 Columns on desktop. Left column: Technical specs. Right/bottom: Grid of clusters */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Technical details & metadata */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="card-standard overflow-hidden gap-0 py-0">
            <CardHeader className="border-b border-border/40 py-3.5 bg-muted/20 px-4 sm:px-6">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-primary" />
                <CardTitle className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">
                  Ficha Técnica del Modelo
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-4 pb-5 space-y-4 px-4 sm:px-6">
              <p className="text-xs text-muted-foreground leading-relaxed">
                Este análisis agrupa ofertas laborales de TI en base a la co-ocurrencia de
                habilidades técnicas utilizando técnicas avanzadas de minería de datos.
              </p>

              <div className="space-y-3.5 pt-2">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/5 text-primary border border-primary/10 shrink-0">
                    <Database className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-[10px] uppercase font-extrabold tracking-wider text-muted-foreground">
                      Volumen Analizado
                    </h4>
                    <p className="text-xs font-bold text-foreground mt-0.5">
                      {totalOffers} ofertas reales activas
                    </p>
                    <p className="text-[10px] text-muted-foreground leading-normal mt-0.5">
                      Extraídas directamente de portales y canales de empleo de tecnología.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/5 text-primary border border-primary/10 shrink-0">
                    <Binary className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-[10px] uppercase font-extrabold tracking-wider text-muted-foreground">
                      Habilidades Únicas
                    </h4>
                    <p className="text-xs font-bold text-foreground mt-0.5">
                      73 tecnologías distintas
                    </p>
                    <p className="text-[10px] text-muted-foreground leading-normal mt-0.5">
                      Mapeadas y limpiadas a partir de los requisitos listados en las ofertas.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/5 text-primary border border-primary/10 shrink-0">
                    <Cpu className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-[10px] uppercase font-extrabold tracking-wider text-muted-foreground">
                      Algoritmo Utilizado
                    </h4>
                    <p className="text-xs font-bold text-foreground mt-0.5">
                      Clustering HDBSCAN sobre UMAP
                    </p>
                    <p className="text-[10px] text-muted-foreground leading-normal mt-0.5">
                      Clustering jerárquico basado en densidad optimizado con reducción dimensional
                      para capturar afinidades complejas de habilidades.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/5 text-blue-500 border border-blue-500/10 shrink-0">
                    <Info className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-[10px] uppercase font-extrabold tracking-wider text-muted-foreground">
                      Frecuencia de Actualización
                    </h4>
                    <p className="text-xs font-bold text-blue-600 dark:text-blue-400 mt-0.5">
                      Semanal (Automatizada)
                    </p>
                    <p className="text-[10px] text-muted-foreground leading-normal mt-0.5">
                      El sistema sincroniza nuevos datos los domingos para mantener el pulso del
                      mercado.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Active context panel */}
          {selectedCluster && (
            <Card className="card-tinted">
              <CardContent className="py-4 space-y-2">
                <div className="flex items-center gap-1.5 text-primary">
                  <Sparkles className="h-4 w-4" />
                  <span className="text-xs font-bold font-mono uppercase tracking-wider">
                    Especialidad Seleccionada
                  </span>
                </div>
                <p className="text-xs text-foreground/80 leading-normal">
                  Has seleccionado la especialidad de:{' '}
                  <strong className="text-primary font-semibold">{selectedCluster}</strong>.
                </p>
                <p className="text-[10px] text-muted-foreground leading-normal">
                  Haz clic en &quot;Ver Diagnóstico&quot; para analizar tu perfil con esta
                  especialidad.
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Columns: The spacious layout of clusters */}
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {clusters.map((cluster) => {
              const { icon: IconComponent, colorClass } = getClusterMetadata(cluster.name);
              const isSelected = isSelectedCluster(cluster.name);
              const percent =
                totalOffers > 0
                  ? parseFloat(((cluster.job_offer_count / totalOffers) * 100).toFixed(1))
                  : 0;

              return (
                <div
                  key={cluster.id}
                  onClick={() => setSelectedCluster(cluster.name)}
                  className={`group relative p-5 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between min-h-[260px] ${
                    isSelected
                      ? 'bg-primary/5 border-primary shadow-md scale-[1.01]'
                      : 'bg-card border-border/80 hover:border-primary/40 hover:bg-secondary/15 hover:shadow-xs'
                  }`}
                >
                  {/* Radio Selection Indicator */}
                  <div className="absolute top-4 right-4">
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                        isSelected
                          ? 'border-primary bg-primary'
                          : 'border-muted-foreground/30 bg-transparent'
                      }`}
                    >
                      {isSelected && (
                        <div className="w-1.5 h-1.5 rounded-full bg-primary-foreground" />
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    {/* Icon and Name */}
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2.5 rounded-xl border shrink-0 group-hover:scale-105 transition-transform ${colorClass}`}
                      >
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-sm text-foreground tracking-tight group-hover:text-primary transition-colors">
                          {cluster.name}
                        </h3>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[10px] text-muted-foreground font-semibold">
                            {cluster.job_offer_count} ofertas
                          </span>
                          <span className="h-1 w-1 rounded-full bg-border" />
                          <span className="text-[10px] text-primary font-bold">
                            {percent}% del mercado
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
                        style={{ width: `${percent * 3.5}%` }} // Multiply to fill or represent it proportional to largest
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
                      {cluster.top_skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-0.5 rounded-md text-[9px] font-semibold bg-secondary text-foreground/80 hover:text-primary hover:bg-primary/5 transition-all"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {isSelected && (
                    <div className="mt-4 pt-3 flex justify-end">
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/diagnosis?cluster=${encodeURIComponent(cluster.name)}`);
                        }}
                        className="text-[10px] font-bold h-7 gap-1 bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        <ArrowLeft className="w-3 h-3 rotate-180" />
                        Ver Diagnostico
                      </Button>
                    </div>
                  )}
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
                to {
                  transform: rotate(360deg);
                }
              }
              .animate-spin-custom {
                animation: spin 1s linear infinite;
              }
            `}</style>
            <Cpu className="h-8 w-8 animate-spin-custom text-primary" />
            <p className="text-xs text-muted-foreground font-semibold">
              Cargando la Topología del Mercado...
            </p>
          </div>
        </div>
      }
    >
      <TopologyContent />
    </Suspense>
  );
}
