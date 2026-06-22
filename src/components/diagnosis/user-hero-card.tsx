'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings2, Loader2, Compass, CheckCircle2, Sparkles, AlertCircle } from 'lucide-react';
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
  className?: string;
}

export function UserHeroCard({
  fullName,
  roleTitle,
  seniority,
  currentScore,
  primarySpecialty,
  totalSkills = 0,
  totalStrengths = 0,
  totalGaps = 0,
  isLoading = false,
  className,
}: UserHeroCardProps) {
  const getScoreState = (score: number) => {
    if (score >= 75)
      return {
        label: 'Alta afinidad',
        color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30',
      };
    if (score >= 50)
      return {
        label: 'Media afinidad',
        color: 'text-amber-500 bg-amber-500/10 border-amber-500/30',
      };
    return {
      label: 'Baja afinidad',
      color: 'text-red-500 bg-red-500/10 border-red-500/30',
    };
  };

  const scoreState = getScoreState(currentScore);

  return (
    <Card
      className={cn(
        'card-glass relative overflow-hidden flex flex-col justify-between h-full p-6 sm:p-8 gap-6',
        className
      )}
    >
      {isLoading && (
        <div className="absolute inset-0 bg-background/60 backdrop-blur-xs z-10 flex flex-col items-center justify-center gap-2">
          <Loader2 className="h-6 w-6 text-primary animate-spin" />
        </div>
      )}

      {/* Top Section: Identity & Specialty Split */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-6 pb-6 border-b border-border/40">
        
        {/* Left Side: User Identity */}
        <div className="flex justify-between items-start gap-4 w-full md:w-auto flex-1">
          <div className="space-y-2.5 min-w-0">
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-foreground truncate">
              {fullName}
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-xs text-muted-foreground font-bold leading-none">
                {roleTitle || 'Sin rol especificado'}
              </p>
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-extrabold font-mono bg-primary/10 text-primary uppercase">
                {seniority}
              </span>
            </div>
          </div>
          <div className="shrink-0 md:ml-4">
            <Link href="/profile">
              <Button
                variant="ghost"
                size="sm"
                className="text-primary hover:bg-primary/10 text-[10px] h-7 cursor-pointer gap-1.5 px-2.5 font-bold"
              >
                <Settings2 className="w-3.5 h-3.5" />
                Ajustar
              </Button>
            </Link>
          </div>
        </div>

        {/* Right Side: Specialty Target & Affinity Score */}
        <div className="flex flex-col gap-2 w-full md:w-auto shrink-0 md:items-end">
          <div className="flex items-center gap-2 md:justify-end">
            <div className="p-1.5 rounded-full bg-primary/10 flex items-center justify-center">
              <Compass className="w-4 h-4 text-primary" />
            </div>
            <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest">
              Especialidad Objetivo
            </p>
          </div>

          <div className="space-y-1 md:text-right">
            <p className="text-base sm:text-lg font-black text-foreground tracking-tight truncate leading-tight max-w-[280px]">
              {primarySpecialty}
            </p>
            
            <div className="flex items-baseline gap-3 mt-1.5 md:justify-end">
              <span className="text-4xl sm:text-5xl font-black text-foreground tracking-tighter leading-none">
                {currentScore}%
              </span>
              <span
                className={cn(
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black border shrink-0',
                  scoreState.color
                )}
              >
                {scoreState.label}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Section: Indicadores Clave */}
      <div className="flex flex-col gap-4">
        <div className="space-y-0.5">
          <h3 className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest">
            Indicadores Clave
          </h3>
          <p className="text-xs text-muted-foreground leading-normal">
            Resumen del análisis técnico de tu perfil profesional frente a la especialidad objetivo.
          </p>
        </div>

        {/* Grid for key indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-1">
          {/* Habilidades */}
          <div className="flex items-center gap-3 p-4 rounded-xl bg-secondary/15 border border-border/30 hover:border-emerald-500/20 hover:bg-secondary/25 transition-all">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[9px] font-extrabold text-muted-foreground uppercase tracking-wider block">
                Habilidades
              </span>
              <span className="text-sm font-black text-foreground block truncate">
                {totalSkills} Detectadas
              </span>
            </div>
          </div>

          {/* Fortalezas */}
          <div className="flex items-center gap-3 p-4 rounded-xl bg-secondary/15 border border-border/30 hover:border-yellow-500/20 hover:bg-secondary/25 transition-all">
            <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-500 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[9px] font-extrabold text-muted-foreground uppercase tracking-wider block">
                Fortalezas
              </span>
              <span className="text-sm font-black text-foreground block truncate">
                {totalStrengths} Principales
              </span>
            </div>
          </div>

          {/* Brechas */}
          <div className="flex items-center gap-3 p-4 rounded-xl bg-secondary/15 border border-border/30 hover:border-red-500/20 hover:bg-secondary/25 transition-all">
            <div className="p-2 rounded-lg bg-red-500/10 text-red-500 shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[9px] font-extrabold text-muted-foreground uppercase tracking-wider block">
                Brechas
              </span>
              <span className="text-sm font-black text-foreground block truncate">
                {totalGaps} Por Cubrir
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
