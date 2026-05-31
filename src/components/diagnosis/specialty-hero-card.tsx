import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DiagnosisResult } from './types';

interface Props {
  data: DiagnosisResult;
}

export function SpecialtyHeroCard({ data }: Props) {
  return (
    <div className="relative overflow-hidden rounded-[2rem] bg-white/60 dark:bg-slate-950/50 backdrop-blur-xl text-foreground dark:text-white p-8 mb-6 border border-white/80 dark:border-slate-800/60 shadow-xl shadow-primary/5 dark:shadow-none">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 dark:bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/50 dark:bg-secondary/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      
      <div className="relative z-10 flex flex-col lg:flex-row gap-8 items-start lg:items-center justify-between">
        <div className="flex-1 space-y-6">
          <div>
            <h3 className="text-xs font-bold tracking-widest text-primary uppercase mb-2">
              Especialidad detectada (Principal)
            </h3>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-3xl font-bold">{data.detectedSpecialty}</h2>
              <span className="px-2.5 py-1 text-xs font-semibold bg-primary/20 text-primary rounded-full border border-primary/30">
                Alta afinidad
              </span>
            </div>
            <p className="text-muted-foreground/90 dark:text-slate-400 mt-2 text-sm">
              Tu perfil tiene alta coincidencia con este cluster del mercado.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold tracking-widest text-muted-foreground/90 dark:text-slate-400 uppercase mb-3">
              Afinidades Secundarias
            </h4>
            <div className="flex flex-wrap gap-2">
              {data.secondaryAffinities.map((aff) => (
                <div key={aff.name} className="px-4 py-1.5 bg-secondary/40 dark:bg-slate-800 text-foreground dark:text-white rounded-full text-sm font-medium border border-border dark:border-slate-700">
                  {aff.name} {aff.percentage}%
                </div>
              ))}
              <Button variant="outline" className="h-[34px] rounded-full border-border dark:border-slate-700 bg-transparent hover:bg-secondary/50 dark:hover:bg-slate-800 hover:text-foreground dark:hover:text-white text-muted-foreground dark:text-slate-300">
                + Explorar más
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-shrink-0 flex flex-col items-start lg:items-end gap-6 w-full lg:w-auto">
          <div className="text-left lg:text-right w-full lg:w-auto">
            <h3 className="text-xs font-bold tracking-widest text-muted-foreground/90 dark:text-slate-400 uppercase mb-2">
              Alineación con el mercado
            </h3>
            <div className="text-5xl font-bold mb-2">{data.alignmentPercentage}%</div>
            
            {/* Simple progress bar */}
            <div className="w-full lg:w-48 h-2 bg-secondary/50 dark:bg-slate-800 rounded-full overflow-hidden mb-2">
              <div 
                className="h-full bg-primary rounded-full" 
                style={{ width: `${data.alignmentPercentage}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground/90 dark:text-slate-400 flex items-center justify-start lg:justify-end gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              Estás por encima del 68% de los perfiles analizados
            </p>
          </div>

          <Button className="w-full lg:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl h-12 px-6 gap-2 border-none">
            Obtén tu ruta personalizada basada en las brechas detectadas
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
