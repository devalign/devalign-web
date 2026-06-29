'use client';

import React from 'react';
import { Settings, Sun, Moon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

import { useResetAccount, useDeleteAccount } from '@/hooks/use-user-profile';
import { ResetAccountDialog } from './reset-account-dialog';
import { DeleteAccountDialog } from './delete-account-dialog';

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLogoutClick: () => void;
}

export function SettingsDialog({ open, onOpenChange, onLogoutClick }: SettingsDialogProps) {
  const [theme, setTheme] = React.useState<'light' | 'dark'>('light');
  const [isResetConfirmOpen, setIsResetConfirmOpen] = React.useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = React.useState(false);

  const { mutate: reset, isPending: isResetting } = useResetAccount();
  const { mutate: deleteAcc, isPending: isDeleting } = useDeleteAccount();

  const handleResetConfirm = () => {
    reset(undefined, {
      onSuccess: () => {
        toast.success('Cuenta restablecida correctamente.');
        setIsResetConfirmOpen(false);
        onOpenChange(false);
      },
      onError: (error) => {
        console.error('Error resetting account:', error);
        const message = error instanceof Error ? error.message : 'Ocurrió un error desconocido';
        toast.error(`Error: ${message}`);
      },
    });
  };

  const handleDeleteConfirm = () => {
    deleteAcc(undefined, {
      onSuccess: () => {
        toast.success('Cuenta eliminada permanentemente.');
        setIsDeleteConfirmOpen(false);
        onOpenChange(false);
        onLogoutClick();
      },
      onError: (error) => {
        console.error('Error deleting account:', error);
        const message = error instanceof Error ? error.message : 'Ocurrió un error desconocido';
        toast.error(`Error: ${message}`);
      },
    });
  };

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const isDark = document.documentElement.classList.contains('dark');
      const timer = setTimeout(() => {
        setTheme(isDark ? 'dark' : 'light');
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [open]);

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    const root = document.documentElement;
    if (newTheme === 'dark') {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
    setTheme(newTheme);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-border bg-card">
        <DialogHeader className="text-left">
          <DialogTitle className="flex items-center gap-2 font-bold text-foreground justify-start">
            <Settings className="h-5 w-5 text-primary" />
            <span>Ajustes de Cuenta</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground text-left">
            Gestiona tus preferencias de privacidad, apariencia, alertas y sesión.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-5">
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Apariencia
            </h4>
            <div className="grid grid-cols-2 gap-1 bg-secondary/35 p-0.5 rounded-lg border border-border/50">
              <button
                onClick={() => handleThemeChange('light')}
                className={cn(
                  'flex items-center justify-center gap-1 py-1.5 px-1.5 text-[10px] font-semibold rounded-md transition-all duration-150 cursor-pointer',
                  theme === 'light'
                    ? 'bg-card text-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                <Sun className="h-3 w-3" />
                <span>Claro</span>
              </button>
              <button
                onClick={() => handleThemeChange('dark')}
                className={cn(
                  'flex items-center justify-center gap-1 py-1.5 px-1.5 text-[10px] font-semibold rounded-md transition-all duration-150 cursor-pointer',
                  theme === 'dark'
                    ? 'bg-card text-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                <Moon className="h-3 w-3" />
                <span>Oscuro</span>
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Datos de la Cuenta
            </h4>
            <div className="rounded-lg border border-border p-3.5 bg-secondary/10 flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <span className="text-xs font-semibold text-foreground">Restablecer Cuenta</span>
                <p className="text-[10px] text-muted-foreground leading-normal">
                  Elimina tu currículum y diagnósticos, pero mantén tu cuenta activa.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsResetConfirmOpen(true)}
                className="text-[10px] h-7 shrink-0 cursor-pointer"
              >
                Restablecer
              </Button>
            </div>
            
            <div className="rounded-lg border border-destructive/20 p-3.5 bg-destructive/5 flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <span className="text-xs font-semibold text-destructive">Eliminar Cuenta</span>
                <p className="text-[10px] text-muted-foreground leading-normal">
                  Elimina de forma permanente e irreversible tu cuenta y todos tus datos.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsDeleteConfirmOpen(true)}
                className="border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive text-[10px] h-7 shrink-0 cursor-pointer"
              >
                Eliminar
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Sesión
            </h4>
            <div className="rounded-lg border border-border p-3.5 bg-secondary/10 flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <span className="text-xs font-semibold text-foreground">Cerrar Sesión</span>
                <p className="text-[10px] text-muted-foreground leading-normal">
                  Cierra de forma segura tu sesión activa en este dispositivo.
                </p>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  onOpenChange(false);
                  onLogoutClick();
                }}
                className="text-[10px] h-7 shrink-0 cursor-pointer"
              >
                Cerrar sesión
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end border-t border-border pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="cursor-pointer"
          >
            Cancelar
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={() => {
              onOpenChange(false);
              toast.success('Ajustes guardados correctamente.');
            }}
            className="cursor-pointer"
          >
            Guardar Ajustes
          </Button>
        </DialogFooter>
      </DialogContent>

      <ResetAccountDialog
        open={isResetConfirmOpen}
        onOpenChange={setIsResetConfirmOpen}
        onConfirm={handleResetConfirm}
        isLoading={isResetting}
      />

      <DeleteAccountDialog
        open={isDeleteConfirmOpen}
        onOpenChange={setIsDeleteConfirmOpen}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
      />
    </Dialog>
  );
}
