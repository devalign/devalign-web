import React from 'react';
import { Clock } from 'lucide-react';

export function DiagnosisHeader() {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          Diagnóstico Inteligente
          <span className="text-emerald-500">✨</span>
        </h1>
        <p className="text-muted-foreground mt-1">
          Análisis automático de tu perfil vs. demanda del mercado IT.
        </p>
      </div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">
        <Clock className="w-4 h-4" />
        <span>Último análisis: 12 May 2026 - 10:45 AM</span>
      </div>
    </div>
  );
}
