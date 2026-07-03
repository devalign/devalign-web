import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { listUserCVs, getUserProfile } from '@/lib/api';
import { toast } from 'sonner';

export type AnalysisPhase = 'phase1' | 'phase2';

interface CVAnalysisContextType {
  isAnalyzing: boolean;
  isAnalysisReady: boolean;
  analyzedCvId: string | null;
  analysisPhase: AnalysisPhase;
  elapsedSeconds: number;
  startAnalysis: (cvId: string) => void;
  commitUpdate: () => Promise<void>;
  cancelAnalysis: () => void;
}

const CVAnalysisContext = createContext<CVAnalysisContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'devalign_cv_analysis_state';
const MAX_POLLING_DURATION = 90000;
const STALL_WARNING_MS = 30000;
const PHASE1_DURATION_MS = 7000;

export function CVAnalysisProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isAnalysisReady, setIsAnalysisReady] = useState(false);
  const [analyzedCvId, setAnalyzedCvId] = useState<string | null>(null);
  const [analysisPhase, setAnalysisPhase] = useState<AnalysisPhase>('phase1');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const phaseTimerRef = useRef<NodeJS.Timeout | null>(null);
  const elapsedTimerRef = useRef<NodeJS.Timeout | null>(null);
  const stallWarningShownRef = useRef(false);

  const clearPollInterval = useCallback(() => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
  }, []);

  const clearAllTimers = useCallback(() => {
    clearPollInterval();
    if (phaseTimerRef.current) {
      clearTimeout(phaseTimerRef.current);
      phaseTimerRef.current = null;
    }
    if (elapsedTimerRef.current) {
      clearInterval(elapsedTimerRef.current);
      elapsedTimerRef.current = null;
    }
  }, [clearPollInterval]);

  const saveState = (
    analyzing: boolean,
    ready: boolean,
    cvId: string | null,
    startTime?: number,
    phase?: AnalysisPhase,
    elapsed?: number,
  ) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify({
          isAnalyzing: analyzing,
          isAnalysisReady: ready,
          analyzedCvId: cvId,
          startTime: startTime || Date.now(),
          analysisPhase: phase || 'phase1',
          elapsedSeconds: elapsed || 0,
        }),
      );
    }
  };

  const pollCvStatus = useCallback(
    (cvId: string, initialStartTime?: number) => {
      clearPollInterval();

      const startTime = initialStartTime || Date.now();

      const checkStatus = async () => {
        const elapsed = Date.now() - startTime;
        if (!stallWarningShownRef.current && elapsed >= STALL_WARNING_MS) {
          stallWarningShownRef.current = true;
          toast.info('El análisis está tomando más de lo habitual, pero sigue procesando. Gracias por tu paciencia.');
        }
        if (elapsed >= MAX_POLLING_DURATION) {
          // Before clearing state, check if the profile has already been diagnosed.
          // If so, treat as completed instead of resetting to empty.
          try {
            const profile = await getUserProfile();
            if (profile?.is_diagnosed) {
              clearAllTimers();
              setIsAnalyzing(false);
              setIsAnalysisReady(true);
              setAnalyzedCvId(cvId);
              saveState(false, true, cvId);
              queryClient.invalidateQueries({ queryKey: ['userProfile'] });
              queryClient.invalidateQueries({ queryKey: ['userCVs'] });
              toast.success('¡Análisis completado!');
              return;
            }
          } catch { /* ignore profile check on timeout */ }

          clearAllTimers();
          setIsAnalyzing(false);
          setIsAnalysisReady(false);
          setAnalyzedCvId(null);
          setAnalysisPhase('phase1');
          setElapsedSeconds(0);
          saveState(false, false, null);
          toast.warning(
            'El análisis está tomando más de lo esperado. Puedes intentar actualizar tus datos en unos instantes.',
          );
          return;
        }

        try {
          const data = await listUserCVs();
          const currentCv = data.cvs.find((c) => c.cv_id === cvId);
          if (currentCv) {
            if (currentCv.status === 'completed') {
              clearAllTimers();
              setIsAnalyzing(false);
              setIsAnalysisReady(true);
              setAnalyzedCvId(cvId);
              saveState(false, true, cvId);
              queryClient.invalidateQueries({ queryKey: ['userProfile'] });
              queryClient.invalidateQueries({ queryKey: ['userCVs'] });
              return;
            } else if (currentCv.status === 'failed') {
              clearAllTimers();
              setIsAnalyzing(false);
              setIsAnalysisReady(false);
              setAnalyzedCvId(null);
              setAnalysisPhase('phase1');
              setElapsedSeconds(0);
              saveState(false, false, null);
              const backendError = currentCv.error_message;
              let friendlyError = 'Hubo un problema al procesar tu CV. Por favor, intenta de nuevo.';
              if (backendError) {
                const lower = backendError.toLowerCase();
                if (lower.includes('not a valid cv') || lower.includes('not a resume') || lower.includes('no es un cv') || lower.includes('no es un currículum')) {
                  friendlyError = 'El archivo no parece ser un currículum válido. Asegúrate de que contenga experiencia, educación y habilidades técnicas.';
                } else if (lower.includes('llm') || lower.includes('extraction fail')) {
                  friendlyError = 'No pudimos extraer la información de tu CV. Intenta de nuevo o contacta a soporte.';
                } else if (lower.includes('too large') || lower.includes('exceeds')) {
                  friendlyError = 'El archivo excede el tamaño máximo permitido.';
                } else {
                  friendlyError = backendError;
                }
              }
              toast.error(friendlyError);
              return;
            }
          }

          // CV status not yet 'completed' — check if the profile has already been diagnosed.
          // The backend may mark the profile as diagnosed before the CV status flips.
          const profile = await getUserProfile();
          if (profile?.is_diagnosed) {
            clearAllTimers();
            setIsAnalyzing(false);
            setIsAnalysisReady(true);
            setAnalyzedCvId(cvId);
            saveState(false, true, cvId);
            queryClient.invalidateQueries({ queryKey: ['userProfile'] });
            queryClient.invalidateQueries({ queryKey: ['userCVs'] });
          }
        } catch (err) {
          console.error('Error polling CV status:', err);
        }
      };

      checkStatus();
      pollIntervalRef.current = setInterval(checkStatus, 2000);
    },
    [clearAllTimers, clearPollInterval, queryClient],
  );

  const startPhases = useCallback(() => {
    setAnalysisPhase('phase1');
    setElapsedSeconds(0);

    phaseTimerRef.current = setTimeout(() => {
      setAnalysisPhase('phase2');
    }, PHASE1_DURATION_MS);

    elapsedTimerRef.current = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
  }, []);

  const startAnalysis = useCallback(
    (cvId: string) => {
      stallWarningShownRef.current = false;
      setIsAnalyzing(true);
      setIsAnalysisReady(false);
      setAnalyzedCvId(cvId);
      setAnalysisPhase('phase1');
      setElapsedSeconds(0);
      const startTime = Date.now();
      saveState(true, false, cvId, startTime, 'phase1', 0);

      // Force React Query to refetch CV list so the new CV appears immediately
      // and EmptyProfileState transitions to the profile view.
      queryClient.invalidateQueries({ queryKey: ['userCVs'] });

      startPhases();
      pollCvStatus(cvId, startTime);
    },
    [pollCvStatus, queryClient, startPhases],
  );

  const cancelAnalysis = useCallback(() => {
    clearAllTimers();
    setIsAnalyzing(false);
    setIsAnalysisReady(false);
    setAnalyzedCvId(null);
    setAnalysisPhase('phase1');
    setElapsedSeconds(0);
    saveState(false, false, null);
    toast.info('Análisis cancelado.');
  }, [clearAllTimers]);

  const commitUpdate = useCallback(async () => {
    const toastId = toast.loading('Aplicando nuevos datos de análisis a tu perfil...');
    try {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['userProfile'] }),
        queryClient.invalidateQueries({ queryKey: ['userCVs'] }),
      ]);

      clearAllTimers();
      setIsAnalyzing(false);
      setIsAnalysisReady(false);
      setAnalyzedCvId(null);
      setAnalysisPhase('phase1');
      setElapsedSeconds(0);
      saveState(false, false, null);

      toast.dismiss(toastId);
      toast.success('¡Perfil y diagnóstico actualizados con éxito!');
    } catch (error) {
      console.error('Error committing update:', error);
      toast.dismiss(toastId);
      toast.error('Error al aplicar la actualización.');
    }
  }, [queryClient, clearAllTimers]);

  // Restore state on mount and check status
  useEffect(() => {
    let active = true;

    async function restoreAndCheck() {
      if (typeof window === 'undefined') return;

      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (!stored) return;

      try {
        const parsed = JSON.parse(stored);
        if (parsed.isAnalyzing && parsed.analyzedCvId) {
          const startTime = parsed.startTime || Date.now();
          const elapsed = Date.now() - startTime;

          if (elapsed >= MAX_POLLING_DURATION) {
            // If the profile is already diagnosed, treat as completed.
            try {
              const profile = await getUserProfile();
              if (profile?.is_diagnosed) {
                setIsAnalyzing(false);
                setIsAnalysisReady(true);
                saveState(false, true, parsed.analyzedCvId);
                queryClient.invalidateQueries({ queryKey: ['userProfile'] });
                queryClient.invalidateQueries({ queryKey: ['userCVs'] });
                return;
              }
            } catch { /* ignore */ }

            setIsAnalyzing(false);
            setIsAnalysisReady(false);
            setAnalyzedCvId(null);
            setAnalysisPhase('phase1');
            setElapsedSeconds(0);
            localStorage.removeItem(LOCAL_STORAGE_KEY);
            return;
          }

          setIsAnalyzing(true);
          setAnalyzedCvId(parsed.analyzedCvId);
          setAnalysisPhase(parsed.analysisPhase || 'phase1');
          setElapsedSeconds(parsed.elapsedSeconds || Math.floor(elapsed / 1000));

          try {
            const data = await listUserCVs();
            const currentCv = data.cvs.find((c) => c.cv_id === parsed.analyzedCvId);

            if (!active) return;

            if (currentCv) {
              if (currentCv.status === 'completed') {
                setIsAnalyzing(false);
                setIsAnalysisReady(true);
                saveState(false, true, parsed.analyzedCvId);
                return;
              } else if (currentCv.status === 'failed') {
                setIsAnalyzing(false);
                setIsAnalysisReady(false);
                setAnalyzedCvId(null);
                setAnalysisPhase('phase1');
                setElapsedSeconds(0);
                saveState(false, false, null);
                return;
              }
            }
          } catch (apiError) {
            console.error('Error checking current CV status on mount:', apiError);
          }

          if (active) {
            // Before resuming timers, check if the profile is already diagnosed.
            try {
              const profile = await getUserProfile();
              if (profile?.is_diagnosed) {
                setIsAnalyzing(false);
                setIsAnalysisReady(true);
                saveState(false, true, parsed.analyzedCvId);
                queryClient.invalidateQueries({ queryKey: ['userProfile'] });
                queryClient.invalidateQueries({ queryKey: ['userCVs'] });
                return;
              }
            } catch { /* ignore */ }

            const savedPhase = parsed.analysisPhase || 'phase1';
            const savedElapsed = parsed.elapsedSeconds || 0;
            setAnalysisPhase(savedPhase);
            setElapsedSeconds(savedElapsed);

            // Start timers WITHOUT resetting elapsedSeconds (unlike startPhases)
            if (savedPhase === 'phase1') {
              phaseTimerRef.current = setTimeout(() => {
                setAnalysisPhase('phase2');
              }, PHASE1_DURATION_MS);
            }
            elapsedTimerRef.current = setInterval(() => {
              setElapsedSeconds((prev) => prev + 1);
            }, 1000);

            pollCvStatus(parsed.analyzedCvId, startTime);
          }
        } else if (parsed.isAnalysisReady) {
          setIsAnalysisReady(true);
          setAnalyzedCvId(parsed.analyzedCvId);
          queryClient.invalidateQueries({ queryKey: ['userProfile'] });
          queryClient.invalidateQueries({ queryKey: ['userCVs'] });
        }
      } catch (e) {
        console.error('Error parsing stored CV analysis state:', e);
      }
    }

    restoreAndCheck();

    return () => {
      active = false;
    };
  }, [pollCvStatus, startPhases]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearAllTimers();
    };
  }, [clearAllTimers]);

  return (
    <CVAnalysisContext.Provider
      value={{
        isAnalyzing,
        isAnalysisReady,
        analyzedCvId,
        analysisPhase,
        elapsedSeconds,
        startAnalysis,
        commitUpdate,
        cancelAnalysis,
      }}
    >
      {children}
    </CVAnalysisContext.Provider>
  );
}

export function useCVAnalysis() {
  const context = useContext(CVAnalysisContext);
  if (!context) {
    throw new Error('useCVAnalysis must be used within a CVAnalysisProvider');
  }
  return context;
}
