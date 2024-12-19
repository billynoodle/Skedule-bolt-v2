import { supabase } from '../../supabase/client';
import { AuthError } from '../types';
import { handleAuthError } from '../core/errors';
import { log } from '../../../utils/logger';

export async function signOut() {
  try {
    const { error: signOutError } = await supabase.auth.signOut();
    
    if (signOutError) {
      throw new AuthError(signOutError.message, signOutError.status);
    }

    log('AuthService', 'User signed out successfully');
  } catch (err) {
    handleAuthError(err, 'Sign out');
  }
}