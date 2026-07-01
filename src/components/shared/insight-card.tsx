import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Lightbulb, TrendingUp, AlertTriangle, CheckCircle, BarChart3, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export type InsightType = 'trend' | 'gap' | 'compliance' | 'critical' | 'general';

interface InsightCardProps {
  title: string;
  description: React.ReactNode;
  value?: string | number;
  type?: InsightType;
  icon?: LucideIcon;
  className?: string;
}

const getInsightConfig = (type: InsightType) => {
  switch (type) {
    case 'trend':
      return {
        icon: TrendingUp,
        colorClass: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20',
        badgeClass: 'text-indigo-600 bg-indigo-500/10',
      };
    case 'gap':
      return {
        icon: AlertTriangle,
        colorClass: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
        badgeClass: 'text-rose-600 bg-rose-500/10',
      };
    case 'compliance':
      return {
        icon: CheckCircle,
        colorClass: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
        badgeClass: 'text-emerald-600 bg-emerald-500/10',
      };
    case 'critical':
      return {
        icon: Lightbulb,
        colorClass: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
        badgeClass: 'text-amber-600 bg-amber-500/10',
      };
    default:
      return {
        icon: BarChart3,
        colorClass: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20',
        badgeClass: 'text-indigo-600 bg-indigo-500/10',
      };
  }
};

export function InsightCard({
  title,
  description,
  value,
  type = 'general',
  icon: CustomIcon,
  className,
}: InsightCardProps) {
  const config = getInsightConfig(type);
  const Icon = CustomIcon || config.icon;

  return (
    <Card className={cn('card-insight overflow-hidden flex flex-col', className)}>
      <CardContent className="p-4 sm:p-5 flex flex-col gap-3 h-full">
        <div className="flex items-start justify-between gap-2">
          <div className={cn('p-2 rounded-xl border shrink-0', config.colorClass)}>
            <Icon className="w-4 h-4" />
          </div>
          {value && (
            <span className={cn('px-2.5 py-1 rounded-lg text-xs font-black tracking-tight', config.badgeClass)}>
              {value}
            </span>
          )}
        </div>
        
        <div className="space-y-1.5 mt-auto">
          <h4 className="font-extrabold text-sm text-foreground tracking-tight leading-tight">
            {title}
          </h4>
          <div className="text-xs text-muted-foreground leading-relaxed">
            {description}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
