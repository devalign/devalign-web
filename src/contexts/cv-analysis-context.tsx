import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getUserProfile, listUserCVs } from '@/lib/api';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';

interface CVAnalysisContextType {
  isAnalyzing: boolean;
  isAnalysisReady: boolean;
  analyzedCvId: string | null;
  startAnalysis: (cvId: string) => void;
  commitUpdate: () => Promise<void>;
  cancelAnalysis: () => void;
}

const CVAnalysisContext = createContext<CVAnalysisContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'devalign_cv_analysis_state';
const MAX_POLLING_DURATION = 90000; // 90 seconds total timeout

export function CVAnalysisProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isAnalysisReady, setIsAnalysisReady] = useState(false);
  const [analyzedCvId, setAnalyzedCvId] = useState<string | null>(null);

  const channelRef = useRef<any>(null);
  // Separate refs for the poll interval and any one-shot timeout
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Persistence to LocalStorage
  const saveState = (
    analyzing: boolean,
    ready: boolean,
    cvId: string | null,
    startTime?: number,
  ) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify({
          isAnalyzing: analyzing,
          isAnalysisReady: ready,
          analyzedCvId: cvId,
          startTime: startTime || Date.now(),
        }),
      );
    }
  };

  const unsubscribeFromCvChanges = useCallback(() => {
    if (channelRef.current) {
      channelRef.current.unsubscribe();
      channelRef.current = null;
    }
    // Use clearInterval — the poll is a setInterval, not a setTimeout
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
  }, []);

  const pollCvStatus = useCallback(
    (cvId: string, initialStartTime?: number) => {
      // Cancel any existing poll before starting a new one
      unsubscribeFromCvChanges();

      const startTime = initialStartTime || Date.now();

      const checkStatus = async () => {
        const elapsed = Date.now() - startTime;
        if (elapsed >= MAX_POLLING_DURATION) {
          // Stop polling first, then update state
          if (pollIntervalRef.current) {
            clearInterval(pollIntervalRef.current);
            pollIntervalRef.current = null;
          }
          setIsAnalyzing(false);
          setIsAnalysisReady(false);
          setAnalyzedCvId(null);
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
              // Stop polling BEFORE setting state to avoid race conditions
              if (pollIntervalRef.current) {
                clearInterval(pollIntervalRef.current);
                pollIntervalRef.current = null;
              }
              setIsAnalyzing(false);
              setIsAnalysisReady(true);
              saveState(false, true, cvId);
              toast.success(
                '¡Análisis finalizado! Los datos de tu nuevo CV están listos para ser aplicados.',
              );
            } else if (currentCv.status === 'failed') {
              // Stop polling BEFORE setting state
              if (pollIntervalRef.current) {
                clearInterval(pollIntervalRef.current);
                pollIntervalRef.current = null;
              }
              setIsAnalyzing(false);
              setIsAnalysisReady(false);
              setAnalyzedCvId(null);
              saveState(false, false, null);
              toast.error('Hubo un problema al procesar tu CV. Por favor, intenta de nuevo.');
            }
          }
        } catch (err) {
          console.error('Error polling CV status:', err);
        }
      };

      // First check immediately
      checkStatus();

      // Then poll every 3 seconds; store in ref so clearInterval can cancel it
      pollIntervalRef.current = setInterval(checkStatus, 3000);
    },
    [unsubscribeFromCvChanges],
  );

  const startAnalysis = useCallback(
    (cvId: string) => {
      setIsAnalyzing(true);
      setIsAnalysisReady(false);
      setAnalyzedCvId(cvId);
      const startTime = Date.now();
      saveState(true, false, cvId, startTime);

      pollCvStatus(cvId, startTime);
    },
    [pollCvStatus],
  );

  const cancelAnalysis = useCallback(() => {
    setIsAnalyzing(false);
    setIsAnalysisReady(false);
    setAnalyzedCvId(null);
    unsubscribeFromCvChanges();
    saveState(false, false, null);
    toast.info('Análisis cancelado.');
  }, [unsubscribeFromCvChanges]);

  const commitUpdate = useCallback(async () => {
    const toastId = toast.loading('Aplicando nuevos datos de análisis a tu perfil...');
    try {
      // Invalidate queries to refresh UI with new profile & cvs
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['userProfile'] }),
        queryClient.invalidateQueries({ queryKey: ['userCVs'] }),
      ]);

      setIsAnalyzing(false);
      setIsAnalysisReady(false);
      setAnalyzedCvId(null);
      unsubscribeFromCvChanges();
      saveState(false, false, null);

      toast.dismiss(toastId);
      toast.success('¡Perfil y diagnóstico actualizados con éxito!');
    } catch (error) {
      console.error('Error committing update:', error);
      toast.dismiss(toastId);
      toast.error('Error al aplicar la actualización.');
    }
  }, [queryClient, unsubscribeFromCvChanges]);

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
            setIsAnalyzing(false);
            setIsAnalysisReady(false);
            setAnalyzedCvId(null);
            localStorage.removeItem(LOCAL_STORAGE_KEY);
            console.warn('Analysis timed out while away.');
            return;
          }

          // Fetch latest CVs to check if status was updated while user was offline/away
          setIsAnalyzing(true);
          setAnalyzedCvId(parsed.analyzedCvId);

          try {
            const data = await listUserCVs();
            const currentCv = data.cvs.find((c) => c.cv_id === parsed.analyzedCvId);

            if (!active) return;

            if (currentCv) {
              if (currentCv.status === 'completed') {
                setIsAnalyzing(false);
                setIsAnalysisReady(true);
                saveState(false, true, parsed.analyzedCvId);
                toast.success(
                  '¡Análisis finalizado! Los datos de tu nuevo CV están listos para ser aplicados.',
                );
                return;
              } else if (currentCv.status === 'failed') {
                setIsAnalyzing(false);
                setIsAnalysisReady(false);
                setAnalyzedCvId(null);
                saveState(false, false, null);
                return;
              }
            }
          } catch (apiError) {
            console.error('Error checking current CV status on mount:', apiError);
          }

          // If still processing, resume polling
          if (active) {
            pollCvStatus(parsed.analyzedCvId, startTime);
          }
        } else if (parsed.isAnalysisReady) {
          setIsAnalysisReady(true);
          setAnalyzedCvId(parsed.analyzedCvId);
        }
      } catch (e) {
        console.error('Error parsing stored CV analysis state:', e);
      }
    }

    restoreAndCheck();

    return () => {
      active = false;
    };
  }, [pollCvStatus]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      unsubscribeFromCvChanges();
    };
  }, [unsubscribeFromCvChanges]);

  return (
    <CVAnalysisContext.Provider
      value={{
        isAnalyzing,
        isAnalysisReady,
        analyzedCvId,
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
