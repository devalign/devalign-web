'use client';

import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { Hexagon, Moon, Sun, Sparkles, Rocket } from 'lucide-react';

type AuthShellProps = {
  children: ReactNode;
};

export default function AuthShell({ children }: AuthShellProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const isDark =
      localStorage.theme === 'dark' ||
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setTheme(isDark ? 'dark' : 'light');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
    setTheme(newTheme);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden transition-colors duration-300">
      <div className="w-full bg-primary text-primary-foreground py-2 text-center text-xs sm:text-sm font-bold tracking-widest uppercase shadow-sm relative z-50">
        <span className="flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4" />
          <span className="hidden sm:inline">Revoluciona tu carrera TI:</span> Descubre tu nivel
          real con DevAlign
          <Rocket className="w-4 h-4" />
        </span>
      </div>

      <button
        onClick={toggleTheme}
        className="absolute top-14 right-4 md:top-16 md:right-8 z-50 p-2.5 rounded-full border border-border bg-background/50 backdrop-blur-md text-foreground shadow-sm hover:bg-muted/80 transition-all cursor-pointer"
        aria-label="Cambiar tema"
        title={theme === 'light' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}
      >
        {theme === 'light' ? (
          <Moon className="w-5 h-5 text-slate-700" />
        ) : (
          <Sun className="w-5 h-5 text-yellow-400" />
        )}
      </button>

      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-30 flex items-center justify-center">
        <div className="w-200 h-200 border border-border rounded-full absolute" />
        <div className="w-150 h-150 border border-border rounded-full absolute" />
        <div className="w-100 h-100 border border-border rounded-full absolute" />
        <div className="w-px h-full bg-border absolute" />
        <div className="h-px w-full bg-border absolute" />
      </div>

      <main className="flex-1 flex flex-col items-center justify-center relative z-10 px-4 pt-10 pb-20">
        <div className="text-center max-w-3xl mb-10 mt-6 flex flex-col items-center">
          <div className="flex items-center justify-center gap-2 mb-6 font-bold text-xl tracking-tight text-slate-900 dark:text-slate-400">
            <Hexagon className="w-6 h-6 fill-slate-900 text-slate-900 dark:text-slate-400" />
            DEV-ALIGN
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-slate-400 tracking-tighter leading-[1.05] mb-6 uppercase max-w-2xl">
            Cierra la brecha técnica entre tu perfil y la demanda real del mercado TI
          </h1>

          <p className="text-slate-600 dark:text-slate-400 text-base md:text-lg max-w-lg mx-auto">
            Accede a infraestructura de aprendizaje y mentoría para potenciar tu perfil profesional
            hoy mismo.
          </p>
        </div>

        <div className="w-full max-w-md">{children}</div>
      </main>

      <footer className="py-6 text-center text-xs font-bold text-slate-500 tracking-widest relative z-10 flex flex-wrap justify-center gap-6">
        <a href="#alcance" className="hover:text-slate-900 transition-colors">
          ALCANCE
        </a>
        <a href="#documentacion" className="hover:text-slate-900 transition-colors">
          DOCUMENTACIÓN
        </a>
        <a href="#soporte" className="hover:text-slate-900 transition-colors">
          SOPORTE
        </a>
      </footer>
    </div>
  );
}
