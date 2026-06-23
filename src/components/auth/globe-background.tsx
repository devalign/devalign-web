import { Cpu, Database, Server } from 'lucide-react';

const nodes = [
  { Icon: Cpu, left: '15%', top: '55%' },
  { Icon: Server, left: '22%', top: '32%' },
  { Icon: Cpu, left: '82%', top: '30%' },
  { Icon: Database, left: '78%', top: '65%' },
];

export default function GlobeBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden flex items-center justify-center">
      {/* Resplandor central (glow radial suave) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,hsl(var(--success)/0.06)_0%,transparent_50%)]" />

      {/* Contenedor principal del globo */}
      <div className="relative w-[900px] h-[900px]">
        {/* SVG Wireframe */}
        <svg
          viewBox="0 0 1000 1000"
          className="absolute inset-0 w-full h-full text-foreground"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        >
          <defs>
            <linearGradient id="beam-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--success))" stopOpacity="0" />
              <stop offset="20%" stopColor="hsl(var(--success))" stopOpacity="0.8" />
              <stop offset="100%" stopColor="hsl(var(--success))" stopOpacity="1" />
            </linearGradient>
          </defs>

          {/* Grupo de líneas del globo */}
          <g opacity="0.15">
            {/* Círculo exterior */}
            <circle cx="500" cy="500" r="498" />

            {/* Longitudes (Verticales) */}
            <ellipse cx="500" cy="500" rx="120" ry="498" />
            <ellipse cx="500" cy="500" rx="250" ry="498" />
            <ellipse cx="500" cy="500" rx="370" ry="498" />
            <ellipse cx="500" cy="500" rx="460" ry="498" />
            <line x1="500" y1="2" x2="500" y2="998" />

            {/* Latitudes (Horizontales) */}
            <ellipse cx="500" cy="500" rx="498" ry="120" />
            <ellipse cx="500" cy="320" rx="464" ry="111" />
            <ellipse cx="500" cy="680" rx="464" ry="111" />
            <ellipse cx="500" cy="160" rx="364" ry="87" />
            <ellipse cx="500" cy="840" rx="364" ry="87" />
            <ellipse cx="500" cy="50" rx="216" ry="52" />
            <ellipse cx="500" cy="950" rx="216" ry="52" />
          </g>

          {/* Haz de luz conectando nodos (efecto de resplandor blur) */}
          <path
            d="M 175 550 Q 450 750 795 300"
            fill="none"
            stroke="url(#beam-grad)"
            strokeWidth="8"
            opacity="0.3"
            style={{ filter: 'blur(4px)' }}
          />
          {/* Haz de luz principal (núcleo brillante) */}
          <path
            d="M 175 550 Q 450 750 795 300"
            fill="none"
            stroke="url(#beam-grad)"
            strokeWidth="2.5"
          />
        </svg>

        {/* Nodos (Iconos tipo hardware flotantes) */}
        {nodes.map(({ Icon, left, top }, i) => (
          <div
            key={i}
            className="absolute -translate-x-1/2 -translate-y-1/2 p-1.5 bg-background/80 backdrop-blur-md rounded-2xl border border-border shadow-2xl"
            style={{ left, top }}
          >
            <div className="relative bg-zinc-950 rounded-xl p-3 flex items-center justify-center border border-zinc-800 shadow-inner">
              <Icon className="w-5 h-5 text-zinc-300" />

              {/* Punto de conexión verde brillante en el nodo destino (índice 2) */}
              {i === 2 && (
                <>
                  <span className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-success rounded-full shadow-[0_0_10px_var(--color-success)]" />
                  <span className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-success rounded-full animate-ping opacity-75" />
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
