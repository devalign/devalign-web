'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import * as THREE from 'three';

// Dynamic import with ssr: false is required for force-graph in Next.js
// because it relies on the window object.
const ForceGraph3D = dynamic(() => import('react-force-graph-3d'), { ssr: false });

export interface GraphNode {
  id: string;
  label: string;
  group: string;
  domains: string[];
  status: 'acquired' | 'gap' | 'neutral';
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
}

function hexToRgba(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function KnowledgeGraphVisualization3D({ 
  data, 
  isLoading, 
  onNodeClick, 
  highlightMode = 'all'
}: KnowledgeGraphVisualization3DProps) {
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    setIsDark(document.documentElement.classList.contains('dark'));

    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

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
    return (
      <div className="flex h-full min-h-[400px] w-full items-center justify-center rounded-xl border border-white/10 bg-black/40 backdrop-blur-md">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-indigo-500"></div>
          <p className="text-sm text-gray-400">Loading 3D neural network...</p>
        </div>
      </div>
    );
  }

  // Determine if a node matches the active filter
  const isNodeHighlighted = (node: GraphNode) => {
    if (highlightMode === 'all') return true;
    if (highlightMode === 'strengths') return node.status === 'acquired';
    if (highlightMode === 'gaps') return node.status === 'gap';
    return true;
  };

  // Enhance nodes with visual properties based on their status and active filter
  const enhancedData = {
    nodes: data.nodes.map(n => {
      const highlighted = isNodeHighlighted(n);
      return {
        ...n,
        highlighted,
        val: n.status === 'acquired' ? 2 : n.status === 'gap' ? 1.5 : 1,
        color: !highlighted
          ? (isDark ? '#1e293b' : '#cbd5e1') // Faded color
          : n.status === 'acquired' ? '#10b981' : // Emerald
            n.status === 'gap' ? '#f97316' :      // Orange/Red
            '#6366f1'                             // Indigo (neutral)
      };
    }),
    links: data.links.map(l => {
      // Find source/target node IDs
      const sourceId = typeof l.source === 'object' ? (l.source as any).id : l.source;
      const targetId = typeof l.target === 'object' ? (l.target as any).id : l.target;
      
      const sourceNode = data.nodes.find(n => n.id === sourceId);
      const targetNode = data.nodes.find(n => n.id === targetId);
      
      const isHighlighted = highlightMode === 'all' || 
        (sourceNode && isNodeHighlighted(sourceNode) && targetNode && isNodeHighlighted(targetNode));

      const isImplicit = (l.type || '').includes('implicit');
      return {
        ...l,
        color: !isHighlighted
          ? (isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)') // Faded link
          : isImplicit 
            ? (isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)') 
            : (isDark ? 'rgba(99, 102, 241, 0.25)' : 'rgba(79, 70, 229, 0.18)'),
        width: isImplicit ? 0.75 : 2.0
      };
    })
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-transparent">
      <div 
        id="graph-container-3d" 
        className="relative w-full h-full overflow-hidden bg-transparent"
      >
        <div className="absolute bottom-4 left-4 z-10 flex flex-col gap-2 rounded-lg bg-background/60 p-3 text-xs text-muted-foreground backdrop-blur-md border border-white/10">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
            <span>Acquired Skill</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)]"></span>
            <span>Missing / Gap</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]"></span>
            <span>Related</span>
          </div>
        </div>

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
              opacity: highlighted ? 1 : 0.15
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
                side: THREE.BackSide
              });
              const glowMesh = new THREE.Mesh(glowGeom, glowMat);
              group.add(glowMesh);
            }
            
            return group;
          }}
          linkColor={(link: any) => link.color}
          linkWidth={(link: any) => link.width}
          linkDirectionalParticles={3}
          linkDirectionalParticleWidth={(link: any) => (link.type || '').includes('implicit') ? 1.5 : (link.color.includes('0.02') ? 0 : 3.0)}
          linkDirectionalParticleSpeed={(link: any) => (link.type || '').includes('implicit') ? 0.007 : 0.015}
          linkDirectionalParticleColor={(link: any) => (link.type || '').includes('implicit') ? (isDark ? '#a7f3d0' : '#059669') : (isDark ? '#c7d2fe' : '#4f46e5')}
          backgroundColor="rgba(0,0,0,0)"
          enableNodeDrag={false}
        />
      </div>
    </div>
  );
}
