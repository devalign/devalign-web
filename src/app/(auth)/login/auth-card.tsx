'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { createClient } from '@/lib/supabase/client';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

type AuthMode = 'login' | 'signup' | 'forgot-password' | 'reset-password';

const passwordRequirements = [
  { label: 'Mínimo 8 caracteres', test: (pw: string) => pw.length >= 8 },
  { label: 'Una letra mayúscula', test: (pw: string) => /[A-Z]/.test(pw) },
  { label: 'Una letra minúscula', test: (pw: string) => /[a-z]/.test(pw) },
  { label: 'Un número o carácter especial', test: (pw: string) => /[\d\W]/.test(pw) },
];

const translateError = (message: string): string => {
  const lowercaseMessage = message.toLowerCase();

  if (lowercaseMessage.includes('invalid login credentials') || lowercaseMessage.includes('invalid credentials')) {
    return 'El correo o la contraseña son incorrectos.';
  }
  if (lowercaseMessage.includes('user already registered') || lowercaseMessage.includes('email already in use')) {
    return 'Este correo electrónico ya está registrado.';
  }
  if (lowercaseMessage.includes('email not confirmed') || lowercaseMessage.includes('email_not_confirmed')) {
    return 'Debes confirmar tu correo electrónico antes de iniciar sesión.';
  }
  if (lowercaseMessage.includes('signup requires a valid email') || lowercaseMessage.includes('invalid email')) {
    return 'Por favor ingresa un correo electrónico válido.';
  }
  if (lowercaseMessage.includes('password is too short') || lowercaseMessage.includes('should be at least')) {
    return 'La contraseña es demasiado corta.';
  }
  if (lowercaseMessage.includes('network error') || lowercaseMessage.includes('failed to fetch')) {
    return 'Error de conexión. Por favor verifica tu acceso a internet.';
  }

  return message;
};

export default function AuthCard() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('mode') === 'reset-password') {
        setMode('reset-password');
      }
    }
  }, []);

  const handleModeChange = (newMode: AuthMode) => {
    setMode(newMode);
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const isLogin = mode === 'login';
  const isSignup = mode === 'signup';
  const isForgotPassword = mode === 'forgot-password';
  const isResetPassword = mode === 'reset-password';

  const checkRequirement = (testFn: (pw: string) => boolean) => {
    if (!password) return false;
    return testFn(password);
  };

  const isPasswordSecure = (pw: string) => {
    return passwordRequirements.every((req) => req.test(pw));
  };

  const handleOAuthLogin = async () => {
    setIsLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        window.location.href = '/dashboard';
      } else if (isSignup) {
        if (password !== confirmPassword) {
          toast.error('Las contraseñas no coinciden.');
          setIsLoading(false);
          return;
        }

        if (!isPasswordSecure(password)) {
          toast.error('La contraseña no cumple con los requisitos de seguridad.');
          setIsLoading(false);
          return;
        }

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
        toast.success('Revisa tu correo electrónico para confirmar tu cuenta.');
        handleModeChange('login');
      } else if (isForgotPassword) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/api/auth/callback?next=/?mode=reset-password`,
        });
        if (error) throw error;
        toast.success('Se ha enviado un enlace de recuperación a tu correo electrónico.');
        handleModeChange('login');
      } else if (isResetPassword) {
        if (password !== confirmPassword) {
          toast.error('Las contraseñas no coinciden.');
          setIsLoading(false);
          return;
        }

        if (!isPasswordSecure(password)) {
          toast.error('La contraseña no cumple con los requisitos de seguridad.');
          setIsLoading(false);
          return;
        }

        const { error } = await supabase.auth.updateUser({
          password: password,
        });
        if (error) throw error;
        toast.success('Tu contraseña ha sido restablecida con éxito.');
        window.location.href = '/dashboard';
      }
    } catch (err) {
      const rawMessage = err instanceof Error ? err.message : 'Ocurrió un error';
      toast.error(translateError(rawMessage));
    } finally {
      setIsLoading(false);
    }
  };

  // Card headers based on current mode
  const getHeaderInfo = () => {
    switch (mode) {
      case 'login':
        return {
          title: 'Iniciar sesión',
          description: 'Comienza tu transformación profesional',
        };
      case 'signup':
        return {
          title: 'Crear una cuenta',
          description: 'Comienza tu transformación profesional',
        };
      case 'forgot-password':
        return {
          title: 'Recuperar contraseña',
          description: 'Introduce tu email para recibir un enlace de recuperación',
        };
      case 'reset-password':
        return {
          title: 'Nueva contraseña',
          description: 'Crea una contraseña segura para tu cuenta',
        };
    }
  };

  const headerInfo = getHeaderInfo();

  return (
    <Card className="w-full shadow-2xl shadow-black/5 border-border/50 bg-card/95 backdrop-blur-xl">
      <CardHeader className="text-center space-y-2 pb-6">
        <CardTitle className="text-xl font-bold tracking-tight">
          {headerInfo.title}
        </CardTitle>
        <CardDescription className="text-muted-foreground font-medium">
          {headerInfo.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Google OAuth Button - Only for Login/Signup */}
        {(isLogin || isSignup) && (
          <>
            <Button
              variant="outline"
              className="w-full h-12 font-medium border-border text-foreground bg-card hover:bg-secondary relative"
              onClick={handleOAuthLogin}
              disabled={isLoading}
            >
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
          </>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full name input for Signup only */}
          {isSignup && (
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

          {/* Email input for all modes except Reset Password */}
          {!isResetPassword && (
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
          )}

          {/* Password input for Login, Signup, Reset Password */}
          {!isForgotPassword && (
            <div className="space-y-2">
              <Label htmlFor="password" className="sr-only">
                Contraseña
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder={isResetPassword ? 'Nueva contraseña' : 'Contraseña'}
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

              {/* Forgot password link - Login only */}
              {isLogin && (
                <div className="flex justify-end px-1 pt-1">
                  <button
                    type="button"
                    onClick={() => handleModeChange('forgot-password')}
                    className="text-xs text-muted-foreground hover:text-foreground font-semibold transition-colors"
                    disabled={isLoading}
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Repeat password input for Signup and Reset Password */}
          {(isSignup || isResetPassword) && (
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

          {/* Password security checklist - Signup and Reset Password only */}
          {(isSignup || isResetPassword) && password && (
            <div className="space-y-1.5 p-3 rounded-lg bg-secondary/20 border border-border/40 text-xs">
              <p className="font-semibold text-muted-foreground mb-1">La contraseña debe tener:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
                {passwordRequirements.map((req, i) => {
                  const met = checkRequirement(req.test);
                  return (
                    <div key={i} className="flex items-center gap-1.5 text-muted-foreground">
                      <span
                        className={`h-1.5 w-1.5 rounded-full transition-colors ${
                          met ? 'bg-emerald-500' : 'bg-muted-foreground/40'
                        }`}
                      />
                      <span
                        className={
                          met
                            ? 'text-emerald-600 dark:text-emerald-400 font-medium'
                            : 'text-muted-foreground'
                        }
                      >
                        {req.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <Button
            type="submit"
            className="w-full h-12 text-sm font-semibold shadow-none transition-colors"
            disabled={isLoading}
          >
            {isLoading
              ? 'Cargando...'
              : isLogin
              ? 'Iniciar sesión'
              : isSignup
              ? 'Crear cuenta'
              : isForgotPassword
              ? 'Enviar enlace'
              : 'Restablecer contraseña'}
          </Button>
        </form>

        {/* Toggle Mode */}
        <div className="pt-2 text-center text-sm text-muted-foreground">
          {isLogin && (
            <>
              ¿Aún no tienes una cuenta?
              <button
                type="button"
                onClick={() => handleModeChange('signup')}
                className="ml-1 text-foreground font-semibold hover:underline"
                disabled={isLoading}
              >
                Regístrate
              </button>
            </>
          )}
          {isSignup && (
            <>
              ¿Ya tienes una cuenta?
              <button
                type="button"
                onClick={() => handleModeChange('login')}
                className="ml-1 text-foreground font-semibold hover:underline"
                disabled={isLoading}
              >
                Inicia sesión
              </button>
            </>
          )}
          {isForgotPassword && (
            <button
              type="button"
              onClick={() => handleModeChange('login')}
              className="text-foreground font-semibold hover:underline"
              disabled={isLoading}
            >
              Volver a Iniciar sesión
            </button>
          )}
          {isResetPassword && (
            <button
              type="button"
              onClick={() => {
                // Clear reset-password mode from query param and go to login
                window.history.replaceState({}, '', window.location.pathname);
                handleModeChange('login');
              }}
              className="text-foreground font-semibold hover:underline"
              disabled={isLoading}
            >
              Cancelar y volver al inicio
            </button>
          )}
        </div>

        {/* Terms and Privacy */}
        <p className="text-center text-[10px] text-muted-foreground/70 font-medium px-4 leading-relaxed">
          AL CONTINUAR, ACEPTAS NUESTROS{' '}
          <button
            type="button"
            onClick={() => setShowTerms(true)}
            className="underline hover:text-foreground font-semibold cursor-pointer focus:outline-none transition-colors"
          >
            TÉRMINOS DE SERVICIO
          </button>{' '}
          Y LA{' '}
          <button
            type="button"
            onClick={() => setShowPrivacy(true)}
            className="underline hover:text-foreground font-semibold cursor-pointer focus:outline-none transition-colors"
          >
            POLÍTICA DE PRIVACIDAD
          </button>
          .
        </p>
      </CardContent>

      {/* Modales de Términos y Privacidad */}
      <Dialog open={showTerms} onOpenChange={setShowTerms}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Términos de Servicio</DialogTitle>
            <DialogDescription>Última actualización: Mayo 2026</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 text-xs text-muted-foreground leading-relaxed">
            <p>
              Bienvenido a <strong>Devalign</strong>. Al utilizar nuestra plataforma, aceptas cumplir con los siguientes términos y condiciones que rigen el uso del software de alineación técnica y generación de roadmaps profesionales.
            </p>
            <h4 className="font-bold text-foreground">1. Uso del Servicio</h4>
            <p>
              Devalign es una herramienta de diagnóstico basada en Inteligencia Artificial. Está diseñada para analizar perfiles técnicos, identificar brechas de habilidades y recomendar rutas de aprendizaje personalizadas de acuerdo a las demandas del mercado TI.
            </p>
            <h4 className="font-bold text-foreground">2. Carga de Documentos (CV)</h4>
            <p>
              Al subir tu CV (hoja de vida) en formato PDF o DOCX, garantizas que la información es verídica y que tienes el derecho legal de compartirla. Autorizas a Devalign a procesar y analizar el contenido para generar las métricas de afinidad técnica correspondientes.
            </p>
            <h4 className="font-bold text-foreground">3. Limitación de Responsabilidad</h4>
            <p>
              Las recomendaciones y sugerencias de aprendizaje generadas por la IA son de carácter informativo y de orientación profesional. Devalign no garantiza contratación laboral ni se hace responsable por decisiones profesionales tomadas en base a los diagnósticos.
            </p>
            <h4 className="font-bold text-foreground">4. Propiedad Intelectual</h4>
            <p>
              El código, el diseño, la marca y los algoritmos propietarios de Devalign son propiedad intelectual exclusiva de la empresa y no pueden ser reproducidos ni distribuidos sin consentimiento expreso por escrito.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showPrivacy} onOpenChange={setShowPrivacy}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Política de Privacidad</DialogTitle>
            <DialogDescription>Última actualización: Mayo 2026</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 text-xs text-muted-foreground leading-relaxed">
            <p>
              En <strong>Devalign</strong>, nos tomamos muy en serio la seguridad y confidencialidad de tus datos personales. Esta política detalla cómo recopilamos, usamos y protegemos tu información.
            </p>
            <h4 className="font-bold text-foreground">1. Información Recopilada</h4>
            <p>
              Recopilamos información necesaria para el funcionamiento del servicio, incluyendo: tu nombre completo, correo electrónico, credenciales de inicio de sesión y la información contenida en el documento de CV que decidas cargar de forma voluntaria.
            </p>
            <h4 className="font-bold text-foreground">2. Uso de la Información</h4>
            <p>
              Utilizamos tus datos únicamente para:
            </p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Autenticar tu cuenta y proteger el acceso al sistema.</li>
              <li>Analizar tu CV mediante modelos de procesamiento de lenguaje natural (NLP) e IA para calcular tu brecha de habilidades.</li>
              <li>Generar y personalizar tu roadmap de aprendizaje técnico.</li>
            </ul>
            <h4 className="font-bold text-foreground">3. Proveedores de Servicios</h4>
            <p>
              Tus datos son almacenados de forma segura utilizando la infraestructura de <strong>Supabase</strong>. Los análisis de perfil técnico se ejecutan a través de APIs cifradas de proveedores de IA líderes del mercado, garantizando que tu información no se utilice para entrenar modelos públicos.
            </p>
            <h4 className="font-bold text-foreground">4. Control sobre tus Datos</h4>
            <p>
              Puedes solicitar la eliminación permanente de tu cuenta, tu perfil y cualquier CV subido a la plataforma en cualquier momento desde tu panel de usuario o comunicándote con nuestro soporte de forma directa.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
