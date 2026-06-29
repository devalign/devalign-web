'use client';

import React, { useState } from 'react';
import { ArrowLeft, Network, Cpu, Layers, Zap, Info } from 'lucide-react';
import Link from 'next/link';
import { useKnowledgeGraph } from '@/hooks/use-knowledge-graph';
import {
  KnowledgeGraphVisualization,
  GraphNode,
} from '@/components/profile/KnowledgeGraphVisualization';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function MarketExplorerPage() {
  const { data, isLoading, error } = useKnowledgeGraph();
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);

  const handleNodeClick = (node: GraphNode) => {
    setSelectedNode(node);
  };

  return (
    <div className="absolute inset-y-0 right-0 left-16 overflow-hidden bg-background z-10 flex flex-col">
      {/* Background Neural Network Graph */}
      <div className="absolute inset-0 z-0 bg-transparent">
        {error ? (
          <div className="flex h-full w-full items-center justify-center bg-black/40">
            <p className="text-sm text-destructive font-semibold">
              Hubo un error cargando el grafo de conocimiento.
            </p>
          </div>
        ) : (
          <KnowledgeGraphVisualization
            data={data || { nodes: [], links: [] }}
            isLoading={isLoading}
            onNodeClick={handleNodeClick}
          />
        )}
      </div>

      {/* Foreground UI - Floating Header */}
      <header className="absolute top-6 left-6 right-6 z-20 flex items-center justify-between pointer-events-none">
        {/* Title and Back button */}
        <div className="flex items-center gap-4 bg-background/60 backdrop-blur-xl border border-border/40 rounded-2xl p-4 shadow-xl pointer-events-auto">
          <Link href="/diagnosis">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full border border-border/20 bg-muted/30 hover:bg-muted/50 transition-all"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="space-y-0.5">
            <h1 className="text-sm md:text-base font-black tracking-tight text-foreground flex items-center gap-2">
              <Network className="w-4 h-4 text-info shrink-0" />
              Explorador de Red Neuronal
            </h1>
            <p className="text-[10px] text-muted-foreground">
              Mapeo interactivo de relaciones de habilidades IT.
            </p>
          </div>
        </div>
      </header>

      {/* Foreground UI - Floating Side Details Panel */}
      <div className="absolute top-28 right-6 bottom-6 w-80 z-20 pointer-events-none flex flex-col justify-between">
        {selectedNode ? (
          <Card className="border-border/40 shadow-2xl bg-background/60 backdrop-blur-xl h-full flex flex-col pointer-events-auto rounded-2xl overflow-hidden transition-all duration-300">
            <CardHeader className="pb-4 border-b border-border/40 bg-muted/[0.03]">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg font-bold text-foreground leading-tight">
                  {selectedNode.label}
                </CardTitle>
                <Cpu className="h-4 w-4 text-muted-foreground/50 shrink-0 ml-2 mt-1" />
              </div>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {selectedNode.status === 'acquired' && (
                  <Badge
                    variant="outline"
                    className="bg-success/10 text-success dark:text-success border-success/20 text-[10px] py-0.5"
                  >
                    Adquirida
                  </Badge>
                )}
                {selectedNode.status === 'gap' && (
                  <Badge
                    variant="outline"
                    className="bg-warning/10 text-warning dark:text-warning border-warning/20 text-[10px] py-0.5"
                  >
                    Brecha
                  </Badge>
                )}
                {selectedNode.status === 'neutral' && (
                  <Badge
                    variant="outline"
                    className="bg-info/10 text-info dark:text-info border-info/20 text-[10px] py-0.5"
                  >
                    Relacionada
                  </Badge>
                )}
                {selectedNode.status === 'market' && (
                  <Badge
                    variant="outline"
                    className="bg-muted/30 text-muted-foreground border border-border/30 text-[10px] py-0.5"
                  >
                    Mercado
                  </Badge>
                )}
                <Badge
                  variant="secondary"
                  className="bg-muted/30 text-muted-foreground border border-border/30 text-[10px] py-0.5 hover:bg-muted/30"
                >
                  {selectedNode.group}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6 flex-1 overflow-y-auto">
              <div className="space-y-2">
                <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  <Layers className="h-3.5 w-3.5" />
                  Dominios de Aplicación
                </h4>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {selectedNode.domains.map((domain) => (
                    <span
                      key={domain}
                      className="px-2 py-1 text-[11px] font-medium rounded-lg bg-muted/30 text-foreground border border-border/30"
                    >
                      {domain}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-3 rounded-xl bg-info/5 border border-info/10 p-4 mt-6">
                <div className="flex items-center gap-2 text-info dark:text-info">
                  <Info className="h-3.5 w-3.5" />
                  <h4 className="text-xs font-bold uppercase tracking-wider">
                    Análisis Contextual
                  </h4>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Esta tecnología se conecta con otras herramientas en tu grafo basadas en la
                  demanda actual del mercado.
                  {selectedNode.status === 'gap'
                    ? ' Al ser una brecha en tu perfil, adquirir esta habilidad fortalecería tu posición para roles que demandan este stack.'
                    : selectedNode.status === 'acquired'
                      ? ' Ya posees esta habilidad, lo que te posiciona favorablemente en su respectivo dominio.'
                      : selectedNode.status === 'neutral'
                        ? ' Es una tecnología relacionada frecuentemente con tu stack actual.'
                        : ' Es una habilidad general del mercado tecnológico no requerida por el cluster actual.'}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-dashed border-2 border-border/30 bg-background/40 backdrop-blur-md shadow-xl h-full flex flex-col items-center justify-center p-8 text-center text-muted-foreground pointer-events-auto rounded-2xl">
            <Zap className="h-8 w-8 mb-3 text-info/50 dark:text-info/50 animate-pulse" />
            <p className="text-xs font-bold text-foreground/80 mb-1">Exploración Activa</p>
            <p className="text-[11px] leading-relaxed max-w-[200px] mx-auto text-muted-foreground">
              Haz clic en cualquier nodo de la red para analizar sus relaciones y contexto en el
              mercado IT.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
