'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Hexagon, 
  UploadCloud, 
  Activity, 
  Map, 
  Settings, 
  Lock, 
  ShieldCheck, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  FileText
} from 'lucide-react';
import { useSidebar } from './sidebar-context';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useUserCVs } from '@/hooks/use-user-cvs';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isCollapsed, setIsCollapsed } = useSidebar();
  const { data: user, isLoading: isUserLoading } = useCurrentUser();
  const { data: cvData } = useUserCVs();
  
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  const navItems = [
    { name: 'Subir CV', href: '/profile', icon: UploadCloud, disabled: false },
    { name: 'Diagnóstico', href: '/analysis', icon: Activity, disabled: true },
    { name: 'Roadmap', href: '/roadmap', icon: Map, disabled: true },
    { name: 'Ajustes', href: '/settings', icon: Settings, disabled: true },
  ];

  const currentCV = cvData?.cvs?.[0];

  return (
    <aside
      className={cn(
        "relative flex h-screen flex-col border-r border-border bg-card transition-all duration-300 ease-in-out z-30",
        isCollapsed ? "w-16" : "w-64"
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
        {isCollapsed && (
          <Hexagon className="mx-auto h-6 w-6 text-primary fill-primary/20" />
        )}

        {/* Toggle Collapse Button */}
        {!isCollapsed && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(true)}
            className="h-7 w-7 rounded-md hover:bg-muted text-muted-foreground hidden md:flex"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* User Information */}
      {!isCollapsed && (
        <div className="px-4 py-4 border-b border-border bg-secondary/30">
          {isUserLoading ? (
            <div className="flex items-center gap-2 animate-pulse">
              <div className="h-8 w-8 rounded-full bg-muted" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 w-20 rounded bg-muted" />
                <div className="h-2.5 w-28 rounded bg-muted" />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2.5 overflow-hidden">
              {user?.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.avatar_url}
                  alt={user.full_name || 'User'}
                  className="h-8 w-8 rounded-full object-cover ring-1 ring-border"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-primary-foreground font-semibold text-xs uppercase">
                  {user?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                </div>
              )}
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-foreground truncate">
                  {user?.full_name || 'Desarrollador'}
                </span>
                <span className="text-[10px] text-muted-foreground font-mono truncate">
                  {user?.email}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

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
                  "flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground/60 cursor-not-allowed select-none group",
                  isCollapsed ? "justify-center" : ""
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
                "flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium transition-all duration-200",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm font-semibold"
                  : "text-foreground hover:bg-secondary/60 hover:text-foreground"
              )}
            >
              <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-primary-foreground" : "text-muted-foreground")} />
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
            <div className="rounded-xl border border-border bg-card p-3 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="flex items-start gap-2.5">
                <div className="rounded-lg bg-red-50 p-1.5 text-red-500 shrink-0 dark:bg-red-950/30">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1 space-y-0.5">
                  <p className="text-xs font-medium text-foreground truncate" title={currentCV.original_filename}>
                    {currentCV.original_filename}
                  </p>
                  <p className="text-[10px] text-muted-foreground font-mono">
                    {(currentCV.size_bytes / 1024 / 1024).toFixed(1)} MB • PDF
                  </p>
                </div>
              </div>
              
              <Link href="/profile" className="mt-3 block">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full text-[10px] h-7 border-primary/30 text-primary-foreground hover:bg-primary/10 hover:text-primary-foreground"
                >
                  Actualizar CV
                </Button>
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Sidebar Footer */}
      <div className="p-3 border-t border-border bg-card space-y-2">
        {/* Security Info */}
        {!isCollapsed && (
          <div className="rounded-lg bg-emerald-50/50 p-2.5 text-[10px] text-emerald-800 dark:bg-emerald-950/10 dark:text-emerald-400 flex items-start gap-2">
            <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-500" />
            <p className="leading-tight">
              Tus datos están seguros. No compartimos tu información.
            </p>
          </div>
        )}

        {/* Expand Toggle for Collapsed View */}
        {isCollapsed && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(false)}
            className="mx-auto h-8 w-8 rounded-md hover:bg-muted text-muted-foreground hidden md:flex"
            title="Expandir sidebar"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}

        {/* Logout Button */}
        <Button
          variant="ghost"
          size={isCollapsed ? "icon" : "sm"}
          onClick={handleLogout}
          className={cn(
            "w-full gap-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors duration-200",
            isCollapsed ? "justify-center h-8" : "justify-start text-xs"
          )}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!isCollapsed && <span>Cerrar sesión</span>}
        </Button>
      </div>
    </aside>
  );
}
