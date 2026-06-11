'use client';

import React from 'react';
import { Lightbulb, Loader2 } from 'lucide-react';

interface AiInsightCardProps {
  marketGaps: string[];
  isLoading?: boolean;
}

export function AiInsightCard({ marketGaps, isLoading = false }: AiInsightCardProps) {
  if (marketGaps.length === 0 && !isLoading) return null;

  return (
    <div className="p-3.5 rounded-xl border border-primary/20 bg-primary/5 flex items-start gap-2.5 relative overflow-hidden">
      {isLoading ? (
        <div className="flex items-center gap-2 w-full py-1">
          <Loader2 className="w-4 h-4 text-primary animate-spin" />
          <span className="text-[10px] font-bold font-mono text-muted-foreground animate-pulse">
            Generando recomendación de IA...
          </span>
        </div>
      ) : (
        <>
          <Lightbulb className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="text-[10px] font-bold text-foreground">INSIGHT IA</p>
            <p className="text-[10px] text-muted-foreground leading-normal">
              Fortalecer habilidades clave como <strong>{marketGaps[0] || 'AWS'}</strong> y{' '}
              <strong>{marketGaps[1] || 'Docker'}</strong> podría aumentar tu alineación con el
              mercado en <strong>+18%</strong>.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
