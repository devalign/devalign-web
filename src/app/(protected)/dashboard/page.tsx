'use client';

import React from 'react';
import { useCurrentUser } from '@/hooks/use-current-user';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, AlertTriangle, User, LayoutDashboard } from 'lucide-react';

export default function DashboardPage() {
  const { data: user, isLoading: isUserLoading, error: userError } = useCurrentUser();

  return (
    <div className="space-y-8 animate-in fade-in duration-500 p-6 sm:p-8 md:p-10 max-w-4xl">
      <div className="space-y-2">
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl flex items-center gap-2">
          <LayoutDashboard className="h-7 w-7 text-primary" />
          Dashboard de Diagnóstico
        </h1>
        <p className="text-sm text-muted-foreground">
          Panel de control para verificar el estado de integración del sistema y base de datos local.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Auth status */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2 text-emerald-600">
              <CheckCircle className="w-5 h-5" />
              Autenticación Supabase
            </CardTitle>
            <CardDescription>Sesión de cliente establecida con éxito</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-secondary/50 rounded-lg text-xs font-mono break-all text-muted-foreground">
              <strong className="text-foreground block mb-1">User ID:</strong>
              {isUserLoading ? 'Cargando...' : user?.id}
            </div>
            <div className="text-xs text-muted-foreground leading-relaxed">
              El middleware y la capa de servicios están sincronizando tus datos de sesión de manera segura.
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Backend JIT status */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Aprovisionamiento JIT (FastAPI)
            </CardTitle>
            <CardDescription>
              Conexión en tiempo real con el backend de FastAPI
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isUserLoading ? (
              <div className="p-4 flex items-center justify-center">
                <span className="text-xs text-muted-foreground">Cargando perfil...</span>
              </div>
            ) : user ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-emerald-600 font-semibold text-sm">
                  <CheckCircle className="w-4 h-4" />
                  ¡Usuario registrado JIT con éxito!
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs font-medium p-4 bg-secondary/50 rounded-lg">
                  <div>
                    <span className="text-muted-foreground block mb-1">EMAIL:</span>
                    <span className="text-foreground break-all">{user.email}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block mb-1">NOMBRE:</span>
                    <span className="text-foreground">
                      {user.full_name || 'Sin especificar'}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-amber-600 font-semibold text-sm">
                  <AlertTriangle className="w-4 h-4" />
                  Error de conexión
                </div>
                <div className="p-4 bg-amber-50 rounded-lg text-xs font-mono text-amber-800">
                  {userError instanceof Error ? userError.message : 'No se pudo obtener el perfil del backend.'}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
