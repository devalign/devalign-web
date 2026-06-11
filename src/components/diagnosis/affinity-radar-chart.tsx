'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from 'recharts';
import { DomainAffinity } from './types';
import { Target } from 'lucide-react';

interface Props {
  data: DomainAffinity[];
  isEmpty?: boolean;
}

export function AffinityRadarChartCard({ data, isEmpty = false }: Props) {
  return (
    <Card className="border-border bg-card h-full flex flex-col justify-between">
      <div>
        <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-xs font-bold text-muted-foreground flex items-center gap-2 tracking-wider uppercase">
            <Target className="h-4 w-4 text-primary" />
            Afinidad Técnica (Por dominio)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full h-[240px] mt-2">
            {isEmpty ? (
              <div className="w-full h-full flex flex-col items-center justify-center border border-dashed border-border/80 bg-secondary/5 rounded-2xl">
                <div className="w-24 h-24 rounded-full border border-dashed border-muted-foreground/20 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full border border-dashed border-muted-foreground/20 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full border border-dashed border-muted-foreground/20" />
                  </div>
                </div>
                <p className="text-[10px] text-muted-foreground/60 mt-4 uppercase tracking-wider font-bold">
                  Esperando Diagnóstico
                </p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="60%" data={data}>
                  <PolarGrid stroke="#e2e8f0" className="dark:stroke-slate-800" />
                  <PolarAngleAxis 
                    dataKey="domain" 
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 600 }} 
                  />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar
                    name="Tu perfil"
                    dataKey="profileScore"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    fill="hsl(var(--primary))"
                    fillOpacity={0.2}
                  />
                  <Radar
                    name="Demanda del mercado"
                    dataKey="marketDemand"
                    stroke="hsl(var(--muted-foreground))"
                    strokeWidth={1.5}
                    fill="transparent"
                    strokeDasharray="4 4"
                  />
                  <Legend 
                    wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} 
                    iconType="circle"
                  />
                </RadarChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
