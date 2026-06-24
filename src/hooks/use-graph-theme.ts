'use client';

import { useState, useEffect } from 'react';

export function useGraphTheme() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === 'undefined') return true;
    return document.documentElement.classList.contains('dark');
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  const getComputedVariable = (varName: string, fallback: string): string => {
    if (typeof window === 'undefined') return fallback;
    const val = window.getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
    return val || fallback;
  };

  const getHSLColorString = (varName: string, fallback: string, opacity?: number): string => {
    const rawVal = getComputedVariable(varName, fallback);
    const parts = rawVal.split(/\s+/);
    if (parts.length >= 3) {
      const h = parts[0];
      const s = parts[1];
      const l = parts[2];
      if (opacity !== undefined) {
        return `hsla(${h}, ${s}, ${l}, ${opacity})`;
      }
      return `hsl(${h}, ${s}, ${l})`;
    }
    return rawVal;
  };

  // Light vs Dark Mode HSL Fallbacks
  const successFallback = isDark ? '142.1 70% 45%' : '142.1 76.2% 36.3%';
  const warningFallback = isDark ? '25 95% 53%' : '25 97% 53%';
  const infoFallback = isDark ? '239 84% 67%' : '239 84% 67%';
  const borderFallback = isDark ? '143 15% 14%' : '140 12% 86%';
  const foregroundFallback = isDark ? '140 12% 93%' : '143 27% 15%';
  const backgroundFallback = isDark ? '143 20% 6%' : '140 12% 97%';

  const colors = {
    acquired: getHSLColorString('--success', successFallback),
    gap: getHSLColorString('--warning', warningFallback),
    neutral: getHSLColorString('--info', infoFallback),
    faded: getHSLColorString('--border', borderFallback),
    text: getHSLColorString('--foreground', foregroundFallback),

    // Transparent / Alpha variants
    getAcquiredAlpha: (opacity: number) => getHSLColorString('--success', successFallback, opacity),
    getGapAlpha: (opacity: number) => getHSLColorString('--warning', warningFallback, opacity),
    getNeutralAlpha: (opacity: number) => getHSLColorString('--info', infoFallback, opacity),

    getLinkColor: (isHighlighted: boolean, isImplicit: boolean): string => {
      if (!isHighlighted) {
        return isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)';
      }
      if (isImplicit) {
        return isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)';
      }
      // Info color with low opacity for links
      const infoHSL = getComputedVariable('--info', infoFallback);
      const parts = infoHSL.split(/\s+/);
      if (parts.length >= 3) {
        const opacityVal = isDark ? 0.25 : 0.18;
        return `hsla(${parts[0]}, ${parts[1]}, ${parts[2]}, ${opacityVal})`;
      }
      return isDark ? 'rgba(99, 102, 241, 0.25)' : 'rgba(79, 70, 229, 0.18)';
    },

    getParticleColor: (isImplicit: boolean): string => {
      // Implicit particle: success theme. Explicit particle: info theme.
      if (isImplicit) {
        const successHSL = getComputedVariable('--success', successFallback);
        const parts = successHSL.split(/\s+/);
        if (parts.length >= 3) {
          // Success tint: slightly lighter in dark mode, darker in light mode
          return isDark
            ? `hsla(${parts[0]}, 100%, 80%, 1)`
            : `hsla(${parts[0]}, ${parts[1]}, ${parts[2]}, 1)`;
        }
        return isDark ? '#a7f3d0' : '#059669';
      } else {
        const infoHSL = getComputedVariable('--info', infoFallback);
        const parts = infoHSL.split(/\s+/);
        if (parts.length >= 3) {
          return isDark
            ? `hsla(${parts[0]}, 100%, 85%, 1)`
            : `hsla(${parts[0]}, ${parts[1]}, ${parts[2]}, 1)`;
        }
        return isDark ? '#c7d2fe' : '#4f46e5';
      }
    },

    getCanvasBackground: (opacity: number): string => {
      const bgHSL = getComputedVariable('--background', backgroundFallback);
      const parts = bgHSL.split(/\s+/);
      if (parts.length >= 3) {
        return `hsla(${parts[0]}, ${parts[1]}, ${parts[2]}, ${opacity})`;
      }
      return isDark ? `rgba(15, 17, 23, ${opacity})` : `rgba(255, 255, 255, ${opacity})`;
    },

    getCanvasBorder: (opacity: number): string => {
      const borderHSL = getComputedVariable('--border', borderFallback);
      const parts = borderHSL.split(/\s+/);
      if (parts.length >= 3) {
        return `hsla(${parts[0]}, ${parts[1]}, ${parts[2]}, ${opacity})`;
      }
      return isDark ? `rgba(255, 255, 255, ${opacity})` : `rgba(0, 0, 0, ${opacity})`;
    },
  };

  return {
    isDark,
    colors,
  };
}
