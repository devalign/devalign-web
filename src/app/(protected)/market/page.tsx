'use client';

import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { LoadingScreen } from '@/components/shared/loading-screen';
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
  Loader2,
  Activity,
} from 'lucide-react';
import { InsightCard } from '@/components/shared';
import { EmptyProfileBanner } from '@/components/shared/empty-profile-banner';
import { ProfileUploadBanner } from '@/components/shared/profile-upload-banner';
import { DiagnosticLoadingBanner } from '@/components/shared/diagnostic-loading-banner';
import { useCVAnalysis } from '@/contexts/cv-analysis-context';
import { useMarketClusters } from '@/hooks/use-market-clusters';
import { useUserProfile } from '@/hooks/use-user-profile';
import { evaluateClusterDiagnostic } from '@/lib/api/user-service';

function getClusterMetadata(_name?: string) {
  return {
    icon: Cpu,
    colorClass: 'text-muted-foreground bg-muted/10 border-muted/20',
  };
}

function TopologyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const activeClusterParam = searchParams.get('cluster') || '';

  const { data: clusters = [], isLoading, error } = useMarketClusters();
  const { data: profile } = useUserProfile();

  const hasProfileData = !!(profile?.cv_id || (profile?.detected_skills && profile.detected_skills.length > 0));

  const [isBannerDismissed, setIsBannerDismissed] = React.useState(false);
  const statusParam = searchParams.get('status');
  const isUpdating = statusParam === 'updating';
  const isDiagnosed = profile?.is_diagnosed ?? false;

  const [diagnosticBanner, setDiagnosticBanner] = React.useState<{
    show: boolean;
    isCompleted: boolean;
    clusterName: string | null;
  }>({ show: false, isCompleted: false, clusterName: null });

  const [filterMode, setFilterMode] = React.useState<'all' | 'evaluated' | 'unevaluated'>('all');
  const [isGenerating, setIsGenerating] = React.useState<string | null>(null);

  const isUrlUpdating = isUpdating && !isBannerDismissed;
  const showBanner = isUrlUpdating || diagnosticBanner.show;
  const bannerIsDiagnosed = diagnosticBanner.show ? diagnosticBanner.isCompleted : isDiagnosed;

  const handleBannerDismiss = () => {
    if (diagnosticBanner.show) {
      setDiagnosticBanner({ show: false, isCompleted: false, clusterName: null });
    } else {
      setIsBannerDismissed(true);
    }
  };

  const handleBannerViewResults = () => {
    if (diagnosticBanner.show && diagnosticBanner.clusterName) {
      router.push(`/diagnosis?cluster=${encodeURIComponent(diagnosticBanner.clusterName)}`);
    } else {
      router.push('/diagnosis');
    }
  };

  const initialCluster = activeClusterParam || profile?.primary_specialty || '';
  const [selectedCluster, setSelectedCluster] = React.useState(initialCluster);

  // Helper to check if a cluster has a diagnostic in profile.all_affinities
  const getClusterAffinityItem = React.useCallback(
    (clusterName: string) => {
      if (!profile?.all_affinities) return null;
      return (
        profile.all_affinities.find(
          (a) => a.cluster_name.toLowerCase() === clusterName.toLowerCase(),
        ) || null
      );
    },
    [profile],
  );

  const hasDiagnostic = React.useCallback(
    (clusterName: string) => {
      return !!getClusterAffinityItem(clusterName);
    },
    [getClusterAffinityItem],
  );

  // Sort clusters by affinity score (descending)
  const sortedClusters = React.useMemo(() => {
    if (!clusters) return [];
    return [...clusters].sort((a, b) => {
      const affA = getClusterAffinityItem(a.name)?.affinity_score ?? -1;
      const affB = getClusterAffinityItem(b.name)?.affinity_score ?? -1;
      return affB - affA;
    });
  }, [clusters, getClusterAffinityItem]);

  // Filter clusters based on tabs selection
  const filteredClusters = React.useMemo(() => {
    return sortedClusters.filter((c) => {
      const isEval = hasDiagnostic(c.name);
      if (filterMode === 'evaluated') return isEval;
      if (filterMode === 'unevaluated') return !isEval;
      return true;
    });
  }, [sortedClusters, hasDiagnostic, filterMode]);

  // Find if active cluster matches any of our topology clusters
  const isSelectedCluster = (clusterName: string) => {
    if (!selectedCluster) return false;
    const nameLow = clusterName.toLowerCase();
    const paramLow = selectedCluster.toLowerCase();
    return nameLow === paramLow || nameLow.includes(paramLow) || paramLow.includes(nameLow);
  };

  const handleGenerateDiagnostic = async (clusterName: string) => {
    if (!hasProfileData) {
      toast.info('Primero debes subir tu CV para poder generar un diagnóstico.', {
        description: 'Te estamos redirigiendo a tu perfil para cargar tu CV.',
      });
      router.push('/profile');
      return;
    }

    setIsGenerating(clusterName);
    setDiagnosticBanner({ show: true, isCompleted: false, clusterName });
    
    try {
      await evaluateClusterDiagnostic(clusterName);
      await queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      
      setSelectedCluster(clusterName);
      setDiagnosticBanner({ show: true, isCompleted: true, clusterName });
    } catch (err) {
      console.error(err);
      toast.error('Error al generar el diagnóstico. Inténtalo de nuevo.');
      setDiagnosticBanner({ show: false, isCompleted: false, clusterName: null });
    } finally {
      setIsGenerating(null);
    }
  };

  if (isLoading) {
    return (
      <LoadingScreen message="Cargando la Topología del Mercado..." minHeight="min-h-[400px]" />
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col gap-2">
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

        {/* Tabs Filter in Header */}
        <div className="flex items-center gap-1 bg-secondary/50 p-1 rounded-xl border border-border/50 shrink-0 self-start sm:self-center">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filterMode === 'all'
                ? 'bg-card text-foreground shadow-xs border border-border/20'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFilterMode('evaluated')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              filterMode === 'evaluated'
                ? 'bg-card text-foreground shadow-xs border border-border/20'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Activity className="w-3 h-3 text-primary" />
            Diagnosticados
          </button>
          <button
            onClick={() => setFilterMode('unevaluated')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              filterMode === 'unevaluated'
                ? 'bg-card text-foreground shadow-xs border border-border/20'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Sparkles className="w-3 h-3 text-amber-500" />
            Sin Evaluar
          </button>
        </div>
      </div>

      <ProfileUploadBanner />
      <DiagnosticLoadingBanner
        isUpdating={showBanner}
        isDiagnosed={bannerIsDiagnosed}
        onDismiss={handleBannerDismiss}
        onViewResults={handleBannerViewResults}
      />
      <EmptyProfileBanner show={!hasProfileData} />

      {/* Grid: 2 Columns on desktop. Left column: Technical specs. Right/bottom: Grid of clusters */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Technical details & metadata */}
        <div className="lg:col-span-1 space-y-6">
          {/* Ficha Técnica Section Divider */}
          <div className="space-y-4">
            <Card className="card-standard overflow-hidden">
              <CardContent className="space-y-4 px-4 sm:px-6">
                <span className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">
                  Ficha Técnica del Modelo
                </span>
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
                        Clustering jerárquico basado en densidad optimizado con reducción
                        dimensional para capturar afinidades complejas de habilidades.
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
          </div>

          {/* Market Insights Context Panel */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">
                Insights de Mercado
              </span>
              <div className="h-px flex-1 bg-border/40" />
            </div>

            <InsightCard
              title="Brecha del Perfil Predominante"
              description={
                <>
                  El <strong className="text-foreground">45%</strong> del mercado demanda{' '}
                  <strong>Desarrolladores Web Full Stack</strong>. Su mayor deficiencia generalizada
                  es el <strong className="text-foreground">Testing Automatizado</strong>.
                </>
              }
              type="trend"
              value="Tendencia"
            />

            <InsightCard
              title="Brechas Más Frecuentes"
              description={
                <>
                  De las últimas evaluaciones, el <strong className="text-foreground">62%</strong>{' '}
                  de los desarrolladores presentan debilidades críticas en{' '}
                  <strong>DevOps (Docker/CI/CD)</strong> independientemente de su rol.
                </>
              }
              type="gap"
              value="Top Brecha"
            />
          </div>
        </div>

        {/* Right Columns: The spacious layout of clusters */}
        <div className="lg:col-span-2 space-y-4">
          {filteredClusters.length === 0 ? (
            <div className="min-h-[300px] flex flex-col items-center justify-center border border-dashed border-border rounded-2xl p-8 bg-card text-center">
              <Activity className="w-8 h-8 text-muted-foreground mb-3 animate-pulse" />
              <h3 className="font-extrabold text-sm text-foreground">No hay clústeres</h3>
              <p className="text-xs text-muted-foreground max-w-xs mt-1">
                No encontramos especialidades que coincidan con la selección del filtro.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredClusters.map((cluster) => {
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
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <h3 className="font-extrabold text-sm text-foreground tracking-tight group-hover:text-primary transition-colors truncate">
                              {cluster.name}
                            </h3>
                            {hasDiagnostic(cluster.name) ? (
                              <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/10 text-[8px] py-0 px-1 font-bold rounded-md shrink-0">
                                Diagnosticado
                              </Badge>
                            ) : (
                              <Badge
                                variant="outline"
                                className="bg-muted/10 text-muted-foreground border-border text-[8px] py-0 px-1 font-bold rounded-md shrink-0"
                              >
                                Sin evaluar
                              </Badge>
                            )}
                          </div>
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
                        {hasDiagnostic(cluster.name) ? (
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/diagnosis?cluster=${encodeURIComponent(cluster.name)}`);
                            }}
                            className="text-[10px] font-bold h-7 gap-1 bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
                          >
                            <ArrowLeft className="w-3 h-3 rotate-180" />
                            Ver Diagnóstico
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            disabled={isGenerating !== null}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleGenerateDiagnostic(cluster.name);
                            }}
                            className="text-[10px] font-bold h-7 gap-1 bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
                          >
                            {isGenerating === cluster.name ? (
                              <>
                                <Loader2 className="w-3 h-3 animate-spin" />
                                Generando...
                              </>
                            ) : (
                              <>
                                <Activity className="w-3 h-3" />
                                Generar Diagnóstico
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MarketTopologyPage() {
  return (
    <Suspense fallback={<LoadingScreen message="Cargando la Topología del Mercado..." />}>
      <TopologyContent />
    </Suspense>
  );
}
