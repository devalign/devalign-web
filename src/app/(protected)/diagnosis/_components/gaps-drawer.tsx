'use client';

import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Search, AlertCircle } from 'lucide-react';
import { SkillItem } from '@/types';

interface GapListItem {
  name: string;
  skill_type: string;
  market_importance: string;
  market_demand_percentage: number;
  trend?: 'growing' | 'stable' | 'shrinking' | null;
}

interface GapsDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  gaps: GapListItem[];
}

export function GapsDrawer({ isOpen, onOpenChange, gaps }: GapsDrawerProps) {
  const [search, setSearch] = useState('');

  const filteredGaps = gaps.filter((g) =>
    g.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md bg-card border-l border-border flex flex-col h-full">
        <SheetHeader className="pb-4">
          <SheetTitle className="flex items-center gap-2 text-destructive dark:text-destructive font-bold">
            <AlertCircle className="h-5 w-5 text-destructive" />
            Brechas Prioritarias
          </SheetTitle>
          <SheetDescription className="text-xs text-muted-foreground mt-1">
            Habilidades recomendadas para aumentar tu alineación técnica y compatibilidad en el mercado.
          </SheetDescription>
        </SheetHeader>

        {/* Search bar */}
        <div className="relative my-4">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar brecha..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-border bg-secondary/35 text-foreground placeholder-muted-foreground focus:outline-hidden focus:ring-1 focus:ring-primary focus:border-primary"
          />
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 scrollbar-none">
          {filteredGaps.map((gap) => {
            const crit = gap.market_importance || 'medium';
            const demand = gap.market_demand_percentage || 50;
            const borderClass =
              crit === 'critical'
                ? 'border-destructive/30 bg-destructive/5 hover:border-destructive/50 hover:bg-destructive/10'
                : 'border-warning/30 bg-warning/5 hover:border-amber-500/50 hover:bg-warning/10';
            const textClass =
              crit === 'critical'
                ? 'text-destructive dark:text-destructive'
                : 'text-warning dark:text-warning';
            const critLabel =
              crit === 'critical'
                ? 'Crítica'
                : crit === 'high'
                  ? 'Alta'
                  : crit === 'medium'
                    ? 'Media'
                    : crit;
            const tagClass =
              crit === 'critical'
                ? 'bg-destructive/10 text-destructive dark:text-destructive'
                : 'bg-warning/10 text-warning dark:text-warning';

            return (
              <div
                key={gap.name}
                className={`flex flex-col justify-between p-3 rounded-lg border border-dashed transition-colors ${borderClass}`}
              >
                <div className="flex justify-between items-start gap-1">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs truncate">
                      {gap.name}
                    </span>
                    {gap.trend === 'growing' && (
                      <span className="inline-flex items-center gap-0.5 text-[8px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/25 shrink-0">
                        Creciente
                      </span>
                    )}
                    {gap.trend === 'shrinking' && (
                      <span className="inline-flex items-center gap-0.5 text-[8px] font-bold px-1.5 py-0.2 rounded-full bg-rose-500/10 text-rose-600 border border-rose-500/25 shrink-0">
                        Decreciente
                      </span>
                    )}
                  </div>
                  <span className={`text-[9px] font-bold shrink-0 ${textClass} opacity-80`}>
                    {demand}% DEMANDA
                  </span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className={`text-[10px] font-medium ${textClass}`}>{critLabel}</span>
                  {gap.skill_type && (
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${tagClass}`}
                    >
                      {gap.skill_type === 'hard_skill'
                        ? 'Habilidad'
                        : gap.skill_type === 'tool'
                          ? 'Herramienta'
                          : gap.skill_type === 'methodology'
                            ? 'Metodología'
                            : gap.skill_type}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
          {filteredGaps.length === 0 && (
            <p className="text-center text-xs text-muted-foreground py-8">
              No se encontraron brechas con ese nombre.
            </p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
