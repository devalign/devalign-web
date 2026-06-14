'use client';

import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';

export interface StrengthItem {
  name: string;
  level: string;
  score: number;
  demandPercentage: number;
}

interface StrengthsCardProps {
  strengths: StrengthItem[];
  onViewAll: () => void;
  isLoading?: boolean;
}

export function StrengthsCard({ strengths, onViewAll, isLoading = false }: StrengthsCardProps) {
  return (
    <Card className="shadow-lg shadow-black/5 border-border bg-card flex flex-col h-full relative overflow-hidden min-h-[280px]">
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
        {strengths.length === 0 ? (
          <div className="p-4 rounded-lg bg-secondary/35 border border-dashed border-border text-center text-xs text-muted-foreground my-auto">
            No se identificaron fortalezas clave específicas para este cluster.
          </div>
        ) : (
          <>
            <div className="space-y-2">
              {strengths.slice(0, 4).map((s) => (
                <div
                  key={s.name}
                  className="flex flex-col justify-between p-2.5 rounded-lg bg-emerald-500/5 border border-emerald-500/10"
                >
                  <div className="flex justify-between items-start gap-1">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">{s.name}</span>
                    <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold shrink-0">
                      {s.demandPercentage}% DEMANDA
                    </span>
                  </div>
                  <span className="text-[10px] text-muted-foreground mt-1">{s.level}</span>
                </div>
              ))}
            </div>
            <div className="pt-2 text-right">
              <button
                onClick={onViewAll}
                className="text-[10px] font-bold text-primary hover:underline inline-flex items-center gap-1 cursor-pointer bg-transparent border-0"
              >
                Ver todas ({strengths.length}) <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
