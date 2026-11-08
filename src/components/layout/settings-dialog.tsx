'use client';

import React from 'react';
import { Settings, Sun, Moon, KeyRound, User, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

import {
  useUserProfile,
  useUpdateUserProfile,
  useResetAccount,
  useDeleteAccount,
} from '@/hooks/use-user-profile';
import { ResetAccountDialog } from './reset-account-dialog';
import { DeleteAccountDialog } from './delete-account-dialog';
import { ChangePasswordDialog } from './change-password-dialog';

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLogoutClick: () => void;
}

export function SettingsDialog({ open, onOpenChange, onLogoutClick }: SettingsDialogProps) {
  const [theme, setTheme] = React.useState<'light' | 'dark'>('light');
  const [isResetConfirmOpen, setIsResetConfirmOpen] = React.useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = React.useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = React.useState(false);

  const { data: profile } = useUserProfile();
  const { mutateAsync: updateProfile, isPending: isUpdatingProfile } = useUpdateUserProfile();
  const { mutate: reset, isPending: isResetting } = useResetAccount();
  const { mutate: deleteAcc, isPending: isDeleting } = useDeleteAccount();

  const [fullName, setFullName] = React.useState('');

  // Synchronize fullName with existing profile when opening dialog or when profile updates
  React.useEffect(() => {
    if (open && profile) {
      setFullName(profile.full_name || '');
    }
  }, [open, profile]);

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

  const handleDialogClose = (newOpen: boolean) => {
    if (!newOpen) {
      // Discard uncommitted edits upon closing modal (CP022)
      setFullName(profile?.full_name || '');
    }
    onOpenChange(newOpen);
  };

  const handleSaveSettings = async () => {
    // Validate empty full name (CP18)
    if (!fullName.trim()) {
      toast.error('El nombre completo es requerido.');
      return;
    }

    try {
      const currentTrimmed = (profile?.full_name || '').trim();
      const nextTrimmed = fullName.trim();

      if (nextTrimmed !== currentTrimmed) {
        await updateProfile({ full_name: nextTrimmed });
      }

      toast.success('Ajustes guardados correctamente.');
      onOpenChange(false);
    } catch (err) {
      console.error('Error saving settings:', err);
      const message =
        err instanceof Error ? err.message : 'Ocurrió un error al guardar los ajustes.';
      toast.error(message);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleDialogClose}>
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

          <div className="py-3 space-y-4 max-h-[65vh] overflow-y-auto pr-1">
            {/* Perfil Section */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-primary" />
                <span>Perfil</span>
              </h4>
              <div className="rounded-lg border border-border p-3.5 bg-secondary/10 space-y-2">
                <Label
                  htmlFor="settings-fullname"
                  className="text-xs font-semibold text-foreground"
                >
                  Nombre Completo
                </Label>
                <Input
                  id="settings-fullname"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSaveSettings();
                    }
                  }}
                  placeholder="Tu nombre completo"
                  disabled={isUpdatingProfile}
                  className="h-9 text-xs bg-card border-border"
                />
              </div>
            </div>

            {/* Seguridad Section */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <KeyRound className="h-3.5 w-3.5 text-primary" />
                <span>Seguridad</span>
              </h4>
              <div className="rounded-lg border border-border p-3.5 bg-secondary/10 flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <span className="text-xs font-semibold text-foreground">Contraseña</span>
                  <p className="text-[10px] text-muted-foreground leading-normal">
                    Actualiza tu clave de acceso para mantener segura tu cuenta.
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsChangePasswordOpen(true)}
                  className="text-[10px] h-7 shrink-0 cursor-pointer"
                >
                  Cambiar contraseña
                </Button>
              </div>
            </div>

            {/* Apariencia Section */}
            <div className="space-y-2">
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

            {/* Datos de la Cuenta Section */}
            <div className="space-y-2">
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

            {/* Sesión Section */}
            <div className="space-y-2">
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
              onClick={() => handleDialogClose(false)}
              disabled={isUpdatingProfile}
              className="cursor-pointer text-xs"
            >
              Cancelar
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleSaveSettings}
              disabled={isUpdatingProfile}
              className="cursor-pointer text-xs gap-1.5"
            >
              {isUpdatingProfile ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Guardando...</span>
                </>
              ) : (
                <span>Guardar Ajustes</span>
              )}
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

      <ChangePasswordDialog open={isChangePasswordOpen} onOpenChange={setIsChangePasswordOpen} />
    </>
  );
}
