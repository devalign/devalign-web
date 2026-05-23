import { Hexagon } from 'lucide-react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
      {/* Top Marketing Banner */}
      <div className="w-full bg-primary text-primary-foreground py-2 text-center text-xs font-bold tracking-wider">
        CIERRA LA BRECHA TÉCNICA HOY —{' '}
        <span className="underline cursor-pointer">EXPLORA LOS PROGRAMAS</span>
      </div>

      {/* Decorative Background Web/Globe Watermark (CSS simulated radial gradient lines) */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-30 flex items-center justify-center">
        <div className="w-[800px] h-[800px] border-[1px] border-border rounded-full absolute" />
        <div className="w-[600px] h-[600px] border-[1px] border-border rounded-full absolute" />
        <div className="w-[400px] h-[400px] border-[1px] border-border rounded-full absolute" />
        <div className="w-px h-full bg-border absolute" />
        <div className="h-px w-full bg-border absolute" />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center relative z-10 px-4 pt-10 pb-20">
        {/* Branding & Headline */}
        <div className="text-center max-w-3xl mb-10 mt-6 flex flex-col items-center">
          <div className="flex items-center justify-center gap-2 mb-6 font-bold text-xl tracking-tight text-slate-900">
            <Hexagon className="w-6 h-6 fill-slate-900 text-slate-900" />
            DEV-ALIGN
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-[1.05] mb-6 uppercase max-w-2xl">
            Cierra la brecha técnica entre tu perfil y la demanda real del mercado TI
          </h1>

          <p className="text-slate-600 text-base md:text-lg max-w-lg mx-auto">
            Accede a infraestructura de aprendizaje y mentoría para potenciar tu carrera profesional
            hoy mismo.
          </p>
        </div>

        {/* Auth Card Container */}
        <div className="w-full max-w-md">{children}</div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs font-bold text-slate-500 tracking-widest relative z-10 flex flex-wrap justify-center gap-6">
        <a href="#" className="hover:text-slate-900 transition-colors">
          PRECIOS
        </a>
        <a href="#" className="hover:text-slate-900 transition-colors">
          DOCS
        </a>
        <a href="#" className="hover:text-slate-900 transition-colors">
          BLOG
        </a>
        <a href="#" className="hover:text-slate-900 transition-colors">
          CHANGELOG
        </a>
        <a href="#" className="hover:text-slate-900 transition-colors">
          SOPORTE
        </a>
      </footer>
    </div>
  );
}
