import { supabase } from '../../supabase/client';
import { AuthError } from '../types';
import { handleAuthError } from '../core/errors';
import { log } from '../../../utils/logger';

export async function deleteAccount() {
  try {
    // First, call the RPC function to delete user data
    const { error: rpcError } = await supabase.rpc('delete_user');
    
    if (rpcError) {
      throw new AuthError(
        'Failed to delete user data: ' + rpcError.message,
        rpcError.code === 'PGRST116' ? 403 : 500
      );
    }

    // Then sign out to complete the process
    const { error: signOutError } = await supabase.auth.signOut();
    
    if (signOutError) {
      throw new AuthError(signOutError.message, signOutError.status);
    }

    log('AuthService', 'Account deleted successfully');
  } catch (err) {
    handleAuthError(err, 'Delete account');
  }
}