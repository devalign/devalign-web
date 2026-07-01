'use client';

import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Search, CheckCircle2 } from 'lucide-react';
import { SkillItem } from '@/types';

interface StrengthListItem {
  name: string;
  level: string;
  score: number;
  demandPercentage: number;
  category: string;
  trend?: 'growing' | 'stable' | 'shrinking' | null;
  ict_score?: number;
}

interface StrengthsDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  strengths: StrengthListItem[];
}

export function StrengthsDrawer({ isOpen, onOpenChange, strengths }: StrengthsDrawerProps) {
  const [search, setSearch] = useState('');

  const filteredStrengths = strengths.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md bg-card border-l border-border flex flex-col h-full">
        <SheetHeader className="pb-4">
          <SheetTitle className="flex items-center gap-2 text-success dark:text-success font-bold">
            <CheckCircle2 className="h-5 w-5 text-success" />
            Todas las Fortalezas
          </SheetTitle>
          <SheetDescription className="text-xs text-muted-foreground mt-1">
            Habilidades técnicas en las que demuestras dominio según el análisis de tu CV.
          </SheetDescription>
        </SheetHeader>

        {/* Search bar */}
        <div className="relative my-4">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar fortaleza..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-border bg-secondary/35 text-foreground placeholder-muted-foreground focus:outline-hidden focus:ring-1 focus:ring-primary focus:border-primary"
          />
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 scrollbar-none">
          {filteredStrengths.map((strength, idx) => (
            <div
              key={`${strength.name}-${idx}`}
              className="flex flex-col justify-between p-3 rounded-lg bg-success/5 border border-success/10 transition-colors hover:bg-success/10"
            >
              <div className="flex justify-between items-start gap-1">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs truncate">
                    {strength.name}
                  </span>
                  {strength.trend === 'growing' && (
                    <span className="inline-flex items-center gap-0.5 text-[8px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/25 shrink-0">
                      Creciente
                    </span>
                  )}
                  {strength.trend === 'shrinking' && (
                    <span className="inline-flex items-center gap-0.5 text-[8px] font-bold px-1.5 py-0.2 rounded-full bg-rose-500/10 text-rose-600 border border-rose-500/25 shrink-0">
                      Decreciente
                    </span>
                  )}
                </div>
                <span className="text-[9px] text-success/80 dark:text-success/80 font-bold shrink-0">
                  {strength.demandPercentage}% DEMANDA
                </span>
              </div>
              <div className="flex items-center justify-between mt-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-muted-foreground">{strength.level}</span>
                  {strength.ict_score !== undefined && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/15">
                      ICT {strength.ict_score.toFixed(1)}
                    </span>
                  )}
                </div>
                {strength.category && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-success/10 text-success dark:text-success font-medium">
                    {strength.category === 'hard_skill'
                      ? 'Habilidad'
                      : strength.category === 'tool'
                        ? 'Herramienta'
                        : strength.category === 'methodology'
                          ? 'Metodología'
                          : strength.category}
                  </span>
                )}
              </div>
            </div>
          ))}
          {filteredStrengths.length === 0 && (
            <p className="text-center text-xs text-muted-foreground py-8">
              No se encontraron fortalezas con ese nombre.
            </p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
