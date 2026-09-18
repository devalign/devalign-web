'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Briefcase } from 'lucide-react';
import { OpportunityProjection, MarketInsights } from '@/lib/api/types';
import { cn } from '@/lib/utils';

interface ClusterDemandCardProps {
  clusterName?: string;
  opportunityProjection?: OpportunityProjection | null;
  jobOfferCount?: number;
  marketInsights?: MarketInsights;
  affinityScore?: number;
  isLoading?: boolean;
  className?: string;
}

export function ClusterDemandCard({
  opportunityProjection,
  jobOfferCount = 0,
  affinityScore = 0.21,
  isLoading = false,
  className,
}: ClusterDemandCardProps) {
  const totalOffers = opportunityProjection?.total_cluster_offers ?? jobOfferCount ?? 100;
  const directMatches =
    opportunityProjection?.direct_matches_count ??
    Math.max(1, Math.round(totalOffers * Math.max(0.05, affinityScore)));
  const unlockable = Math.max(0, totalOffers - directMatches);
  const unlockPct =
    opportunityProjection?.unlock_percentage ??
    Math.round((directMatches / Math.max(1, totalOffers)) * 100);

  return (
    <Card className={cn(className)}>
      <CardContent className="space-y-2">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-6 gap-2">
            <Loader2 className="w-5 h-5 text-primary animate-spin" />
            <span className="text-[10px] font-bold font-mono text-muted-foreground animate-pulse">
              Calculando ofertas compatibles...
            </span>
          </div>
        ) : (
          <>
            {/* Metric & Description */}
            <div className="flex items-baseline gap-2 pt-0.5">
              <span className="text-base sm:text-lg font-black tracking-tight text-foreground">
                {directMatches} de {totalOffers}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                ofertas del mercado
              </span>
            </div>

            {/* Description */}
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Tu perfil califica directamente para el{' '}
              <strong className="text-foreground">{unlockPct}%</strong> de las ofertas del clúster.
              Cubrir tus brechas prioritarias te habilita para competir por el{' '}
              <strong className="text-primary font-semibold">100% ({totalOffers} ofertas)</strong>.
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}
