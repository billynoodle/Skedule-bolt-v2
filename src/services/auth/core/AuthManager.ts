import { supabase } from '../../supabase/client';
import { AuthError } from '../types';
import { log } from '../../../utils/logger';

export class AuthManager {
  private static instance: AuthManager | null = null;

  private constructor() {}

  static getInstance(): AuthManager {
    if (!this.instance) {
      this.instance = new AuthManager();
    }
    return this.instance;
  }

  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        throw new AuthError(error.message, error.status);
      }

      if (!user) {
        throw new AuthError('No authenticated user', 401);
      }

      log('AuthManager', 'Got current user', { id: user.id });
      return user;
    } catch (err) {
      log('AuthManager', 'Failed to get current user', err);
      throw err;
    }
  }

  async requireAuth() {
    const user = await this.getCurrentUser();
    if (!user) {
      throw new AuthError('Authentication required', 401);
    }
    return user;
  }

  async checkSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        throw new AuthError(error.message, error.status);
      }

      return session;
    } catch (err) {
      log('AuthManager', 'Failed to check session', err);
      throw err;
    }
  }
}