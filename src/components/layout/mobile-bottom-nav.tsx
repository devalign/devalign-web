'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Network, TrendingUp, Activity, Settings, User } from 'lucide-react';
import { useUserProfile } from '@/hooks/use-user-profile';
import { useCurrentUser } from '@/hooks/use-current-user';
import { createClient } from '@/lib/supabase/client';
import { SettingsDialog } from './settings-dialog';
import { LogoutDialog } from './logout-dialog';
import { cn } from '@/lib/utils';

export function MobileBottomNav() {
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

  const getLinkHref = (href: string) => {
    return cluster ? `${href}?cluster=${encodeURIComponent(cluster)}` : href;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 h-12 border-t border-border/80 bg-background/80 backdrop-blur-xl flex lg:hidden justify-around items-center px-2 pb-safe shadow-lg">
      {/* Overview */}
      <Link
        href={getLinkHref('/overview')}
        className="flex flex-col items-center justify-center flex-1 h-full py-2 select-none"
      >
        <Network
          className={cn(
            'h-[18px] w-[18px] transition-all duration-200',
            pathname === '/overview' ? 'text-primary scale-110' : 'text-muted-foreground/70',
          )}
          strokeWidth={1.75}
        />
      </Link>

      {/* Diagnóstico */}
      <Link
        href={getLinkHref('/diagnosis')}
        className="flex flex-col items-center justify-center flex-1 h-full py-2 select-none"
      >
        <Activity
          className={cn(
            'h-[18px] w-[18px] transition-all duration-200',
            pathname === '/diagnosis' ? 'text-primary scale-110' : 'text-muted-foreground/70',
          )}
          strokeWidth={1.75}
        />
      </Link>

      {/* Mercado */}
      <Link
        href={getLinkHref('/market')}
        className="flex flex-col items-center justify-center flex-1 h-full py-2 select-none"
      >
        <TrendingUp
          className={cn(
            'h-[18px] w-[18px] transition-all duration-200',
            pathname === '/market' ? 'text-primary scale-110' : 'text-muted-foreground/70',
          )}
          strokeWidth={1.75}
        />
      </Link>

      {/* Ajustes */}
      <button
        onClick={() => setIsSettingsOpen(true)}
        className="flex flex-col items-center justify-center flex-1 h-full py-2 select-none cursor-pointer"
      >
        <Settings
          className={cn(
            'h-[18px] w-[18px] transition-all duration-200',
            isSettingsOpen ? 'text-primary scale-110' : 'text-muted-foreground/70',
          )}
          strokeWidth={1.75}
        />
      </button>

      {/* Perfil */}
      <Link
        href="/profile"
        className="flex flex-col items-center justify-center flex-1 h-full py-2 select-none"
      >
        {isUserLoading ? (
          <div className="h-[18px] w-[18px] rounded-full bg-muted animate-pulse" />
        ) : user?.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.avatar_url}
            alt="User"
            className={cn(
              'h-[18px] w-[18px] rounded-full object-cover border transition-all duration-200',
              pathname === '/profile' ? 'border-primary scale-110' : 'border-transparent',
            )}
          />
        ) : (
          <User
            className={cn(
              'h-[18px] w-[18px] transition-all duration-200',
              pathname === '/profile' ? 'text-primary scale-110' : 'text-muted-foreground/70',
            )}
            strokeWidth={1.75}
          />
        )}
      </Link>

      {/* Dialogs */}
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
    </div>
  );
}
export default MobileBottomNav;
