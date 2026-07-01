'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Network,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { ProfileRadarCard } from '@/app/(protected)/diagnosis/_components/profile-radar-card';
import { GraphNode } from '../../profile/_components/graph/knowledge-graph-visualization';
import { cn } from '@/lib/utils';
import { ClusterAffinityItem } from '@/lib/api/types';

export type FilterMode = 'all' | 'strengths' | 'gaps';

interface OverviewSideDrawerProps {
  domainAffinities: any[];
  fullName: string;
  roleTitle: string;
  seniority: string;
  totalSkills: number;
  alignmentScore?: number;
  primarySpecialty?: string;
  isLoading?: boolean;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  activeFilter?: FilterMode;
  onFilterChange?: (filter: FilterMode) => void;
  graphNodes?: GraphNode[];
  onNodeClick?: (node: GraphNode) => void;
  activeCluster?: ClusterAffinityItem | null;
}

export function OverviewSideDrawer({
  domainAffinities,
  fullName,
  roleTitle,
  seniority,
  totalSkills,
  isLoading = false,
  isOpen,
  onOpenChange,
  activeFilter,
  onFilterChange,
  graphNodes = [],
  onNodeClick,
  activeCluster,
}: OverviewSideDrawerProps) {
  // Filter and sort nodes for Strengths (acquired) and Gaps (gap)
  const filteredNodes = React.useMemo(() => {
    if (!activeFilter || activeFilter === 'all') return [];

    const statusToFilter = activeFilter === 'strengths' ? 'acquired' : 'gap';
    const nodes = graphNodes.filter((node) => node.status === statusToFilter);

    if (activeFilter === 'strengths') {
      const skillsMap = new Map(
        (activeCluster?.detected_skills || []).map((s) => {
          const nameLower = s.name.toLowerCase();
          const ict = s.ict_score ?? 0;
          let score = 1;
          if (ict >= 7.0) score = 3;
          else if (ict >= 4.0) score = 2;

          return [nameLower, { score, demand: s.market_demand_percentage ?? 0 }];
        })
      );

      return [...nodes].sort((a, b) => {
        const aDetail = skillsMap.get(a.label.toLowerCase()) || { score: 1, demand: 0 };
        const bDetail = skillsMap.get(b.label.toLowerCase()) || { score: 1, demand: 0 };

        if (bDetail.score !== aDetail.score) {
          return bDetail.score - aDetail.score;
        }
        return bDetail.demand - aDetail.demand;
      });
    } else {
      const gapsMap = new Map(
        (activeCluster?.skill_gaps || []).map((g) => {
          const nameLower = g.name.toLowerCase();
          const importanceMap: Record<string, number> = {
            critical: 3,
            high: 2,
            medium: 1,
          };
          const importanceScore = importanceMap[g.market_importance ?? 'medium'] ?? 1;

          return [nameLower, { importanceScore, demand: g.market_demand_percentage ?? 0 }];
        })
      );

      return [...nodes].sort((a, b) => {
        const aDetail = gapsMap.get(a.label.toLowerCase()) || { importanceScore: 1, demand: 0 };
        const bDetail = gapsMap.get(b.label.toLowerCase()) || { importanceScore: 1, demand: 0 };

        if (bDetail.importanceScore !== aDetail.importanceScore) {
          return bDetail.importanceScore - aDetail.importanceScore;
        }
        return bDetail.demand - aDetail.demand;
      });
    }
  }, [graphNodes, activeFilter, activeCluster]);

  return (
    <>
      <div className="flex pointer-events-auto w-full">
        <Card className="overflow-visible py-0 flex flex-col w-full card-glass! rounded-t-3xl lg:rounded-2xl border border-x border-b-0 lg:border border-border/30 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_-10px_40px_rgba(0,0,0,0.4)] transition-all duration-300 ease-in-out">
          {/* Header area - acts as handle & contains filters */}
          <div className="flex flex-col p-3 pb-0 border-b border-border/10">
            {/* Handle for mobile drag */}
            <div
              className="flex justify-center lg:hidden cursor-pointer"
              onClick={() => onOpenChange(!isOpen)}
            >
              <div className="w-12 h-1.5 rounded-full bg-muted-foreground/30" />
            </div>

            {/* Segmented Filter Control Row */}
            {activeFilter && onFilterChange && (
              <div className="flex items-center justify-between gap-2">
                <div className="flex bg-muted/65 p-0.5 rounded-lg border border-border/20 flex-1">
                  {[
                    { id: 'all' as FilterMode, label: 'Todo', icon: Network },
                    { id: 'strengths' as FilterMode, label: 'Fortalezas', icon: CheckCircle2 },
                    { id: 'gaps' as FilterMode, label: 'Brechas', icon: AlertCircle },
                  ].map((tab) => {
                    const isActive = activeFilter === tab.id;
                    const TabIcon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => onFilterChange(tab.id)}
                        className={cn(
                          'flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 text-[10px] font-bold rounded-md transition-all cursor-pointer select-none',
                          isActive
                            ? 'bg-background text-foreground shadow-xs'
                            : 'text-muted-foreground/75 hover:text-foreground hover:bg-background/25',
                        )}
                      >
                        <TabIcon
                          className={cn(
                            'w-3 h-3 shrink-0',
                            isActive ? 'text-primary' : 'text-muted-foreground/50',
                          )}
                        />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Toggle button */}
                <button
                  onClick={() => onOpenChange(!isOpen)}
                  className="flex items-center justify-center h-7 w-7 rounded-lg hover:bg-muted text-muted-foreground/80 transition-colors border border-border/10 cursor-pointer shrink-0"
                  title={isOpen ? 'Colapsar panel' : 'Expandir panel'}
                >
                  {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                </button>
              </div>
            )}
          </div>

          {/* Expandable Body */}
          <div
            className={cn(
              'flex flex-col overflow-hidden transition-all duration-300 ease-in-out',
              isOpen ? 'max-h-[60vh] lg:max-h-[70vh] opacity-100' : 'max-h-0 opacity-0',
            )}
          >
            {/* Tab content */}
            <div className="flex-1 overflow-y-auto scrollbar-none min-h-[60vh]">
              {activeFilter === 'all' ? (
                <div className="flex-1 overflow-visible">
                  <ProfileRadarCard
                    fullName={fullName}
                    roleTitle={roleTitle}
                    seniority={seniority}
                    totalSkills={totalSkills}
                    domainAffinities={domainAffinities}
                    isLoading={isLoading}
                    className="border-0 shadow-none bg-transparent p-0 card-glass-none!"
                  />
                </div>
              ) : (
                <div className="flex-1 flex flex-col p-4 space-y-2.5 h-full">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest">
                      {activeFilter === 'strengths'
                        ? 'Competencias Adquiridas'
                        : 'Brechas por Desarrollar'}
                    </span>
                    <span className="text-[9px] font-extrabold text-muted-foreground/80 bg-secondary/80 border border-border/40 px-2 py-0.5 rounded-full">
                      {filteredNodes.length}
                    </span>
                  </div>

                  <div className="h-full space-y-2 overflow-y-auto pr-1 scrollbar-thin">
                    {filteredNodes.length === 0 ? (
                      <p className="text-xs text-muted-foreground text-center py-10 font-medium">
                        No se detectaron {activeFilter === 'strengths' ? 'fortalezas' : 'brechas'}{' '}
                        en esta especialidad.
                      </p>
                    ) : (
                      filteredNodes.map((node) => (
                        <div
                          key={node.id}
                          onClick={() => onNodeClick && onNodeClick(node)}
                          className="flex items-center justify-between p-2.5 rounded-xl border border-border/40 bg-secondary/15 hover:bg-secondary/30 hover:border-primary/30 transition-all cursor-pointer group"
                        >
                          <div className="flex flex-col min-w-0 pr-2">
                            <span className="text-xs font-bold text-foreground truncate group-hover:text-primary transition-colors">
                              {node.label}
                            </span>
                            <span className="text-[9px] text-muted-foreground font-semibold uppercase tracking-wider mt-0.5">
                              {node.group}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            {node.status === 'acquired' ? (
                              <span className="inline-flex h-1.5 w-1.5 rounded-full bg-success" />
                            ) : (
                              <span className="inline-flex h-1.5 w-1.5 rounded-full bg-warning animate-pulse" />
                            )}
                            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/45 group-hover:text-primary transition-all group-hover:translate-x-0.5" />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-border/10 bg-muted shrink-0 rounded-b-2xl">
              <Link href="/diagnosis" className="block w-full">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-[11px] font-bold h-9 text-muted-foreground hover:text-foreground flex items-center justify-center gap-1.5 transition-all rounded-lg cursor-pointer hover:bg-muted/50"
                >
                  Ver diagnóstico completo
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
