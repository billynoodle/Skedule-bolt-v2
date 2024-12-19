import React, { createContext, useContext, useEffect } from 'react';
import { AuthContextType } from '../services/auth/types';
import { useAuthState } from '../hooks/auth/useAuthState';
import { onAuthStateChange, setupSessionRefresh } from '../services/auth/core/session';
import { AUTH_CONFIG } from '../services/auth/config';
import { useAutoLogout } from '../hooks/auth/useAutoLogout';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { session, loading, setSession, setLoading } = useAuthState();
  const { startTimers, clearTimers } = setupSessionRefresh(AUTH_CONFIG.sessionTimeout);

  useEffect(() => {
    const { unsubscribe } = onAuthStateChange((newSession) => {
      setSession(newSession);
      setLoading(false);
      
      if (newSession) {
        startTimers(newSession);
      } else {
        clearTimers();
      }
    });

    return () => {
      unsubscribe();
      clearTimers();
    };
  }, []);

  // Initialize auto-logout
  useAutoLogout();

  const value: AuthContextType = {
    session,
    user: session?.user ?? null,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}