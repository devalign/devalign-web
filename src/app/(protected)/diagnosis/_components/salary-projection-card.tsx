'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Loader2 } from 'lucide-react';
import { SalaryProjection, GapImpactItem, MarketInsights } from '@/lib/api/types';
import { cn } from '@/lib/utils';

interface SalaryProjectionCardProps {
  salaryProjection?: SalaryProjection | null;
  marketInsights?: MarketInsights | null;
  gapImpacts?: GapImpactItem[];
  skillGaps?: Array<{ name: string; market_importance?: string }>;
  clusterName?: string;
  seniority?: string;
  isLoading?: boolean;
  className?: string;
}

export function SalaryProjectionCard({
  salaryProjection,
  marketInsights,
  seniority = 'mid',
  isLoading = false,
  className,
}: SalaryProjectionCardProps) {
  const [currencyMode, setCurrencyMode] = useState<'USD' | 'PEN' | 'EUR'>('PEN');

  if (isLoading) {
    return (
      <Card className={cn('flex flex-col justify-center h-full', className)}>
        <CardContent className="p-4 flex flex-col items-center justify-center py-8 gap-2">
          <Loader2 className="w-5 h-5 text-primary animate-spin" />
          <span className="text-[11px] font-mono text-muted-foreground animate-pulse">
            Calculando benchmark...
          </span>
        </CardContent>
      </Card>
    );
  }

  const isUsd = currencyMode === 'USD';
  const isEur = currencyMode === 'EUR';
  const currencySymbol = isUsd ? '$' : isEur ? '€' : 'S/. ';

  // Check if real salary data is present
  const avgUsd = salaryProjection?.cluster_average_usd ?? marketInsights?.average_salary_usd ?? null;
  const hasSalaryData =
    avgUsd != null ||
    salaryProjection?.salary_median_pen != null ||
    salaryProjection?.salary_median_usd != null ||
    marketInsights?.salary_median_usd != null;

  if (!hasSalaryData) {
    return (
      <Card className={cn('p-5 card-standard flex flex-col justify-center items-center text-center h-full min-h-[160px]', className)}>
        <p className="text-xs text-muted-foreground font-medium">
          Datos de benchmark salarial en recopilación para este clúster.
        </p>
      </Card>
    );
  }

  const baseAvg = avgUsd ?? 0;

  // Percentiles calculation
  const p25Val = isUsd
    ? salaryProjection?.salary_p25_usd ?? marketInsights?.salary_p25_usd ?? baseAvg * 0.75
    : isEur
      ? (salaryProjection as any)?.salary_p25_eur ?? (baseAvg * 0.75 * 0.92)
      : salaryProjection?.salary_p25_pen ??
        (marketInsights?.salary_p25_usd
          ? marketInsights.salary_p25_usd * 3.75
          : baseAvg * 0.75 * 3.75);

  const p50Val = isUsd
    ? salaryProjection?.salary_median_usd ?? marketInsights?.salary_median_usd ?? baseAvg
    : isEur
      ? (salaryProjection as any)?.salary_median_eur ?? (baseAvg * 0.92)
      : salaryProjection?.salary_median_pen ??
        (marketInsights?.salary_median_usd
          ? marketInsights.salary_median_usd * 3.75
          : baseAvg * 3.75);

  const p75Val = isUsd
    ? salaryProjection?.cluster_p75_usd ?? marketInsights?.salary_p75_usd ?? baseAvg * 1.35
    : isEur
      ? (salaryProjection as any)?.salary_p75_eur ?? (baseAvg * 1.35 * 0.92)
      : salaryProjection?.salary_p75_pen ??
        (marketInsights?.salary_p75_usd
          ? marketInsights.salary_p75_usd * 3.75
          : baseAvg * 1.35 * 3.75);

  const seniorityLower = seniority.toLowerCase();
  const isJunior = seniorityLower.includes('junior');
  const isSenior =
    seniorityLower.includes('senior') ||
    seniorityLower.includes('staff') ||
    seniorityLower.includes('lead');
  const isMid = !isJunior && !isSenior;

  const currentSeniorityLabel = isSenior ? 'Senior' : isJunior ? 'Junior' : 'Mid';

  // Market differential calculation
  const diffPercentage = marketInsights?.salary_differential_percentage ?? 0;


  // Relative bar heights for the micro-histogram (min 38% to ensure text fits inside, max 100%)
  const safeP75 = p75Val > 0 ? p75Val : 1;
  const p25Height = Math.max(38, Math.min(100, Math.round((p25Val / safeP75) * 100)));
  const p50Height = Math.max(65, Math.min(100, Math.round((p50Val / safeP75) * 100)));
  const p75Height = 100;

  return (
    <Card className={cn(className)}>
      <CardContent className="space-y-2.5">
        {/* 1. Header: Headline Metric & Compact Currency Switch */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base sm:text-lg font-black tracking-tight text-foreground">
              {diffPercentage >= 0 ? `+${diffPercentage}%` : `${diffPercentage}%`}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
              Diferencial de Mercado
            </span>
          </div>

          <div className="flex items-center p-0.5 rounded-md bg-secondary border border-border text-[10px] font-bold shrink-0">
            <button
              onClick={() => setCurrencyMode('PEN')}
              className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                currencyMode === 'PEN'
                  ? 'bg-background text-foreground shadow-2xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              PEN
            </button>
            <button
              onClick={() => setCurrencyMode('USD')}
              className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                currencyMode === 'USD'
                  ? 'bg-background text-foreground shadow-2xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              USD
            </button>
            <button
              onClick={() => setCurrencyMode('EUR')}
              className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                currencyMode === 'EUR'
                  ? 'bg-background text-foreground shadow-2xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              EUR
            </button>
          </div>
        </div>

        {/* 2. Top Contextual Note: Stack Market Value */}
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          Los perfiles en este stack perciben en promedio un{' '}
          <strong className="text-foreground">
            {diffPercentage >= 0 ? `+${diffPercentage}%` : `${diffPercentage}%`}
          </strong>{' '}
          frente a la media del mercado.
        </p>

        {/* 3. Micro-Histogram */}
        <div className="pt-0.5 pb-2.5">
          <div className="grid grid-cols-3 gap-2.5 items-end h-20">
            {/* P25 Column */}
            <div className="flex flex-col items-center justify-end h-full gap-1.5">
              <div className="w-full h-14 flex items-end justify-center">
                <div
                  style={{ height: `${p25Height}%` }}
                  className={`w-full rounded-md transition-all duration-300 flex items-center justify-center px-1 text-center ${
                    isJunior
                      ? 'bg-primary text-primary-foreground border border-primary shadow-xs font-black'
                      : 'bg-secondary/90 border border-border/80 text-foreground font-bold'
                  }`}
                >
                  <span className="text-[11px] tracking-tight truncate">
                    {currencySymbol}
                    {Math.round(p25Val).toLocaleString('es-ES')}
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
                P25 · Jr
              </span>
            </div>

            {/* P50 Column */}
            <div className="flex flex-col items-center justify-end h-full gap-1.5">
              <div className="w-full h-14 flex items-end justify-center">
                <div
                  style={{ height: `${p50Height}%` }}
                  className={`w-full rounded-md transition-all duration-300 flex items-center justify-center px-1 text-center ${
                    isMid
                      ? 'bg-primary text-primary-foreground border border-primary shadow-xs font-black'
                      : 'bg-secondary/90 border border-border/80 text-foreground font-bold'
                  }`}
                >
                  <span className="text-[11px] tracking-tight truncate">
                    {currencySymbol}
                    {Math.round(p50Val).toLocaleString('es-ES')}
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
                P50 · Mid
              </span>
            </div>

            {/* P75 Column */}
            <div className="flex flex-col items-center justify-end h-full gap-1.5">
              <div className="w-full h-14 flex items-end justify-center">
                <div
                  style={{ height: `${p75Height}%` }}
                  className={`w-full rounded-md transition-all duration-300 flex items-center justify-center px-1 text-center ${
                    isSenior
                      ? 'bg-primary text-primary-foreground border border-primary shadow-xs font-black'
                      : 'bg-secondary/60 border border-dashed border-border/90 text-foreground font-bold'
                  }`}
                >
                  <span className="text-[11px] tracking-tight truncate">
                    {currencySymbol}
                    {Math.round(p75Val).toLocaleString('es-ES')}{isSenior ? '+' : ''}
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
                P75 · Sr
              </span>
            </div>
          </div>
        </div>

        {/* 4. Bottom Description: Candidate Position and P75 Milestone */}
        <p className="text-[11px] text-muted-foreground leading-relaxed pt-2">
          Tu perfil (<strong className="text-foreground">{currentSeniorityLabel}</strong>) se
          posiciona en torno a la mediana. Dominar tus brechas prioritarias te habilita para el percentil{' '}
          <strong className="text-primary font-semibold">
            P75 (~{currencySymbol}
            {Math.round(p75Val).toLocaleString('es-ES')}{isSenior ? '+' : ''})
          </strong>
          .
        </p>
      </CardContent>
    </Card>
  );
}
