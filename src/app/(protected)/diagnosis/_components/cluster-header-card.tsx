'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Briefcase, Clock3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { OpportunityProjection, MarketInsights } from '@/lib/api/types';

interface ClusterHeaderCardProps {
  primarySpecialty: string;
  currentScore: number;
  lastAnalysisDate?: string;
  jobOfferCount?: number;
  marketPercent?: number;
  opportunityProjection?: OpportunityProjection | null;
  marketInsights?: MarketInsights | null;
  topSkills?: string[];
  isLoading?: boolean;
  className?: string;
}

export function ClusterHeaderCard({
  currentScore,
  lastAnalysisDate = 'Recientemente',
  jobOfferCount = 0,
  opportunityProjection,
  marketInsights,
  className,
}: ClusterHeaderCardProps) {
  const totalOffers = opportunityProjection?.total_cluster_offers ?? jobOfferCount;
  const exp = marketInsights?.experience_distribution;
  const totalExpPct = (exp?.junior_percentage || 0) + (exp?.mid_percentage || 0) + (exp?.senior_percentage || 0);
  const hasValidExp = totalExpPct > 0;

  const jrPct = hasValidExp ? exp!.junior_percentage : null;
  const midPct = hasValidExp ? exp!.mid_percentage : null;
  const srPct = hasValidExp ? exp!.senior_percentage : null;


  return (
    <Card
      className={cn('relative overflow-hidden p-5 card-standard flex flex-col gap-4', className)}
    >
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        {/* Left Side: Specialty Info */}
        <div className="space-y-1.5 flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-primary/10 text-primary shrink-0">
              <Briefcase className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest block">
              Especialidad Analizada
            </span>
          </div>

          <div className="flex items-baseline gap-2 pt-0.5">
            <span className="text-2xl font-black tracking-tight text-foreground leading-none">
              {currentScore}%
            </span>
            <span
              className={cn(
                'text-[10px] font-bold uppercase tracking-wider',
                currentScore >= 75
                  ? 'text-success'
                  : currentScore >= 50
                    ? 'text-warning'
                    : 'text-destructive',
              )}
            >
              {currentScore >= 75
                ? 'afinidad alta'
                : currentScore >= 50
                  ? 'afinidad media'
                  : 'afinidad baja'}
            </span>
          </div>
        </div>

        {/* Right Side: Last Analysis Date */}
        <div className="flex flex-wrap gap-3 shrink-0">
          <div className="flex items-center gap-2.5 p-2 px-3.5 rounded-xl border border-border/40 bg-secondary/10 min-w-[130px]">
            <div className="p-1.5 rounded-lg bg-info/10 text-info shrink-0">
              <Clock3 className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[8px] font-extrabold text-muted-foreground uppercase tracking-wider block">
                Último análisis
              </span>
              <span className="text-xs font-black text-foreground block truncate mt-0.5">
                {lastAnalysisDate}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Full-width Horizontal Market Demand & Seniority Row */}
      <div className="pt-2 border-t border-border/40 flex items-center justify-between flex-wrap gap-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5 text-xs">
          <span>Demanda de mercado:</span>
          <strong className="text-foreground font-semibold">
            {totalOffers} ofertas
          </strong>
        </div>
        {hasValidExp ? (
          <div className="flex items-center gap-2 text-xs">
            <span>
              Jr (<strong className="text-foreground font-semibold">{jrPct}%</strong>)
            </span>
            <span className="text-border">·</span>
            <span>
              Mid (<strong className="text-foreground font-semibold">{midPct}%</strong>)
            </span>
            <span className="text-border">·</span>
            <span>
              Senior (<strong className="text-foreground font-semibold">{srPct}%</strong>)
            </span>
          </div>
        ) : (
          <span className="text-xs text-muted-foreground/70 italic">Distribución de experiencia en análisis</span>
        )}
      </div>
    </Card>

  );
}
