'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import * as THREE from 'three';
import { useGraphTheme } from '@/hooks/use-graph-theme';
import { GraphLegend } from './graph-legend';
import { GraphLoading } from './graph-loading';

// Dynamic import with ssr: false is required for force-graph in Next.js
// because it relies on the window object.
const ForceGraph3D = dynamic(() => import('react-force-graph-3d'), { ssr: false });

export interface GraphNode {
  id: string;
  label: string;
  group: string;
  domains: string[];
  status: 'acquired' | 'gap' | 'neutral' | 'market';
  val?: number; // Internal size
}

export interface GraphLink {
  source: string;
  target: string;
  value: number;
  type: string;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

interface KnowledgeGraphVisualization3DProps {
  data: GraphData;
  isLoading: boolean;
  onNodeClick?: (node: GraphNode) => void;
  highlightMode?: 'all' | 'strengths' | 'gaps';
  isLegendHidden?: boolean;
}

export function KnowledgeGraphVisualization3D({
  data,
  isLoading,
  onNodeClick,
  highlightMode = 'all',
  isLegendHidden = false,
}: KnowledgeGraphVisualization3DProps) {
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const { isDark, colors } = useGraphTheme();

  useEffect(() => {
    const container = document.getElementById('graph-container-3d');
    if (!container) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setDimensions({
          width: entry.contentRect.width || 800,
          height: entry.contentRect.height || 600,
        });
      }
    });

    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, [isLoading]);

  if (isLoading) {
    return <GraphLoading message="Cargando red neuronal 3D..." />;
  }

  // Determine if a node matches the active filter
  const isNodeHighlighted = (node: GraphNode) => {
    if (node.status === 'market') return false; // General market background is always faded
    if (highlightMode === 'all') return true;
    if (highlightMode === 'strengths') return node.status === 'acquired';
    if (highlightMode === 'gaps') return node.status === 'gap';
    return true;
  };

  // Enhance nodes with visual properties based on their status and active filter
  const enhancedData = {
    nodes: data.nodes.map((n) => {
      const highlighted = isNodeHighlighted(n);
      return {
        ...n,
        highlighted,
        val: n.status === 'acquired' ? 2 : n.status === 'gap' ? 1.5 : 1,
        color: !highlighted
          ? colors.faded
          : n.status === 'acquired'
            ? colors.acquired
            : n.status === 'gap'
              ? colors.gap
              : colors.neutral,
      };
    }),
    links: data.links.map((l) => {
      // Find source/target node IDs
      const sourceId = typeof l.source === 'object' ? (l.source as any).id : l.source;
      const targetId = typeof l.target === 'object' ? (l.target as any).id : l.target;

      const sourceNode = data.nodes.find((n) => n.id === sourceId);
      const targetNode = data.nodes.find((n) => n.id === targetId);

      const isHighlighted =
        highlightMode === 'all' ||
        !!(
          sourceNode &&
          isNodeHighlighted(sourceNode) &&
          targetNode &&
          isNodeHighlighted(targetNode)
        );

      const isImplicit = (l.type || '').includes('implicit');
      return {
        ...l,
        color: colors.getLinkColor(isHighlighted, isImplicit),
        width: isImplicit ? 0.75 : 2.0,
      };
    }),
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-transparent">
      <div
        id="graph-container-3d"
        className="relative w-full h-full overflow-hidden bg-transparent"
      >
        {!isLegendHidden && <GraphLegend />}

        <ForceGraph3D
          width={dimensions.width}
          height={dimensions.height}
          graphData={enhancedData}
          nodeLabel={(node: any) => `${node.label} (${node.domains.join(', ')})`}
          onNodeClick={(node: any) => onNodeClick && onNodeClick(node as GraphNode)}
          nodeThreeObject={(node: any) => {
            const group = new THREE.Group();
            const highlighted = node.highlighted;

            // Core sphere
            const coreRadius = node.status === 'acquired' ? 5 : node.status === 'gap' ? 4 : 3;
            const coreGeom = new THREE.SphereGeometry(coreRadius, 16, 16);
            const coreMat = new THREE.MeshBasicMaterial({
              color: node.color,
              transparent: !highlighted,
              opacity: highlighted ? 1 : 0.15,
            });
            const coreMesh = new THREE.Mesh(coreGeom, coreMat);
            group.add(coreMesh);

            // Glow halo (only if highlighted)
            if (highlighted) {
              const glowRadius = coreRadius * 2.2;
              const glowGeom = new THREE.SphereGeometry(glowRadius, 16, 16);
              const glowMat = new THREE.MeshBasicMaterial({
                color: node.color,
                transparent: true,
                opacity: isDark ? 0.22 : 0.15,
                blending: isDark ? THREE.AdditiveBlending : THREE.NormalBlending,
                side: THREE.BackSide,
              });
              const glowMesh = new THREE.Mesh(glowGeom, glowMat);
              group.add(glowMesh);
            }

            return group;
          }}
          linkColor={(link: any) => link.color}
          linkWidth={(link: any) => link.width}
          linkDirectionalParticles={3}
          linkDirectionalParticleWidth={(link: any) =>
            (link.type || '').includes('implicit') ? 1.5 : link.color.includes('0.02') ? 0 : 3.0
          }
          linkDirectionalParticleSpeed={(link: any) =>
            (link.type || '').includes('implicit') ? 0.007 : 0.015
          }
          linkDirectionalParticleColor={(link: any) =>
            colors.getParticleColor((link.type || '').includes('implicit'))
          }
          backgroundColor="rgba(0,0,0,0)"
          enableNodeDrag={false}
        />
      </div>
    </div>
  );
}
