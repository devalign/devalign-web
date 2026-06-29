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

interface DeleteAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading: boolean;
}

export function DeleteAccountDialog({
  open,
  onOpenChange,
  onConfirm,
  isLoading,
}: DeleteAccountDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-destructive/20 bg-card shadow-2xl transition-all duration-300">
        <DialogHeader className="text-left">
          <DialogTitle className="text-destructive flex items-center gap-2.5 font-extrabold text-lg justify-start tracking-tight">
            <div className="p-2 bg-destructive/10 rounded-full text-destructive animate-pulse">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <span>¿Eliminar tu cuenta permanentemente?</span>
          </DialogTitle>
          <DialogDescription className="text-left text-sm text-muted-foreground leading-relaxed mt-2">
            Esta acción es <strong className="text-foreground font-semibold">permanente</strong> e irreversible. No solo borrarás tus currículums, historial y diagnósticos, sino que también perderás el acceso completo a esta cuenta.
          </DialogDescription>
        </DialogHeader>

        <div className="py-2.5 px-1">
          <p className="text-xs text-destructive/80 mt-2 font-medium bg-destructive/5 border border-destructive/10 p-2.5 rounded-lg">
            Nota: Al confirmar, cerrarás sesión y tu cuenta será eliminada. Si deseas volver a usar la plataforma, deberás registrarte nuevamente con tu correo.
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
                <span>Eliminando cuenta...</span>
              </>
            ) : (
              <>
                <span>Confirmar Eliminación</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
