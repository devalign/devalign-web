'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { createClient } from '@/lib/supabase/client';
import { Eye, EyeOff } from 'lucide-react';

type AuthMode = 'login' | 'signup';

export default function AuthCard() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const supabase = createClient();

  const isLogin = mode === 'login';

  const handleOAuthLogin = async () => {
    setIsLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });
    // the page will redirect, so we don't necessarily need to reset isLoading
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!isLogin && password !== confirmPassword) {
      alert('Las contraseñas no coinciden.');
      setIsLoading(false);
      return;
    }

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        // On success, middleware or router will handle redirect to /dashboard
        window.location.href = '/dashboard';
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
            emailRedirectTo: `${window.location.origin}/api/auth/callback`,
          },
        });
        if (error) throw error;
        alert('Revisa tu correo electrónico para confirmar tu cuenta.');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ocurrió un error';
      alert(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full shadow-2xl shadow-black/5 border-border/50 bg-card/95 backdrop-blur-xl">
      <CardHeader className="text-center space-y-2 pb-6">
        <CardTitle className="text-xl font-bold tracking-tight">
          {isLogin ? 'Iniciar sesión' : 'Crear una cuenta'}
        </CardTitle>
        <CardDescription className="text-muted-foreground font-medium">
          Comienza tu transformación profesional
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Google OAuth Button */}
        <Button
          variant="outline"
          className="w-full h-12 font-medium border-border text-foreground bg-card hover:bg-secondary relative"
          onClick={handleOAuthLogin}
          disabled={isLoading}
        >
          {/* Custom Google G-Logo SVG */}
          <svg className="w-5 h-5 absolute left-4" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
            <path d="M1 1h22v22H1z" fill="none" />
          </svg>
          Continuar con Google
        </Button>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-3 text-muted-foreground/80 font-semibold tracking-wider">
              o ingresa con tu correo
            </span>
          </div>
        </div>

        {/* Email & Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="fullName" className="sr-only">
                Nombre completo
              </Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Nombre completo"
                className="h-12 bg-secondary/30"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email" className="sr-only">
              Correo electrónico
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Correo electrónico"
              className="h-12 bg-secondary/30"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="sr-only">
              Contraseña
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Contraseña"
                className="h-12 bg-secondary/30 pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none transition-colors"
                disabled={isLoading}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="sr-only">
                Repetir contraseña
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Repetir contraseña"
                  className="h-12 bg-secondary/30 pr-10"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none transition-colors"
                  disabled={isLoading}
                  aria-label={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          )}

          <Button
            type="submit"
            className="w-full h-12 text-sm font-semibold shadow-none transition-colors"
            disabled={isLoading}
          >
            {isLoading ? 'Cargando...' : isLogin ? 'Iniciar sesión' : 'Crear cuenta'}
          </Button>
        </form>

        {/* Toggle Mode */}
        <div className="pt-2 text-center text-sm text-muted-foreground">
          {isLogin ? '¿Aún no tienes una cuenta?' : '¿Ya tienes una cuenta?'}
          <button
            type="button"
            onClick={() => {
              setMode(isLogin ? 'signup' : 'login');
              setShowPassword(false);
              setShowConfirmPassword(false);
            }}
            className="ml-1 text-foreground font-semibold hover:underline"
            disabled={isLoading}
          >
            {isLogin ? 'Regístrate' : 'Inicia sesión'}
          </button>
        </div>

        {/* Terms and Privacy */}
        <p className="text-center text-[10px] text-muted-foreground/70 font-medium px-4 leading-relaxed">
          AL CONTINUAR, ACEPTAS NUESTROS{' '}
          <a href="#" className="underline hover:text-foreground">
            TÉRMINOS DE SERVICIO
          </a>{' '}
          Y LA{' '}
          <a href="#" className="underline hover:text-foreground">
            POLÍTICA DE PRIVACIDAD
          </a>
          .
        </p>
      </CardContent>
    </Card>
  );
}
