import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Hexagon, LayoutDashboard, LogOut, CheckCircle, AlertTriangle, User } from 'lucide-react';

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Route protection fallback if middleware proxy didn't catch it
  if (!user) {
    redirect('/login');
  }

  let backendProfile = null;
  let backendError = null;

  // Perform a test call to the FastAPI backend to trigger JIT provisioning
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const token = session?.access_token;

    if (token) {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        next: { revalidate: 0 }, // Bypass caching for dynamic JIT check
      });

      if (res.ok) {
        backendProfile = await res.json();
      } else {
        backendError = `El backend retornó código HTTP ${res.status}`;
      }
    } else {
      backendError = 'No se pudo obtener el token JWT de la sesión activa';
    }
  } catch (err) {
    backendError =
      err instanceof Error
        ? err.message
        : 'Error de conexión con el backend de FastAPI (puerto 8000)';
  }

  const handleLogout = async () => {
    'use server';
    const supabaseClient = await createClient();
    await supabaseClient.auth.signOut();
    redirect('/login');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-lg text-slate-900">
            <Hexagon className="w-5 h-5 fill-slate-900 text-slate-900" />
            DEV-ALIGN
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs text-slate-500 font-mono hidden md:inline">{user.email}</span>
            <form action={handleLogout}>
              <Button
                type="submit"
                variant="ghost"
                size="sm"
                className="gap-2 text-slate-600 hover:text-slate-900"
              >
                <LogOut className="w-4 h-4" />
                Cerrar sesión
              </Button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <LayoutDashboard className="w-8 h-8 text-primary" />
            Dashboard de Devalign
          </h1>
          <p className="text-slate-500 mt-1">
            Bienvenido a tu panel de alineación técnica y roadmap IT.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Auth Session Status */}
          <Card className="shadow-lg shadow-black/5 border-slate-100 bg-white md:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center gap-2 text-emerald-600">
                <CheckCircle className="w-5 h-5" />
                Autenticación Supabase
              </CardTitle>
              <CardDescription>Sesión de cliente establecida con éxito</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-slate-50 rounded-lg text-xs font-mono break-all text-slate-600">
                <strong className="text-slate-800 block mb-1">User ID (Supabase):</strong>
                {user.id}
              </div>
              <div className="text-xs text-slate-500 leading-relaxed">
                El middleware de Next.js intercepta correctamente tus cookies y valida tu rol de
                manera segura en el servidor.
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Backend & JIT Status */}
          <Card className="shadow-lg shadow-black/5 border-slate-100 bg-white md:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Aprovisionamiento JIT (FastAPI)
              </CardTitle>
              <CardDescription>
                Prueba de conexión en tiempo real con el backend en el puerto 8000
              </CardDescription>
            </CardHeader>
            <CardContent>
              {backendProfile ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-emerald-600 font-semibold text-sm">
                    <CheckCircle className="w-4 h-4" />
                    ¡Usuario registrado JIT con éxito en PostgreSQL!
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs font-medium p-4 bg-slate-50 rounded-lg">
                    <div>
                      <span className="text-slate-400 block mb-1">EMAIL BACKEND:</span>
                      <span className="text-slate-800 break-all">{backendProfile.email}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-1">NOMBRE COMPLETO:</span>
                      <span className="text-slate-800">
                        {backendProfile.full_name || 'Sin especificar'}
                      </span>
                    </div>
                    <div className="col-span-2 pt-2 border-t border-slate-200">
                      <span className="text-slate-400 block mb-1">POSTGRES ID (UUID):</span>
                      <span className="text-slate-800 font-mono text-[10px]">
                        {backendProfile.id}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed">
                    El backend interceptó tu token Bearer, validó tu firma con Supabase, te creó en
                    la tabla de PostgreSQL del backend en milisegundos y nos retornó tu perfil
                    completo.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-amber-600 font-semibold text-sm">
                    <AlertTriangle className="w-4 h-4" />
                    Error de Aprovisionamiento JIT
                  </div>

                  <div className="p-4 bg-amber-50 rounded-lg text-xs font-mono text-amber-800">
                    {backendError}
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed">
                    Asegúrate de que tu backend FastAPI en `devalign-api` esté corriendo con `make
                    dev` en el puerto `8000`. Si el backend está apagado, no se podrá aprovisionar
                    tu perfil JIT localmente.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
