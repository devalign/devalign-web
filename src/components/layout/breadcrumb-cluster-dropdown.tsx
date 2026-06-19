'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Sparkles, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ClusterAffinityItem } from '@/lib/api/types';

interface BreadcrumbClusterDropdownProps {
  clusters: ClusterAffinityItem[];
  activeCluster: ClusterAffinityItem | null;
  onSelect: (clusterName: string) => void;
  className?: string;
}

export function BreadcrumbClusterDropdown({
  clusters,
  activeCluster,
  onSelect,
  className,
}: BreadcrumbClusterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!activeCluster || clusters.length === 0) {
    return (
      <span className="font-semibold text-foreground truncate max-w-[120px] sm:max-w-[200px]">
        {activeCluster?.cluster_name || 'Especialidad'}
      </span>
    );
  }

  const score = Math.round(activeCluster.affinity_score * 100);

  return (
    <div ref={dropdownRef} className={cn('relative inline-flex items-center', className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-xs font-bold transition-all cursor-pointer',
          'hover:bg-primary/10 hover:text-primary',
          'text-foreground',
          isOpen && 'bg-primary/10 text-primary'
        )}
      >
        <span className="truncate max-w-[140px] sm:max-w-[180px]">{activeCluster.cluster_name}</span>
        <ChevronDown
          className={cn(
            'h-3 w-3 shrink-0 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1.5 w-56 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-50">
          <div className="p-1">
            {clusters.map((cluster) => {
              const isSelected = cluster.cluster_name === activeCluster.cluster_name;
              const clusterScore = Math.round(cluster.affinity_score * 100);

              return (
                <button
                  key={cluster.cluster_id}
                  onClick={() => {
                    onSelect(cluster.cluster_name);
                    setIsOpen(false);
                  }}
                  className={cn(
                    'w-full flex items-center gap-2 px-2.5 py-2 rounded-md text-left transition-colors cursor-pointer',
                    isSelected
                      ? 'bg-primary/10 text-primary'
                      : 'text-foreground hover:bg-secondary/50'
                  )}
                >
                  {cluster.is_primary && (
                    <Sparkles
                      className={cn(
                        'h-3 w-3 shrink-0',
                        isSelected ? 'text-primary' : 'text-emerald-500'
                      )}
                    />
                  )}
                  {!cluster.is_primary && <div className="w-3 shrink-0" />}
                  <span className="flex-1 text-xs font-semibold truncate">
                    {cluster.cluster_name}
                  </span>
                  <span
                    className={cn(
                      'text-[10px] font-bold tabular-nums',
                      isSelected ? 'text-primary' : 'text-muted-foreground'
                    )}
                  >
                    {clusterScore}%
                  </span>
                  {isSelected && <Check className="h-3 w-3 shrink-0 text-primary" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
