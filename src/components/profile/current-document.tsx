'use client';

import React from 'react';
import { useUserCVs } from '@/hooks/use-user-cvs';
import { FileText, HardDrive, Download, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';


export default function CurrentDocument() {
  const { data: cvData, isLoading } = useUserCVs();

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-border bg-card p-5 animate-pulse">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-muted" />
          <div className="flex-1 space-y-2">
            <div className="h-3.5 w-1/3 rounded bg-muted animate-pulse" />
            <div className="h-3 w-1/2 rounded bg-muted animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  const currentCV = cvData?.cvs?.[0];

  if (!currentCV) return null;

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
          CV Activo
        </h4>
        <div className="flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/10 px-2 py-0.5 rounded-full">
          <ShieldCheck className="h-3.5 w-3.5" />
          Analizado
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="rounded-xl bg-red-50 p-2.5 text-red-500 shrink-0 dark:bg-red-950/30">
            <FileText className="h-5 w-5" />
          </div>
          <div className="space-y-0.5 min-w-0">
            <p className="text-sm font-semibold text-foreground truncate max-w-[200px] sm:max-w-xs md:max-w-md" title={currentCV.original_filename}>
              {currentCV.original_filename}
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
              <span className="flex items-center gap-1 shrink-0">
                <HardDrive className="h-3.5 w-3.5 text-muted-foreground/60" />
                {(currentCV.size_bytes / 1024 / 1024).toFixed(2)} MB
              </span>
              <span>&bull;</span>
              <span>PDF</span>
            </div>
          </div>
        </div>

        {currentCV.download_url && (
          <a
            href={currentCV.download_url}
            download
            target="_blank"
            rel="noreferrer"
            className="shrink-0 self-end sm:self-center"
          >
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 text-xs text-foreground border-border hover:bg-muted"
            >
              <Download className="h-3.5 w-3.5" />
              Descargar CV
            </Button>
          </a>
        )}
      </div>

      <div className="pt-2 flex items-center justify-between text-xs">
        <span className="text-muted-foreground font-medium">
          ¿Listo para ver los resultados?
        </span>
        
        <div className="flex items-center gap-1 text-muted-foreground/50 font-semibold cursor-not-allowed select-none" title="Diagnóstico (Bloqueado temporalmente)">
          <span>Ver diagnóstico</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </div>
      </div>
    </div>
  );
}
