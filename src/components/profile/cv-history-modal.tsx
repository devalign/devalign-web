'use client';

import React, { useState } from 'react';
import { useUserCVs, useReanalyzeCV } from '@/hooks/use-user-cvs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  FileText,
  Download,
  RefreshCw,
  AlertTriangle,
  Calendar,
  HardDrive,
  CheckCircle,
  Loader2,
  ChevronLeft,
} from 'lucide-react';
import { toast } from 'sonner';

interface CVHistoryModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  activeCvId?: string;
  onReanalyzeTriggered: (cvId: string) => void;
}

export default function CVHistoryModal({
  isOpen,
  onOpenChange,
  activeCvId,
  onReanalyzeTriggered,
}: CVHistoryModalProps) {
  const { data: cvData, isLoading, refetch } = useUserCVs();
  const reanalyzeMutation = useReanalyzeCV();

  // State to track if user clicked "Re-analizar" and which CV they selected
  const [confirmingCvId, setConfirmingCvId] = useState<string | null>(null);

  const selectedCv = cvData?.cvs?.find((cv) => cv.cv_id === confirmingCvId);

  const handleClose = () => {
    setConfirmingCvId(null);
    onOpenChange(false);
  };

  const handleReanalyzeConfirm = async () => {
    if (!confirmingCvId) return;

    const toastId = toast.loading('Iniciando el re-análisis del currículum...');
    try {
      await reanalyzeMutation.mutateAsync(confirmingCvId);
      toast.dismiss(toastId);

      // Trigger context logic (polling, etc.) in the page
      onReanalyzeTriggered(confirmingCvId);

      // Close the modal
      handleClose();
    } catch (error) {
      console.error('Error starting CV re-analysis:', error);
      toast.dismiss(toastId);
      toast.error('Ocurrió un error al intentar iniciar el re-análisis.');
    }
  };

  const cvsList = cvData?.cvs || [];

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) handleClose();
        else onOpenChange(true);
      }}
    >
      <DialogContent className="sm:max-w-[500px] border-border bg-card shadow-2xl p-6">
        {confirmingCvId && selectedCv ? (
          // Confirmation View
          <div className="space-y-5">
            <DialogHeader>
              <div className="flex items-center gap-2 text-amber-500 mb-1">
                <AlertTriangle className="h-5 w-5 animate-pulse" />
                <DialogTitle className="text-sm font-extrabold uppercase tracking-wider text-foreground">
                  Confirmar Re-análisis
                </DialogTitle>
              </div>
              <DialogDescription className="text-xs text-muted-foreground">
                Estás a punto de re-calcular tu perfil profesional usando una versión anterior de tu
                currículum.
              </DialogDescription>
            </DialogHeader>

            <div className="bg-secondary/10 p-3.5 rounded-xl border border-border/40 space-y-1.5">
              <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                Documento Seleccionado
              </span>
              <div className="flex items-center gap-2.5">
                <FileText className="h-4 w-4 text-red-500" />
                <span
                  className="text-xs font-semibold text-foreground truncate"
                  title={selectedCv.original_filename}
                >
                  {selectedCv.original_filename}
                </span>
              </div>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 p-4 rounded-xl text-xs space-y-1.5 leading-relaxed">
              <p className="font-bold flex items-center gap-1.5">
                <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                ¡Atención!
              </p>
              <p>
                Este proceso **sobrescribirá completamente tu perfil actual** y recalculará tu
                diagnóstico técnico. Cualquier cambio manual que hayas realizado en tus habilidades,
                experiencia, educación o certificaciones se perderá.
              </p>
            </div>

            <div className="flex justify-end gap-2.5 pt-2 border-t border-border/50">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setConfirmingCvId(null)}
                className="text-xs font-semibold border-border hover:bg-muted"
                disabled={reanalyzeMutation.isPending}
              >
                <ChevronLeft className="mr-1 h-3.5 w-3.5" />
                Volver al historial
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={handleReanalyzeConfirm}
                className="text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={reanalyzeMutation.isPending}
              >
                {reanalyzeMutation.isPending ? (
                  <>
                    <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
                    Sí, re-analizar
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          // History List View
          <div className="space-y-4">
            <DialogHeader>
              <DialogTitle className="text-sm font-extrabold uppercase tracking-wider text-foreground">
                Historial de Versiones
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Consulta los documentos subidos anteriormente y selecciona uno para restablecer tu
                perfil en base a ese análisis.
              </DialogDescription>
            </DialogHeader>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-3">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-xs text-muted-foreground font-semibold">Cargando versiones...</p>
              </div>
            ) : cvsList.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border bg-secondary/5 p-8 text-center">
                <FileText className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-xs font-bold text-foreground">Sin historial</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  No se han encontrado currículums subidos anteriormente.
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                {cvsList.map((cv) => {
                  const isActive = cv.cv_id === activeCvId;

                  return (
                    <div
                      key={cv.cv_id}
                      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border transition-all ${
                        isActive
                          ? 'border-primary/30 bg-primary/5 shadow-sm shadow-primary/5'
                          : 'border-border/60 hover:border-border hover:bg-secondary/10'
                      }`}
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div
                          className={`rounded-lg p-2 shrink-0 ${
                            isActive
                              ? 'bg-primary/10 text-primary'
                              : 'bg-secondary/20 text-muted-foreground'
                          }`}
                        >
                          <FileText className="h-4 w-4" />
                        </div>
                        <div className="space-y-1 min-w-0">
                          <p
                            className="text-xs font-bold text-foreground truncate max-w-[200px] sm:max-w-[220px]"
                            title={cv.original_filename}
                          >
                            {cv.original_filename}
                          </p>
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[9px] text-muted-foreground font-mono">
                            <span className="flex items-center gap-0.5">
                              <HardDrive className="h-2.5 w-2.5 shrink-0" />
                              {(cv.size_bytes / 1024 / 1024).toFixed(2)} MB
                            </span>
                            <span>&bull;</span>
                            {cv.uploaded_at && (
                              <span className="flex items-center gap-0.5">
                                <Calendar className="h-2.5 w-2.5 shrink-0" />
                                {new Date(cv.uploaded_at).toLocaleDateString(undefined, {
                                  day: '2-digit',
                                  month: '2-digit',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                        {cv.download_url && (
                          <Button
                            asChild
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer rounded-lg border border-border/30 hover:border-border/80"
                            title="Descargar archivo original"
                          >
                            <a href={cv.download_url} download target="_blank" rel="noreferrer">
                              <Download className="h-3.5 w-3.5" />
                            </a>
                          </Button>
                        )}

                        {isActive ? (
                          <div className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/5 border border-emerald-500/20 rounded-lg">
                            <CheckCircle className="h-3 w-3 text-emerald-500" />
                            Activo
                          </div>
                        ) : (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setConfirmingCvId(cv.cv_id)}
                            className="h-8 text-[10px] font-bold gap-1 cursor-pointer border-border hover:bg-secondary/15 text-foreground hover:text-primary transition-all"
                          >
                            <RefreshCw className="h-3 w-3 shrink-0" />
                            Re-analizar
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="flex justify-end pt-3 border-t border-border/50">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleClose}
                className="text-xs font-semibold border-border hover:bg-muted cursor-pointer"
              >
                Cerrar
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
