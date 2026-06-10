'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Hexagon,
  Activity,
  Map,
  Settings,
  Lock,
  ShieldCheck,
  LogOut,
  FileText,
  Sun,
  Moon,
  type LucideIcon,
} from 'lucide-react';
import { useSidebar } from './sidebar-context';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useUserCVs } from '@/hooks/use-user-cvs';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

export default function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isCollapsed } = useSidebar();
  const { data: user, isLoading: isUserLoading } = useCurrentUser();
  const { data: cvData } = useUserCVs();

  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = React.useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);
  const [theme, setTheme] = React.useState<'light' | 'dark'>('light');

  const supabase = createClient();

  // Sync theme state with DOM
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const isDark = document.documentElement.classList.contains('dark');
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTheme(isDark ? 'dark' : 'light');
    }
  }, []);

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    const root = document.documentElement;
    if (newTheme === 'dark') {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
    setTheme(newTheme);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  const navItems: { name: string; href: string; icon: LucideIcon; disabled?: boolean }[] = [
    { name: 'Diagnóstico', href: '/dashboard', icon: Activity },
    { name: 'Roadmap', href: '/dashboard/roadmap', icon: Map },
  ];

  const currentCV = cvData?.cvs?.[0];

  return (
    <aside
      className={cn(
        'relative flex h-screen flex-col border-r border-border bg-card transition-all duration-300 ease-in-out z-30',
        isCollapsed ? 'w-16' : 'w-64',
      )}
    >
      {/* Header / Logo */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-border">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <Hexagon className="h-6 w-6 text-primary fill-primary/20 animate-pulse" />
            <div className="flex flex-col">
              <span className="font-bold tracking-tight text-foreground text-sm">Devalign</span>
              <span className="text-[10px] text-muted-foreground font-mono">v0.1.0</span>
            </div>
          </div>
        )}
        {isCollapsed && <Hexagon className="mx-auto h-6 w-6 text-primary fill-primary/20" />}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1.5 px-3 py-4 overflow-y-auto">
        {!isCollapsed && (
          <p className="px-2 text-[10px] font-semibold text-muted-foreground tracking-wider uppercase mb-2">
            Navegación
          </p>
        )}
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          if (item.disabled) {
            return (
              <div
                key={item.name}
                className={cn(
                  'flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground/60 cursor-not-allowed select-none group',
                  isCollapsed ? 'justify-center' : '',
                )}
                title={`${item.name} (Próximamente)`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="h-4 w-4 shrink-0 text-muted-foreground/40" />
                  {!isCollapsed && <span>{item.name}</span>}
                </div>
                {!isCollapsed && <Lock className="h-3 w-3 text-muted-foreground/40 shrink-0" />}
              </div>
            );
          }

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold transition-all duration-200',
                isActive
                  ? 'bg-secondary text-foreground font-extrabold shadow-xs'
                  : 'text-muted-foreground hover:bg-secondary/40 hover:text-foreground',
              )}
            >
              <Icon
                className={cn(
                  'h-4 w-4 shrink-0',
                  isActive ? 'text-primary' : 'text-muted-foreground/70',
                )}
              />
              {!isCollapsed && <span>{item.name}</span>}
            </Link>
          );
        })}

        {/* Document Section (from reference) */}
        {!isCollapsed && currentCV && (
          <div className="mt-8 pt-6 border-t border-border space-y-3">
            <p className="px-2 text-[10px] font-semibold text-muted-foreground tracking-wider uppercase">
              Documento
            </p>
            <div className="rounded-xl border border-border bg-card p-3 transition-shadow duration-200">
              <div className="flex items-start gap-2.5">
                <div className="rounded-lg bg-red-50 p-1.5 text-red-500 shrink-0 dark:bg-red-950/30">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1 space-y-0.5">
                  <p
                    className="text-xs font-medium text-foreground truncate"
                    title={currentCV.original_filename}
                  >
                    {currentCV.original_filename}
                  </p>
                  <p className="text-[10px] text-muted-foreground font-mono">
                    {(currentCV.size_bytes / 1024 / 1024).toFixed(1)} MB • PDF
                  </p>
                </div>
              </div>

              <div className="mt-3 space-y-2">
                <Link href="/profile?action=update-cv" className="block">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-[10px] h-7 border-primary/30 text-primary hover:bg-primary/10 cursor-pointer"
                  >
                    Actualizar CV
                  </Button>
                </Link>
                <Link href="/profile?action=preview-ats" className="block">
                  <Button
                    variant="default"
                    size="sm"
                    className="w-full text-[10px] h-7 cursor-pointer"
                  >
                    Generar CV ATS
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Security Info */}
      {!isCollapsed && (
        <div className="m-3 p-2.5 text-[10px] text-muted-foreground flex items-start gap-2 border border-border/50 rounded-lg bg-transparent">
          <ShieldCheck className="h-4 w-4 shrink-0 text-primary" />
          <p className="leading-tight">Tus datos están seguros. No compartimos tu información.</p>
        </div>
      )}

      {/* Sidebar Footer */}
      <div className="p-3 border-t border-border bg-card space-y-2">
        {/* Collapsed User Info Trigger for Collapsed View */}
        {isCollapsed && (
          <div className="flex flex-col gap-2.5 items-center pt-1">
            {/* Collapsed Settings Button (Opens Settings Modal Directly) */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSettingsOpen(true)}
              className="h-8 w-8 rounded-md hover:bg-muted text-muted-foreground cursor-pointer"
              title="Ajustes de cuenta"
            >
              <Settings className="h-4 w-4" />
            </Button>

            {/* Collapsed Avatar Link (Navigates directly to /profile) */}
            <Link
              href="/profile"
              className="h-8 w-8 rounded-full overflow-hidden hover:ring-2 hover:ring-primary transition-all duration-200 focus:outline-hidden cursor-pointer block"
              title="Mi Perfil"
            >
              {isUserLoading ? (
                <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
              ) : user?.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.avatar_url} alt="User" className="h-8 w-8 object-cover" />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center bg-primary/20 text-primary-foreground font-semibold text-xs uppercase">
                  {user?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                </div>
              )}
            </Link>
          </div>
        )}

        {/* User Information with Options Button (Expanded View) */}
        {!isCollapsed && (
          <div className="px-3 py-2 flex items-center justify-between gap-2.5 overflow-hidden mt-1 bg-secondary/10 rounded-lg relative">
            {isUserLoading ? (
              <div className="flex items-center gap-2 animate-pulse w-full py-0.5">
                <div className="h-8 w-8 rounded-full bg-muted" />
                <div className="h-3 w-16 rounded bg-muted" />
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <Link href="/profile" className="shrink-0 hover:opacity-80 transition-opacity">
                    {user?.avatar_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={user.avatar_url}
                        alt="Avatar"
                        className="h-8 w-8 rounded-full object-cover ring-1 ring-border"
                      />
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-primary-foreground font-semibold text-xs uppercase">
                        {user?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                      </div>
                    )}
                  </Link>
                  <Link
                    href="/profile"
                    className="text-xs font-bold text-foreground hover:text-primary transition-colors flex items-center gap-1 group truncate min-w-0"
                  >
                    <span>Mi Perfil</span>
                    <span className="inline-block transition-transform group-hover:translate-x-0.5 shrink-0">
                      &rarr;
                    </span>
                  </Link>
                </div>

                {/* Options Button (Settings icon) */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSettingsOpen(true)}
                  className="h-7 w-7 rounded-md hover:bg-muted text-muted-foreground shrink-0 cursor-pointer"
                  title="Ajustes de cuenta"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Settings Modal Dialog */}
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent className="sm:max-w-md border-border bg-card">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-bold text-foreground">
              <Settings className="h-5 w-5 text-primary" />
              <span>Ajustes de Cuenta</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Gestiona tus preferencias de privacidad, apariencia, alertas y sesión.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-5">
            {/* Apariencia / Tema */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Apariencia
              </h4>
              <div className="grid grid-cols-2 gap-1 bg-secondary/35 p-0.5 rounded-lg border border-border/50">
                <button
                  onClick={() => handleThemeChange('light')}
                  className={cn(
                    'flex items-center justify-center gap-1 py-1.5 px-1.5 text-[10px] font-semibold rounded-md transition-all duration-150 cursor-pointer',
                    theme === 'light'
                      ? 'bg-card text-foreground shadow-xs'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  <Sun className="h-3 w-3" />
                  <span>Claro</span>
                </button>
                <button
                  onClick={() => handleThemeChange('dark')}
                  className={cn(
                    'flex items-center justify-center gap-1 py-1.5 px-1.5 text-[10px] font-semibold rounded-md transition-all duration-150 cursor-pointer',
                    theme === 'dark'
                      ? 'bg-card text-foreground shadow-xs'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  <Moon className="h-3 w-3" />
                  <span>Oscuro</span>
                </button>
              </div>
            </div>



            {/* Notificaciones */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Notificaciones
              </h4>
              <div className="space-y-3 rounded-lg border border-border p-3.5 bg-secondary/10">
                <label className="flex items-start justify-between gap-4 cursor-pointer">
                  <div className="space-y-0.5">
                    <span className="text-xs font-semibold text-foreground">
                      Reportes Semanales
                    </span>
                    <p className="text-[10px] text-muted-foreground leading-normal">
                      Recibe correos con el estado actualizado del mercado de desarrollo de
                      software.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked={false}
                    className="h-4 w-4 rounded-sm border-border text-primary focus:ring-primary cursor-pointer accent-primary"
                  />
                </label>
              </div>
            </div>

            {/* Datos & Cuenta */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Datos de la Cuenta
              </h4>
              <div className="rounded-lg border border-destructive/20 p-3.5 bg-destructive/5 flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <span className="text-xs font-semibold text-destructive">Restablecer Cuenta</span>
                  <p className="text-[10px] text-muted-foreground leading-normal">
                    Elimina de forma permanente tu currículum, historial y diagnósticos guardados.
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    toast.error('Esta acción simula la eliminación de todos tus datos.');
                  }}
                  className="border-destructive/30 text-destructive hover:bg-destructive/10 text-[10px] h-7 shrink-0 cursor-pointer"
                >
                  Restablecer
                </Button>
              </div>
            </div>

            {/* Sesión */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Sesión
              </h4>
              <div className="rounded-lg border border-border p-3.5 bg-secondary/10 flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <span className="text-xs font-semibold text-foreground">Cerrar Sesión</span>
                  <p className="text-[10px] text-muted-foreground leading-normal">
                    Cierra de forma segura tu sesión activa en este dispositivo.
                  </p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    setIsSettingsOpen(false);
                    setIsLogoutConfirmOpen(true);
                  }}
                  className="text-[10px] h-7 shrink-0 cursor-pointer"
                >
                  Cerrar sesión
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end border-t border-border pt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSettingsOpen(false)}
              className="cursor-pointer"
            >
              Cancelar
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => {
                setIsSettingsOpen(false);
                toast.success('Ajustes guardados correctamente.');
              }}
              className="cursor-pointer"
            >
              Guardar Ajustes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Logout Confirmation Dialog */}
      <Dialog open={isLogoutConfirmOpen} onOpenChange={setIsLogoutConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center gap-2 font-bold">
              <LogOut className="h-5 w-5" />
              <span>¿Cerrar sesión?</span>
            </DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas cerrar sesión? Tendrás que volver a autenticarte para
              acceder a tus diagnósticos y roadmaps.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsLogoutConfirmOpen(false)}
              className="cursor-pointer"
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleLogout}
              className="gap-2 cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              <span>Cerrar sesión</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </aside>
  );
}
