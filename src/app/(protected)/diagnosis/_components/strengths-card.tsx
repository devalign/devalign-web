'use client';

import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ArrowRight, Loader2, CheckCircle2, TrendingUp, TrendingDown } from 'lucide-react';

export interface StrengthItem {
  name: string;
  level: string;
  score: number;
  demandPercentage: number;
  category?: string;
  ict_score?: number;
  trend?: 'growing' | 'stable' | 'shrinking' | null;
}

interface StrengthsCardProps {
  strengths: StrengthItem[];
  onViewAll: () => void;
  isLoading?: boolean;
}

const levelBadge = (level: string) => {
  if (level === 'Avanzado') return 'bg-success/10 text-success dark:text-success border-success/20';
  if (level === 'Intermedio')
    return 'bg-warning/10 text-warning dark:text-warning border-warning/20';
  return 'bg-secondary/20 text-muted-foreground border-border/40';
};

export function StrengthsCard({ strengths, onViewAll, isLoading = false }: StrengthsCardProps) {
  return (
    <Card className="flex flex-col h-full relative overflow-hidden min-h-[180px]">
      {isLoading && (
        <div className="absolute inset-0 bg-background/60 backdrop-blur-xs z-10 flex flex-col items-center justify-center gap-2">
          <Loader2 className="h-6 w-6 text-primary animate-spin" />
          <p className="text-[9px] font-bold font-mono text-muted-foreground animate-pulse">
            Identificando fortalezas...
          </p>
        </div>
      )}

      <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
        <span className="text-[10px] font-extrabold text-foreground uppercase tracking-wider">
          Fortalezas principales
        </span>
        {strengths.length > 0 && (
          <button
            onClick={onViewAll}
            className="text-[10px] font-bold text-primary hover:underline inline-flex items-center gap-1 cursor-pointer bg-transparent border-0"
          >
            Ver todas ({strengths.length}) <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </CardHeader>
      <CardContent className="flex-1 pt-1 space-y-1.5">
        {strengths.length === 0 ? (
          <div className="py-6 text-center text-xs text-muted-foreground">
            No se identificaron fortalezas clave específicas para este cluster.
          </div>
        ) : (
          strengths.slice(0, 5).map((s) => (
            <div
              key={s.name}
              className="flex items-center justify-between py-1.5 px-1 border-b border-border/20 last:border-b-0"
            >
              <div className="flex items-center gap-2 min-w-0">
                <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0" />
                <span className="text-xs font-semibold text-foreground truncate">{s.name}</span>
                {s.trend === 'growing' && (
                  <span title="Demanda en crecimiento" className="shrink-0 flex items-center">
                    <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                  </span>
                )}
                {s.trend === 'shrinking' && (
                  <span title="Demanda decreciente" className="shrink-0 flex items-center">
                    <TrendingDown className="h-3.5 w-3.5 text-rose-500" />
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 shrink-0 ml-2">
                {s.ict_score !== undefined && (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                    ICT {s.ict_score.toFixed(1)}
                  </span>
                )}
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${levelBadge(s.level)}`}
                >
                  {s.level}
                </span>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
