'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, TrendingUp } from 'lucide-react';
import { MarketInsights } from '@/lib/api/types';

interface ClusterDemandCardProps {
  roleTitle?: string;
  marketInsights?: MarketInsights;
  isLoading?: boolean;
}

export function ClusterDemandCard({ roleTitle = 'Data Engineering', marketInsights, isLoading = false }: ClusterDemandCardProps) {
  const growth = marketInsights?.growth_percentage ?? null;
  const isPositive = growth !== null && growth >= 0;
  return (
    <Card className="shadow-lg shadow-black/5 border-border bg-card flex flex-col justify-between h-full min-h-[220px]">
      <CardContent className="p-5 flex flex-col justify-between h-full gap-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3 h-full">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
            <span className="text-[10px] font-bold font-mono text-muted-foreground animate-pulse">
              Cargando demanda...
            </span>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-500" />
                <span className="text-[10px] font-bold font-mono uppercase tracking-wider">
                  Demanda del Cluster
                </span>
              </div>
              <div className="flex items-baseline gap-2 pt-1">
                <span className={`text-3xl font-extrabold tracking-tight ${isPositive ? 'text-foreground' : 'text-foreground'}`}>
                  {growth !== null ? `${isPositive ? '+' : ''}${growth}%` : 'N/A'}
                </span>
                <span className={`text-[11px] font-semibold ${isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                  Crecimiento laboral
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs text-muted-foreground leading-relaxed">
              Las ofertas para la especialidad <strong className="text-foreground">{roleTitle}</strong> han mostrado este comportamiento recientemente (Market Share: {marketInsights?.market_share_percentage ?? 'N/A'}%).
            </p>

            {/* Sparkline chart (SVG) */}
            <div className="w-full h-10 mt-2 relative overflow-hidden">
              <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="sparkline-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgb(16, 185, 129)" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="rgb(16, 185, 129)" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Area under the line */}
                <path
                  d="M 0 35 Q 20 32, 40 38 T 80 20 T 100 15 L 100 40 L 0 40 Z"
                  fill="url(#sparkline-grad)"
                />
                {/* Stroke Line */}
                <path
                  d="M 0 35 Q 20 32, 40 38 T 80 20 T 100 15"
                  fill="none"
                  stroke="rgb(16, 185, 129)"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
