import { supabase } from '../supabase/client';
import { AuthError } from './types';
import { log, error as logError } from '../../utils/logger';

export async function getSession() {
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      throw new AuthError(sessionError.message, sessionError.status);
    }

    return session;
  } catch (err) {
    const error = err instanceof AuthError ? err : new AuthError(
      err instanceof Error ? err.message : 'Failed to get session',
      500
    );
    logError('AuthService', 'Get session failed', error);
    throw error;
  }
}

export async function refreshSession() {
  try {
    const { data: { session }, error: refreshError } = await supabase.auth.refreshSession();

    if (refreshError) {
      throw new AuthError(refreshError.message, refreshError.status);
    }

    return session;
  } catch (err) {
    const error = err instanceof AuthError ? err : new AuthError(
      err instanceof Error ? err.message : 'Failed to refresh session',
      500
    );
    logError('AuthService', 'Session refresh failed', error);
    throw error;
  }
}