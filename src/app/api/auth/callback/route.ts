import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * Next.js API Route Handler that exchanges a Supabase Auth code for a persistent session.
 * Triggered automatically by email verification links and Google OAuth redirects.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  // Redirect to dashboard by default if no next query param is present
  const next = searchParams.get('next') ?? '/dashboard';

  if (code) {
    const supabase = await createClient();

    // Exchange the temporal single-use code for a full user session cookies
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }

    console.error('Auth callback session exchange error:', error.message);
  }

  // Fallback if the code exchange fails or is missing
  return NextResponse.redirect(`${origin}/login?error=No se pudo autenticar al usuario`);
}
