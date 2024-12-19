import { supabase } from '../supabase/client';
import { AuthError } from './types';
import { log, error as logError } from '../../utils/logger';

export async function resetPassword(email: string) {
  try {
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/update-password`
    });

    if (resetError) {
      throw new AuthError(resetError.message, resetError.status);
    }

    log('AuthService', 'Password reset email sent', { email });
  } catch (err) {
    const error = err instanceof AuthError ? err : new AuthError(
      err instanceof Error ? err.message : 'Failed to send reset email',
      500
    );
    logError('AuthService', 'Password reset failed', error);
    throw error;
  }
}

export async function updatePassword(newPassword: string) {
  try {
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (updateError) {
      throw new AuthError(updateError.message, updateError.status);
    }

    log('AuthService', 'Password updated successfully');
  } catch (err) {
    const error = err instanceof AuthError ? err : new AuthError(
      err instanceof Error ? err.message : 'Failed to update password',
      500
    );
    logError('AuthService', 'Password update failed', error);
    throw error;
  }
}