'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Breadcrumb, BreadcrumbItem } from '@/components/ui/breadcrumb';
import { Loader2 } from 'lucide-react';
import type { ClusterAffinityItem } from '@/lib/api/types';

interface HeaderBarProps {
  clusters: ClusterAffinityItem[];
  activeCluster: ClusterAffinityItem | null;
  onSelectCluster: (clusterName: string) => void;
  isAnalyzing?: boolean;
  isAnalysisReady?: boolean;
  lastAnalysisDate?: string;
}

export function HeaderBar({
  clusters,
  activeCluster,
  onSelectCluster,
  isAnalyzing = false,
  isAnalysisReady = false,
  lastAnalysisDate,
}: HeaderBarProps) {
  const pathname = usePathname();

  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const items: BreadcrumbItem[] = [];
    const clusterName = activeCluster?.cluster_name || '';

    if (pathname.startsWith('/diagnosis')) {
      items.push({ label: 'Diagnóstico' });
      if (clusterName) {
        items.push({ label: clusterName, isClusterSelector: true });
      }
    } else if (pathname.startsWith('/market')) {
      items.push({ label: 'Mercado' });
    } else if (pathname.startsWith('/overview')) {
      items.push({ label: 'Overview' });
      if (clusterName) {
        items.push({ label: clusterName, isClusterSelector: true });
      }
    } else if (pathname.startsWith('/profile')) {
      items.push({ label: 'Perfil Profesional' });
    }

    return items;
  };

  return (
    <header className="card-glass flex h-auto min-h-12 sm:h-14 shrink-0 items-center justify-between px-3 sm:px-4 lg:px-6 sticky top-0 z-20 gap-2">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
        <Breadcrumb
          items={getBreadcrumbs()}
          clusters={clusters}
          activeCluster={activeCluster}
          onSelectCluster={onSelectCluster}
        />
      </div>

      <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs text-muted-foreground font-medium select-none shrink-0">
        {isAnalyzing && (
          <span className="hidden md:flex items-center gap-1.5 bg-primary/10 text-primary px-2.5 py-1 rounded-full border border-primary/20 font-semibold animate-pulse">
            <Loader2 className="h-3 w-3 animate-spin text-primary" />
            <span className="hidden lg:inline">Analizando CV...</span>
          </span>
        )}
        {isAnalysisReady && (
          <span className="hidden md:flex items-center gap-1.5 bg-success/10 text-success px-2.5 py-1 rounded-full border border-success/20 font-semibold">
            <span className="h-1.5 w-1.5 rounded-full bg-success shrink-0" />
            <span className="hidden lg:inline">Actualización Lista</span>
          </span>
        )}
        {lastAnalysisDate && (
          <span className="hidden lg:flex items-center gap-1.5 bg-secondary/50 px-2.5 py-1 rounded-full border border-border/40">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            Último análisis: {lastAnalysisDate}
          </span>
        )}
      </div>
    </header>
  );
}
