'use client';

import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import {
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Activity,
  Sparkles,
  Search,
  Info,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LoadingScreen } from '@/components/shared/loading-screen';
import { EmptyProfileBanner } from '@/components/shared/empty-profile-banner';
import { ProfileUploadBanner } from '@/components/shared/profile-upload-banner';
import { DiagnosticLoadingBanner } from '@/components/shared/diagnostic-loading-banner';
import { useMarketClusters } from '@/hooks/use-market-clusters';
import { useUserProfile } from '@/hooks/use-user-profile';
import {
  ClusterCompactCard,
  MarketSearchInput,
  MarketSidebar,
} from './_components';

const INITIAL_VISIBLE_COUNT = 8;

function TopologyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { data: clusters = [], isLoading, error } = useMarketClusters();
  const { data: profile } = useUserProfile();

  const hasProfileData = !!(
    profile?.cv_id || (profile?.detected_skills && profile.detected_skills.length > 0)
  );

  const [isBannerDismissed, setIsBannerDismissed] = React.useState(false);
  const statusParam = searchParams.get('status');
  const isUpdating = statusParam === 'updating';
  const isDiagnosed = profile?.is_diagnosed ?? false;

  const [diagnosticBanner, setDiagnosticBanner] = React.useState<{
    show: boolean;
    isCompleted: boolean;
    clusterName: string | null;
  }>({ show: false, isCompleted: false, clusterName: null });

  const [searchQuery, setSearchQuery] = React.useState('');
  const [isExpanded, setIsExpanded] = React.useState(false);

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

  // Sort clusters by affinity score (descending)
  const sortedClusters = React.useMemo(() => {
    if (!clusters) return [];
    return [...clusters].sort((a, b) => {
      const affA = getClusterAffinityItem(a.name)?.affinity_score ?? -1;
      const affB = getClusterAffinityItem(b.name)?.affinity_score ?? -1;
      return affB - affA;
    });
  }, [clusters, getClusterAffinityItem]);

  // Partition clusters into evaluated and unevaluated
  const { evaluatedClusters, unevaluatedClusters } = React.useMemo(() => {
    const evaluated: typeof sortedClusters = [];
    const unevaluated: typeof sortedClusters = [];

    sortedClusters.forEach((c) => {
      if (getClusterAffinityItem(c.name)) {
        evaluated.push(c);
      } else {
        unevaluated.push(c);
      }
    });

    return { evaluatedClusters: evaluated, unevaluatedClusters: unevaluated };
  }, [sortedClusters, getClusterAffinityItem]);

  // Search filtering across all clusters
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const isSearching = normalizedQuery.length > 0;

  const searchResults = React.useMemo(() => {
    if (!isSearching) return [];
    return sortedClusters.filter((c) => {
      const nameMatch = c.name.toLowerCase().includes(normalizedQuery);
      const skillMatch = c.top_skills?.some((s) =>
        s.toLowerCase().includes(normalizedQuery),
      );
      const descMatch = c.description?.toLowerCase().includes(normalizedQuery);
      return nameMatch || skillMatch || descMatch;
    });
  }, [sortedClusters, isSearching, normalizedQuery]);

  const handleViewDiagnostic = (clusterName: string) => {
    if (!hasProfileData) {
      toast.info('Primero debes subir tu CV para poder ver tu diagnóstico.', {
        description: 'Te estamos redirigiendo a tu perfil para cargar tu CV.',
      });
      router.push('/profile');
      return;
    }
    router.push(`/diagnosis?cluster=${encodeURIComponent(clusterName)}`);
  };

  if (isLoading) {
    return (
      <LoadingScreen message="Cargando la Topología del Mercado..." minHeight="min-h-[70vh]" />
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
  const uniqueSkillsCount = new Set(clusters.flatMap((c) => c.top_skills || [])).size;
  const visibleUnevaluatedClusters = isExpanded
    ? unevaluatedClusters
    : unevaluatedClusters.slice(0, INITIAL_VISIBLE_COUNT);
  const remainingCount = Math.max(0, unevaluatedClusters.length - INITIAL_VISIBLE_COUNT);

  return (
    <div className="min-h-full flex flex-col">
      {/* Sticky Header with Search and Navigation */}
      <header className="sticky top-0 z-30 bg-background border-b border-border/50 py-4 sm:py-6 md:py-8 space-y-6 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <button
              onClick={() => router.push('/overview')}
              className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer p-1 rounded-lg hover:bg-secondary/60 shrink-0 -ml-1"
              aria-label="Volver a Panorama General"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <div className="min-w-0">
              <h1 className="text-base sm:text-lg md:text-xl font-black tracking-tight text-foreground truncate">
                Topología del Mercado IT
              </h1>
              <p className="text-[11px] text-muted-foreground hidden sm:block truncate">
                {clusters.length} especialidades identificadas mediante clustering no supervisado.
              </p>
            </div>
          </div>

          {/* Real-time Search Input */}
          <div className="w-full sm:w-80 shrink-0">
            <MarketSearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              onClear={() => setSearchQuery('')}
              resultCount={isSearching ? searchResults.length : undefined}
            />
          </div>
        </div>
      </header>

      {/* Main Body (Horizontal Padding Only) */}
      <div className="px-4 sm:px-6 md:px-8 pb-8 space-y-6 max-w-7xl mx-auto w-full flex-1">
        <ProfileUploadBanner />
        <DiagnosticLoadingBanner
          isUpdating={showBanner}
          isDiagnosed={bannerIsDiagnosed}
          onDismiss={handleBannerDismiss}
          onViewResults={handleBannerViewResults}
        />
        <EmptyProfileBanner show={!hasProfileData} />

        {/* Main Layout: Sticky Sidebar (Left) + Compact Rows (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Left Column: Sticky Specs and Insights */}
          <MarketSidebar totalOffers={totalOffers} uniqueSkillsCount={uniqueSkillsCount} />

        {/* Right Column: Compact Cluster Rows and Progressive Disclosure */}
        <div className="lg:col-span-2 space-y-6">
          {isSearching ? (
            /* Search Results View */
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-border/50 pb-2">
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-primary" />
                  <h2 className="text-xs sm:text-sm font-extrabold text-foreground">
                    Resultados de búsqueda ({searchResults.length})
                  </h2>
                </div>
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-primary font-bold hover:underline cursor-pointer"
                >
                  Limpiar búsqueda
                </button>
              </div>

              {searchResults.length === 0 ? (
                <div className="min-h-[220px] flex flex-col items-center justify-center border border-dashed border-border rounded-2xl p-8 bg-card text-center">
                  <Search className="w-8 h-8 text-muted-foreground mb-3 opacity-40" />
                  <h3 className="font-extrabold text-sm text-foreground">
                    No se encontraron especialidades
                  </h3>
                  <p className="text-xs text-muted-foreground max-w-xs mt-1">
                    No hay coincidencias para &quot;{searchQuery}&quot;. Intenta con otro rol o
                    tecnología.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-3.5">
                  {searchResults.map((cluster) => (
                    <ClusterCompactCard
                      key={cluster.id}
                      cluster={cluster}
                      affinityItem={getClusterAffinityItem(cluster.name)}
                      totalOffers={totalOffers}
                      onViewDiagnostic={handleViewDiagnostic}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Categorized Sections View */
            <div className="space-y-8">
              {/* Block 1: Evaluated Specialties (Only if profile has diagnostics) */}
              {evaluatedClusters.length > 0 && (
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20">
                        <Activity className="w-4 h-4" />
                      </div>
                      <div>
                        <h2 className="text-sm font-extrabold text-foreground tracking-tight">
                          Tus Especialidades Evaluadas
                        </h2>
                        <p className="text-[11px] text-muted-foreground">
                          Alineación calculada contra tu perfil técnico y experiencia.
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20">
                      {evaluatedClusters.length}{' '}
                      {evaluatedClusters.length === 1 ? 'evaluada' : 'evaluadas'}
                    </span>
                  </div>

                  <div className="flex flex-col gap-3.5">
                    {evaluatedClusters.map((cluster) => (
                      <ClusterCompactCard
                        key={cluster.id}
                        cluster={cluster}
                        affinityItem={getClusterAffinityItem(cluster.name)}
                        totalOffers={totalOffers}
                        onViewDiagnostic={handleViewDiagnostic}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Block 2: General Market Specialties with Progressive Disclosure */}
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-secondary text-foreground border border-border/60">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                    </div>
                    <div>
                      <h2 className="text-sm font-extrabold text-foreground tracking-tight">
                        Explorar Especialidades del Mercado
                      </h2>
                      <p className="text-[11px] text-muted-foreground">
                        Compara requerimientos de la industria y descubre nuevas oportunidades.
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-muted-foreground bg-secondary/80 px-2 py-0.5 rounded-md border border-border/40">
                    {unevaluatedClusters.length} disponibles
                  </span>
                </div>

                {unevaluatedClusters.length === 0 ? (
                  <div className="min-h-[160px] flex flex-col items-center justify-center border border-dashed border-border rounded-2xl p-6 bg-card text-center">
                    <p className="text-xs text-muted-foreground">
                      Todas las especialidades han sido evaluadas en tu perfil.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col gap-3.5">
                      {visibleUnevaluatedClusters.map((cluster) => (
                        <ClusterCompactCard
                          key={cluster.id}
                          cluster={cluster}
                          affinityItem={null}
                          totalOffers={totalOffers}
                          onViewDiagnostic={handleViewDiagnostic}
                        />
                      ))}
                    </div>

                    {/* Progressive Disclosure Toggle */}
                    {unevaluatedClusters.length > INITIAL_VISIBLE_COUNT && (
                      <div className="pt-2 flex justify-center">
                        <Button
                          variant="outline"
                          onClick={() => setIsExpanded((prev) => !prev)}
                          className="h-9 px-4 text-xs font-bold gap-2 border-border/80 hover:border-primary/50 hover:bg-primary/5 hover:text-primary transition-all cursor-pointer rounded-xl"
                        >
                          {isExpanded ? (
                            <>
                              <ChevronUp className="w-3.5 h-3.5" />
                              <span>Mostrar menos especialidades</span>
                            </>
                          ) : (
                            <>
                              <ChevronDown className="w-3.5 h-3.5" />
                              <span>
                                Mostrar todas las especialidades restantes ({remainingCount} más)
                              </span>
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
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
