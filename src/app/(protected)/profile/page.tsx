'use client';

import React, { useState, useEffect } from 'react';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useUserCVs } from '@/hooks/use-user-cvs';
import { useUserProfile } from '@/hooks/use-user-profile';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Shield,
  Sparkles,
  Edit3,
  Briefcase,
  MapPin,
  Clock,
  Loader2,
  FileText,
  CheckCircle2,
  Compass,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

// Custom Profile Components
import CVUploader from '@/components/profile/cv-uploader';
import CurrentDocument from '@/components/profile/current-document';
import AffinityCard from '@/components/profile/affinity-card';
import SkillsCard from '@/components/profile/skills-card';
import ExperienceCard from '@/components/profile/experience-card';
import InsightCard from '@/components/profile/insight-card';
import ProfileEditModal from '@/components/profile/profile-edit-modal';
import CVAtsPreviewModal from '@/components/profile/cv-ats-preview-modal';

export default function ProfilePage() {
  const { data: user, isLoading: isUserLoading } = useCurrentUser();
  const { data: cvData, isLoading: isCVLoading, refetch: refetchCVs } = useUserCVs();
  const { data: profile, refetch: refetchProfile } = useUserProfile();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isCVPreviewOpen, setIsCVPreviewOpen] = useState(false);
  // Immediately set after CV upload to force the analyzing state,
  // avoids the race condition between async refetchCVs / refetchProfile.
  const [pendingUpload, setPendingUpload] = useState(false);
  const [ignoredCVId, setIgnoredCVId] = useState<string | null>(null);
  const [showCancel, setShowCancel] = useState(false);

  useEffect(() => {
    const ignored = localStorage.getItem('ignored_cv_id');
    if (ignored) setIgnoredCVId(ignored);
  }, []);

  const hasCV = cvData && cvData.cvs && cvData.cvs.length > 0;
  const hasProfile = !!profile;
  const currentCvId = hasCV ? cvData.cvs[0].cv_id : null;
  const isIgnored = currentCvId && currentCvId === ignoredCVId;
  const cvMismatch = hasCV && hasProfile && profile.cv_id !== currentCvId && !isIgnored;
  const isAnalyzing = !isIgnored && (pendingUpload || (hasCV && (!hasProfile || cvMismatch)));

  // Clear pendingUpload once the profile's cv_id catches up with the latest CV
  useEffect(() => {
    if (pendingUpload && hasCV && hasProfile && profile.cv_id === currentCvId) {
      setPendingUpload(false);
    }
  }, [pendingUpload, hasCV, hasProfile, profile, currentCvId]);

  // Real-time polling for background AI analysis
  useEffect(() => {
    let interval: NodeJS.Timeout;
    let timeout: NodeJS.Timeout;
    
    if (isAnalyzing) {
      interval = setInterval(() => {
        refetchProfile();
        refetchCVs();
      }, 3000);
      
      timeout = setTimeout(() => {
        setShowCancel(true);
      }, 10000); // Mostrar opciones de cancelación después de 10 segundos
    } else {
      setShowCancel(false);
    }
    
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [isAnalyzing, refetchProfile, refetchCVs]);

  const isLoading = isUserLoading || isCVLoading;

  if (isLoading) {
    return (
      <div className="p-6 sm:p-8 md:p-10 mx-auto max-w-7xl space-y-6 animate-pulse">
        <div className="h-8 w-48 rounded bg-muted" />
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 h-96 rounded-xl bg-muted" />
          <div className="md:col-span-1 h-96 rounded-xl bg-muted" />
        </div>
      </div>
    );
  }

  // 2. ESTADO ANALIZANDO (CV subido pero perfil procesándose en background)
  if (isAnalyzing) {
    return (
      <div className="p-6 sm:p-8 md:p-10 mx-auto max-w-4xl text-center space-y-8 flex flex-col items-center justify-center min-h-[70vh] animate-in fade-in duration-500">
        <div className="relative">
          <div className="h-20 w-20 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
          <FileText className="h-8 w-8 text-primary absolute inset-0 m-auto animate-pulse" />
        </div>
        <div className="space-y-3 max-w-md">
          <h2 className="text-xl font-extrabold text-foreground flex items-center justify-center gap-2">
            Procesando tu Currículum
            <Loader2 className="h-5 w-5 text-primary animate-spin" />
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Nuestro motor de Inteligencia Artificial está leyendo tu documento, extrayendo tus
            habilidades técnicas y calculando tu afinidad con las especialidades del mercado laboral
            de desarrollo.
          </p>
        </div>
        <Card className="max-w-md border-border bg-card p-4 w-full">
          <CardContent className="p-0 flex items-center gap-3 text-left">
            <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
            <div className="text-xs">
              <p className="font-bold text-foreground">CV Subido Correctamente</p>
              <p className="text-muted-foreground truncate max-w-xs">
                {cvData?.cvs?.[0]?.original_filename}
              </p>
            </div>
          </CardContent>
        </Card>

        {showCancel && (
          <div className="mt-4 flex flex-col items-center gap-4 animate-in fade-in duration-500">
            <p className="text-xs text-muted-foreground">¿Está demorando demasiado o hubo un error?</p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsUpdateModalOpen(true)}
              >
                Subir otro CV
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  if (currentCvId) {
                    localStorage.setItem('ignored_cv_id', currentCvId);
                    setIgnoredCVId(currentCvId);
                    setPendingUpload(false);
                  }
                }}
              >
                Cancelar
              </Button>
            </div>
          </div>
        )}

        {/* Modal de actualización accesible desde la vista de procesando */}
        <Dialog open={isUpdateModalOpen} onOpenChange={setIsUpdateModalOpen}>
          <DialogContent className="sm:max-w-xl border-border bg-card">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Actualizar Currículum Vitae
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Sube una versión más reciente de tu CV. Sincronizaremos tus datos profesionales
                automáticamente y recalcularemos tu alineación técnica.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <CVUploader
                onUploadSuccess={() => {
                  setPendingUpload(true);
                  refetchCVs();
                  refetchProfile();
                  setIsUpdateModalOpen(false);
                }}
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // Default display values

  const userInitials = profile?.full_name
    ? profile.full_name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : user?.full_name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U';

  const defaultDescription = profile
    ? `Desarrollador técnico con experiencia en el diseño e implementación de soluciones de software. Especializado en optimización de flujos de trabajo y alineación de tecnologías a los estándares del mercado de desarrollo.`
    : `Completa tu perfil subiendo tu currículum. La IA de Devalign analizará tu experiencia de forma automática para rellenar este perfil, calcular tu afinidad con el mercado y detectar tus brechas.`;

  // 3. RENDERIZADO GLOBAL (Soporta estado activo y Zero-State)
  return (
    <div className="p-6 sm:p-8 md:p-10 mx-auto max-w-7xl space-y-6 animate-in fade-in duration-500">
      
      {/* Banner Prominente de Carga de CV (Solo si no tiene CV subido) */}
      {!hasCV && (
        <Card className="border border-dashed border-primary/45 bg-primary/5 overflow-hidden shadow-xs">
          <CardContent className="p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-left w-full md:max-w-2xl">
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
                Completa tu Perfil Profesional
                <Sparkles className="h-5.5 w-5.5 text-primary fill-primary/10 shrink-0" />
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Sube tu currículum para comenzar. Analizaremos tu experiencia con Inteligencia
                Artificial para sincronizar tu perfil, detectar tus brechas de habilidades y recomendarte oportunidades de crecimiento.
              </p>
            </div>
            <div className="w-full md:w-[320px] shrink-0">
              <CVUploader
                onUploadSuccess={() => {
                  setPendingUpload(true);
                  refetchCVs();
                  refetchProfile();
                }}
              />
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Columna Izquierda: Información Profesional y Historiales */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tarjeta de Resumen de Perfil */}
          <Card className="border-border bg-card overflow-hidden">
            <CardContent className="px-6 py-6 space-y-6">
              <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary-foreground font-semibold text-2xl uppercase border-2 border-primary/20">
                    {userInitials}
                  </div>
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-extrabold text-xl text-foreground">
                        {profile?.full_name || 'Desarrollador'}
                      </h3>
                      <Badge className="bg-primary/5 text-primary-foreground dark:text-primary border border-primary/20 flex items-center gap-1 font-bold text-[10px] py-0.5 px-2.5 rounded-full">
                        <Shield className="h-3 w-3 text-primary" />
                        Verificado
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-xs font-bold text-primary">
                        {profile?.current_job_role || 'Software Engineer'}
                      </p>
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditModalOpen(true)}
                  disabled={!profile}
                  className="h-8 gap-1.5 text-xs text-foreground border-border hover:bg-muted cursor-pointer shrink-0"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  Editar perfil
                </Button>
              </div>

              {/* Summary Description */}
              <p className="text-xs text-muted-foreground leading-relaxed">{defaultDescription}</p>

              {/* Diagnostic Quick Details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border">
                <div className="space-y-1">
                  <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider block">
                    Experiencia
                  </span>
                  <p className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <Compass className="h-4 w-4 text-primary shrink-0" />
                    {profile && profile.years_experience !== null
                      ? `${profile.years_experience}+ años`
                      : 'N/A'}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider block">
                    Ubicación
                  </span>
                  <p className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-primary shrink-0" />
                    {profile?.location || 'No especificada'}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider block">
                    Disponibilidad
                  </span>
                  <p className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-primary shrink-0" />
                    {profile?.availability || 'Inmediata'}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider block">
                    Modalidad
                  </span>
                  <p className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <Briefcase className="h-4 w-4 text-primary shrink-0" />
                    {profile?.preferred_modality || 'Remota / Híbrida'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Habilidades Detectadas */}
          <SkillsCard
            detectedSkills={profile?.detected_skills || []}
            skillGaps={profile?.skill_gaps || []}
            isPlaceholder={!profile}
          />

          {/* Experiencia Laboral */}
          <ExperienceCard type="experience" items={profile?.work_experience || []} isPlaceholder={!profile} />

          {/* Educación y Certificaciones */}
          <div className="grid gap-6 md:grid-cols-2">
            <ExperienceCard type="education" items={profile?.education || []} isPlaceholder={!profile} />
            <ExperienceCard type="certifications" items={profile?.certifications || []} isPlaceholder={!profile} />
          </div>
        </div>

        {/* Columna Derecha: CV Activo, Afinidad con Dominios, Insight de IA */}
        <div className="lg:col-span-1 space-y-6">
          {/* CV Actual */}
          <CurrentDocument
            onUpdateClick={() => setIsUpdateModalOpen(true)}
            onGenerateCVClick={() => setIsCVPreviewOpen(true)}
          />

          {/* Afinidad con Dominios */}
          <AffinityCard
            primarySpecialty={profile?.primary_specialty || 'Backend'}
            alignmentScore={profile?.alignment_score || 0.0}
            secondaryAffinities={profile?.secondary_affinities || []}
            isPlaceholder={!profile}
          />

          {/* Insight IA */}
          <InsightCard
            primarySpecialty={profile?.primary_specialty || 'Backend'}
            skillGaps={profile?.skill_gaps || []}
            isPlaceholder={!profile}
          />
        </div>
      </div>

      {/* Edit Profiling Modal */}
      {profile && (
        <ProfileEditModal
          profile={profile}
          isOpen={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
        />
      )}

      {/* CV ATS Preview Modal */}
      {profile && (
        <CVAtsPreviewModal
          isOpen={isCVPreviewOpen}
          onOpenChange={setIsCVPreviewOpen}
          profile={profile}
          userEmail={user?.email}
        />
      )}

      {/* Actualizar CV Modal Dialog */}
      <Dialog open={isUpdateModalOpen} onOpenChange={setIsUpdateModalOpen}>
        <DialogContent className="sm:max-w-xl border-border bg-card">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Actualizar Currículum Vitae
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Sube una versión más reciente de tu CV. Sincronizaremos tus datos profesionales
              automáticamente y recalcularemos tu alineación técnica.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <CVUploader
              onUploadSuccess={() => {
                setPendingUpload(true);
                refetchCVs();
                refetchProfile();
                setIsUpdateModalOpen(false);
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
