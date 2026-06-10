'use client';

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Sparkles, 
  Award, 
  Target, 
  GraduationCap, 
  TrendingUp, 
  Hexagon,
  ShieldCheck
} from 'lucide-react';
import Link from 'next/link';

export default function PublicSharePage() {
  const params = useParams();
  const diagnosticId = params?.diagnosticId as string;

  useEffect(() => {
    console.log('Public diagnostic share loaded for ID:', diagnosticId);
  }, [diagnosticId]);

  // Mock static data for Willy Anderson Samata Ccoya based on the share ID
  const developerName = 'Willy Anderson Samata Ccoya';
  const roleTitle = 'Practicante en Gestión de Información Financiera';
  const seniority = 'mid';
  const degree = 'Ingeniería de Sistemas de Información';
  const university = 'Universidad Peruana de Ciencias Aplicadas - UPC';
  const currentScore = 64;

  const techSkills = [
    'SQL Server', 'Python', 'Databricks', 'Power BI', 'Power Apps', 'Power Automate', 'MS Excel', 'Jupyter Notebooks'
  ];
  
  const certifications = [
    { name: 'Data Analysis with Python', issuer: 'IBM', date: 'Octubre 2025' },
    { name: 'Data Visualization with Python', issuer: 'IBM', date: 'Octubre 2025' },
    { name: 'Python para ciencia de datos, IA y desarrollo', issuer: 'IBM', date: 'Febrero 2025' },
  ];

  // SVG Radar Coordinates out of 100 for (Data, Backend, Cloud, DevOps, Frontend)
  // Maps to: Backend (92), Frontend (42), Cloud (78), DevOps (64), Data (64)
  const convert = (val: number, angleDeg: number) => {
    const angleRad = (angleDeg - 90) * (Math.PI / 180);
    const r = (val / 100) * 70; // Map 100% to 70px radius
    const x = 100 + r * Math.cos(angleRad);
    const y = 100 + r * Math.sin(angleRad);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  };

  const radarPoints = {
    user: [
      convert(75, 0),    // Backend
      convert(42, 72),   // Frontend
      convert(55, 144),  // Cloud
      convert(40, 216),  // DevOps
      convert(80, 288),  // Data
    ].join(' '),
    market: [
      convert(92, 0),    // Backend market demand
      convert(42, 72),   // Frontend market demand
      convert(78, 144),  // Cloud market demand
      convert(64, 216),  // DevOps market demand
      convert(64, 288),  // Data market demand
    ].join(' ')
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      
      {/* Header / Logo */}
      <header className="border-b border-border bg-card/60 backdrop-blur-md py-4">
        <div className="max-w-4xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100">
            <Hexagon className="w-5 h-5 fill-primary/30 text-primary" />
            DEV-ALIGN
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5" />
            Alineación Verificada
          </div>
        </div>
      </header>

      {/* Main Content (Centered Diagnostic Summary Card) */}
      <main className="flex-grow max-w-4xl w-full mx-auto px-6 py-10 flex items-center justify-center">
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          
          {/* LEFT PANEL: verified developer profile */}
          <div className="space-y-6">
            
            {/* Developer credentials */}
            <Card className="shadow-lg shadow-black/5 border-border bg-card">
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-primary/10 text-primary border border-primary/20">
                    <Sparkles className="w-3.5 h-3.5" /> Perfil Validado por IA
                  </span>
                  <h1 className="text-2xl font-black tracking-tight text-foreground">{developerName}</h1>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground font-semibold">{roleTitle}</span>
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-bold font-mono bg-secondary text-foreground uppercase">
                      {seniority}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Education */}
            <Card className="shadow-lg shadow-black/5 border-border bg-card">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-primary" />
                  <span className="text-[10px] font-extrabold text-foreground uppercase tracking-wider">Formación Académica</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-1">
                <p className="text-xs font-bold text-foreground">{degree}</p>
                <p className="text-[10px] text-muted-foreground">{university}</p>
              </CardContent>
            </Card>

            {/* Verified Skills */}
            <Card className="shadow-lg shadow-black/5 border-border bg-card">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-[10px] font-extrabold text-foreground uppercase tracking-wider">Habilidades Verificadas</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1.5">
                  {techSkills.map((skill) => (
                    <span 
                      key={skill}
                      className="px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Certifications */}
            <Card className="shadow-lg shadow-black/5 border-border bg-card">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-primary" />
                  <span className="text-[10px] font-extrabold text-foreground uppercase tracking-wider">Certificaciones obtenidas</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {certifications.map((c, idx) => (
                  <div key={idx} className="flex justify-between items-center gap-4 text-xs">
                    <div className="space-y-0.5">
                      <p className="font-semibold text-foreground">{c.name}</p>
                      <p className="text-[10px] text-muted-foreground">{c.issuer}</p>
                    </div>
                    <span className="text-[10px] text-muted-foreground font-mono shrink-0">{c.date}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* RIGHT PANEL: Alignment metrics */}
          <div className="space-y-6">
            
            {/* Score & specialty */}
            <Card className="shadow-lg shadow-black/5 border-border bg-card">
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="text-center sm:text-left space-y-1">
                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Alineación con el mercado</p>
                    <div className="flex items-baseline justify-center sm:justify-start gap-1">
                      <span className="text-5xl font-black text-foreground tracking-tight">{currentScore}%</span>
                    </div>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border text-emerald-600 bg-emerald-500/10 border-emerald-500/35">
                      Alta afinidad
                    </span>
                  </div>
                  
                  <div className="flex-1 text-center sm:text-right space-y-1.5 border-t sm:border-t-0 sm:border-l border-border pt-4 sm:pt-0 sm:pl-6">
                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Especialidad detectada</p>
                    <h3 className="text-lg font-black text-foreground tracking-tight">Data Engineering</h3>
                    <p className="text-[9px] text-muted-foreground">Perfil verificado frente al mercado peruano.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Radar Chart */}
            <Card className="shadow-lg shadow-black/5 border-border bg-card">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-primary" />
                  <span className="text-[10px] font-extrabold text-foreground uppercase tracking-wider">Afinidad por Dominio</span>
                </div>
              </CardHeader>
              <CardContent className="flex justify-center py-4">
                <div className="relative w-full max-w-[190px] aspect-square">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 200 200">
                    {[20, 40, 60, 80, 100].map((r) => {
                      const rad = (r / 100) * 70;
                      const points = [0, 72, 144, 216, 288].map((angle) => {
                        const a = (angle - 90) * (Math.PI / 180);
                        return `${100 + rad * Math.cos(a)},${100 + rad * Math.sin(a)}`;
                      }).join(' ');
                      return (
                        <polygon
                          key={r}
                          points={points}
                          className="fill-none stroke-border/40 stroke-1"
                        />
                      );
                    })}

                    {[0, 72, 144, 216, 288].map((angle) => {
                      const a = (angle - 90) * (Math.PI / 180);
                      return (
                        <line
                          key={angle}
                          x1={100}
                          y1={100}
                          x2={100 + 70 * Math.cos(a)}
                          y2={100 + 70 * Math.sin(a)}
                          className="stroke-border/40 stroke-1"
                        />
                      );
                    })}

                    <text x={100} y={15} textAnchor="middle" className="fill-muted-foreground text-[8px] font-bold font-mono">BACKEND</text>
                    <text x={178} y={75} textAnchor="start" className="fill-muted-foreground text-[8px] font-bold font-mono">FRONTEND</text>
                    <text x={155} y={185} textAnchor="start" className="fill-muted-foreground text-[8px] font-bold font-mono">CLOUD</text>
                    <text x={45} y={185} textAnchor="end" className="fill-muted-foreground text-[8px] font-bold font-mono">DEVOPS</text>
                    <text x={22} y={75} textAnchor="end" className="fill-muted-foreground text-[8px] font-bold font-mono">DATA</text>

                    <polygon points={radarPoints.market} className="fill-slate-800/10 stroke-slate-500/50 stroke-1.5" />
                    <polygon points={radarPoints.user} className="fill-primary/25 stroke-primary stroke-2" />

                    {radarPoints.market.split(' ').map((p, idx) => {
                      const [x, y] = p.split(',');
                      return <circle key={idx} cx={x} cy={y} r={2.5} className="fill-slate-500" />;
                    })}

                    {radarPoints.user.split(' ').map((p, idx) => {
                      const [x, y] = p.split(',');
                      return <circle key={idx} cx={x} cy={y} r={3} className="fill-primary stroke-card stroke-1" />;
                    })}
                  </svg>

                  <div className="absolute -bottom-6 left-0 right-0 flex justify-center gap-4 text-[9px] font-mono text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
                      <span>Mercado</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      <span>Perfil</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Compatible Roles */}
            <Card className="shadow-lg shadow-black/5 border-border bg-card">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <span className="text-[10px] font-extrabold text-foreground uppercase tracking-wider">Roles compatibles</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between items-center p-2 rounded-lg bg-secondary/35 text-xs">
                  <span className="font-bold text-foreground">Backend Java Developer</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 text-[10px] font-bold">Afinidad Alta</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-lg bg-secondary/35 text-xs">
                  <span className="font-bold text-foreground">Java Cloud Engineer</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 text-[10px] font-bold">Afinidad Alta</span>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </main>

      {/* Footer / CTA Branding */}
      <footer className="border-t border-border bg-card py-6">
        <div className="max-w-4xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <p className="text-xs font-bold text-foreground">¿Quieres medir tu alineación técnica?</p>
            <p className="text-[10px] text-muted-foreground">Descubre tus brechas frente al mercado TI con Devalign.</p>
          </div>
          <Link href="/">
            <Button size="sm" className="h-10 px-6 font-bold cursor-pointer shadow-xs">
              Medir mi Perfil Gratis
            </Button>
          </Link>
        </div>
      </footer>

    </div>
  );
}
