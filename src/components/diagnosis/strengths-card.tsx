'use client';

import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ArrowRight, Loader2 } from 'lucide-react';

interface StrengthsCardProps {
  techSkills: string[];
  onViewAll: () => void;
  isLoading?: boolean;
}

export function StrengthsCard({ techSkills, onViewAll, isLoading = false }: StrengthsCardProps) {
  return (
    <Card className="shadow-lg shadow-black/5 border-border bg-card flex flex-col h-full relative overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 bg-background/60 backdrop-blur-xs z-10 flex flex-col items-center justify-center gap-2">
          <Loader2 className="h-6 w-6 text-primary animate-spin" />
          <p className="text-[9px] font-bold font-mono text-muted-foreground animate-pulse">
            Identificando fortalezas...
          </p>
        </div>
      )}

      <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-extrabold text-foreground uppercase tracking-wider">
            Fortalezas principales
          </span>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between pt-0 space-y-3">
        <div className="space-y-2">
          {techSkills.slice(0, 4).map((f, idx) => {
            const levels = ['Avanzado', 'Intermedio - Avanzado', 'Intermedio', 'Intermedio'];
            const demands = [92, 85, 78, 71];
            const level = levels[idx] || 'Intermedio';
            const demand = demands[idx] || 65;
            return (
              <div
                key={f}
                className="flex flex-col justify-between p-2.5 rounded-lg bg-emerald-500/5 border border-emerald-500/10"
              >
                <div className="flex justify-between items-start gap-1">
                  <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">{f}</span>
                  <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold shrink-0">
                    {demand}% DEMANDA
                  </span>
                </div>
                <span className="text-[10px] text-muted-foreground mt-1">{level}</span>
              </div>
            );
          })}
        </div>
        <div className="pt-2 text-right">
          <button
            onClick={onViewAll}
            className="text-[10px] font-bold text-primary hover:underline inline-flex items-center gap-1 cursor-pointer bg-transparent border-0"
          >
            Ver todas ({techSkills.length}) <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
