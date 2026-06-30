'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2 } from 'lucide-react';

import { SkillItem } from '@/lib/api/types';

interface AiInsightCardProps {
  marketGaps: SkillItem[];
  isLoading?: boolean;
}

export function AiInsightCard({ marketGaps, isLoading = false }: AiInsightCardProps) {
  if (marketGaps.length === 0 && !isLoading) return null;

  // Calculate dynamic increase based on the importance and demand of the top 2 gaps
  const topGaps = marketGaps.slice(0, 2);
  const potentialIncrease =
    topGaps.length > 0
      ? Math.min(
          35,
          Math.max(
            8,
            Math.round(
              topGaps.reduce((sum, gap) => sum + (gap.market_demand_percentage || 50), 0) * 0.12,
            ),
          ),
        )
      : 18;

  return (
    <div className="card-ai p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
      {isLoading ? (
        <div className="flex items-center justify-center py-2 gap-3 w-full">
          <Loader2 className="w-5 h-5 text-primary animate-spin" />
          <span className="text-xs font-semibold text-muted-foreground animate-pulse">
            Generando recomendación...
          </span>
        </div>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row items-start justify-start gap-3.5 flex-1">
            <div className="space-y-3">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Sparkles className="w-3.5 h-3.5 text-warning" />
                <span className="text-[10px] font-bold font-mono uppercase tracking-wider">
                  Recomendación
                </span>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">
                Fortalecer habilidades clave como{' '}
                <strong className="text-foreground">{topGaps[0]?.name || 'AWS'}</strong>
                {topGaps[1] && (
                  <>
                    {' '}
                    y <strong className="text-foreground">{topGaps[1].name}</strong>
                  </>
                )}{' '}
                podría aumentar tu alineación con el mercado en{' '}
                <strong className="text-success dark:text-success">+{potentialIncrease}%</strong>.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
