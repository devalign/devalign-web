'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Lightbulb, ArrowUpRight } from 'lucide-react';

interface MarketImpactCardProps {
  marketGaps?: string[];
  isLoading?: boolean;
}

export function MarketImpactCard({ marketGaps = [], isLoading = false }: MarketImpactCardProps) {
  const gap1 = marketGaps[0] || 'REST APIs';
  const gap2 = marketGaps[1] || 'microservicios';

  return (
    <Card className="shadow-lg shadow-black/5 border-border bg-card flex flex-col justify-between h-full min-h-[220px]">
      <CardContent className="p-5 flex flex-col justify-between h-full gap-4">
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
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-[10px] font-bold font-mono uppercase tracking-wider">
                  Insight de Mercado
                </span>
              </div>
              <div className="flex items-baseline gap-1 pt-1">
                <span className="text-3xl font-extrabold text-foreground tracking-tight">
                  +32%
                </span>
                <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                  Diferencial Salarial
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs text-muted-foreground leading-relaxed">
              Los profesionales que dominan <strong className="text-foreground">{gap1}</strong> y{' '}
              <strong className="text-foreground">{gap2}</strong> perciben ingresos promedio <strong>32% más altos (2.3x)</strong> en vacantes locales.
            </p>

            {/* Footer action link */}
            <div className="flex items-center gap-1 text-[10px] font-bold text-primary cursor-pointer hover:underline pt-2 group w-fit">
              <span>Ver detalle del insight</span>
              <ArrowUpRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
