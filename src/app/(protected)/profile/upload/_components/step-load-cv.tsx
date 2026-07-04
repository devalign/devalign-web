'use client';

import { useCallback } from 'react';
import CVUploader from '../../_components/cv/cv-uploader';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface StepLoadCVProps {
  onUploadSuccess: (cvId: string) => void;
  onCancel: () => void;
}

export function StepLoadCV({ onUploadSuccess, onCancel }: StepLoadCVProps) {
  const handleUploadSuccess = useCallback(
    (newCvId: string) => {
      onUploadSuccess(newCvId);
    },
    [onUploadSuccess],
  );

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-sm font-bold text-foreground mb-1">Paso 1: Selecciona tu CV</h2>
        <p className="text-xs text-muted-foreground mb-4">
          Carga tu CV en formato PDF o DOCX para extraer tus competencias y generar tu diagnóstico
          profesional.
        </p>
        <CVUploader onUploadSuccess={handleUploadSuccess} />
      </div>
    </div>
  );
}

