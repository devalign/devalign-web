'use client';

import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';

export interface UserData {
  id: string;
  email?: string;
  full_name?: string;
  avatar_url?: string;
}

export function useCurrentUser() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  const query = useQuery<UserData | null, Error>({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) throw error;
      if (!user) return null;

      return {
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
        avatar_url: user.user_metadata?.avatar_url,
      };
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
    retry: 1,
  });

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const newUser: UserData = {
          id: session.user.id,
          email: session.user.email,
          full_name:
            session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
          avatar_url: session.user.user_metadata?.avatar_url,
        };
        queryClient.setQueryData(['currentUser'], newUser);
        queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      } else if (event === 'SIGNED_OUT') {
        queryClient.setQueryData(['currentUser'], null);
        queryClient.clear(); // Clear all cached queries on logout
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase.auth, queryClient]);

  return query;
}
