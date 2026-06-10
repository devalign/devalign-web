import { createClient } from '@/lib/supabase/client';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1';

export async function apiClient<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const token = session?.access_token;

  const headers = new Headers(options.headers);
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  // Do not set Content-Type if we are uploading a file (FormData)
  // because the browser needs to set the boundary parameter automatically
  if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
    cache: 'no-store',
  });

  if (!response.ok) {
    let errorMessage = `Error del servidor (${response.status})`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.detail || errorData.message || errorMessage;
    } catch {
      // Fallback a texto si no es JSON
      try {
        const textError = await response.text();
        if (textError) errorMessage = textError;
      } catch {
        // ignore
      }
    }
    throw new Error(errorMessage);
  }

  // Si la respuesta no tiene contenido (p.ej. 204 No Content), devolvemos vacio
  if (response.status === 204) {
    return {} as T;
  }

  return response.json() as Promise<T>;
}
