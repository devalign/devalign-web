'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useUserProfile } from '@/hooks/use-user-profile';

import {
  Hexagon,
  Activity,
  Map,
  Network,
  Settings,
  LogOut,
  Sun,
  Moon,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react';
import { useCurrentUser } from '@/hooks/use-current-user';
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

interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
  disabled?: boolean;
}

const navItems: NavItem[] = [
  { name: 'Overview', href: '/overview', icon: Network },
  { name: 'Mercado', href: '/market', icon: TrendingUp },
  { name: 'Evaluación', href: '/dashboard', icon: Activity },
  { name: 'Plan de Acción', href: '/dashboard/action-plan', icon: Map },
];

export default function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: profile } = useUserProfile();
  const { data: user, isLoading: isUserLoading } = useCurrentUser();
  const cluster = searchParams.get('cluster') || profile?.primary_specialty || '';

  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = React.useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);
  const [theme, setTheme] = React.useState<'light' | 'dark'>('light');

  const supabase = createClient();

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

  return (
    <aside
      suppressHydrationWarning
      className="relative flex h-full flex-col border border-border transition-all duration-300 ease-in-out z-30 shrink-0 w-16"
    >
      <div className="flex h-14 items-center justify-center px-4 border-b border-border">
        <Hexagon className="h-6 w-6 text-primary fill-primary/20" />
      </div>

      <nav className="flex-1 flex flex-col justify-between px-3 py-4">
        <div className="space-y-1.5">
          {navItems.filter(item => item.name !== 'Mercado').map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

          if (item.disabled) {
            return (
              <div key={item.name} className="relative group">
                <div
                  className="flex items-center justify-center rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground/60 cursor-not-allowed select-none"
                  title={`${item.name} (Próximamente)`}
                >
                  <Icon className="h-4 w-4 shrink-0 text-muted-foreground/40" />
                </div>
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2.5 py-1.5 bg-card border border-border rounded-lg shadow-lg text-xs font-semibold opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">
                  {item.name} (Próximamente)
                </div>
              </div>
            );
          }

          const itemHref = cluster
            ? `${item.href}?cluster=${encodeURIComponent(cluster)}`
            : item.href;

          return (
            <div key={item.name} className="relative group">
              <Link
                href={itemHref}
                className={cn(
                  'flex items-center justify-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold transition-all duration-200',
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
              </Link>
              <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2.5 py-1.5 bg-card border border-border rounded-lg shadow-lg text-xs font-semibold opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">
                {item.name}
              </div>
            </div>
          );
        })}
        </div>

        <div className="space-y-1.5">
          {navItems.filter(item => item.name === 'Mercado').map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            const itemHref = cluster
              ? `${item.href}?cluster=${encodeURIComponent(cluster)}`
              : item.href;

            return (
              <div key={item.name} className="relative group">
                <Link
                  href={itemHref}
                  className={cn(
                    'flex items-center justify-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold transition-all duration-200',
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
                </Link>
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2.5 py-1.5 bg-card border border-border rounded-lg shadow-lg text-xs font-semibold opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">
                  {item.name}
                </div>
              </div>
            );
          })}
        </div>
      </nav>

      <div className="p-3 border-t border-border space-y-2.5 flex flex-col justify-center items-center">
        <div className="relative group">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSettingsOpen(true)}
            className="h-8 w-8 rounded-md hover:bg-muted text-muted-foreground cursor-pointer"
            title="Ajustes de cuenta"
          >
            <Settings className="h-4 w-4" />
          </Button>
          <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2.5 py-1.5 bg-card border border-border rounded-lg shadow-lg text-xs font-semibold opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">
            Ajustes
          </div>
        </div>

        <div className="relative group">
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
          <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2.5 py-1.5 bg-card border border-border rounded-lg shadow-lg text-xs font-semibold opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">
            Mi Perfil
          </div>
        </div>
      </div>

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
