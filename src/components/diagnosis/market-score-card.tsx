'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface AffinityItem {
  name: string;
  score: number;
}

interface MarketScoreCardProps {
  currentScore: number;
  primarySpecialty?: string;
  secondaryAffinities?: AffinityItem[];
  isLoading?: boolean;
}

export function MarketScoreCard({
  currentScore,
  primarySpecialty = 'Data Engineering',
  secondaryAffinities = [
    { name: 'DevOps', score: 63 },
    { name: 'Data Engineering', score: 41 },
  ],
  isLoading = false,
}: MarketScoreCardProps) {
  const getScoreState = (score: number) => {
    if (score >= 75)
      return {
        label: 'Alta afinidad',
        color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/35',
      };
    if (score >= 50)
      return {
        label: 'Media afinidad',
        color: 'text-amber-500 bg-amber-500/10 border-amber-500/35',
      };
    return { label: 'Baja afinidad', color: 'text-red-500 bg-red-500/10 border-red-500/35' };
  };

  const scoreState = getScoreState(currentScore);

  return (
    <Card className="shadow-lg shadow-black/5 border-border bg-card relative overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 bg-background/60 backdrop-blur-xs z-10 flex flex-col items-center justify-center gap-2">
          <Loader2 className="h-6 w-6 text-primary animate-spin" />
          <p className="text-[9px] font-bold font-mono text-muted-foreground animate-pulse">
            Calibrando alineación...
          </p>
        </div>
      )}

      <CardContent className="pt-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Score */}
          <div className="text-center sm:text-left space-y-1">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Alineación con el mercado
            </p>
            <div className="flex items-baseline justify-center sm:justify-start gap-1">
              <span className="text-5xl font-black text-foreground tracking-tight">
                {currentScore}%
              </span>
            </div>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${scoreState.color}`}
            >
              {scoreState.label}
            </span>
          </div>

          {/* Specialty */}
          <div className="flex-1 text-center sm:text-right space-y-1.5 border-t sm:border-t-0 sm:border-l border-border pt-4 sm:pt-0 sm:pl-6">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Especialidad principal
            </p>
            <h3 className="text-lg font-black text-foreground tracking-tight">
              {primarySpecialty}
            </h3>
            <p className="text-[10px] text-muted-foreground">
              Tu perfil tiene alta coincidencia con este cluster.
            </p>
            <div className="flex flex-wrap justify-center sm:justify-end gap-1.5 mt-2">
              {secondaryAffinities.map((aff) => (
                <span
                  key={aff.name}
                  className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-secondary text-foreground"
                >
                  {aff.name} {aff.score}%
                </span>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
