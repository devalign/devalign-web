'use client';

import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Sparkles, TrendingUp, CheckCircle2, Lightbulb } from 'lucide-react';

interface RoadmapStep {
  skill: string;
  impact: string;
  topics: string[];
  justification: string;
  rule: string;
  trendData: number[];
}

interface StepDetailsDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  step: RoadmapStep | null;
}

export function StepDetailsDrawer({ isOpen, onOpenChange, step }: StepDetailsDrawerProps) {
  if (!step) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md bg-card border-l border-border flex flex-col h-full overflow-y-auto">
        <SheetHeader className="pb-4 border-b border-border/60">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-primary/10 text-primary border border-primary/20">
              <Sparkles className="w-2.5 h-2.5" />
              Detalle de Habilidad
            </span>
          </div>
          <SheetTitle className="text-lg font-extrabold text-foreground">
            Cerrar brecha: {step.skill}
          </SheetTitle>
          <SheetDescription className="text-xs text-muted-foreground">
            Justificación técnica y temas sugeridos de estudio.
          </SheetDescription>
        </SheetHeader>

        {/* Content */}
        <div className="flex-1 py-4 space-y-5">
          {/* Impact and Association rule */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-success/5 border border-success/15">
              <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider block">
                Impacto Estimado
              </span>
              <span className="text-sm font-black text-success mt-0.5 block">{step.impact}</span>
            </div>
            <div className="p-3 rounded-lg bg-primary/5 border border-primary/15">
              <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider block">
                Regla de Asociación
              </span>
              <span className="text-[9px] font-bold text-primary mt-0.5 block truncate" title={step.rule}>
                {step.rule}
              </span>
            </div>
          </div>

          {/* Justificación */}
          <div className="space-y-1.5">
            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">
              Justificación de Mercado
            </span>
            <p className="text-xs text-foreground leading-relaxed bg-secondary/25 p-3 rounded-lg border border-border/40">
              {step.justification}
            </p>
          </div>

          {/* Temas Sugeridos */}
          <div className="space-y-2">
            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">
              Temario Sugerido de Estudio
            </span>
            <div className="space-y-1.5">
              {step.topics.map((topic, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2 rounded-md bg-secondary/15 border border-border/30 text-xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span className="font-semibold text-foreground">{topic}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tendencias */}
          <div className="space-y-2.5">
            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">
              Tendencia de Demanda (Últimos 6 meses)
            </span>
            <div className="p-3 rounded-lg border border-border/60 bg-secondary/10 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                <span className="font-semibold text-foreground">Alineado al mercado</span>
              </div>
              <span className="text-xs font-black text-primary">
                {step.trendData[step.trendData.length - 1]}% frecuencia
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-border/60 mt-auto">
          <Button
            onClick={() => onOpenChange(false)}
            className="w-full text-xs font-bold cursor-pointer"
          >
            Entendido
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
