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
import { SettingsDialog } from './settings-dialog';
import { LogoutDialog } from './logout-dialog';
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
  { name: 'Diagnóstico', href: '/diagnosis', icon: Activity },
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

  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <aside
      suppressHydrationWarning
      className="hidden lg:flex relative h-full flex-col border border-border transition-all duration-300 ease-in-out z-30 shrink-0 w-16"
    >
      <div className="flex h-14 items-center justify-center px-4 border-b border-border">
        <Hexagon className="h-6 w-6 text-primary fill-primary/20" />
      </div>

      <nav className="flex-1 flex flex-col justify-between px-3 py-4">
        <div className="space-y-1.5">
          {navItems
            .filter((item) => item.name !== 'Mercado')
            .map((item) => {
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
          {navItems
            .filter((item) => item.name === 'Mercado')
            .map((item) => {
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

      <SettingsDialog
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
        onLogoutClick={() => setIsLogoutConfirmOpen(true)}
      />

      <LogoutDialog
        open={isLogoutConfirmOpen}
        onOpenChange={setIsLogoutConfirmOpen}
        onConfirm={handleLogout}
      />
    </aside>
  );
}
