import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, ResponsiveContainer, YAxis } from 'recharts';
import { ArrowUpRight } from 'lucide-react';
import { ClusterDemandDataPoint } from './types';

interface Props {
  growth: number;
  data: ClusterDemandDataPoint[];
  isEmpty?: boolean;
}

export function ClusterDemandChartCard({ growth, data, isEmpty = false }: Props) {
  return (
    <Card className="border-border bg-card shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-xs font-bold text-muted-foreground flex items-center gap-2 tracking-wider uppercase">
          <ArrowUpRight className="h-4 w-4 text-primary" />
          Demanda del Cluster
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-[10px] text-muted-foreground -mt-2 mb-3">
          Crecimiento en ofertas (últimos 6 meses)
        </p>
        {isEmpty ? (
          <div className="flex items-end justify-between gap-4 animate-pulse">
            <div className="h-8 bg-muted rounded-md w-16" />
            <div className="w-28 h-10 bg-muted/40 rounded-md border border-dashed border-border" />
          </div>
        ) : (
          <div className="flex items-end justify-between gap-4">
            <div className="text-3xl font-extrabold text-primary">
              +{growth}%
            </div>
            
            <div className="w-28 h-10">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorDemand" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <YAxis domain={['dataMin - 5', 'dataMax + 5']} hide />
                  <Area 
                    type="monotone" 
                    dataKey="demand" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2} 
                    fillOpacity={1} 
                    fill="url(#colorDemand)" 
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
