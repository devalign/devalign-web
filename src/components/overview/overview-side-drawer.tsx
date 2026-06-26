'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ChevronRight,
  ChevronLeft,
  Settings2,
  Compass,
  ChevronDown,
  ChevronUp,
  Network,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { AffinityRadarChart } from '@/components/diagnosis/affinity-radar-chart';
import { cn } from '@/lib/utils';

export type FilterMode = 'all' | 'strengths' | 'gaps';

interface OverviewSideDrawerProps {
  domainAffinities: any[];
  techSkills: string[];
  fullName: string;
  roleTitle: string;
  seniority: string;
  alignmentScore?: number;
  primarySpecialty?: string;
  isLoading?: boolean;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  activeFilter?: FilterMode;
  onFilterChange?: (filter: FilterMode) => void;
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
  isOpen,
  onOpenChange,
  activeFilter,
  onFilterChange,
}: OverviewSideDrawerProps) {
  const getScoreState = (score: number) => {
    if (score >= 75)
      return {
        label: 'Alta afinidad',
        color: 'text-success bg-success/10 border-success/35 hover:bg-success/10',
      };
    if (score >= 50)
      return {
        label: 'Media afinidad',
        color: 'text-warning bg-warning/10 border-warning/35 hover:bg-warning/10',
      };
    return {
      label: 'Baja afinidad',
      color:
        'text-red-600 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-500/10 dark:border-red-500/20 hover:bg-red-50 dark:hover:bg-red-500/10',
    };
  };

  const scoreState = alignmentScore !== undefined ? getScoreState(alignmentScore) : null;

  return (
    <>
      {/* UNIFIED VERTICAL COLLAPSING CARD */}
      <div className="flex pointer-events-auto w-full">
        <Card className="overflow-hidden py-0 flex flex-col w-full card-glass! rounded-t-3xl lg:rounded-2xl border border-x border-b-0 lg:border border-border/30 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_-10px_40px_rgba(0,0,0,0.4)] transition-all duration-300 ease-in-out">
          {/* Header (Mini Card) - Always visible, acts as toggle */}
          <div
            className="flex flex-col cursor-pointer p-4 pb-3 border-b border-border/10 hover:bg-muted/30 transition-colors rounded-t-3xl lg:rounded-t-2xl"
            onClick={() => onOpenChange(!isOpen)}
          >
            {/* Handle */}
            <div className="flex justify-center mb-3">
              <div className="w-12 h-1.5 rounded-full bg-muted-foreground/30" />
            </div>

            {/* Summary Info */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5 text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider mb-1.5">
                  <Compass className="w-3.5 h-3.5 text-info" />
                  <span className="truncate">{primarySpecialty || 'Especialidad'}</span>
                </div>
                {scoreState && (
                  <Badge
                    variant="outline"
                    className={cn(
                      'text-[10px] font-bold px-2 py-0.5 w-fit border-border/30',
                      scoreState.color,
                    )}
                  >
                    {scoreState.label}
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-3xl font-black text-foreground tracking-tighter">
                  {alignmentScore !== undefined ? `${alignmentScore}%` : '--'}
                </span>
              </div>
            </div>

            {/* Segmented Filter Control Row */}
            {activeFilter && onFilterChange && (
              <div
                className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-border/10"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex bg-muted/65 p-0.5 rounded-lg border border-border/20 flex-1">
                  {[
                    { id: 'all' as FilterMode, label: 'Todo', icon: Network },
                    { id: 'strengths' as FilterMode, label: 'Fortalezas', icon: CheckCircle2 },
                    { id: 'gaps' as FilterMode, label: 'Brechas', icon: AlertCircle },
                  ].map((tab) => {
                    const isActive = activeFilter === tab.id;
                    const TabIcon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => onFilterChange(tab.id)}
                        className={cn(
                          'flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 text-[10px] font-bold rounded-md transition-all cursor-pointer select-none',
                          isActive
                            ? 'bg-background text-foreground shadow-xs'
                            : 'text-muted-foreground/75 hover:text-foreground hover:bg-background/25',
                        )}
                      >
                        <TabIcon
                          className={cn(
                            'w-3 h-3 shrink-0',
                            isActive ? 'text-primary' : 'text-muted-foreground/50',
                          )}
                        />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Toggle button */}
                <button
                  onClick={() => onOpenChange(!isOpen)}
                  className="flex items-center justify-center h-7 w-7 rounded-lg hover:bg-muted text-muted-foreground/80 transition-colors border border-border/10 cursor-pointer shrink-0"
                  title={isOpen ? 'Colapsar panel' : 'Expandir panel'}
                >
                  {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                </button>
              </div>
            )}
          </div>

          {/* Expandable Body */}
          <div
            className={cn(
              'flex flex-col overflow-hidden transition-all duration-300 ease-in-out',
              isOpen ? 'max-h-[60vh] lg:max-h-[70vh] opacity-100' : 'max-h-0 opacity-0',
            )}
          >
            {/* User Info & Adjust */}
            <div className="p-4 flex justify-between items-start gap-4 border-y border-border shrink-0 bg-muted/5">
              <div className="space-y-1 flex-1 min-w-0">
                <h2 className="text-sm font-black tracking-tight text-foreground truncate">
                  {fullName}
                </h2>
                <div className="flex items-center gap-2">
                  <p className="text-[11px] text-muted-foreground font-bold">{roleTitle}</p>
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

            {/* Radar Chart */}
            <div className="flex-1 overflow-y-auto scrollbar-none min-h-[200px] flex flex-col">
              <AffinityRadarChart
                domainAffinities={domainAffinities}
                techSkills={techSkills}
                isLoading={isLoading}
                standalone={false}
              />
            </div>

            {/* Footer */}
            <div className="p-3 border-b border-border/10 bg-muted shrink-0">
              <Link href="/diagnosis" className="block w-full">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-[11px] font-bold h-9 text-muted-foreground hover:text-foreground flex items-center justify-center gap-1.5 transition-all rounded-lg cursor-pointer hover:bg-muted/50"
                >
                  Ver Diagnóstico Completo
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
