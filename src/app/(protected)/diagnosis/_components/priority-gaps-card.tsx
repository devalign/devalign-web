'use client';

import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ArrowRight, Loader2, AlertTriangle, TrendingUp, TrendingDown, Info } from 'lucide-react';
import { SkillItem } from '@/lib/api/types';

interface PriorityGapsCardProps {
  marketGaps: SkillItem[];
  onViewAll: () => void;
  isLoading?: boolean;
}

const severityBadge = (crit: string) => {
  if (crit === 'critical')
    return 'bg-destructive/10 text-destructive dark:text-destructive border-destructive/20';
  if (crit === 'high') return 'bg-warning/10 text-warning dark:text-warning border-warning/20';
  return 'bg-secondary/20 text-muted-foreground border-border/40';
};

const severityLabel = (crit: string) => {
  if (crit === 'critical') return 'Alta prioridad';
  if (crit === 'high') return 'Media prioridad';
  if (crit === 'medium') return 'Baja prioridad';
  return crit;
};

export function PriorityGapsCard({
  marketGaps,
  onViewAll,
  isLoading = false,
}: PriorityGapsCardProps) {
  return (
    <Card className="flex flex-col h-full relative overflow-visible min-h-[180px]">
      {isLoading && (
        <div className="absolute inset-0 bg-background/60 backdrop-blur-xs z-10 flex flex-col items-center justify-center gap-2">
          <Loader2 className="h-6 w-6 text-primary animate-spin" />
          <p className="text-[9px] font-bold font-mono text-muted-foreground animate-pulse">
            Buscando brechas...
          </p>
        </div>
      )}

      <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0 overflow-visible">
        <div className="flex items-center gap-1.5 relative z-30">
          <span className="text-[10px] font-extrabold text-foreground uppercase tracking-wider">
            Brechas prioritarias
          </span>
          <div className="group relative">
            <Info className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground cursor-help transition-colors" />
            <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-56 rounded-md border border-border bg-card p-2 text-[10px] leading-relaxed text-muted-foreground opacity-0 shadow-xl transition-all group-hover:opacity-100 z-50 normal-case font-normal">
              Indica las tecnologías críticas requeridas por el mercado para tu rol que aún no han sido detectadas en tu perfil. Su prioridad (Alta, Media, Baja) se determina por la relevancia del stack y su nivel de demanda.
            </div>
          </div>
        </div>
        {marketGaps.length > 0 && (
          <button
            onClick={onViewAll}
            className="text-[10px] font-bold text-primary hover:underline inline-flex items-center gap-1 cursor-pointer bg-transparent border-0"
          >
            Ver todas ({marketGaps.length}) <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </CardHeader>
      <CardContent className="flex-1 pt-1 space-y-1.5">
        {marketGaps.length === 0 ? (
          <div className="py-6 text-center text-xs text-muted-foreground">
            Has cubierto todas las brechas detectadas.
          </div>
        ) : (
          marketGaps.slice(0, 5).map((bg) => {
            const crit = bg.market_importance || 'medium';

            return (
              <div
                key={bg.name}
                className="flex items-center justify-between py-1.5 px-1 border-b border-border/20 last:border-b-0"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <AlertTriangle
                    className={`w-3.5 h-3.5 shrink-0 ${
                      crit === 'critical' ? 'text-destructive' : 'text-warning'
                    }`}
                  />
                  <span className="text-xs font-semibold text-foreground truncate">{bg.name}</span>
                  {bg.trend === 'growing' && (
                    <span title="Demanda en crecimiento" className="shrink-0 flex items-center">
                      <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                    </span>
                  )}
                  {bg.trend === 'shrinking' && (
                    <span title="Demanda decreciente" className="shrink-0 flex items-center">
                      <TrendingDown className="h-3.5 w-3.5 text-rose-500" />
                    </span>
                  )}
                </div>
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border shrink-0 ml-2 ${severityBadge(crit)}`}
                >
                  {severityLabel(crit)}
                </span>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
