import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getUserProfile } from '@/lib/api';
import { toast } from 'sonner';

interface CVAnalysisContextType {
  isAnalyzing: boolean;
  isAnalysisReady: boolean;
  analyzedCvId: string | null;
  startAnalysis: (cvId: string) => void;
  commitUpdate: () => Promise<void>;
}

const CVAnalysisContext = createContext<CVAnalysisContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'devalign_cv_analysis_state';

export function CVAnalysisProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isAnalysisReady, setIsAnalysisReady] = useState(false);
  const [analyzedCvId, setAnalyzedCvId] = useState<string | null>(null);

  const pollingRef = useRef<boolean>(false);
  const targetCvIdRef = useRef<string | null>(null);

  // Persistence to LocalStorage
  const saveState = (analyzing: boolean, ready: boolean, cvId: string | null) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify({ isAnalyzing: analyzing, isAnalysisReady: ready, analyzedCvId: cvId })
      );
    }
  };

  const runPolling = useCallback(async (cvId: string) => {
    if (pollingRef.current && targetCvIdRef.current === cvId) return;
    
    pollingRef.current = true;
    targetCvIdRef.current = cvId;
    
    let attempts = 0;
    const maxAttempts = 30;
    const pollInterval = 3000; // 3 seconds

    const poll = async () => {
      if (!pollingRef.current || targetCvIdRef.current !== cvId) return;

      try {
        const profile = await getUserProfile();
        if (profile && profile.cv_id === cvId) {
          setIsAnalyzing(false);
          setIsAnalysisReady(true);
          pollingRef.current = false;
          saveState(false, true, cvId);
          toast.success('¡Análisis finalizado! Los datos de tu nuevo CV están listos para ser aplicados.');
          return;
        }
      } catch (error) {
        console.error('Error polling profile analysis:', error);
      }

      attempts++;
      if (attempts >= maxAttempts) {
        setIsAnalyzing(false);
        setIsAnalysisReady(false);
        setAnalyzedCvId(null);
        pollingRef.current = false;
        targetCvIdRef.current = null;
        saveState(false, false, null);
        toast.warning(
          'El análisis está tomando más de lo esperado. Puedes intentar actualizar tus datos en unos instantes.'
        );
        return;
      }

      setTimeout(poll, pollInterval);
    };

    poll();
  }, []);

  const startAnalysis = useCallback((cvId: string) => {
    setIsAnalyzing(true);
    setIsAnalysisReady(false);
    setAnalyzedCvId(cvId);
    saveState(true, false, cvId);
    
    toast.info('El análisis de tu CV se está ejecutando en segundo plano. Puedes seguir navegando.');
    
    runPolling(cvId);
  }, [runPolling]);

  const commitUpdate = useCallback(async () => {
    const toastId = toast.loading('Aplicando nuevos datos de análisis a tu perfil...');
    try {
      // Invalidate queries to refresh UI with new profile & cvs
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['userProfile'] }),
        queryClient.invalidateQueries({ queryKey: ['userCVs'] })
      ]);
      
      setIsAnalyzing(false);
      setIsAnalysisReady(false);
      setAnalyzedCvId(null);
      pollingRef.current = false;
      targetCvIdRef.current = null;
      saveState(false, false, null);

      toast.dismiss(toastId);
      toast.success('¡Perfil y diagnóstico actualizados con éxito!');
    } catch (error) {
      console.error('Error committing update:', error);
      toast.dismiss(toastId);
      toast.error('Error al aplicar la actualización.');
    }
  }, [queryClient]);

  // Restore state on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.isAnalyzing && parsed.analyzedCvId) {
            setIsAnalyzing(true);
            setIsAnalysisReady(false);
            setAnalyzedCvId(parsed.analyzedCvId);
            runPolling(parsed.analyzedCvId);
          } else if (parsed.isAnalysisReady) {
            setIsAnalysisReady(true);
            setAnalyzedCvId(parsed.analyzedCvId);
          }
        } catch (e) {
          console.error('Error parsing stored CV analysis state:', e);
        }
      }
    }
  }, [runPolling]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      pollingRef.current = false;
    };
  }, []);

  return (
    <CVAnalysisContext.Provider
      value={{
        isAnalyzing,
        isAnalysisReady,
        analyzedCvId,
        startAnalysis,
        commitUpdate,
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
