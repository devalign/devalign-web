'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronRight } from 'lucide-react';

interface RoadmapStep {
  skill: string;
  impact: string;
  topics: string[];
  justification: string;
  rule: string;
  trendData: number[];
}

interface RoadmapPhase {
  title: string;
  description: string;
  steps: RoadmapStep[];
}

interface ActionPlanTimelineProps {
  phases: RoadmapPhase[];
  onStepClick: (step: RoadmapStep) => void;
}

export function ActionPlanTimeline({ phases, onStepClick }: ActionPlanTimelineProps) {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {phases.map((phase, phaseIdx) => (
        <div key={phaseIdx} className="space-y-4">
          {/* Phase Title */}
          <div className="flex items-start gap-3">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-primary text-xs font-bold shrink-0 mt-0.5">
              {phaseIdx + 1}
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">{phase.title}</h3>
              <p className="text-[10px] text-muted-foreground">{phase.description}</p>
            </div>
          </div>

          {/* Steps Cards */}
          <div className="space-y-3 pl-9">
            {phase.steps.map((step, stepIdx) => (
              <Card
                key={stepIdx}
                onClick={() => onStepClick(step)}
                className="border border-border/80 hover:border-primary/50 bg-card hover:bg-secondary/10 transition-all cursor-pointer shadow-xs relative overflow-hidden group"
              >
                <CardContent className="p-4 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                        {step.skill}
                      </h4>
                      <span className="text-[9px] font-bold text-success bg-success/10 px-1.5 py-0.5 rounded-md">
                        {step.impact}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {step.topics.slice(0, 3).map((topic, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[9px] text-muted-foreground bg-secondary px-2 py-0.5 rounded-full"
                        >
                          {topic}
                        </span>
                      ))}
                      {step.topics.length > 3 && (
                        <span className="text-[9px] text-muted-foreground">
                          +{step.topics.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform shrink-0" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
