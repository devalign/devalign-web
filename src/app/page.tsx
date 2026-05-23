import type { Metadata } from 'next';
import AuthCard from '@/app/(auth)/login/auth-card';
import AuthShell from '@/components/auth/auth-shell';

export const metadata: Metadata = {
  title: 'Devalign | Acceso',
  description: 'Inicia sesión o crea una cuenta para entrar al MVP académico de Devalign.',
};

export default function Home() {
  return (
    <AuthShell>
      <AuthCard />
    </AuthShell>
  );
}
