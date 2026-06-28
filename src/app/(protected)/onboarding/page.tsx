'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, CheckCircle2, Loader2, Hexagon, WifiOff } from 'lucide-react';
import { useUserCVs } from '@/hooks/use-user-cvs';
import { useCVAnalysis } from '@/contexts/cv-analysis-context';
import CVUploader from '@/components/profile/cv-uploader';
import { Button } from '@/components/ui/button';

export default function OnboardingPage() {
  const router = useRouter();
  const { data: cvData, isLoading, isError, refetch } = useUserCVs();
  const { startAnalysis, isAnalyzing, isAnalysisReady, commitUpdate } = useCVAnalysis();

  const hasCV = !!(cvData?.cvs && cvData.cvs.length > 0);

  useEffect(() => {
    if (hasCV && !isAnalyzing && !isAnalysisReady) {
      router.replace('/overview');
    }
  }, [hasCV, isAnalyzing, isAnalysisReady, router]);

  useEffect(() => {
    if (isAnalysisReady) {
      const timer = setTimeout(() => {
        commitUpdate().then(() => {
          router.replace('/overview');
        });
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isAnalysisReady, commitUpdate, router]);

  if (isAnalysisReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="max-w-lg w-full space-y-6 text-center animate-in fade-in zoom-in duration-500">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-success/10 text-success">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-black text-foreground tracking-tight">
              ¡Análisis completo!
            </h1>
            <p className="text-muted-foreground text-sm">
              Tu perfil profesional está listo. Redirigiendo al dashboard...
            </p>
          </div>
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground mx-auto" />
        </div>
      </div>
    );
  }

  if (isAnalyzing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="max-w-lg w-full space-y-6 text-center animate-in fade-in duration-500">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Loader2 className="h-10 w-10 animate-spin" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-black text-foreground tracking-tight">
              Analizando tu CV
            </h1>
            <p className="text-muted-foreground text-sm">
              Nuestro motor de IA está extrayendo tus competencias, fortalezas y brechas técnicas.
            </p>
          </div>
          <div className="flex justify-center gap-1">
            <span className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
          <p className="text-xs text-muted-foreground">Puedes cerrar esta página, el análisis continúa en segundo plano.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 py-10">
      <div className="max-w-lg w-full space-y-8">
        {isError ? (
          <div className="text-center space-y-6">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-warning/10 text-warning">
              <WifiOff className="h-8 w-8" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-black text-foreground tracking-tight">
                Sin conexión al servidor
              </h1>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-md mx-auto">
                No pudimos verificar si ya tienes un CV registrado. Aun así puedes subir tu
                currículum ahora; se procesará cuando el servidor esté disponible.
              </p>
            </div>
            <div className="flex justify-center gap-3">
              <Button onClick={() => refetch()} variant="outline" className="gap-2 h-10 text-xs font-bold">
                <Loader2 className="h-4 w-4" />
                Reintentar conexión
              </Button>
            </div>
            <div className="border-t border-border pt-6">
              <CVUploader
                onUploadSuccess={(cvId) => {
                  if (cvId) startAnalysis(cvId);
                }}
              />
            </div>
          </div>
        ) : (
          <div className="text-center space-y-6">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-inner">
              <Hexagon className="h-8 w-8 fill-primary/20" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-black text-foreground tracking-tight flex items-center justify-center gap-2">
                <Sparkles className="w-6 h-6 text-primary" />
                Bienvenido a Devalign
              </h1>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-md mx-auto">
                Para comenzar, sube tu currículum. Analizaremos tus competencias técnicas y
                descubriremos tu alineación con las especialidades más demandadas del mercado IT.
              </p>
            </div>
            <CVUploader
              onUploadSuccess={(cvId) => {
                if (cvId) startAnalysis(cvId);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
