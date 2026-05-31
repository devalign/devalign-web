'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, ArrowRight } from 'lucide-react';
import { SkillStrength } from './types';
import { cn } from '@/lib/utils';

interface Props {
  strengths: SkillStrength[];
  total: number;
  isEmpty?: boolean;
}

export function StrengthsCard({ strengths, total, isEmpty = false }: Props) {
  return (
    <Card className="border-border bg-card h-full flex flex-col justify-between">
      <div>
        <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-xs font-bold text-muted-foreground flex items-center gap-2 tracking-wider uppercase">
            <Check className="h-4 w-4 text-primary" />
            Fortalezas Detectadas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-col gap-3">
            {isEmpty ? null : (
              strengths.map((skill) => (
                <div
                  key={skill.name}
                  className="p-3 rounded-xl border border-border bg-card flex items-center justify-between gap-2 transition-all hover:bg-muted/5"
                >
                  <div className="space-y-0.5 min-w-0">
                    <p
                      className="text-xs font-semibold text-foreground truncate"
                      title={skill.name}
                    >
                      {skill.name}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {skill.level}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-primary">
                      {skill.demandPercentage ?? (skill.score * 20)}%
                    </span>
                    <span className="text-[9px] text-muted-foreground block uppercase tracking-wider font-semibold">
                      Demanda
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </div>
      <div className="px-6 pb-6 pt-2">
        <button 
          disabled={isEmpty} 
          className={cn(
            "flex items-center gap-2 text-xs font-bold transition-colors",
            isEmpty 
              ? "text-muted-foreground/45 cursor-not-allowed select-none" 
              : "text-muted-foreground hover:text-foreground cursor-pointer"
          )}
        >
          Ver todas las skills ({isEmpty ? 0 : total})
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </Card>
  );
}
