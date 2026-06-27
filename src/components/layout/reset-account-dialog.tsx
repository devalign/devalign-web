'use client';

import React from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ResetAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading: boolean;
}

export function ResetAccountDialog({
  open,
  onOpenChange,
  onConfirm,
  isLoading,
}: ResetAccountDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-destructive/20 bg-card shadow-2xl transition-all duration-300">
        <DialogHeader className="text-left">
          <DialogTitle className="text-destructive flex items-center gap-2.5 font-extrabold text-lg justify-start tracking-tight">
            <div className="p-2 bg-destructive/10 rounded-full text-destructive animate-pulse">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <span>¿Restablecer tu cuenta?</span>
          </DialogTitle>
          <DialogDescription className="text-left text-sm text-muted-foreground leading-relaxed mt-2">
            Esta acción es <strong className="text-foreground font-semibold">permanente</strong> e irreversible. Se eliminará de forma definitiva:
          </DialogDescription>
        </DialogHeader>

        <div className="py-2.5 px-1">
          <ul className="space-y-2 text-xs text-muted-foreground list-disc pl-4">
            <li>Tu currículum actual cargado en el sistema.</li>
            <li>El historial completo de versiones de CV.</li>
            <li>Todos tus diagnósticos de habilidades guardados.</li>
            <li>Tus afinidades de especialidad y brechas detectadas.</li>
          </ul>
          <p className="text-xs text-destructive/80 mt-4 font-medium bg-destructive/5 border border-destructive/10 p-2.5 rounded-lg">
            Nota: Tu cuenta y tus ajustes de tema no se verán afectados, pero deberás subir un nuevo currículum para volver a utilizar la plataforma.
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
            variant="destructive"
            size="sm"
            onClick={onConfirm}
            disabled={isLoading}
            className="gap-2 cursor-pointer font-semibold bg-destructive hover:bg-destructive/90 transition-all shadow-md shadow-destructive/10"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Restableciendo...</span>
              </>
            ) : (
              <>
                <span>Confirmar Restablecer</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
