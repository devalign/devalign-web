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

export function PriorityGapsCard({ marketGaps, onViewAll, isLoading = false }: PriorityGapsCardProps) {
  return (
    <Card className="shadow-lg shadow-black/5 border-border bg-card flex flex-col h-full relative overflow-hidden">
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
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between pt-0 space-y-3">
        {marketGaps.length === 0 ? (
          <div className="p-4 rounded-lg bg-emerald-500/5 border border-dashed border-emerald-500/30 text-center text-xs text-muted-foreground my-auto">
            🎉 ¡Felicidades! Has cubierto todas las brechas detectadas.
          </div>
        ) : (
          <>
            <div className="space-y-2">
              {marketGaps.slice(0, 4).map((bg) => {
                const crit = bg.market_importance || 'medium';
                const demand = bg.market_demand_percentage || 50;

                const borderClass =
                  crit === 'critical' || crit === 'critical'
                    ? 'border-red-500/30 bg-red-500/5 hover:border-red-500/50'
                    : 'border-amber-500/30 bg-amber-500/5 hover:border-amber-500/50';
                const textClass =
                  crit === 'critical' || crit === 'critical'
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-amber-600 dark:text-amber-400';
                const critLabel =
                  crit === 'critical' ? 'Crítica' :
                  crit === 'high' ? 'Alta' :
                  crit === 'medium' ? 'Media' : crit;

                return (
                  <div
                    key={bg.name}
                    className={`flex flex-col justify-between p-2.5 rounded-lg border border-dashed transition-colors ${borderClass}`}
                  >
                    <div className="flex justify-between items-start gap-1">
                      <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">{bg.name}</span>
                      <span className={`text-[9px] font-bold shrink-0 ${textClass}`}>
                        {demand}% DEMANDA
                      </span>
                    </div>
                    <span className="text-[10px] text-muted-foreground mt-1">
                      Brecha ({critLabel})
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="pt-2 text-right">
              <button
                onClick={onViewAll}
                className="text-[10px] font-bold text-primary hover:underline inline-flex items-center gap-1 cursor-pointer bg-transparent border-0"
              >
                Ver todas ({marketGaps.length}) <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
