'use client';

import React from 'react';
import Link from 'next/link';
import { Network, Maximize } from 'lucide-react';
import { useKnowledgeGraph } from '@/hooks/use-knowledge-graph';
import { KnowledgeGraphVisualization } from '@/components/profile/KnowledgeGraphVisualization';
import { Button } from '@/components/ui/button';

export function KnowledgeGraphCard() {
  const { data, isLoading, error } = useKnowledgeGraph();

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Network className="h-5 w-5 text-indigo-500" />
          <h2 className="text-lg font-semibold text-foreground">Mapa Semántico de Conocimiento</h2>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-xs text-muted-foreground hidden md:block">
            Visualización de relaciones entre habilidades y dominios
          </div>
          <Link href="/market/explorer">
            <Button variant="outline" size="sm" className="h-8 gap-2">
              <Maximize className="h-3.5 w-3.5" />
              Explorador
            </Button>
          </Link>
        </div>
      </div>

      <div className="text-sm text-muted-foreground">
        Explora las conexiones entre las tecnologías de tu perfil y aquellas que el mercado demanda en tu especialidad.
      </div>

      {error ? (
        <div className="flex h-[600px] w-full items-center justify-center rounded-xl border border-white/10 bg-black/40">
          <p className="text-sm text-red-400">Hubo un error cargando el grafo de conocimiento.</p>
        </div>
      ) : (
        <div className="relative h-[600px] w-full overflow-hidden rounded-xl border border-border bg-[#0B0C10] shadow-xs">
          <KnowledgeGraphVisualization 
            data={data || { nodes: [], links: [] }} 
            isLoading={isLoading} 
          />
        </div>
      )}
    </div>
  );
}
