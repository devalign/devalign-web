'use client';

import * as React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BreadcrumbClusterDropdown } from '@/components/layout/breadcrumb-cluster-dropdown';
import type { ClusterAffinityItem } from '@/lib/api/types';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  isClusterSelector?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  clusters?: ClusterAffinityItem[];
  activeCluster?: ClusterAffinityItem | null;
  onSelectCluster?: (name: string) => void;
}

export function Breadcrumb({
  items,
  className,
  clusters,
  activeCluster,
  onSelectCluster,
}: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn('flex items-center space-x-1.5 text-xs text-muted-foreground', className)}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            {index > 0 && (
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/45 shrink-0" />
            )}
            {item.isClusterSelector && clusters && onSelectCluster ? (
              <BreadcrumbClusterDropdown
                clusters={clusters}
                activeCluster={activeCluster ?? null}
                onSelect={onSelectCluster}
              />
            ) : isLast || !item.href ? (
              <span
                className={cn(
                  'font-semibold text-foreground truncate max-w-[120px] sm:max-w-[200px]',
                  isLast ? 'text-foreground font-extrabold' : 'text-muted-foreground',
                )}
              >
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="hover:text-primary transition-colors font-medium hover:underline"
              >
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
