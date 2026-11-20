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
import { useCurrentUser } from '@/hooks/use-current-user';
import { ResetAccountDialog } from './reset-account-dialog';
import { DeleteAccountDialog } from './delete-account-dialog';
import { ChangePasswordDialog } from './change-password-dialog';

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLogoutClick: () => void;
}

function getCommittedTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  try {
    if (localStorage.theme === 'dark') return 'dark';
    if (localStorage.theme === 'light') return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  } catch {
    return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
  }
}

function applyThemeToDocument(targetTheme: 'light' | 'dark') {
  const root = document.documentElement;
  if (targetTheme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

export function SettingsDialog({ open, onOpenChange, onLogoutClick }: SettingsDialogProps) {
  const [committedTheme, setCommittedTheme] = React.useState<'light' | 'dark'>('light');
  const [draftTheme, setDraftTheme] = React.useState<'light' | 'dark' | null>(null);
  const theme = draftTheme ?? committedTheme;
  const [isResetConfirmOpen, setIsResetConfirmOpen] = React.useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = React.useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = React.useState(false);

  const { data: user } = useCurrentUser();
  const { data: profile } = useUserProfile();
  const { mutateAsync: updateProfile, isPending: isUpdatingProfile } = useUpdateUserProfile();
  const { mutate: reset, isPending: isResetting } = useResetAccount();
  const { mutate: deleteAcc, isPending: isDeleting } = useDeleteAccount();

  const initialFullName = (profile?.full_name || user?.full_name || '').trim();
  const [draftFullName, setDraftFullName] = React.useState<string | null>(null);
  const fullName = draftFullName ?? initialFullName;
  const trimmedFullName = fullName.trim();
  const isNameEmpty = trimmedFullName.length === 0;
  const showNameRequiredError = draftFullName !== null && isNameEmpty;
  const hasNameChange = trimmedFullName !== initialFullName;
  const hasThemeChange = theme !== committedTheme;
  const hasChanges = hasNameChange || hasThemeChange;
  const isSaveDisabled =
    isUpdatingProfile || !hasChanges || showNameRequiredError || (isNameEmpty && !hasThemeChange);

  const handleResetConfirm = () => {
    reset(undefined, {
      onSuccess: () => {
        toast.success('Cuenta restablecida correctamente.');
        setIsResetConfirmOpen(false);
        handleDialogClose(false);
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
        handleDialogClose(false);
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
    if (typeof window !== 'undefined' && open) {
      const savedTheme = getCommittedTheme();
      const timer = setTimeout(() => {
        setCommittedTheme(savedTheme);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [open]);

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    // Live preview only; localStorage persistence happens on Guardar Ajustes
    applyThemeToDocument(newTheme);
    setDraftTheme(newTheme);
  };

  const handleDialogClose = (newOpen: boolean) => {
    if (!newOpen) {
      // Discard uncommitted edits and revert preview theme upon closing modal (CP022)
      setDraftFullName(null);
      setDraftTheme(null);
      const savedTheme = getCommittedTheme();
      applyThemeToDocument(savedTheme);
      setCommittedTheme(savedTheme);
    }
    onOpenChange(newOpen);
  };

  const handleSaveSettings = async () => {
    if (!hasChanges) return;

    // Validate empty full name when edited (CP18)
    if (hasNameChange && isNameEmpty) {
      return;
    }

    try {
      if (hasNameChange) {
        await updateProfile({ full_name: trimmedFullName });
      }

      applyThemeToDocument(theme);
      localStorage.setItem('theme', theme);
      setCommittedTheme(theme);
      setDraftTheme(null);
      setDraftFullName(null);
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
                  onChange={(e) => setDraftFullName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (!isSaveDisabled) {
                        handleSaveSettings();
                      }
                    }
                  }}
                  placeholder="Tu nombre completo"
                  disabled={isUpdatingProfile}
                  aria-invalid={showNameRequiredError}
                  className={cn(
                    'h-9 text-xs bg-card border-border',
                    showNameRequiredError && 'border-destructive focus-visible:ring-destructive',
                  )}
                />
                {showNameRequiredError && (
                  <p className="text-[11px] font-medium text-destructive">
                    El nombre completo es requerido.
                  </p>
                )}
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
                    handleDialogClose(false);
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
              disabled={isSaveDisabled}
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
