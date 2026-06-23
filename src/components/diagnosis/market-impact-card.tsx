'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Lightbulb, ArrowUpRight } from 'lucide-react';

import { SkillItem, MarketInsights } from '@/lib/api/types';

interface MarketImpactCardProps {
  marketGaps?: SkillItem[];
  marketInsights?: MarketInsights;
  onViewAll?: () => void;
  isLoading?: boolean;
}

export function MarketImpactCard({
  marketGaps = [],
  marketInsights,
  onViewAll,
  isLoading = false,
}: MarketImpactCardProps) {
  const salaryDiff = marketInsights?.salary_differential_percentage ?? null;
  const isPositive = salaryDiff !== null && salaryDiff >= 0;

  return (
    <Card className="card-ai flex flex-col justify-between h-auto min-h-[220px]">
      <CardContent className="p-5 flex flex-col justify-between h-auto gap-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3 h-full">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
            <span className="text-[10px] font-bold font-mono text-muted-foreground animate-pulse">
              Cargando impacto...
            </span>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Lightbulb className="w-3.5 h-3.5 text-warning" />
                <span className="text-[10px] font-bold font-mono uppercase tracking-wider">
                  Insight de Mercado
                </span>
              </div>
              <div className="flex items-baseline gap-1.5 pt-1">
                <span
                  className={`text-lg font-black tracking-tight ${isPositive ? 'text-foreground' : 'text-foreground'}`}
                >
                  {salaryDiff !== null ? `${isPositive ? '+' : ''}${salaryDiff}%` : 'N/A'}
                </span>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider ${isPositive ? 'text-warning' : 'text-destructive'}`}
                >
                  Diferencial
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs text-muted-foreground leading-relaxed">
              Los profesionales que dominan este stack técnico tienen el potencial de percibir
              ingresos{' '}
              <strong>
                {salaryDiff !== null
                  ? isPositive
                    ? `${salaryDiff}% superiores`
                    : `${Math.abs(salaryDiff)}% inferiores`
                  : 'variables'}
              </strong>{' '}
              respecto a la media del mercado.
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}
