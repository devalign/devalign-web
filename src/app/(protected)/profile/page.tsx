'use client';

import React from 'react';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useUserCVs } from '@/hooks/use-user-cvs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Mail, Shield, UserCheck, Calendar, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import CVUploader from '@/components/profile/cv-uploader';
import CurrentDocument from '@/components/profile/current-document';
import AIPipelineSteps from '@/components/profile/ai-pipeline-steps';
import ProfileAside from '@/components/profile/profile-aside';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

export default function ProfilePage() {
  const { data: user, isLoading: isUserLoading } = useCurrentUser();
  const { data: cvData, isLoading: isCVLoading } = useUserCVs();
  const [isSaving, setIsSaving] = React.useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('action') === 'update-cv') {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsUpdateModalOpen(true);
        // Limpiar el parámetro de la URL sin recargar la página
        const newUrl = window.location.pathname;
        window.history.replaceState({}, '', newUrl);
      }
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Perfil actualizado correctamente (Simulación)');
    }, 1000);
  };

  const isLoading = isUserLoading || isCVLoading;

  if (isLoading) {
    return (
      <div className="p-6 sm:p-8 md:p-10 mx-auto max-w-4xl space-y-6">
        <div className="h-8 w-48 rounded bg-muted animate-pulse" />
        <div className="h-64 rounded-xl bg-muted animate-pulse" />
      </div>
    );
  }

  const creationDate = user?.created_at 
    ? new Date(user.created_at).toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    : 'No disponible';

  const hasCV = cvData && cvData.cvs && cvData.cvs.length > 0;

  // ESTADO INICIAL / EMPTY STATE (Si el usuario no tiene CV)
  if (!hasCV) {
    return (
      <div className="flex min-h-full w-full flex-col lg:flex-row animate-in fade-in duration-500">
        {/* Contenido Principal */}
        <div className="flex-1 p-6 sm:p-8 md:p-10">
          <div className="mx-auto max-w-4xl space-y-8">
            {/* Onboarding Header */}
            <div className="space-y-2">
              <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl flex items-center gap-2">
                Completa tu Perfil Profesional
                <Sparkles className="h-6 w-6 text-primary fill-primary/10 shrink-0" />
              </h1>
              <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
                Sube tu currículum para comenzar. Analizaremos tu experiencia con Inteligencia Artificial para sincronizar tu perfil y recomendarte oportunidades de crecimiento profesional.
              </p>
            </div>

            {/* CV Uploader Zone */}
            <div className="space-y-4">
              <CVUploader />
            </div>

            {/* AI Processing Steps */}
            <AIPipelineSteps />
          </div>
        </div>

        {/* Aside Contextual */}
        <aside className="w-full border-t border-border bg-card/30 p-6 sm:p-8 lg:w-[350px] lg:min-w-[350px] lg:border-t-0 lg:border-l xl:w-[380px] xl:min-w-[380px]">
          <ProfileAside />
        </aside>
      </div>
    );
  }

  // ESTADO COMPLETO (Si el usuario ya tiene CV cargado)
  return (
    <div className="p-6 sm:p-8 md:p-10 mx-auto max-w-4xl space-y-8 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl flex items-center gap-2">
          Mi Perfil
        </h1>
        <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
          Gestiona tu información personal y preferencias de tu cuenta.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Columna Izquierda: Avatar, Información Rápida y CV Activo */}
        <div className="md:col-span-1 space-y-6">
          <Card className="border-border bg-card h-fit">
            <CardContent className="pt-6 flex flex-col items-center text-center space-y-4">
              {user?.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.avatar_url}
                  alt={user.full_name || 'User'}
                  className="h-24 w-24 rounded-full object-cover ring-4 ring-primary/20"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/20 text-primary-foreground font-semibold text-3xl uppercase">
                  {user?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                </div>
              )}
              <div className="space-y-1">
                <h3 className="font-bold text-lg text-foreground">{user?.full_name || 'Desarrollador'}</h3>
                <p className="text-xs text-muted-foreground font-mono truncate max-w-[200px]">
                  {user?.email}
                </p>
              </div>
              
              <div className="w-full border-t border-border pt-4 text-left space-y-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Shield className="h-4 w-4 text-primary shrink-0" />
                  <span>ID: <code className="font-mono text-[10px] bg-muted px-1.5 py-0.5 rounded">{user?.id?.slice(0, 8)}...</code></span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-4 w-4 text-primary shrink-0" />
                  <span>Miembro desde: <strong className="font-medium text-foreground">{creationDate}</strong></span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Información del documento actual cargado */}
          <CurrentDocument onUpdateClick={() => setIsUpdateModalOpen(true)} />
        </div>

        {/* Columna Derecha: Formulario de Información Personal */}
        <Card className="md:col-span-2 border-border bg-card h-fit">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Información Personal</CardTitle>
            <CardDescription>
              Detalles básicos de tu cuenta en Devalign.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSave}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="flex items-center gap-1.5 text-xs font-semibold">
                  <User className="h-3.5 w-3.5 text-muted-foreground" />
                  Nombre Completo
                </Label>
                <Input 
                  id="fullName" 
                  defaultValue={user?.full_name || ''} 
                  placeholder="Tu nombre completo"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-1.5 text-xs font-semibold">
                  <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                  Correo Electrónico
                </Label>
                <Input 
                  id="email" 
                  type="email"
                  defaultValue={user?.email || ''} 
                  disabled
                  className="bg-secondary/40 border-border/80 cursor-not-allowed text-muted-foreground"
                />
                <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <UserCheck className="h-3 w-3 text-emerald-500" />
                  El correo electrónico no puede ser modificado ya que está vinculado a tu cuenta de acceso.
                </p>
              </div>
            </CardContent>
            <CardFooter className="border-t border-border pt-4 mt-4 flex justify-end">
              <Button type="submit" disabled={isSaving} className="cursor-pointer">
                {isSaving ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>

      {/* Diálogo Modal de Actualización de CV */}
      <Dialog open={isUpdateModalOpen} onOpenChange={setIsUpdateModalOpen}>
        <DialogContent className="sm:max-w-xl border-border bg-card">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Actualizar Currículum Vitae
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Sube una versión más reciente de tu CV. Sincronizaremos tus datos profesionales automáticamente y recalcularemos tu alineación técnica.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <CVUploader onUploadSuccess={() => setIsUpdateModalOpen(false)} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
