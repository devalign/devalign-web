'use client';

import * as React from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Cluster } from '@/types/market';
import type { ClusterAffinityItem } from '@/types/diagnosis';

export interface ClusterCompactCardProps {
  cluster: Cluster;
  affinityItem: ClusterAffinityItem | null;
  totalOffers: number;
  isGenerating?: boolean;
  onViewDiagnostic: (clusterName: string) => void;
  onRequestDiagnostic?: (clusterName: string) => void;
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
 * Single-column row card with full-width skills distribution and clean action hierarchy.
 */
export function ClusterCompactCard({
  cluster,
  affinityItem,
  totalOffers,
  isGenerating = false,
  onViewDiagnostic,
  onRequestDiagnostic,
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

  const isDiagnosed = affinityItem !== null && !!affinityItem.is_evaluated;

  const handleAction = () => {
    if (isDiagnosed) {
      onViewDiagnostic(cluster.name);
    } else if (onRequestDiagnostic) {
      onRequestDiagnostic(cluster.name);
    } else {
      onViewDiagnostic(cluster.name);
    }
  };

  return (
    <div
      onClick={handleAction}
      className="group relative p-4 rounded-xl border border-border/80 bg-card hover:border-primary/40 hover:bg-secondary/15 hover:shadow-xs transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer"
    >
      {/* Left Area: Title, Skills, and Market Stats */}
      <div className="space-y-2.5 flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3
            className="font-extrabold text-sm sm:text-base text-foreground tracking-tight group-hover:text-primary transition-colors truncate"
            title={cluster.name}
          >
            {cluster.name}
          </h3>

          {isDiagnosed ? (
            <Badge className="bg-primary/15 text-primary border-primary/30 hover:bg-primary/15 text-[10px] py-0 px-2 font-bold rounded-md shrink-0">
              {affinityScorePercent !== null ? `${affinityScorePercent}% Match` : 'Evaluada'}
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="bg-muted/15 text-muted-foreground border-border text-[10px] py-0 px-2 font-semibold rounded-md shrink-0"
            >
              Disponible
            </Badge>
          )}
        </div>

        {/* Skills Badges */}
        {cluster.top_skills && cluster.top_skills.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-hidden w-full flex-wrap">
            {cluster.top_skills.slice(0, 5).map((skill) => (
              <span
                key={skill}
                className="text-[10px] px-2 py-0.5 rounded bg-secondary text-secondary-foreground border border-border/40 font-medium truncate max-w-[180px]"
                title={skill}
              >
                {cleanSkillName(skill)}
              </span>
            ))}
            {cluster.top_skills.length > 5 && (
              <span className="text-[10px] text-muted-foreground font-semibold shrink-0">
                +{cluster.top_skills.length - 5}
              </span>
            )}
          </div>
        )}

        {/* Market Stats */}
        <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-medium pt-0.5">
          <span>{cluster.job_offer_count} ofertas</span>
          <span className="h-1 w-1 rounded-full bg-border" />
          <span className="text-primary font-bold">{percent}% del mercado</span>
        </div>
      </div>

      {/* Right Area: Unified Action Button */}
      <div className="shrink-0 flex sm:flex-col items-end justify-between sm:justify-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/30">
        <Button
          size="sm"
          variant={isDiagnosed ? 'default' : 'outline'}
          disabled={isGenerating}
          onClick={(e) => {
            e.stopPropagation();
            handleAction();
          }}
          className="h-8 text-xs font-bold gap-1.5 px-3 cursor-pointer shadow-none"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Cargando...</span>
            </>
          ) : (
            <>
              <span>Ver diagnóstico</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
