'use client';

import Link from 'next/link';
import { ArrowLeft, FileText } from 'lucide-react';
import AuthShell from '@/app/(auth)/login/_components/auth-shell';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function TermsPage() {
  return (
    <AuthShell>
      <div className="w-full max-w-2xl mx-auto">
        <Card className="border-border bg-card shadow-2xl">
          <CardHeader className="border-b border-border/60 pb-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <Link href="/">
                <Button variant="ghost" size="sm" className="gap-2 cursor-pointer -ml-2 text-muted-foreground hover:text-foreground">
                  <ArrowLeft className="h-4 w-4" />
                  Volver al inicio
                </Button>
              </Link>
              <div className="flex items-center gap-2 text-xs font-semibold text-success bg-success/10 px-2.5 py-1 rounded-full">
                <FileText className="h-3.5 w-3.5" />
                Legal
              </div>
            </div>
            <div className="space-y-1">
              <CardTitle className="text-2xl font-bold tracking-tight">Términos de Servicio</CardTitle>
              <p className="text-xs text-muted-foreground">Última actualización: Mayo 2026</p>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-6 text-sm text-muted-foreground leading-relaxed">
            <p>
              Bienvenido a <strong>Devalign</strong>. Al utilizar nuestra plataforma, aceptas
              cumplir con los siguientes términos y condiciones que rigen el uso del software de
              alineación técnica y generación de roadmaps profesionales.
            </p>
            
            <section className="space-y-2">
              <h3 className="font-bold text-foreground text-base">1. Uso del Servicio</h3>
              <p>
                Devalign es una herramienta de diagnóstico basada en Inteligencia Artificial. Está
                diseñada para analizar perfiles técnicos, identificar brechas de habilidades y
                recomendar rutas de aprendizaje personalizadas de acuerdo a las demandas del mercado
                TI.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="font-bold text-foreground text-base">2. Carga de Documentos (CV)</h3>
              <p>
                Al subir tu CV (hoja de vida) en formato PDF o DOCX, garantizas que la información es
                verídica y que tienes el derecho legal de compartirla. Autorizas a Devalign a procesar
                y analizar el contenido para generar las métricas de afinidad técnica
                correspondientes.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="font-bold text-foreground text-base">3. Limitación de Responsabilidad</h3>
              <p>
                Las recomendaciones y sugerencias de aprendizaje generadas por la IA son de carácter
                informativo y de orientación profesional. Devalign no garantiza contratación laboral
                ni se hace responsable por decisiones profesionales tomadas en base a los
                diagnósticos.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="font-bold text-foreground text-base">4. Propiedad Intelectual</h3>
              <p>
                El código, el diseño, la marca y los algoritmos propietarios de Devalign son propiedad
                intelectual exclusiva de la empresa y no pueden ser reproducidos ni distribuidos sin
                consentimiento expreso por escrito.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </AuthShell>
  );
}
