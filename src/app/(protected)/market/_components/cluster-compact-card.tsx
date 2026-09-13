'use client';

import * as React from 'react';
import {
  Brain,
  Cloud,
  Database,
  Layout,
  Server,
  Shield,
  Smartphone,
  Terminal,
  CheckSquare,
  Cpu,
  ArrowRight,
  Sparkles,
  Loader2,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Cluster } from '@/types/market';
import type { ClusterAffinityItem } from '@/types/diagnosis';

/**
 * Resolves an appropriate Lucide icon depending on cluster technical terms.
 */
function getClusterIcon(name: string): LucideIcon {
  const lower = name.toLowerCase();
  if (
    lower.includes('data') ||
    lower.includes('machine learning') ||
    lower.includes('ia') ||
    lower.includes('inteligencia') ||
    lower.includes('científico') ||
    lower.includes('analista de datos')
  ) {
    return Brain;
  }
  if (
    lower.includes('cloud') ||
    lower.includes('devops') ||
    lower.includes('terraform') ||
    lower.includes('kubernetes')
  ) {
    return Cloud;
  }
  if (
    lower.includes('base de datos') ||
    lower.includes('sql') ||
    lower.includes('dba') ||
    lower.includes('database')
  ) {
    return Database;
  }
  if (
    lower.includes('qa') ||
    lower.includes('testing') ||
    lower.includes('automation') ||
    lower.includes('pruebas')
  ) {
    return CheckSquare;
  }
  if (
    lower.includes('mobile') ||
    lower.includes('flutter') ||
    lower.includes('android') ||
    lower.includes('ios')
  ) {
    return Smartphone;
  }
  if (
    lower.includes('security') ||
    lower.includes('seguridad') ||
    lower.includes('ciberseguridad')
  ) {
    return Shield;
  }
  if (
    lower.includes('frontend') ||
    lower.includes('react') ||
    lower.includes('web') ||
    lower.includes('vue') ||
    lower.includes('angular')
  ) {
    return Layout;
  }
  if (
    lower.includes('backend') ||
    lower.includes('api') ||
    lower.includes('microservicios') ||
    lower.includes('java') ||
    lower.includes('python') ||
    lower.includes('php') ||
    lower.includes('.net') ||
    lower.includes('node')
  ) {
    return Server;
  }
  if (
    lower.includes('sistemas') ||
    lower.includes('soporte') ||
    lower.includes('linux')
  ) {
    return Terminal;
  }
  return Cpu;
}

export interface ClusterCompactCardProps {
  cluster: Cluster;
  affinityItem: ClusterAffinityItem | null;
  isSelected: boolean;
  totalOffers: number;
  isGenerating: boolean;
  onSelect: (clusterName: string) => void;
  onEvaluate: (clusterName: string) => void;
  onViewDiagnostic: (clusterName: string) => void;
}

/**
 * Compact row card for displaying an IT market cluster with minimal vertical footprint.
 */
export function ClusterCompactCard({
  cluster,
  affinityItem,
  isSelected,
  totalOffers,
  isGenerating,
  onSelect,
  onEvaluate,
  onViewDiagnostic,
}: ClusterCompactCardProps) {
  const percent =
    totalOffers > 0
      ? parseFloat(((cluster.job_offer_count / totalOffers) * 100).toFixed(1))
      : 0;

  const rawScore = affinityItem?.affinity_score;
  const affinityScorePercent =
    rawScore !== undefined && rawScore !== null
      ? rawScore > 1
        ? Math.round(rawScore)
        : Math.round(rawScore * 100)
      : null;

  const isDiagnosed = affinityItem !== null;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(cluster.name)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(cluster.name);
        }
      }}
      className={cn(
        'group relative p-3 sm:p-3.5 rounded-xl border transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 min-h-[92px]',
        isSelected
          ? 'bg-primary/5 border-primary shadow-xs ring-1 ring-primary/30'
          : 'bg-card border-border/80 hover:border-primary/40 hover:bg-secondary/15 hover:shadow-xs',
      )}
    >
      {/* Left: Icon and Core Info */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div
          className={cn(
            'p-2.5 rounded-lg border shrink-0 transition-transform group-hover:scale-105',
            isSelected
              ? 'bg-primary/10 text-primary border-primary/25'
              : 'bg-muted/40 text-muted-foreground border-border/50 group-hover:text-primary group-hover:border-primary/20',
          )}
        >
          {React.createElement(getClusterIcon(cluster.name), { className: 'h-5 w-5' })}
        </div>

        <div className="min-w-0 flex-1">
          <h3
            className="font-extrabold text-xs sm:text-sm text-foreground tracking-tight group-hover:text-primary transition-colors truncate"
            title={cluster.name}
          >
            {cluster.name}
          </h3>

          {/* Top Skills Badges */}
          {cluster.top_skills && cluster.top_skills.length > 0 && (
            <div className="flex flex-wrap items-center gap-1 mt-1">
              {cluster.top_skills.slice(0, 3).map((skill) => (
                <span
                  key={skill}
                  className="text-[9px] px-1.5 py-0.2 rounded bg-secondary/80 text-secondary-foreground border border-border/40 font-medium truncate max-w-[105px]"
                >
                  {skill}
                </span>
              ))}
              {cluster.top_skills.length > 3 && (
                <span className="text-[9px] text-muted-foreground font-semibold">
                  +{cluster.top_skills.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Market Demand Metrics */}
          <div className="flex items-center gap-2 mt-1 text-[10px] text-muted-foreground font-medium">
            <span>{cluster.job_offer_count} ofertas</span>
            <span className="h-1 w-1 rounded-full bg-border" />
            <span className="text-primary font-bold">{percent}% del mercado</span>
          </div>
        </div>
      </div>

      {/* Right: State Badge and Action Button */}
      <div className="shrink-0 flex flex-col items-end justify-between gap-2 self-stretch min-w-[100px]">
        {isDiagnosed ? (
          <>
            <Badge className="bg-primary/15 text-primary border-primary/30 hover:bg-primary/15 text-[10px] py-0.5 px-2 font-bold rounded-md shrink-0">
              {affinityScorePercent !== null ? `${affinityScorePercent}% Match` : 'Diagnosticado'}
            </Badge>

            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                onViewDiagnostic(cluster.name);
              }}
              className="h-7 text-[10px] font-bold gap-1 text-primary hover:bg-primary/10 hover:text-primary px-2 cursor-pointer"
            >
              <span>Ver</span>
              <ArrowRight className="w-3 h-3" />
            </Button>
          </>
        ) : (
          <>
            <Badge
              variant="outline"
              className="bg-muted/15 text-muted-foreground border-border text-[9px] py-0.5 px-1.5 font-semibold rounded-md shrink-0"
            >
              Sin evaluar
            </Badge>

            <Button
              size="sm"
              variant="outline"
              disabled={isGenerating}
              onClick={(e) => {
                e.stopPropagation();
                onEvaluate(cluster.name);
              }}
              className="h-7 text-[10px] font-bold gap-1 px-2.5 border-border/70 hover:border-primary/50 hover:bg-primary/5 hover:text-primary cursor-pointer transition-colors"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span>Evaluando...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>Evaluar</span>
                </>
              )}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
