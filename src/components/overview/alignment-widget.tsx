'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Map, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface AlignmentWidgetProps {
  currentScore: number;
  primarySpecialty?: string;
  isLoading?: boolean;
}

export function AlignmentWidget({
  currentScore,
  primarySpecialty = 'Data Science Analyst',
  isLoading = false,
}: AlignmentWidgetProps) {
  const getScoreState = (score: number) => {
    if (score >= 75)
      return {
        label: 'Alta afinidad',
        color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/35 hover:bg-emerald-500/10',
      };
    if (score >= 50)
      return {
        label: 'Media afinidad',
        color: 'text-amber-500 bg-amber-500/10 border-amber-500/35 hover:bg-amber-500/10',
      };
    return {
      label: 'Baja afinidad',
      color: 'text-red-500 bg-red-500/10 border-red-500/35 hover:bg-red-500/10',
    };
  };

  const scoreState = getScoreState(currentScore);

  return (
    <div className="relative overflow-hidden bg-background/60 backdrop-blur-xl border border-border/40 rounded-2xl p-4 shadow-xl flex items-center justify-between gap-4 pointer-events-auto w-full">
      {isLoading && (
        <div className="absolute inset-0 bg-background/60 backdrop-blur-xs z-10 flex items-center justify-center gap-2">
          <Loader2 className="h-4 w-4 text-indigo-500 animate-spin" />
        </div>
      )}

      {/* Left Circle/Score */}
      <div className="flex flex-col items-end justify-center shrink-0">
        <span className="text-3xl font-black text-foreground tracking-tight">{currentScore}%</span>
        <Badge
          variant="outline"
          className={`text-[9px] font-bold px-1.5 py-0.5 mt-1 border ${scoreState.color}`}
        >
          {scoreState.label}
        </Badge>
      </div>

      {/* Right Info & Action */}
      <div className="flex-1 min-w-0 space-y-1.5 text-left">
        <div>
          <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
            Especialidad
          </p>
          <h4
            className="text-xs font-bold text-foreground truncate max-w-[180px]"
            title={primarySpecialty}
          >
            {primarySpecialty}
          </h4>
        </div>

        <Link href={`/dashboard/action-plan?cluster=${encodeURIComponent(primarySpecialty)}`}>
          <Button
            variant="ghost"
            size="sm"
            className="text-[9px] font-bold h-6 py-0.5 px-2 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1 transition-all rounded-lg mt-1"
          >
            <Map className="h-2.5 w-2.5" />
            Ver Plan de Acción
          </Button>
        </Link>
      </div>
    </div>
  );
}
