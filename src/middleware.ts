import { type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

/**
 * Global Next.js middleware interceptor.
 * Delegates authentication checks and session refreshing to the Supabase helper.
 */
export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static CSS, JS, etc.)
     * - _next/image (Next.js image optimization)
     * - favicon.ico (system icons)
     * - Image formats/assets (svg, png, jpg, webp, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
