'use client';

import { useState, useEffect } from 'react';
import AuthShell from '@/components/auth/auth-shell';
import LandingContent from '@/components/landing/landing-content';
import AuthDialog from '@/components/auth/auth-dialog';
import { LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HomeClient() {
  const [authOpen, setAuthOpen] = useState(false);

  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        setAuthOpen(false);

        // Radix UI DismissableLayer sets body.style.pointerEvents = "none"
        // when a dialog is open. On bfcache restore this persists, killing
        // every click on the page. Force-remove it immediately.
        document.body.style.pointerEvents = '';
        document.body.removeAttribute('data-scroll-locked');
        document.querySelectorAll('[aria-hidden="true"]').forEach((el) => {
          el.removeAttribute('aria-hidden');
        });
      }
    };
    window.addEventListener('pageshow', handlePageShow);
    return () => window.removeEventListener('pageshow', handlePageShow);
  }, []);

  return (
    <AuthShell
      headerActions={
        <div className="flex items-center gap-3">
          <button
            onClick={() => setAuthOpen(true)}
            className="text-sm font-semibold text-foreground hover:text-primary transition-colors"
          >
            Crear cuenta
          </button>
          <Button
            onClick={() => setAuthOpen(true)}
            size="sm"
            className="text-sm font-semibold shadow-none gap-1.5"
          >
            <LogIn className="w-4 h-4" />
            Iniciar sesión
          </Button>
        </div>
      }
    >
      <LandingContent onOpenAuth={() => setAuthOpen(true)} />
      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} />
    </AuthShell>
  );
}
