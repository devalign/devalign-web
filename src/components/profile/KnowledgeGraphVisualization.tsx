'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { useGraphTheme } from '@/hooks/use-graph-theme';
import { GraphLegend } from './graph-legend';
import { GraphLoading } from './graph-loading';

// Dynamic import with ssr: false is required for force-graph in Next.js
// because it relies on the window object.
const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), { ssr: false });

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

interface KnowledgeGraphVisualizationProps {
  data: GraphData;
  isLoading: boolean;
  onNodeClick?: (node: GraphNode) => void;
  highlightMode?: 'all' | 'strengths' | 'gaps';
  isLegendHidden?: boolean;
}

export function KnowledgeGraphVisualization({
  data,
  isLoading,
  onNodeClick,
  highlightMode = 'all',
  isLegendHidden = false,
}: KnowledgeGraphVisualizationProps) {
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const { isDark, colors } = useGraphTheme();

  useEffect(() => {
    const container = document.getElementById('graph-container');
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
    return <GraphLoading message="Cargando red neuronal..." />;
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
    <div className="relative w-full h-full overflow-hidden bg-transparent touch-none">
      <div id="graph-container" className="relative w-full h-full overflow-hidden bg-transparent touch-none">
        {!isLegendHidden && <GraphLegend />}

        <ForceGraph2D
          width={dimensions.width}
          height={dimensions.height}
          graphData={enhancedData}
          nodeLabel={(node: any) => `${node.label} (${node.domains.join(', ')})`}
          onNodeClick={(node: any) => onNodeClick && onNodeClick(node as GraphNode)}
          linkColor={(link: any) => link.color}
          linkWidth={(link: any) => link.width}
          linkDirectionalParticles={1}
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
          nodeCanvasObject={(node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
            if (
              typeof node.x !== 'number' ||
              typeof node.y !== 'number' ||
              isNaN(node.x) ||
              isNaN(node.y)
            ) {
              return;
            }

            const r = node.status === 'acquired' ? 7 : node.status === 'gap' ? 6 : 5;
            const highlighted = node.highlighted;

            // 1. Pulsing neon glow shadow (only if highlighted)
            if (highlighted) {
              ctx.save();
              ctx.beginPath();

              const time = Date.now() * 0.003;
              const pulse = Math.sin(time + (node.x || 0)) * 0.15 + 0.85; // unique pulse offset based on node position
              const glowRadius = r * 2.5 * pulse;

              ctx.arc(node.x, node.y, glowRadius, 0, 2 * Math.PI, false);

              // Radial gradient for smooth glow
              const gradient = ctx.createRadialGradient(
                node.x,
                node.y,
                r * 0.8,
                node.x,
                node.y,
                glowRadius,
              );

              const startColor =
                node.status === 'acquired'
                  ? colors.getAcquiredAlpha(isDark ? 0.4 : 0.25)
                  : node.status === 'gap'
                    ? colors.getGapAlpha(isDark ? 0.4 : 0.25)
                    : colors.getNeutralAlpha(isDark ? 0.4 : 0.25);

              const endColor =
                node.status === 'acquired'
                  ? colors.getAcquiredAlpha(0)
                  : node.status === 'gap'
                    ? colors.getGapAlpha(0)
                    : colors.getNeutralAlpha(0);

              gradient.addColorStop(0, startColor);
              gradient.addColorStop(0.2, startColor);
              gradient.addColorStop(1, endColor);

              ctx.fillStyle = gradient;
              ctx.fill();
              ctx.restore();
            }

            // 2. Glassmorphic outer border/ring
            ctx.beginPath();
            ctx.arc(node.x, node.y, r, 0, 2 * Math.PI, false);
            ctx.strokeStyle = colors.getCanvasBorder(
              highlighted ? (isDark ? 0.45 : 0.2) : isDark ? 0.08 : 0.04,
            );
            ctx.lineWidth = 1.5 / globalScale;
            ctx.stroke();

            // 3. Solid inner core
            ctx.beginPath();
            ctx.arc(node.x, node.y, r * 0.9, 0, 2 * Math.PI, false);
            ctx.fillStyle = node.color;
            ctx.fill();

            // 4. Draw label below the node if zoomed in and highlighted
            if (globalScale > 1.2 && highlighted) {
              const label = node.label;
              const fontSize = 10 / globalScale;
              ctx.font = `${fontSize}px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;

              const textWidth = ctx.measureText(label).width;
              const paddingX = 5 / globalScale;
              const paddingY = 3 / globalScale;
              const bgWidth = textWidth + paddingX * 2;
              const bgHeight = fontSize + paddingY * 2;
              const bgX = node.x - bgWidth / 2;
              const bgY = node.y + r + 4 / globalScale;

              // Draw glassmorphism background tag (dark, transparent)
              ctx.fillStyle = colors.getCanvasBackground(isDark ? 0.85 : 0.92);

              // Safe rounded rect drawing
              ctx.beginPath();
              const radius = 3 / globalScale;
              ctx.moveTo(bgX + radius, bgY);
              ctx.lineTo(bgX + bgWidth - radius, bgY);
              ctx.quadraticCurveTo(bgX + bgWidth, bgY, bgX + bgWidth, bgY + radius);
              ctx.lineTo(bgX + bgWidth, bgY + bgHeight - radius);
              ctx.quadraticCurveTo(
                bgX + bgWidth,
                bgY + bgHeight,
                bgX + bgWidth - radius,
                bgY + bgHeight,
              );
              ctx.lineTo(bgX + radius, bgY + bgHeight);
              ctx.quadraticCurveTo(bgX, bgY + bgHeight, bgX, bgY + bgHeight - radius);
              ctx.lineTo(bgX, bgY + radius);
              ctx.quadraticCurveTo(bgX, bgY, bgX + radius, bgY);
              ctx.closePath();
              ctx.fill();

              ctx.strokeStyle = colors.getCanvasBorder(isDark ? 0.12 : 0.08);
              ctx.lineWidth = 0.5 / globalScale;
              ctx.stroke();

              // Draw text
              ctx.textAlign = 'center';
              ctx.textBaseline = 'top';
              ctx.fillStyle = colors.text;
              ctx.fillText(label, node.x, bgY + paddingY);
            }
          }}
        />
      </div>
    </div>
  );
}
