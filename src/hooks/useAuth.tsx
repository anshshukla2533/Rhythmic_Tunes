import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '@/lib/api';

interface AuthUser {
  id: string;
  email: string;
  display_name: string;
}

interface AuthCtxType {
  user: AuthUser | null;
  loading: boolean;
  signOut: () => void;
}

const AuthCtx = createContext<AuthCtxType>({ user: null, loading: true, signOut: () => {} });

export function AuthProvider({ children }: { children: any }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) { setLoading(false); return; }
    api.me()
      .then(({ user }) => setUser(user))
      .catch(() => { localStorage.removeItem('auth_token'); })
      .finally(() => setLoading(false));
  }, []);

  const signOut = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
  };

  return (
    <AuthCtx.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthCtx.Provider>
  );
}

// Called after successful login/signup to persist token and user
export function setAuthSession(token: string, user: AuthUser) {
  localStorage.setItem('auth_token', token);
}

export const useAuth = () => useContext(AuthCtx);
