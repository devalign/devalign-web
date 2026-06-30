'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Map } from 'lucide-react';

interface MarketScoreCardProps {
  currentScore: number;
  primarySpecialty?: string;
  isLoading?: boolean;
  onViewRoadmap?: () => void;
}

export function MarketScoreCard({
  currentScore,
  primarySpecialty = 'Data Engineering',
  isLoading = false,
  onViewRoadmap,
}: MarketScoreCardProps) {
  const getScoreState = (score: number) => {
    if (score >= 75)
      return {
        label: 'Alta afinidad',
        color: 'text-success bg-success/10 border-success/35',
      };
    if (score >= 50)
      return {
        label: 'Media afinidad',
        color: 'text-warning bg-warning/10 border-warning/35',
      };
    return {
      label: 'Baja afinidad',
      color: 'text-destructive bg-destructive/10 border-destructive/35',
    };
  };

  const scoreState = getScoreState(currentScore);

  return (
    <Card className="card-standard relative overflow-hidden flex flex-col h-full">
      {isLoading && (
        <div className="absolute inset-0 bg-background/60 backdrop-blur-xs z-10 flex flex-col items-center justify-center gap-2">
          <Loader2 className="h-6 w-6 text-primary animate-spin" />
          <p className="text-[9px] font-bold font-mono text-muted-foreground animate-pulse">
            Calibrando alineación...
          </p>
        </div>
      )}

      <CardContent className="py-6 flex-1 flex flex-col justify-center">
        <div className="flex flex-col sm:flex-row items-stretch justify-between gap-6">
          {/* Left Side: Score & Affinity State */}
          <div className="flex flex-col justify-center text-center sm:text-left space-y-3 sm:pr-6 sm:max-w-[220px] shrink-0">
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Alineación con el mercado
              </p>
              <div className="flex items-baseline justify-center sm:justify-start gap-1 mt-1">
                <span className="text-5xl font-black text-foreground tracking-tight">
                  {currentScore}%
                </span>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${scoreState.color}`}
              >
                {scoreState.label}
              </span>
            </div>
          </div>

          {/* Right Side: Specialty Evaluation & Button */}
          <div className="flex-1 text-center sm:text-right space-y-4 border-t sm:border-t-0 sm:border-l border-border pt-6 sm:pt-0 sm:pl-6 flex flex-col justify-between">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Especialidad Evaluada
              </p>
              <h3 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                {primarySpecialty}
              </h3>
            </div>

            {onViewRoadmap && (
              <div className="flex justify-center sm:justify-end pt-1">
                <Button
                  variant="default"
                  size="sm"
                  onClick={onViewRoadmap}
                  className="text-[10px] font-bold h-7 flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Map className="h-3 w-3" />
                  Ver Plan
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
