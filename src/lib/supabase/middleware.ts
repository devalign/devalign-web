import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Refreshes the user session dynamically using cookie headers.
 * Protects route boundaries by redirecting unauthenticated or authenticated users.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return supabaseResponse; // Skip if env vars aren't populated yet
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  // Refresh auth token session (critical check)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect old auth routes (/login and /register) to root (/)
  if (
    request.nextUrl.pathname === '/login' ||
    request.nextUrl.pathname === '/register'
  ) {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  const isDashboardRoute =
    request.nextUrl.pathname.startsWith('/dashboard') ||
    request.nextUrl.pathname.startsWith('/profile') ||
    request.nextUrl.pathname.startsWith('/analysis') ||
    request.nextUrl.pathname.startsWith('/roadmap');

  const isAuthRoute = request.nextUrl.pathname === '/';

  if (isDashboardRoute && !user) {
    // Redirect unauthenticated users to the home/login screen
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  const hasResetMode = request.nextUrl.searchParams.get('mode') === 'reset-password';

  if (isAuthRoute && user && !hasResetMode) {
    // Redirect logged-in users away from the home/login screen to profile (upload CV)
    const url = request.nextUrl.clone();
    url.pathname = '/profile';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
