'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { getBrowserClient } from '../lib/supabaseClient';

type Role = 'parent' | 'tutor' | 'admin' | null;

interface AuthState {
  user: User | null;
  role: Role;
  loading: boolean;
}

const AuthContext = createContext<AuthState>({ user: null, role: null, loading: true });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({ user: null, role: null, loading: true });

  useEffect(() => {
    const supabase = getBrowserClient();

    async function loadUser(user: User | null) {
      if (!user) { setState({ user: null, role: null, loading: false }); return; }
      const { data } = await supabase.from('users').select('role').eq('id', user.id).maybeSingle();
      setState({ user, role: (data?.role as Role) ?? null, loading: false });
    }

    supabase.auth.getSession().then(({ data: { session } }: { data: { session: { user: User } | null } }) => loadUser(session?.user ?? null));

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_: unknown, session: { user: User } | null) => {
      loadUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
