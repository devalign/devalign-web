'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, ArrowRight } from 'lucide-react';
import { SkillGap } from './types';
import { cn } from '@/lib/utils';

interface Props {
  gaps: SkillGap[];
  total: number;
  isEmpty?: boolean;
}

export function PriorityGapsCard({ gaps, total, isEmpty = false }: Props) {
  return (
    <Card className="border-border bg-card h-full flex flex-col justify-between">
      <div>
        <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-xs font-bold text-muted-foreground flex items-center gap-2 tracking-wider uppercase">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            Brechas Prioritarias
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-col gap-3">
            {isEmpty ? null : (
              gaps.map((gap) => {
                const isCritica = gap.criticality === 'Crítica';
                return (
                  <div
                    key={gap.name}
                    className={`p-3 rounded-xl border border-dashed flex items-center justify-between gap-2 transition-all hover:bg-muted/5 ${
                      isCritica
                        ? 'border-destructive/40 bg-destructive/5 dark:border-destructive/20'
                        : 'border-amber-500/40 bg-amber-500/5 dark:border-amber-950/20'
                    }`}
                  >
                    <div className="space-y-0.5 min-w-0">
                      <p
                        className="text-xs font-semibold text-foreground truncate"
                        title={gap.name}
                      >
                        {gap.name}
                      </p>
                      <p
                        className={`text-[10px] font-bold ${
                          isCritica 
                            ? 'text-destructive' 
                            : 'text-amber-600 dark:text-amber-400'
                        }`}
                      >
                        Brecha ({gap.criticality})
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className={`text-xs font-bold ${
                        isCritica ? 'text-destructive' : 'text-amber-600 dark:text-amber-400'
                      }`}>
                        {gap.demandPercentage ?? (isCritica ? 80 : 60)}%
                      </span>
                      <span className="text-[9px] text-muted-foreground block uppercase tracking-wider font-semibold">
                        Demanda
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </div>
      <div className="px-6 pb-6 pt-2">
        <button 
          disabled={isEmpty}
          className={cn(
            "flex items-center gap-2 text-xs font-bold transition-colors",
            isEmpty 
              ? "text-muted-foreground/45 cursor-not-allowed select-none" 
              : "text-muted-foreground hover:text-foreground cursor-pointer"
          )}
        >
          Ver todas las brechas ({isEmpty ? 0 : total})
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </Card>
  );
}
