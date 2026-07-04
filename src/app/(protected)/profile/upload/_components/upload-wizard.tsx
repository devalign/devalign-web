'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StepLoadCV } from './step-load-cv';
import { StepProcessingCV } from './step-processing-cv';
import { StepConfirmSkills } from './step-confirm-skills';
import { useCVAnalysis } from '@/contexts/cv-analysis-context';

type WizardStep = 'load' | 'processing' | 'confirm';

export function UploadWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAnalyzing, isSkillsDetected, analyzedCvId, cancelAnalysis } = useCVAnalysis();
  const existingCvId = searchParams.get('cvId') || analyzedCvId;
  
  const [currentStep, setCurrentStep] = useState<WizardStep>(() => {
    if (isSkillsDetected) return 'confirm';
    if (isAnalyzing || existingCvId) return 'processing';
    return 'load';
  });
  const [cvId, setCvId] = useState<string | null>(existingCvId);

  useEffect(() => {
    if (isSkillsDetected) {
      setCurrentStep('confirm');
    } else if (isAnalyzing) {
      setCurrentStep('processing');
    }
  }, [isAnalyzing, isSkillsDetected]);

  useEffect(() => {
    if (analyzedCvId && cvId !== analyzedCvId) {
      setCvId(analyzedCvId);
    }
  }, [analyzedCvId, cvId]);

  const handleUploadSuccess = useCallback((newCvId: string) => {
    setCvId(newCvId);
    setCurrentStep('processing');
  }, []);

  const handleSkillsDetected = useCallback(() => {
    setCurrentStep('confirm');
  }, []);

  const handleCancel = useCallback(() => {
    cancelAnalysis();
    router.push('/profile');
  }, [router, cancelAnalysis]);

  const handleBack = useCallback(() => {
    router.push('/profile');
  }, [router]);

  const handleComplete = useCallback(() => {
    router.push(`/profile?status=updating&expectedCvId=${cvId}`);
  }, [router, cvId]);

  const stepLabels = ['Cargar CV', 'Procesando CV', 'Confirmar competencias'];
  const stepIndex = currentStep === 'load' ? 0 : currentStep === 'processing' ? 1 : 2;

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-8 space-y-8">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBack}
          className="h-8 w-8"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-lg font-black tracking-tight text-foreground">
            Subir nuevo CV
          </h1>
          <p className="text-xs text-muted-foreground">
            Sigue los pasos para actualizar tu perfil
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {stepLabels.map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div
              className={`flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold transition-colors ${
                i < stepIndex
                  ? 'bg-primary/10 text-primary'
                  : i === stepIndex
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
              }`}
            >
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                  i <= stepIndex ? 'bg-background/20' : 'bg-background'
                }`}
              >
                {i + 1}
              </span>
              {label}
            </div>
            {i < stepLabels.length - 1 && (
              <div
                className={`hidden sm:block h-px w-8 ${
                  i < stepIndex ? 'bg-primary' : 'bg-border'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {currentStep === 'load' && (
        <StepLoadCV onUploadSuccess={handleUploadSuccess} onCancel={handleCancel} />
      )}

      {currentStep === 'processing' && cvId && (
        <StepProcessingCV
          cvId={cvId}
          onSkillsDetected={handleSkillsDetected}
          onCancel={handleCancel}
        />
      )}

      {currentStep === 'confirm' && cvId && (
        <StepConfirmSkills
          cvId={cvId}
          onComplete={handleComplete}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}

