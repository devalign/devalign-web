'use client';

import React from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export interface ConfirmDiagnosticDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clusterName: string;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function ConfirmDiagnosticDialog({
  open,
  onOpenChange,
  clusterName,
  onConfirm,
  isLoading = false,
}: ConfirmDiagnosticDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-primary/20 bg-card shadow-2xl transition-all duration-300">
        <DialogHeader className="text-left">
          <DialogTitle className="text-foreground flex items-center gap-2.5 font-extrabold text-lg justify-start tracking-tight">
            <div className="p-2 bg-primary/10 rounded-full text-primary animate-pulse">
              <Sparkles className="h-5 w-5" />
            </div>
            <span>¿Generar diagnóstico de especialidad?</span>
          </DialogTitle>
          <DialogDescription className="text-left text-sm text-muted-foreground leading-relaxed mt-2">
            Estás a punto de generar el análisis detallado para{' '}
            <strong className="text-foreground font-semibold">{clusterName}</strong>. Se evaluará
            y guardará en tu perfil:
          </DialogDescription>
        </DialogHeader>

        <div className="py-2.5 px-1">
          <ul className="space-y-2 text-xs text-muted-foreground list-disc pl-4">
            <li>Comparativa de tus competencias técnicas frente a los requisitos de la industria.</li>
            <li>Detección de brechas críticas (skill gaps) y recomendaciones de aprendizaje.</li>
            <li>Proyección de bandas salariales y nivel de compatibilidad en este rol.</li>
          </ul>
          <p className="text-xs text-primary/90 mt-4 font-medium bg-primary/5 border border-primary/15 p-2.5 rounded-lg">
            Nota: La evaluación se calculará a partir de las competencias registradas en tu perfil y quedará disponible para consulta inmediata.
          </p>
        </div>

        <DialogFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="cursor-pointer font-semibold border-border hover:bg-secondary transition-all"
          >
            Cancelar
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={onConfirm}
            disabled={isLoading}
            className="gap-2 cursor-pointer font-semibold transition-all shadow-md"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Generando...</span>
              </>
            ) : (
              <>
                <span>Confirmar y Generar</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
