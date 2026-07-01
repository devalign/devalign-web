'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Breadcrumb, BreadcrumbItem } from '@/components/ui/breadcrumb';
import { Loader2 } from 'lucide-react';
import type { ClusterAffinityItem } from '@/lib/api/types';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface HeaderBarProps {
  clusters: ClusterAffinityItem[];
  activeCluster: ClusterAffinityItem | null;
  onSelectCluster: (clusterName: string) => void;
  isAnalyzing?: boolean;
  lastAnalysisDate?: string;
  alignmentScore?: number;
}

export function HeaderBar({
  clusters,
  activeCluster,
  onSelectCluster,
  isAnalyzing = false,
  lastAnalysisDate,
  alignmentScore,
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
      items.push({ label: 'Mi Perfil' });
    }

    return items;
  };

  const getScoreState = (score: number) => {
    if (score >= 75)
      return {
        label: 'Alta afinidad',
        color: 'text-success bg-success/10 border-success/35 hover:bg-success/10',
      };
    if (score >= 50)
      return {
        label: 'Media afinidad',
        color: 'text-warning bg-warning/10 border-warning/35 hover:bg-warning/10',
      };
    return {
      label: 'Baja afinidad',
      color:
        'text-red-600 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-500/10 dark:border-red-500/20 hover:bg-red-50 dark:hover:bg-red-500/10',
    };
  };

  const scoreState = alignmentScore !== undefined ? getScoreState(alignmentScore) : null;
  const showScore = alignmentScore !== undefined && activeCluster && (pathname.startsWith('/overview') || pathname.startsWith('/diagnosis'));

  return (
    <header className="card-glass flex h-auto min-h-12 sm:h-14 shrink-0 items-center justify-between px-3 sm:px-4 lg:px-6 sticky top-0 z-20 gap-2">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
        <Breadcrumb
          items={getBreadcrumbs()}
          clusters={clusters}
          activeCluster={activeCluster}
          onSelectCluster={onSelectCluster}
        />
        {showScore && (
          <div className="flex items-center gap-2 shrink-0 ml-1.5 sm:ml-2">
            <span className="text-xs sm:text-sm font-black text-foreground tracking-tight tabular-nums bg-secondary/50 px-2 py-0.5 rounded-md border border-border/40">
              {alignmentScore}%
            </span>
            {scoreState && (
              <Badge
                variant="outline"
                className={cn(
                  'text-[9px] font-extrabold px-1.5 py-0 border-border/30 h-5 shrink-0 uppercase tracking-wider',
                  scoreState.color
                )}
              >
                {scoreState.label}
              </Badge>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs text-muted-foreground font-medium select-none shrink-0">
        {isAnalyzing && (
          <span className="hidden md:flex items-center gap-1.5 bg-success/10 text-success px-2.5 py-1 rounded-full border border-success/20 font-semibold animate-pulse">
            <Loader2 className="h-3 w-3 animate-spin text-success" />
            <span className="hidden lg:inline">Analizando CV...</span>
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

