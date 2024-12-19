import { supabase } from '../../supabase/client';
import { AuthError } from '../types';
import { validateEmail, validatePassword } from '../core/validation';
import { handleAuthError } from '../core/errors';
import { log } from '../../../utils/logger';

export async function signIn(email: string, password: string) {
  try {
    validateEmail(email);
    validatePassword(password);

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
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
    handleAuthError(err, 'Sign in');
  }
}