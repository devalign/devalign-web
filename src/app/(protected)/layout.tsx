'use client';

import React, { Suspense } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import AppSidebar from '@/components/layout/app-sidebar';
import { MobileBottomNav } from '@/components/layout/mobile-bottom-nav';
import { SidebarProvider } from '@/components/layout/sidebar-context';
import { GlobalHeader } from '@/components/layout/global-header';
import { CVAnalysisProvider } from '@/contexts/cv-analysis-context';
import { useUserCVs } from '@/hooks/use-user-cvs';
import { ErrorBoundary } from '@/components/shared/error-boundary';
import { ErrorFallback } from '@/components/shared/error-fallback';
import { cn } from '@/lib/utils';

function OnboardingGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: cvData, isLoading, isError, refetch } = useUserCVs();
  const isOnboarding = pathname === '/onboarding';
  const hasCV = !!(cvData?.cvs && cvData.cvs.length > 0);

  React.useEffect(() => {
    if (!isOnboarding && !isLoading && !isError && !hasCV) {
      router.replace('/onboarding');
    }
  }, [isOnboarding, isLoading, isError, hasCV, router]);

  if (isOnboarding) {
    return <>{children}</>;
  }

  if (isError) {
    return (
      <ErrorFallback
        error="No se puede verificar tu perfil. El servidor de análisis no está disponible."
        onRetry={() => refetch()}
        onHome={() => router.push('/')}
        fullPage
      />
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!hasCV) {
    return null;
  }

  return <>{children}</>;
}

function ProtectedLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showGlobalHeader = pathname === '/overview';
  const isOnboarding = pathname === '/onboarding';

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background font-sans antialiased">
      <div suppressHydrationWarning className="flex h-full w-full gap-0 lg:gap-3">
        {!isOnboarding && <AppSidebar />}

        <main
          suppressHydrationWarning
          className={cn(
            'flex-1 overflow-y-auto overflow-x-hidden bg-background flex flex-col relative',
            isOnboarding ? 'pb-0' : 'pb-16 lg:pb-6',
          )}
        >
          {showGlobalHeader && (
            <div className="z-30 w-full pointer-events-none pt-3 px-3 lg:pt-6 lg:px-6 absolute top-0 left-0 right-0">
              <div className="pointer-events-auto pb-4">
                <GlobalHeader />
              </div>
            </div>
          )}
          <div className="flex-1 min-h-0 w-full relative">{children}</div>
        </main>

        {!isOnboarding && <MobileBottomNav />}
      </div>
    </div>
  );
}

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <CVAnalysisProvider>
      <SidebarProvider>
        <Suspense fallback={null}>
          <ErrorBoundary>
            <OnboardingGate>
              <ProtectedLayoutContent>{children}</ProtectedLayoutContent>
            </OnboardingGate>
          </ErrorBoundary>
        </Suspense>
      </SidebarProvider>
    </CVAnalysisProvider>
  );
}
