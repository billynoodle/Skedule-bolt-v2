import { supabase } from '../supabase/client';
import { AuthError } from './types';
import { log, error as logError } from '../../utils/logger';

export async function signUp(email: string, password: string) {
  try {
    // Validate inputs
    if (!email || !password) {
      throw new AuthError('Email and password are required', 400);
    }

    if (password.length < 6) {
      throw new AuthError('Password must be at least 6 characters', 400);
    }

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password: password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: {
          email: email.trim()
        }
      }
    });

    if (signUpError) {
      throw new AuthError(signUpError.message, signUpError.status);
    }

    if (!data?.user) {
      throw new AuthError('Sign up failed - no user data received', 500);
    }

    log('AuthService', 'User signed up successfully', { email });
    return data;
  } catch (err) {
    const error = err instanceof AuthError ? err : new AuthError(
      err instanceof Error ? err.message : 'An unexpected authentication error occurred',
      500
    );
    logError('AuthService', 'Sign up failed', error);
    throw error;
  }
}