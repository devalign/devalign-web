import type { ReactNode } from 'react';
import { Hexagon } from 'lucide-react';

type AuthShellProps = {
  children: ReactNode;
};

export default function AuthShell({ children }: AuthShellProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
      <div className="w-full bg-primary text-primary-foreground py-2 text-center text-xs font-bold tracking-wider">
        MVP DE AUTH ACTIVO - <span className="underline cursor-pointer">VER ALCANCE</span>
      </div>

      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-30 flex items-center justify-center">
        <div className="w-200 h-200 border border-border rounded-full absolute" />
        <div className="w-150 h-150 border border-border rounded-full absolute" />
        <div className="w-100 h-100 border border-border rounded-full absolute" />
        <div className="w-px h-full bg-border absolute" />
        <div className="h-px w-full bg-border absolute" />
      </div>

      <main className="flex-1 flex flex-col items-center justify-center relative z-10 px-4 pt-10 pb-20">
        <div className="text-center max-w-3xl mb-10 mt-6 flex flex-col items-center">
          <div className="flex items-center justify-center gap-2 mb-6 font-bold text-xl tracking-tight text-slate-900">
            <Hexagon className="w-6 h-6 fill-slate-900 text-slate-900" />
            DEV-ALIGN
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-[1.05] mb-6 uppercase max-w-2xl">
            Cierra la brecha técnica entre tu perfil y la demanda real del mercado TI
          </h1>

          <p className="text-slate-600 text-base md:text-lg max-w-lg mx-auto">
            Accede al flujo inicial de autenticación para entrar al MVP académico de Devalign.
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
