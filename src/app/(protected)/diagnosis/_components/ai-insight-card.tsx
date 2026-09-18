'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, Loader2 } from 'lucide-react';
import { SkillItem } from '@/lib/api/types';
import { cn } from '@/lib/utils';

interface AiInsightCardProps {
  marketGaps: SkillItem[];
  isLoading?: boolean;
  className?: string;
}

export function AiInsightCard({ marketGaps, isLoading = false, className }: AiInsightCardProps) {
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
    <Card className={cn(className)}>
      <CardContent className="space-y-1.5">
        {isLoading ? (
          <div className="flex items-center justify-center py-4 gap-2">
            <Loader2 className="w-4 h-4 text-primary animate-spin" />
            <span className="text-[11px] font-mono text-muted-foreground animate-pulse">
              Generando recomendación...
            </span>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-[10px] font-bold font-mono uppercase tracking-wider">
                Recomendación
              </span>
            </div>

            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Fortalecer habilidades clave como{' '}
              <strong className="text-foreground">{topGaps[0]?.name || 'AWS'}</strong>
              {topGaps[1] && (
                <>
                  {' '}
                  y <strong className="text-foreground">{topGaps[1].name}</strong>
                </>
              )}{' '}
              podría aumentar tu alineación con el mercado en{' '}
              <strong className="text-emerald-500">+{potentialIncrease}%</strong>.
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}
