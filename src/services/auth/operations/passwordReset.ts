import { supabase } from '../../supabase/client';
import { AuthError } from '../types';
import { validateEmail, validatePassword } from '../core/validation';
import { handleAuthError } from '../core/errors';
import { getPasswordResetUrl } from '../utils/redirects';
import { log } from '../../../utils/logger';

export async function resetPassword(email: string) {
  try {
    validateEmail(email);

    const redirectTo = getPasswordResetUrl();

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email.trim(),
      { 
        redirectTo,
        // Don't set captchaToken to avoid CORS issues
        emailRedirectTo: redirectTo // Add explicit emailRedirectTo
      }
    );

    if (resetError) {
      throw new AuthError(resetError.message, resetError.status);
    }

    log('AuthService', 'Password reset email sent', { 
      email,
      redirectTo
    });
  } catch (err) {
    handleAuthError(err, 'Password reset');
  }
}

export async function updatePassword(newPassword: string) {
  try {
    validatePassword(newPassword);

    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (updateError) {
      throw new AuthError(updateError.message, updateError.status);
    }

    log('AuthService', 'Password updated successfully');
  } catch (err) {
    handleAuthError(err, 'Password update');
  }
}