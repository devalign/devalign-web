'use client';

import React, { useState } from 'react';
import { KeyRound, Eye, EyeOff, Loader2, CheckCircle2, Circle } from 'lucide-react';
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
import { createClient } from '@/lib/supabase/client';
import { passwordRequirements, isPasswordSecure } from '@/lib/validators/password';

interface ChangePasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Modal dialog allowing authenticated users to securely update their account password.
 */
export function ChangePasswordDialog({ open, onOpenChange }: ChangePasswordDialogProps) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const supabase = createClient();

  const resetForm = () => {
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setShowConfirmPassword(false);
    setIsLoading(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      resetForm();
    }
    onOpenChange(newOpen);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password) {
      toast.error('Por favor ingresa tu nueva contraseña.');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Las contraseñas no coinciden.');
      return;
    }

    if (!isPasswordSecure(password)) {
      toast.error('La contraseña no cumple con los requisitos de seguridad.');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        throw error;
      }

      toast.success('Contraseña actualizada correctamente.');
      handleOpenChange(false);
    } catch (err) {
      console.error('Error updating password:', err);
      const message =
        err instanceof Error ? err.message : 'Ocurrió un error al actualizar la contraseña.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md border-border bg-card shadow-2xl">
        <DialogHeader className="text-left">
          <DialogTitle className="flex items-center gap-2 font-bold text-foreground justify-start">
            <KeyRound className="h-5 w-5 text-primary" />
            <span>Cambiar Contraseña</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground text-left">
            Ingresa tu nueva contraseña para proteger el acceso a tu cuenta.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* New Password */}
          <div className="space-y-1.5">
            <Label htmlFor="new-password" className="text-xs font-bold text-foreground">
              Nueva contraseña
            </Label>
            <div className="relative">
              <Input
                id="new-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu nueva contraseña"
                disabled={isLoading}
                className="h-9 pr-9 text-xs bg-background border-border"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <Label htmlFor="confirm-new-password" className="text-xs font-bold text-foreground">
              Repetir nueva contraseña
            </Label>
            <div className="relative">
              <Input
                id="confirm-new-password"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repite la nueva contraseña"
                disabled={isLoading}
                className="h-9 pr-9 text-xs bg-background border-border"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                tabIndex={-1}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                aria-label={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Password Requirements Checklist */}
          <div className="rounded-lg border border-border/50 bg-secondary/15 p-3 space-y-2">
            <p className="text-[11px] font-semibold text-muted-foreground">
              La contraseña debe cumplir:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {passwordRequirements.map((req, idx) => {
                const isValid = password.length > 0 && req.test(password);
                return (
                  <div
                    key={idx}
                    className={`flex items-center gap-1.5 text-[10px] transition-colors ${
                      isValid ? 'text-primary font-semibold' : 'text-muted-foreground'
                    }`}
                  >
                    {isValid ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                    ) : (
                      <Circle className="h-3.5 w-3.5 text-muted-foreground/40 shrink-0" />
                    )}
                    <span>{req.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <DialogFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end border-t border-border pt-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleOpenChange(false)}
              disabled={isLoading}
              className="cursor-pointer text-xs"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="default"
              size="sm"
              disabled={isLoading}
              className="cursor-pointer text-xs gap-1.5"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Actualizando...</span>
                </>
              ) : (
                <span>Actualizar contraseña</span>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
