'use client';

import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ArrowRight, Loader2 } from 'lucide-react';
import { SkillItem } from '@/lib/api/types';

interface PriorityGapsCardProps {
  marketGaps: SkillItem[];
  onViewAll: () => void;
  isLoading?: boolean;
}

const categoryLabel = (cat: string) => {
  const c = cat ? cat.toLowerCase() : '';
  if (c === 'hard_skill' || c === 'tech') return 'Tecnología';
  if (c === 'tool') return 'Herramienta';
  if (c === 'methodology' || c === 'concept') return 'Concepto';
  if (c === 'soft') return 'Blanda';
  return cat;
};

export function PriorityGapsCard({
  marketGaps,
  onViewAll,
  isLoading = false,
}: PriorityGapsCardProps) {
  return (
    <Card className="card-standard flex flex-col h-full relative overflow-hidden min-h-[280px]">
      {isLoading && (
        <div className="absolute inset-0 bg-background/60 backdrop-blur-xs z-10 flex flex-col items-center justify-center gap-2">
          <Loader2 className="h-6 w-6 text-primary animate-spin" />
          <p className="text-[9px] font-bold font-mono text-muted-foreground animate-pulse">
            Buscando brechas...
          </p>
        </div>
      )}

      <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-extrabold text-foreground uppercase tracking-wider">
            Brechas prioritarias
          </span>
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
      <CardContent className="flex-1 flex flex-col justify-between pt-0 space-y-3">
        {marketGaps.length === 0 ? (
          <div className="p-4 rounded-lg bg-success/5 border border-dashed border-success/30 text-center text-xs text-muted-foreground my-auto">
            🎉 ¡Felicidades! Has cubierto todas las brechas detectadas.
          </div>
        ) : (
          <>
            <div className="space-y-2">
              {marketGaps.slice(0, 4).map((bg) => {
                const crit = bg.market_importance || 'medium';
                const demand = bg.market_demand_percentage || 50;

                const borderClass =
                  crit === 'critical'
                    ? 'border-destructive/30 bg-destructive/5 hover:border-destructive/50'
                    : 'border-warning/30 bg-warning/5 hover:border-warning/50';
                const textClass = crit === 'critical' ? 'text-destructive' : 'text-warning';
                const critLabel =
                  crit === 'critical'
                    ? 'Crítica'
                    : crit === 'high'
                      ? 'Alta'
                      : crit === 'medium'
                        ? 'Media'
                        : crit;
                const tagClass =
                  crit === 'critical'
                    ? 'bg-destructive/10 text-destructive'
                    : 'bg-warning/10 text-warning';

                return (
                  <div
                    key={bg.name}
                    className={`flex flex-col justify-between p-2.5 rounded-lg border border-dashed transition-colors ${borderClass}`}
                  >
                    <div className="flex justify-between items-start gap-1">
                      <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {bg.name}
                      </span>
                      <span className={`text-[9px] font-bold shrink-0 ${textClass} opacity-80`}>
                        {demand}% DEMANDA
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className={`text-[10px] font-medium ${textClass}`}>{critLabel}</span>
                      {bg.skill_type && (
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${tagClass}`}
                        >
                          {categoryLabel(bg.skill_type)}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
