'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings2, Loader2, User, Briefcase, Target, Clock3 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UserHeroCardProps {
  fullName: string;
  roleTitle: string;
  seniority: string;
  currentScore: number;
  primarySpecialty: string;
  totalSkills?: number;
  totalStrengths?: number;
  totalGaps?: number;
  isLoading?: boolean;
  lastAnalysisDate?: string;
  className?: string;
}

export function UserHeroCard({
  fullName,
  roleTitle,
  seniority,
  currentScore,
  primarySpecialty,
  isLoading = false,
  lastAnalysisDate,
  className,
}: UserHeroCardProps) {
  const getScoreState = (score: number) => {
    if (score >= 75)
      return {
        label: 'Alta afinidad',
        color: 'text-success bg-success/10 border-success/30',
      };
    if (score >= 50)
      return {
        label: 'Media afinidad',
        color: 'text-warning bg-warning/10 border-warning/30',
      };
    return {
      label: 'Baja afinidad',
      color: 'text-destructive bg-destructive/10 border-destructive/30',
    };
  };

  const scoreState = getScoreState(currentScore);

  const summaryMessage =
    currentScore >= 75
      ? 'Excelente alineación con el perfil objetivo.'
      : currentScore >= 50
        ? 'Media afinidad — hay oportunidades de mejora.'
        : 'Baja afinidad — se recomienda reforzar habilidades clave.';

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {isLoading && (
        <div className="absolute inset-0 bg-background/60 backdrop-blur-xs z-10 flex flex-col items-center justify-center gap-2">
          <Loader2 className="h-6 w-6 text-primary animate-spin" />
        </div>
      )}

      {/* Four compact blocks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Perfil analizado */}
        <div className="flex items-start gap-2.5 p-3 card-standard!">
          <div className="p-1.5 rounded-lg bg-primary/10 text-primary shrink-0 mt-0.5">
            <User className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <span className="text-[9px] font-extrabold text-muted-foreground uppercase tracking-wider block">
              Perfil analizado
            </span>
            <span className="text-sm font-black text-foreground block truncate">{fullName}</span>
            <span className="text-[10px] text-muted-foreground block truncate">
              {roleTitle || 'Sin rol'} ·{' '}
              <span className="font-semibold text-primary uppercase">{seniority}</span>
            </span>
          </div>
        </div>

        {/* Especialidad analizada */}
        <div className="flex items-start gap-2.5 p-3 card-standard!">
          <div className="p-1.5 rounded-lg bg-primary/10 text-primary shrink-0 mt-0.5">
            <Briefcase className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <span className="text-[9px] font-extrabold text-muted-foreground uppercase tracking-wider block">
              Especialidad analizada
            </span>
            <span className="text-sm font-black text-foreground block truncate">
              {primarySpecialty}
            </span>
          </div>
        </div>

        {/* Afinidad */}
        <div className="flex items-start gap-2.5 p-3 card-standard!">
          <div className="p-1.5 rounded-lg bg-primary/10 text-primary shrink-0 mt-0.5">
            <Target className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <span className="text-[9px] font-extrabold text-muted-foreground uppercase tracking-wider block">
              Afinidad
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-black text-foreground tracking-tight">
                {currentScore}%
              </span>
              <span
                className={cn(
                  'inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black border',
                  scoreState.color,
                )}
              >
                {scoreState.label}
              </span>
            </div>
          </div>
        </div>

        {/* Último análisis */}
        <div className="flex items-start gap-2.5 p-3 card-standard!">
          <div className="p-1.5 rounded-lg bg-info/10 text-info shrink-0 mt-0.5">
            <Clock3 className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <span className="text-[9px] font-extrabold text-muted-foreground uppercase tracking-wider block">
              Último análisis
            </span>
            <span className="text-sm font-black text-foreground block truncate">
              {lastAnalysisDate || 'Recientemente'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
