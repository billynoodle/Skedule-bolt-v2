import { Session } from '@supabase/supabase-js';
import { supabase } from '../../supabase/client';
import { AuthError } from '../types';
import { handleAuthError } from './errors';
import { log } from '../../../utils/logger';

export async function getSession() {
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      throw new AuthError(sessionError.message, sessionError.status);
    }

    return session;
  } catch (err) {
    handleAuthError(err, 'Get session');
    return null;
  }
}

export async function refreshSession() {
  try {
    const { data: { session }, error: refreshError } = await supabase.auth.refreshSession();

    if (refreshError) {
      throw new AuthError(refreshError.message, refreshError.status);
    }

    log('Auth', 'Session refreshed successfully');
    return session;
  } catch (err) {
    handleAuthError(err, 'Session refresh');
    return null;
  }
}

export function setupSessionRefresh(timeout: number) {
  let refreshTimer: number;
  let sessionCheckInterval: number;

  const clearTimers = () => {
    window.clearTimeout(refreshTimer);
    window.clearInterval(sessionCheckInterval);
  };

  const startTimers = (session: Session) => {
    clearTimers();

    // Refresh 1 minute before expiry
    const refreshTime = (session.expires_in * 1000) - 60000;
    refreshTimer = window.setTimeout(() => refreshSession(), refreshTime);

    // Check session every minute
    sessionCheckInterval = window.setInterval(async () => {
      const currentSession = await getSession();
      if (!currentSession) {
        clearTimers();
      }
    }, 60000);
  };

  return {
    startTimers,
    clearTimers
  };
}

export function onAuthStateChange(callback: (session: Session | null) => void) {
  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session);
    log('Auth', 'Auth state changed', { event: _event });
  });

  return {
    unsubscribe: () => subscription.unsubscribe()
  };
}