'use client';

import React, { useState } from 'react';
import { Sparkles, UploadCloud } from 'lucide-react';
import { toast } from 'sonner';
import { useUploadCV } from '@/hooks/use-upload-cv';

interface DashboardEmptyStateProps {
  onUploadSuccess: (cvId?: string) => void;
}

export function DashboardEmptyState({ onUploadSuccess }: DashboardEmptyStateProps) {
  const uploadMutation = useUploadCV();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const processFile = async (file: File) => {
    const validTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
    ];
    const extension = file.name.split('.').pop()?.toLowerCase();
    const isValidType =
      validTypes.includes(file.type) ||
      extension === 'pdf' ||
      extension === 'docx' ||
      extension === 'doc';

    if (!isValidType) {
      toast.error('Tipo de archivo no soportado. Sube un PDF o DOCX.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('El archivo excede el límite permitido de 5MB.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(10);
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 100);

    try {
      const result = await uploadMutation.mutateAsync(file);
      clearInterval(progressInterval);
      setUploadProgress(100);
      setTimeout(() => {
        setIsUploading(false);
        onUploadSuccess(result.cv_id);
        toast.success('¡CV cargado con éxito! Iniciando análisis de perfil.');
      }, 400);
    } catch (error) {
      clearInterval(progressInterval);
      setIsUploading(false);
      const errorMessage = error instanceof Error ? error.message : 'Error al subir el archivo';
      toast.error(errorMessage);
    }
  };

  const handleFileUpload = (
    e: React.DragEvent<HTMLDivElement> | React.ChangeEvent<HTMLInputElement>,
  ) => {
    e.preventDefault();
    let file: File | undefined;
    if ('dataTransfer' in e && e.dataTransfer.files && e.dataTransfer.files[0]) {
      file = e.dataTransfer.files[0];
    } else {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files[0]) {
        file = target.files[0];
      }
    }

    if (file) {
      processFile(file);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center px-4 py-10">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
            Comienza tu Diagnóstico
          </h1>
          <p className="text-muted-foreground text-sm">
            Sube tu currículum para que nuestro motor de Machine Learning extraiga tus
            competencias e identifique tu alineación con el mercado IT.
          </p>
        </div>

        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleFileUpload}
          className="border-2 border-dashed border-border hover:border-primary/50 transition-colors bg-card p-10 rounded-2xl flex flex-col items-center justify-center gap-4 cursor-pointer relative"
        >
          {isUploading ? (
            <div className="w-full space-y-4 py-4">
              <Sparkles className="w-10 h-10 text-primary animate-pulse mx-auto" />
              <div className="text-sm font-semibold text-foreground">
                Analizando currículum...
              </div>
              <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-150"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <div className="text-[10px] text-muted-foreground font-mono">
                {uploadProgress}% completado
              </div>
            </div>
          ) : (
            <>
              <div className="rounded-full bg-primary/10 p-4 text-primary">
                <UploadCloud className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-foreground">Arrastra tu archivo aquí</p>
                <p className="text-xs text-muted-foreground">
                  Soporta formatos PDF y DOCX hasta 5MB
                </p>
              </div>
              <label className="mt-2">
                <span className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-xs font-semibold text-primary-foreground hover:bg-primary/95 transition-colors cursor-pointer shadow-xs">
                  Seleccionar Archivo
                </span>
                <input
                  type="file"
                  accept=".pdf,.docx"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </label>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
