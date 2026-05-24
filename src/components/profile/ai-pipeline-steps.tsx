'use client';

import React from 'react';
import { FileSearch, BarChart3, Target, GitFork, ChevronRight } from 'lucide-react';

export default function AIPipelineSteps() {
  const steps = [
    {
      num: 1,
      title: '1. Extrae tus habilidades',
      desc: 'Detectamos competencias técnicas y experiencias clave.',
      icon: FileSearch,
      color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400',
    },
    {
      num: 2,
      title: '2. Compara con el mercado',
      desc: 'Analizamos miles de ofertas laborales del sector IT.',
      icon: BarChart3,
      color: 'bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400',
    },
    {
      num: 3,
      title: '3. Identifica brechas',
      desc: 'Detectamos las habilidades que te faltan para destacar.',
      icon: Target,
      color: 'bg-purple-50 text-purple-700 dark:bg-purple-950/20 dark:text-purple-400',
    },
    {
      num: 4,
      title: '4. Genera tu roadmap',
      desc: 'Creamos una ruta personalizada de aprendizaje con IA.',
      icon: GitFork,
      color: 'bg-sage-50 text-primary-foreground dark:bg-primary/10 dark:text-primary',
    },
  ];

  return (
    <div className="rounded-2xl border border-border bg-card p-6 md:p-8 space-y-6">
      <h3 className="text-sm font-bold text-foreground tracking-tight">
        ¿Qué hará la IA con tu CV?
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-4 xl:grid-cols-7 gap-6 md:gap-4 items-start relative">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <React.Fragment key={step.num}>
              {/* Step Card */}
              <div className="flex flex-col items-center text-center space-y-3 relative group">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${step.color} shadow-sm group-hover:scale-105 transition-transform duration-200`}
                >
                  <Icon className="h-5 w-5" />
                </div>

                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-foreground">{step.title}</h4>
                  <p className="text-[11px] text-muted-foreground leading-relaxed max-w-[180px] mx-auto">
                    {step.desc}
                  </p>
                </div>
              </div>

              {/* Arrow Connector between steps */}
              {idx < steps.length - 1 && (
                <div className="hidden md:flex h-12 items-center justify-center text-muted-foreground/30 self-start pt-3">
                  <ChevronRight className="h-4 w-4" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
