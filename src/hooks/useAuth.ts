import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import * as authService from '../services/auth';
import { AuthError } from '../services/auth/types';
import { log } from '../utils/logger';

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AuthError | null>(null);
  const navigate = useNavigate();

  const handleSignIn = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      await authService.signIn(email, password);
      log('Auth', 'Sign in successful, redirecting to dashboard');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err instanceof AuthError ? err : new AuthError(
        err instanceof Error ? err.message : 'Authentication failed',
        500
      ));
      throw err;
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const handleSignUp = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      await authService.signUp(email, password);
      log('Auth', 'Sign up successful, redirecting to email verification');
      navigate('/auth/verify-email', { 
        state: { email }
      });
    } catch (err) {
      setError(err instanceof AuthError ? err : new AuthError(
        err instanceof Error ? err.message : 'Authentication failed',
        500
      ));
      throw err;
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const handleSignOut = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      await authService.signOut();
      log('Auth', 'Sign out successful, redirecting to home');
      navigate('/', { replace: true });
    } catch (err) {
      setError(err instanceof AuthError ? err : new AuthError(
        err instanceof Error ? err.message : 'Sign out failed',
        500
      ));
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const handleResetPassword = useCallback(async (email: string) => {
    try {
      setLoading(true);
      setError(null);
      await authService.resetPassword(email);
      log('Auth', 'Password reset email sent');
      navigate('/auth/check-email', { 
        state: { email }
      });
    } catch (err) {
      setError(err instanceof AuthError ? err : new AuthError(
        err instanceof Error ? err.message : 'Password reset failed',
        500
      ));
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const handleUpdatePassword = useCallback(async (newPassword: string) => {
    try {
      setLoading(true);
      setError(null);
      await authService.updatePassword(newPassword);
      log('Auth', 'Password updated successfully');
      navigate('/auth', { replace: true });
    } catch (err) {
      setError(err instanceof AuthError ? err : new AuthError(
        err instanceof Error ? err.message : 'Password update failed',
        500
      ));
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  return {
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
    resetPassword: handleResetPassword,
    updatePassword: handleUpdatePassword,
    loading,
    error
  };
}