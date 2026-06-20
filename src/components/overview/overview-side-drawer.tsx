'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, ChevronLeft, Settings2, Compass, Map } from 'lucide-react';
import { AffinityRadarChart } from '@/components/diagnosis/affinity-radar-chart';

interface OverviewSideDrawerProps {
  domainAffinities: any[];
  techSkills: string[];
  fullName: string;
  roleTitle: string;
  seniority: string;
  alignmentScore?: number;
  primarySpecialty?: string;
  isLoading?: boolean;
}

export function OverviewSideDrawer({
  domainAffinities,
  techSkills,
  fullName,
  roleTitle,
  seniority,
  alignmentScore,
  primarySpecialty,
  isLoading = false,
}: OverviewSideDrawerProps) {
  const [isOpen, setIsOpen] = useState(true);

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

  const scoreState = alignmentScore !== undefined ? getScoreState(alignmentScore) : null;

  return (
    <div className="relative flex h-full pointer-events-auto items-center justify-end">
      {/* Collapse/Expand Toggle Tab */}
      <div
        className={`absolute top-1/2 -translate-y-1/2 z-10 transition-all duration-300 ${
          isOpen ? '-left-4' : '-left-10'
        }`}
      >
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className="h-8 w-8 rounded-full border border-border/40 bg-background/80 backdrop-blur-xl hover:bg-background/90 transition-all shadow-md pointer-events-auto cursor-pointer"
        >
          {isOpen ? (
            <ChevronRight className="h-4 w-4 text-foreground" />
          ) : (
            <ChevronLeft className="h-4 w-4 text-foreground" />
          )}
        </Button>
      </div>

      {/* Drawer content panel */}
      <div
        className={`transition-all duration-300 ease-in-out h-full overflow-hidden flex justify-end ${
          isOpen ? 'w-96 opacity-100' : 'w-0 opacity-0'
        }`}
      >
        <div className="w-96 shrink-0 h-full flex bg-transparent">
          <div className="flex-1 w-full h-full">
            <Card className="card-glass! relative overflow-hidden flex flex-col h-full gap-0 py-0">
              {/* Cabecera Perfil */}
              <div className="p-5 pb-3 flex justify-between items-start gap-4 border-b border-border/50 shrink-0">
                <div className="space-y-1 flex-1 min-w-0">
                  <h2 className="text-xl font-black tracking-tight text-foreground truncate">
                    {fullName}
                  </h2>
                  <div className="flex items-center gap-2">
                    <p className="text-[11px] text-muted-foreground font-bold leading-relaxed">
                      {roleTitle}
                    </p>
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[9px] font-bold font-mono bg-primary/10 text-primary uppercase">
                      {seniority}
                    </span>
                  </div>
                </div>

                <div className="shrink-0">
                  <Link href="/profile">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-primary hover:bg-primary/10 text-[10px] h-7 cursor-pointer gap-1 px-2"
                    >
                      <Settings2 className="w-3 h-3" />
                      Ajustar
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Especialidad Objetivo */}
              {alignmentScore !== undefined && primarySpecialty && (
                <div className="p-5 py-4 border-b border-border/50 bg-secondary/5 space-y-3 shrink-0">
                  <div className="flex items-center gap-2 text-[9px] font-extrabold text-muted-foreground uppercase tracking-wider">
                    <div className="p-1 rounded-md bg-indigo-500/10">
                      <Compass className="w-3.5 h-3.5 text-indigo-500" />
                    </div>
                    Especialidad Objetivo
                  </div>
                  <h3 className="text-sm font-bold text-foreground">{primarySpecialty}</h3>
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl font-black text-foreground tracking-tight">
                      {alignmentScore}%
                    </span>
                    {scoreState && (
                      <Badge
                        variant="outline"
                        className={`text-[9px] font-bold px-1.5 py-0.5 border ${scoreState.color}`}
                      >
                        {scoreState.label}
                      </Badge>
                    )}
                  </div>
                  <Link
                    href={`/dashboard/action-plan?cluster=${encodeURIComponent(primarySpecialty)}`}
                    className="block w-full"
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-[10px] font-bold h-8 bg-primary/5 text-primary border border-primary/20 hover:bg-primary/10 flex items-center justify-center gap-1.5 transition-all rounded-lg cursor-pointer"
                    >
                      <Map className="h-3 w-3" />
                      Ver Plan de Acción
                    </Button>
                  </Link>
                </div>
              )}

              {/* Decoupled Radar Chart (Scrollable content) */}
              <div className="flex-1 overflow-y-auto scrollbar-none flex flex-col min-h-0">
                <AffinityRadarChart
                  domainAffinities={domainAffinities}
                  techSkills={techSkills}
                  isLoading={isLoading}
                  standalone={false}
                />
              </div>

              {/* Footer: Ver Diagnóstico Completo */}
              <div className="p-3 border-t border-border/50 bg-muted/20 shrink-0">
                <Link href="/dashboard" className="block w-full">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-[10px] font-bold h-8 text-muted-foreground hover:text-foreground flex items-center justify-center gap-1.5 transition-all rounded-lg cursor-pointer hover:bg-muted/50"
                  >
                    Ver Diagnóstico Completo
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
