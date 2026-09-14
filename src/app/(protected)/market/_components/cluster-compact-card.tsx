'use client';

import * as React from 'react';
import { ArrowRight, Sparkles, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Cluster } from '@/types/market';
import type { ClusterAffinityItem } from '@/types/diagnosis';

export interface ClusterCompactCardProps {
  cluster: Cluster;
  affinityItem: ClusterAffinityItem | null;
  totalOffers: number;
  isGenerating: boolean;
  onEvaluate: (clusterName: string) => void;
  onViewDiagnostic: (clusterName: string) => void;
}

/**
 * Compact row card for displaying an IT market cluster with maximum horizontal room for name and skills.
 */
export function ClusterCompactCard({
  cluster,
  affinityItem,
  totalOffers,
  isGenerating,
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
    <div className="group relative p-3 sm:p-3.5 rounded-xl border border-border/80 bg-card hover:border-primary/40 hover:bg-secondary/15 hover:shadow-xs transition-all duration-200 flex items-center justify-between gap-3.5 min-h-[88px]">
      {/* Left: Cluster Information (Title, Skills, Demand) */}
      <div className="min-w-0 flex-1 space-y-1">
        <h3
          className="font-extrabold text-xs sm:text-sm text-foreground tracking-tight group-hover:text-primary transition-colors truncate"
          title={cluster.name}
        >
          {cluster.name}
        </h3>

        {/* Top Skills Badges */}
        {cluster.top_skills && cluster.top_skills.length > 0 && (
          <div className="flex flex-wrap items-center gap-1 pt-0.5">
            {cluster.top_skills.slice(0, 4).map((skill) => (
              <span
                key={skill}
                className="text-[9px] px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground border border-border/40 font-medium truncate max-w-[135px]"
              >
                {skill}
              </span>
            ))}
            {cluster.top_skills.length > 4 && (
              <span className="text-[9px] text-muted-foreground font-semibold shrink-0">
                +{cluster.top_skills.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Market Demand Metrics */}
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-medium pt-0.5">
          <span>{cluster.job_offer_count} ofertas</span>
          <span className="h-1 w-1 rounded-full bg-border" />
          <span className="text-primary font-bold">{percent}% del mercado</span>
        </div>
      </div>

      {/* Right: State Badge and Action Button */}
      <div className="shrink-0 flex flex-col items-end justify-between gap-2 self-stretch min-w-[95px]">
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
