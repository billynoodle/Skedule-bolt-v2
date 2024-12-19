import { supabase } from '../supabase/client';
import { AuthError } from './types';
import { log, error as logError } from '../../utils/logger';

export async function signIn(email: string, password: string) {
  try {
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (signInError) {
      throw new AuthError(
        signInError.message === 'Invalid login credentials'
          ? 'Invalid email or password. Please try again.'
          : signInError.message,
        signInError.status
      );
    }

    if (!data?.user) {
      throw new AuthError('Sign in failed - no user data received', 500);
    }

    log('AuthService', 'User signed in successfully', { email });
    return data;
  } catch (err) {
    const error = err instanceof AuthError ? err : new AuthError(
      err instanceof Error ? err.message : 'An unexpected authentication error occurred',
      500
    );
    logError('AuthService', 'Sign in failed', error);
    throw error;
  }
}