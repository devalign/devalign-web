import { Cpu, Database, Server } from 'lucide-react';

const nodes = [
  { Icon: Server, left: '9.38%', top: '26.64%' },     // Top-Left
  { Icon: Cpu, left: '90.62%', top: '26.64%' },       // Top-Right
  { Icon: Cpu, left: '9.38%', top: '73.36%' },        // Bottom-Left
  { Icon: Database, left: '90.62%', top: '73.36%' },  // Bottom-Right
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
          {/* Grupo de líneas del globo */}
          <g opacity="0.15">
            {/* Círculo exterior */}
            <path id="path-outer" d="M 2 500 A 498 498 0 1 0 998 500 A 498 498 0 1 0 2 500" />

            {/* Longitudes (Verticales) */}
            <path id="path-long-120" d="M 380 500 A 120 498 0 1 0 620 500 A 120 498 0 1 0 380 500" />
            <path id="path-long-250" d="M 250 500 A 250 498 0 1 0 750 500 A 250 498 0 1 0 250 500" />
            <path id="path-long-370" d="M 130 500 A 370 498 0 1 0 870 500 A 370 498 0 1 0 130 500" />
            <path id="path-long-460" d="M 40 500 A 460 498 0 1 0 960 500 A 460 498 0 1 0 40 500" />
            <path id="path-long-center" d="M 500 2 L 500 998" />

            {/* Latitudes (Horizontales) */}
            <path id="path-lat-500" d="M 2 500 A 498 120 0 1 0 998 500 A 498 120 0 1 0 2 500" />
            <path id="path-lat-320" d="M 36 320 A 464 111 0 1 0 964 320 A 464 111 0 1 0 36 320" />
            <path id="path-lat-680" d="M 36 680 A 464 111 0 1 0 964 680 A 464 111 0 1 0 36 680" />
            <path id="path-lat-160" d="M 136 160 A 364 87 0 1 0 864 160 A 364 87 0 1 0 136 160" />
            <path id="path-lat-840" d="M 136 840 A 364 87 0 1 0 864 840 A 364 87 0 1 0 136 840" />
            <path id="path-lat-50" d="M 284 50 A 216 52 0 1 0 716 50 A 216 52 0 1 0 284 50" />
            <path id="path-lat-950" d="M 284 950 A 216 52 0 1 0 716 950 A 216 52 0 1 0 284 950" />
          </g>

          {/* Partículas animadas en movimiento sobre las líneas del globo */}
          <g>
            {/* Partícula en el círculo exterior (sentido horario) */}
            <circle r="3.5" fill="hsl(var(--success))" style={{ filter: 'drop-shadow(0 0 5px hsl(var(--success)))' }}>
              <animateMotion dur="12s" repeatCount="indefinite">
                <mpath href="#path-outer" />
              </animateMotion>
            </circle>

            {/* Partícula en la línea vertical central */}
            <circle r="3.5" fill="hsl(var(--success))" style={{ filter: 'drop-shadow(0 0 5px hsl(var(--success)))' }}>
              <animateMotion dur="6s" repeatCount="indefinite">
                <mpath href="#path-long-center" />
              </animateMotion>
            </circle>

            {/* Partícula en la longitud rx="250" (sentido antihorario) */}
            <circle r="3" fill="hsl(var(--success))" style={{ filter: 'drop-shadow(0 0 4px hsl(var(--success)))' }}>
              <animateMotion dur="8s" repeatCount="indefinite" keyPoints="1;0" keyTimes="0;1" calcMode="linear">
                <mpath href="#path-long-250" />
              </animateMotion>
            </circle>

            {/* Partícula en la longitud rx="370" (sentido horario) */}
            <circle r="3" fill="hsl(var(--success))" style={{ filter: 'drop-shadow(0 0 4px hsl(var(--success)))' }}>
              <animateMotion dur="10s" repeatCount="indefinite">
                <mpath href="#path-long-370" />
              </animateMotion>
            </circle>

            {/* Partícula en la latitud ecuatorial (sentido horario) */}
            <circle r="3" fill="hsl(var(--success))" style={{ filter: 'drop-shadow(0 0 4px hsl(var(--success)))' }}>
              <animateMotion dur="11s" repeatCount="indefinite">
                <mpath href="#path-lat-500" />
              </animateMotion>
            </circle>

            {/* Partícula en la latitud superior cy="320" (sentido horario) */}
            <circle r="3" fill="hsl(var(--success))" style={{ filter: 'drop-shadow(0 0 4px hsl(var(--success)))' }}>
              <animateMotion dur="7s" repeatCount="indefinite">
                <mpath href="#path-lat-320" />
              </animateMotion>
            </circle>

            {/* Partícula en la latitud inferior cy="680" (sentido antihorario) */}
            <circle r="3" fill="hsl(var(--success))" style={{ filter: 'drop-shadow(0 0 4px hsl(var(--success)))' }}>
              <animateMotion dur="9s" repeatCount="indefinite" keyPoints="1;0" keyTimes="0;1" calcMode="linear">
                <mpath href="#path-lat-680" />
              </animateMotion>
            </circle>
          </g>
        </svg>

        {/* Nodos (Iconos tipo hardware flotantes) */}
        {nodes.map(({ Icon, left, top }, i) => (
          <div
            key={i}
            className="hidden md:block absolute -translate-x-1/2 -translate-y-1/2 p-1.5 bg-background/80 backdrop-blur-md rounded-2xl border border-border shadow-2xl"
            style={{ left, top }}
          >
            <div className="relative bg-zinc-950 rounded-xl p-3 flex items-center justify-center border border-zinc-800 shadow-inner">
              <Icon className="w-5 h-5 text-zinc-300" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
