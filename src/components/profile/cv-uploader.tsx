'use client';

import React, { useRef, useState } from 'react';
import { useUploadCV } from '@/hooks/use-upload-cv';
import { UploadCloud, FileText, Loader2, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface CVUploaderProps {
  onUploadSuccess?: () => void;
}

export default function CVUploader({ onUploadSuccess }: CVUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const uploadMutation = useUploadCV();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file: File) => {
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

    setSelectedFile(file);
    toast.success(`Archivo seleccionado: ${file.name}`);
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      await uploadMutation.mutateAsync(selectedFile);
      toast.success('¡Tu CV se ha subido y el diagnóstico inicial ha comenzado!');
      setSelectedFile(null);
      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : 'Error al subir el archivo';
      toast.error(errorMessage);
    }
  };

  const isUploading = uploadMutation.isPending;

  return (
    <div className="w-full space-y-4">
      {/* Zona de Drop */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={onButtonClick}
        className={cn(
          'relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 md:p-12 text-center transition-all duration-300 cursor-pointer bg-card',
          dragActive
            ? 'border-primary bg-primary/5 scale-[1.01] shadow-lg shadow-primary/5'
            : 'border-border hover:border-primary/50 hover:bg-secondary/20',
          isUploading ? 'pointer-events-none opacity-60' : '',
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".pdf,.docx,.doc"
          onChange={handleChange}
          disabled={isUploading}
        />

        <div className="space-y-4">
          {/* Icono de estado */}
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            {isUploading ? (
              <Loader2 className="h-7 w-7 animate-spin" />
            ) : selectedFile ? (
              <FileText className="h-7 w-7 animate-bounce" />
            ) : (
              <UploadCloud className="h-7 w-7" />
            )}
          </div>

          {/* Textos descriptivos */}
          <div className="space-y-1">
            {selectedFile ? (
              <div className="space-y-1">
                <p className="text-sm font-semibold text-foreground">Archivo listo para análisis</p>
                <p className="text-xs text-muted-foreground font-mono truncate max-w-xs md:max-w-md mx-auto">
                  {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                <p className="text-sm font-semibold text-foreground">
                  Arrastra y suelta tu CV aquí
                </p>
                <p className="text-xs text-muted-foreground">o selecciona un archivo PDF o Word</p>
              </div>
            )}
          </div>

          {/* Restricciones */}
          <div className="text-[10px] text-muted-foreground/80 font-medium">
            Máx. 5MB &bull; PDF, DOCX &bull; Español o Inglés
          </div>
        </div>

        {/* Overlay de Carga */}
        {isUploading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-card/85 rounded-2xl backdrop-blur-[2px] transition-all">
            <Loader2 className="h-8 w-8 text-primary animate-spin mb-3" />
            <p className="text-sm font-bold text-foreground">Subiendo y analizando...</p>
            <p className="text-xs text-muted-foreground mt-1">
              Extrayendo habilidades con Inteligencia Artificial
            </p>
          </div>
        )}
      </div>

      {/* Boton de Accion / Envio */}
      {selectedFile && !isUploading && (
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Button
            onClick={handleUpload}
            className="w-full sm:flex-1 py-6 text-sm font-semibold bg-primary-foreground text-primary hover:bg-primary-foreground/90 flex items-center justify-center gap-2 rounded-xl shadow-md transition-all active:scale-[0.98]"
          >
            <UploadCloud className="h-5 w-5" />
            Analizar mi CV
          </Button>
          <Button
            variant="outline"
            onClick={() => setSelectedFile(null)}
            className="w-full sm:w-auto py-6 px-6 text-xs text-muted-foreground border-border hover:bg-muted"
          >
            Cancelar
          </Button>
        </div>
      )}

      {/* Nota Legal */}
      <p className="text-[10px] text-center text-muted-foreground leading-relaxed max-w-md mx-auto">
        <Lock className="h-3 w-3 inline-block mr-1 align-text-bottom text-muted-foreground/80" />
        Al subir tu CV, aceptas nuestros{' '}
        <span className="underline hover:text-foreground cursor-pointer">
          términos de servicio
        </span>{' '}
        y protocolos de análisis profesional encriptado.
      </p>
    </div>
  );
}
