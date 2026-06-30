'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Briefcase, Target, Clock3, Award, FileText, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface ClusterHeaderCardProps {
  primarySpecialty: string;
  currentScore: number;
  lastAnalysisDate?: string;
  jobOfferCount?: number;
  marketPercent?: number;
  topSkills?: string[];
  isLoading?: boolean;
  className?: string;
}

export function ClusterHeaderCard({
  primarySpecialty,
  currentScore,
  lastAnalysisDate = 'Recientemente',
  jobOfferCount = 0,
  marketPercent = 0,
  topSkills = [],
  isLoading = false,
  className,
}: ClusterHeaderCardProps) {
  const getScoreState = (score: number) => {
    if (score >= 75)
      return {
        label: 'Alta afinidad',
        color: 'text-success bg-success/10 border-success/30 dark:border-success/20',
      };
    if (score >= 50)
      return {
        label: 'Media afinidad',
        color: 'text-warning bg-warning/10 border-warning/30 dark:border-warning/20',
      };
    return {
      label: 'Baja afinidad',
      color: 'text-destructive bg-destructive/10 border-destructive/30 dark:border-destructive/20',
    };
  };

  const scoreState = getScoreState(currentScore);

  return (
    <Card
      className={cn('relative overflow-hidden p-5 card-standard flex flex-col gap-4', className)}
    >
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        {/* Left Side: Specialty Info & Stats */}
        <div className="space-y-2.5 flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-primary/10 text-primary shrink-0">
              <Briefcase className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest block">
              Especialidad Analizada
            </span>
          </div>
          <h2 className="text-sm font-semibold text-foreground tracking-tight truncate leading-none">
            Clúster de {primarySpecialty}
          </h2>
        </div>

        {/* Right Side: Score & Date Blocks */}
        <div className="flex flex-wrap gap-3 shrink-0">
          {/* Affinity block */}
          <div className="flex items-center gap-2.5 p-2 px-3.5 rounded-xl border border-border/40 bg-secondary/10 min-w-[140px]">
            <div className="p-1.5 rounded-lg bg-primary/10 text-primary shrink-0">
              <Target className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[8px] font-extrabold text-muted-foreground uppercase tracking-wider block">
                Afinidad
              </span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-base font-black text-foreground tracking-tight tabular-nums">
                  {currentScore}%
                </span>
                <span
                  className={cn(
                    'inline-flex items-center px-1.5 py-0.5 rounded-md text-[8px] font-extrabold border leading-none',
                    scoreState.color,
                  )}
                >
                  {scoreState.label.split(' ')[0]}
                </span>
              </div>
            </div>
          </div>

          {/* Market Share block */}
          {marketPercent > 0 && (
            <div className="flex items-center gap-2.5 p-2 px-3.5 rounded-xl border border-border/40 bg-secondary/10 min-w-[140px]">
              <div className="p-1.5 rounded-lg bg-success/10 text-success shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[8px] font-extrabold text-muted-foreground uppercase tracking-wider block">
                  Cuota de mercado
                </span>
                <span className="text-xs font-black text-foreground block truncate mt-0.5">
                  {marketPercent}%{' '}
                  <span className="text-[10px] font-medium text-muted-foreground ml-0.5">
                    de ofertas
                  </span>
                </span>
              </div>
            </div>
          )}

          {/* Last analysis block */}
          <div className="flex items-center gap-2.5 p-2 px-3.5 rounded-xl border border-border/40 bg-secondary/10 min-w-[140px]">
            <div className="p-1.5 rounded-lg bg-info/10 text-info shrink-0">
              <Clock3 className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[8px] font-extrabold text-muted-foreground uppercase tracking-wider block">
                Último análisis
              </span>
              <span className="text-xs font-black text-foreground block truncate mt-0.5">
                {lastAnalysisDate}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Area: Core Skills badges */}
      {topSkills && topSkills.length > 0 && (
        <div className="border-t border-border/40 pt-3 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="flex flex-col gap-2 flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <span className="text-[8px] font-extrabold text-muted-foreground uppercase tracking-widest block">
                Habilidades Nucleares Demandadas
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {topSkills.map((skill) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="px-2 py-0.5 rounded-md text-[9px] font-extrabold bg-secondary border border-border/40 text-muted-foreground hover:text-primary hover:border-primary/20 transition-all cursor-default"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
          <Link
            href="/market"
            className="text-[10px] font-bold text-primary hover:underline shrink-0 flex items-center gap-1 mt-2 sm:mt-0"
          >
            Explorar otros clústers <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
      )}
    </Card>
  );
}
