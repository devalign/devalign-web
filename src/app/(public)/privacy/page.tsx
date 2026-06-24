'use client';

import Link from 'next/link';
import { ArrowLeft, ShieldAlert } from 'lucide-react';
import AuthShell from '@/components/auth/auth-shell';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function PrivacyPage() {
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
                <ShieldAlert className="h-3.5 w-3.5" />
                Privacidad
              </div>
            </div>
            <div className="space-y-1">
              <CardTitle className="text-2xl font-bold tracking-tight">Política de Privacidad</CardTitle>
              <p className="text-xs text-muted-foreground">Última actualización: Mayo 2026</p>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-6 text-sm text-muted-foreground leading-relaxed">
            <p>
              En <strong>Devalign</strong>, nos tomamos muy en serio la seguridad y confidencialidad
              de tus datos personales. Esta política detalla cómo recopilamos, usamos y protegemos
              tu información.
            </p>

            <section className="space-y-2">
              <h3 className="font-bold text-foreground text-base">1. Información Recopilada</h3>
              <p>
                Recopilamos información necesaria para el funcionamiento del servicio, incluyendo: tu
                nombre completo, correo electrónico, credenciales de inicio de sesión y la información
                contenida en el documento de CV que decidas cargar de forma voluntaria.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="font-bold text-foreground text-base">2. Uso de la Información</h3>
              <p>Utilizamos tus datos únicamente para:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Autenticar tu cuenta y proteger el acceso al sistema.</li>
                <li>
                  Analizar tu CV mediante modelos de procesamiento de lenguaje natural (NLP) e IA para
                  calcular tu brecha de habilidades.
                </li>
                <li>Generar y personalizar tu roadmap de aprendizaje técnico.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h3 className="font-bold text-foreground text-base">3. Proveedores de Servicios</h3>
              <p>
                Tus datos son almacenados de forma segura utilizando la infraestructura de{' '}
                <strong>Supabase</strong>. Los análisis de perfil técnico se ejecutan a través de APIs
                cifradas de proveedores de IA líderes del mercado, garantizando que tu información no
                se utilice para entrenar modelos públicos.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="font-bold text-foreground text-base">4. Control sobre tus Datos</h3>
              <p>
                Puedes solicitar la eliminación permanente de tu cuenta, tu perfil y cualquier CV
                subido a la plataforma en cualquier momento desde tu panel de usuario o comunicándote
                con nuestro soporte de forma directa.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </AuthShell>
  );
}
