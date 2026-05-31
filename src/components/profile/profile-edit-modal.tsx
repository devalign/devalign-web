'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUpdateUserProfile } from '@/hooks/use-user-profile';
import { UserProfileData } from '@/lib/api/types';
import { Edit3, User, Briefcase, MapPin, Calendar, Compass, Shield } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

interface ProfileEditModalProps {
  profile: UserProfileData;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ProfileEditModal({ profile, isOpen, onOpenChange }: ProfileEditModalProps) {
  const [fullName, setFullName] = useState(profile.full_name || '');
  const [currentJobRole, setCurrentJobRole] = useState(profile.current_job_role || '');
  const [yearsExperience, setYearsExperience] = useState(
    profile.years_experience !== null ? String(profile.years_experience) : '',
  );
  const [preferredModality, setPreferredModality] = useState(profile.preferred_modality || '');
  const [location, setLocation] = useState(profile.location || '');
  const [availability, setAvailability] = useState(profile.availability || '');

  const updateProfileMutation = useUpdateUserProfile();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      toast.error('El nombre completo es requerido.');
      return;
    }

    try {
      const years = yearsExperience.trim() !== '' ? Number(yearsExperience) : null;
      if (years !== null && (isNaN(years) || years < 0)) {
        toast.error('Los años de experiencia deben ser un número válido.');
        return;
      }

      await updateProfileMutation.mutateAsync({
        full_name: fullName.trim(),
        current_job_role: currentJobRole.trim() || null,
        years_experience: years,
        preferred_modality: preferredModality.trim() || null,
        location: location.trim() || null,
        availability: availability.trim() || null,
      });

      toast.success('Perfil actualizado correctamente.');
      onOpenChange(false);
    } catch (err) {
      console.error(err);
      toast.error('Error al guardar los cambios.');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg border-border bg-card">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold flex items-center gap-2">
            <Edit3 className="h-5 w-5 text-primary" />
            Editar Información Profesional
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Modifica la información básica sobre tu perfil profesional que la IA extrajo de tu CV.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSave} className="space-y-4 py-2">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label
                htmlFor="edit-name"
                className="text-xs font-bold text-foreground flex items-center gap-1"
              >
                <User className="h-3.5 w-3.5 text-muted-foreground" />
                Nombre Completo
              </Label>
              <Input
                id="edit-name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ej. Alex Rivera"
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label
                htmlFor="edit-role"
                className="text-xs font-bold text-foreground flex items-center gap-1"
              >
                <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
                Cargo Profesional
              </Label>
              <Input
                id="edit-role"
                value={currentJobRole}
                onChange={(e) => setCurrentJobRole(e.target.value)}
                placeholder="Ej. Senior Backend Developer"
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="edit-exp"
                className="text-xs font-bold text-foreground flex items-center gap-1"
              >
                <Compass className="h-3.5 w-3.5 text-muted-foreground" />
                Años de Experiencia
              </Label>
              <Input
                id="edit-exp"
                type="number"
                min="0"
                value={yearsExperience}
                onChange={(e) => setYearsExperience(e.target.value)}
                placeholder="Ej. 8"
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="edit-modality"
                className="text-xs font-bold text-foreground flex items-center gap-1"
              >
                <Shield className="h-3.5 w-3.5 text-muted-foreground" />
                Modalidad Preferida
              </Label>
              <Input
                id="edit-modality"
                value={preferredModality}
                onChange={(e) => setPreferredModality(e.target.value)}
                placeholder="Ej. Remota / Híbrida"
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="edit-loc"
                className="text-xs font-bold text-foreground flex items-center gap-1"
              >
                <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                Ubicación
              </Label>
              <Input
                id="edit-loc"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Ej. Lima, Perú"
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="edit-avail"
                className="text-xs font-bold text-foreground flex items-center gap-1"
              >
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                Disponibilidad
              </Label>
              <Input
                id="edit-avail"
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                placeholder="Ej. Inmediata"
                className="h-9 text-xs"
              />
            </div>
          </div>

          <DialogFooter className="border-t border-border pt-4 mt-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="text-xs border-border hover:bg-muted cursor-pointer"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={updateProfileMutation.isPending}
              className="text-xs font-semibold cursor-pointer"
            >
              {updateProfileMutation.isPending ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
