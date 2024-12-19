import { supabase } from '../supabase/client';
import { AuthError } from './types';
import { log, error as logError } from '../../utils/logger';

export async function signOut() {
  try {
    const { error: signOutError } = await supabase.auth.signOut();
    
    if (signOutError) {
      throw new AuthError(signOutError.message, signOutError.status);
    }

    log('AuthService', 'User signed out successfully');
  } catch (err) {
    const error = err instanceof AuthError ? err : new AuthError(
      err instanceof Error ? err.message : 'Failed to sign out',
      500
    );
    logError('AuthService', 'Sign out failed', error);
    throw error;
  }
}