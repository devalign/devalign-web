'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { InsightCard, type InsightType } from '@/components/shared/insight-card';

export interface MarketInsightItem {
  id: string;
  title: string;
  description: React.ReactNode;
  type: InsightType;
  value: string;
}

const DEFAULT_INSIGHTS: MarketInsightItem[] = [
  {
    id: 'predominant-gap',
    title: 'Brecha del Perfil Predominante',
    description: (
      <>
        El <strong className="text-foreground">45%</strong> del mercado demanda{' '}
        <strong>Desarrolladores Web Full Stack</strong>. Su mayor deficiencia generalizada es el{' '}
        <strong className="text-foreground">Testing Automatizado</strong>.
      </>
    ),
    type: 'trend',
    value: 'Tendencia',
  },
  {
    id: 'frequent-gaps',
    title: 'Brechas Más Frecuentes',
    description: (
      <>
        De las últimas evaluaciones, el <strong className="text-foreground">62%</strong> de los
        desarrolladores presentan debilidades críticas en{' '}
        <strong>DevOps (Docker/CI/CD)</strong> independientemente de su rol.
      </>
    ),
    type: 'gap',
    value: 'Top Brecha',
  },
];

export interface MarketInsightsCarouselProps {
  insights?: MarketInsightItem[];
  className?: string;
  autoPlayInterval?: number;
}

/**
 * Circular carousel displaying one market insight at a time with smooth transitions and controls.
 */
export function MarketInsightsCarousel({
  insights = DEFAULT_INSIGHTS,
  className,
  autoPlayInterval = 7000,
}: MarketInsightsCarouselProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);

  const total = insights.length;

  const nextSlide = React.useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = React.useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Auto-play interval with pause-on-hover
  React.useEffect(() => {
    if (total <= 1 || isPaused) return;

    const timer = setInterval(() => {
      nextSlide();
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [total, isPaused, autoPlayInterval, nextSlide]);

  if (total === 0) return null;

  const currentInsight = insights[currentIndex];

  return (
    <div
      className={cn('space-y-2.5', className)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Header with Title and Circular Navigation Controls */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-primary" />
          <span className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">
            Insights de Mercado
          </span>
        </div>

        {total > 1 && (
          <div className="flex items-center gap-1">
            {/* Pagination Dots */}
            <div className="flex items-center gap-1 mr-1.5">
              {insights.map((item, idx) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={cn(
                    'h-1.5 rounded-full transition-all cursor-pointer',
                    idx === currentIndex
                      ? 'w-4 bg-primary'
                      : 'w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50',
                  )}
                  aria-label={`Ver insight ${idx + 1}`}
                />
              ))}
            </div>

            {/* Prev/Next Buttons */}
            <button
              type="button"
              onClick={prevSlide}
              className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary border border-border/40 transition-colors cursor-pointer"
              aria-label="Insight anterior"
            >
              <ChevronLeft className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={nextSlide}
              className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary border border-border/40 transition-colors cursor-pointer"
              aria-label="Siguiente insight"
            >
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      {/* Slide Display with fade animation */}
      <div className="relative min-h-[140px] transition-all duration-300">
        <InsightCard
          key={currentInsight.id}
          title={currentInsight.title}
          description={currentInsight.description}
          type={currentInsight.type}
          value={currentInsight.value}
          className="shadow-xs border-border/80"
        />
      </div>
    </div>
  );
}
