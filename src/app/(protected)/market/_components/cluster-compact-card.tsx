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
 * Strips overly verbose parenthetical qualifications from skill names
 * (e.g. 'Java (Programming Language)' -> 'Java', 'HyperText Markup Language (HTML)' -> 'HTML').
 */
function cleanSkillName(name: string): string {
  const acronymMatch = name.match(/\(([A-Z0-9/]{2,6})\)/);
  if (acronymMatch && name.length > 15) {
    return acronymMatch[1];
  }
  return (
    name
      .replace(
        /\s*\((?:programming language|software engineering|web framework|design software|database management system)\)/gi,
        '',
      )
      .trim() || name
  );
}

/**
 * Compact row card with full-width skills distribution and clean top-action / bottom-badge hierarchy.
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
    <div className="group relative p-3 sm:p-3.5 rounded-xl border border-border/80 bg-card hover:border-primary/40 hover:bg-secondary/15 hover:shadow-xs transition-all duration-200 flex flex-col justify-between gap-2.5 min-h-[96px]">
      {/* Top Row: Title on the left, Action Button on the top-right */}
      <div className="flex items-start justify-between gap-2.5 min-w-0">
        <h3
          className="font-extrabold text-xs sm:text-sm text-foreground tracking-tight group-hover:text-primary transition-colors line-clamp-1 flex-1 min-w-0"
          title={cluster.name}
        >
          {cluster.name}
        </h3>

        <div className="shrink-0">
          {isDiagnosed ? (
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                onViewDiagnostic(cluster.name);
              }}
              className="h-6 text-[10px] font-bold gap-1 text-primary hover:bg-primary/10 hover:text-primary px-2 cursor-pointer"
            >
              <span>Ver</span>
              <ArrowRight className="w-3 h-3" />
            </Button>
          ) : (
            <Badge
              variant="outline"
              className="bg-muted/15 text-muted-foreground border-border text-[9px] py-0 px-1.5 font-semibold rounded-md"
            >
              Sin evaluar
            </Badge>
          )}
        </div>
      </div>

      {/* Middle Row: Full-width Skills Badges (Spans entire card width) */}
      {cluster.top_skills && cluster.top_skills.length > 0 && (
        <div className="flex items-center gap-1.5 overflow-hidden w-full flex-wrap">
          {cluster.top_skills.slice(0, 4).map((skill) => (
            <span
              key={skill}
              className="text-[9px] px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground border border-border/40 font-medium truncate max-w-[150px]"
              title={skill}
            >
              {cleanSkillName(skill)}
            </span>
          ))}
          {cluster.top_skills.length > 4 && (
            <span className="text-[9px] text-muted-foreground font-semibold shrink-0">
              +{cluster.top_skills.length - 4}
            </span>
          )}
        </div>
      )}

      {/* Bottom Row: Market Demand on the left, Badge / Action on the bottom-right */}
      <div className="flex items-center justify-between gap-2 pt-1 border-t border-border/30">
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-medium">
          <span>{cluster.job_offer_count} ofertas</span>
          <span className="h-1 w-1 rounded-full bg-border" />
          <span className="text-primary font-bold">{percent}% del mercado</span>
        </div>

        <div className="shrink-0">
          {isDiagnosed ? (
            <Badge className="bg-primary/15 text-primary border-primary/30 hover:bg-primary/15 text-[9px] py-0 px-1.5 font-bold rounded-md">
              {affinityScorePercent !== null ? `${affinityScorePercent}% Match` : 'Diagnosticado'}
            </Badge>
          ) : (
            <Button
              size="sm"
              variant="outline"
              disabled={isGenerating}
              onClick={(e) => {
                e.stopPropagation();
                onEvaluate(cluster.name);
              }}
              className="h-6 text-[10px] font-bold gap-1 px-2 border-border/70 hover:border-primary/50 hover:bg-primary/5 hover:text-primary cursor-pointer transition-colors"
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
          )}
        </div>
      </div>
    </div>
  );
}
