import { supabase } from '../../supabase/client';
import { AuthError } from '../types';
import { validateEmail, validatePassword } from '../core/validation';
import { handleAuthError } from '../core/errors';
import { getCallbackUrl } from '../utils/redirects';
import { log } from '../../../utils/logger';

export async function signUp(email: string, password: string) {
  try {
    validateEmail(email);
    validatePassword(password);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        emailRedirectTo: getCallbackUrl(),
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
    handleAuthError(err, 'Sign up');
  }
}