'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useUploadCV } from '@/hooks/use-upload-cv';
import { UploadCloud, FileText, Loader2, Lock, Eye, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const PENDING_FILE_KEY = 'devalign_pending_cv_upload';

interface CVUploaderProps {
  onUploadSuccess?: (cvId: string) => void;
}

const MAGIC_BYTES: Record<string, number[]> = {
  pdf: [0x25, 0x50, 0x44, 0x46],
  docx: [0x50, 0x4b, 0x03, 0x04],
};

async function validateMagicBytes(file: File): Promise<boolean> {
  const slice = file.slice(0, 4);
  const buffer = await slice.arrayBuffer();
  const bytes = new Uint8Array(buffer);

  const isPDF = MAGIC_BYTES.pdf.every((b, i) => bytes[i] === b);
  const isZIP = MAGIC_BYTES.docx.every((b, i) => bytes[i] === b);

  return isPDF || isZIP;
}

export default function CVUploader({ onUploadSuccess }: CVUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pendingFile, setPendingFile] = useState<{ name: string; size: number } | null>(null);

  const uploadMutation = useUploadCV();

  useEffect(() => {
    const stored = sessionStorage.getItem(PENDING_FILE_KEY);
    if (stored) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setPendingFile(JSON.parse(stored));
      } catch {
        /* ignore */
      }
    }
  }, []);

  const clearPendingFile = () => {
    setPendingFile(null);
    sessionStorage.removeItem(PENDING_FILE_KEY);
  };

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

  const validateAndSetFile = async (file: File) => {
    if (file.size === 0) {
      toast.error('El archivo está vacío. Sube un documento con contenido.');
      return;
    }

    const validTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    const extension = file.name.split('.').pop()?.toLowerCase();
    const isValidType =
      validTypes.includes(file.type) || extension === 'pdf' || extension === 'docx';

    if (!isValidType) {
      toast.error('Tipo de archivo no soportado. Sube un PDF o DOCX.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('El archivo excede el límite permitido de 5MB.');
      return;
    }

    const isValidMagic = await validateMagicBytes(file);
    if (!isValidMagic) {
      toast.error(
        'El archivo no es un PDF o DOCX válido. Verifica que el archivo no esté corrupto.',
      );
      return;
    }

    setSelectedFile(file);
    clearPendingFile();
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      const result = await uploadMutation.mutateAsync(selectedFile);
      toast.success('¡Tu CV se ha subido y el diagnóstico inicial ha comenzado!');
      setSelectedFile(null);
      clearPendingFile();
      if (onUploadSuccess) {
        onUploadSuccess(result.cv_id);
      }
    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : 'Error al subir el archivo';
      toast.error(errorMessage);
    }
  };

  const isUploading = uploadMutation.isPending;

  return (
    <div className="w-full space-y-4 bg-card p-6 rounded-2xl border border-border">
      {/* Zona de Drop */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={!selectedFile && !isUploading ? onButtonClick : undefined}
        className={cn(
          'relative flex flex-col items-center justify-center rounded-2xl transition-all duration-300',
          !selectedFile
            ? 'border-2 border-dashed p-8 md:p-12 text-center bg-card'
            : 'border-2 border-dashed border-border/50 bg-secondary/5 p-8',
          dragActive && !selectedFile
            ? 'border-primary bg-primary/5 scale-[1.01] shadow-lg shadow-primary/5'
            : '',
          !dragActive && !selectedFile
            ? 'border-border hover:border-primary/50 hover:bg-secondary/20 cursor-pointer'
            : '',
          isUploading ? 'pointer-events-none opacity-60' : '',
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".pdf,.docx"
          onChange={handleChange}
          disabled={isUploading}
        />

        <div className="space-y-4">
          {!selectedFile && (
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
              <UploadCloud className="h-7 w-7" />
            </div>
          )}

          <div className="space-y-1 w-full">
            {selectedFile ? (
              <div className="w-full flex flex-col items-center justify-center space-y-4">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success/10 text-success">
                  {isUploading ? (
                    <Loader2 className="h-7 w-7 animate-spin" />
                  ) : (
                    <FileText className="h-7 w-7" />
                  )}
                </div>
                <div className="space-y-1 text-center">
                  <p className="text-sm font-semibold text-foreground">
                    {isUploading ? 'Procesando archivo...' : 'Archivo listo para análisis'}
                  </p>
                  <p className="text-xs text-muted-foreground font-mono truncate max-w-[200px] sm:max-w-[320px] mx-auto px-2">
                    {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                </div>

                {selectedFile.type === 'application/pdf' && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 text-xs text-muted-foreground hover:bg-primary/10 hover:text-primary mt-2 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(URL.createObjectURL(selectedFile), '_blank');
                    }}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Abrir vista previa
                  </Button>
                )}
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

          {!selectedFile && (
            <div className="text-[10px] text-muted-foreground/80 font-medium">
              Máx. 5MB &bull; PDF, DOCX &bull; Español o Inglés
            </div>
          )}
        </div>
      </div>

      {/* Archivo pendiente de sesión anterior */}
      {pendingFile && !selectedFile && !isUploading && (
        <div className="flex items-center justify-between gap-3 p-3 rounded-xl border border-warning/20 bg-warning/5">
          <div className="flex items-center gap-2 min-w-0">
            <History className="h-4 w-4 text-warning shrink-0" />
            <span className="text-xs text-muted-foreground truncate">
              Tenías un archivo pendiente:{' '}
              <strong className="text-foreground">{pendingFile.name}</strong>
            </span>
          </div>
          <div className="flex gap-1.5 shrink-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                clearPendingFile();
                onButtonClick();
              }}
              className="h-7 text-[10px] font-bold px-2.5"
            >
              Seleccionar archivo
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearPendingFile}
              className="h-7 text-[10px] text-muted-foreground px-2.5"
            >
              Descartar
            </Button>
          </div>
        </div>
      )}

      {/* Botones de Accion */}
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

      <p className="text-[10px] text-center text-muted-foreground leading-relaxed max-w-md mx-auto">
        <Lock className="h-3 w-3 inline-block mr-1 align-text-bottom text-muted-foreground/80" />
        Al subir tu CV, aceptas nuestros{' '}
        <a
          href="/terms"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-foreground cursor-pointer font-medium"
        >
          términos de servicio
        </a>{' '}
        y protocolos de análisis profesional encriptado.
      </p>
    </div>
  );
}
