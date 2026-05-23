'use client';

import React from 'react';
import CVUploader from '@/components/profile/cv-uploader';
import CurrentDocument from '@/components/profile/current-document';
import AIPipelineSteps from '@/components/profile/ai-pipeline-steps';
import { useUserCVs } from '@/hooks/use-user-cvs';
import { Sparkles } from 'lucide-react';

export default function ProfilePage() {
  const { data: cvData } = useUserCVs();
  const hasCV = cvData && cvData.cvs && cvData.cvs.length > 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl flex items-center gap-2">
          Analiza tu Perfil Profesional
          <Sparkles className="h-6 w-6 text-primary fill-primary/10 shrink-0" />
        </h1>
        <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
          Carga tu CV y descubre cómo se alinea tu perfil con la demanda real del mercado TI.
        </p>
      </div>

      {/* Conditionally Render Active CV Info */}
      {hasCV && (
        <div className="space-y-2">
          <CurrentDocument />
        </div>
      )}

      {/* Upload Zone */}
      <div className="space-y-4">
        {hasCV && (
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Subir Nuevo CV
          </h3>
        )}
        <CVUploader />
      </div>

      {/* Explanatory Pipeline Steps */}
      <AIPipelineSteps />
    </div>
  );
}
