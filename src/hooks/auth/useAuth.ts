import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import * as authService from '../../services/auth/operations';
import { AuthError } from '../../services/auth/types';
import { useAuthRedirect } from './useAuthRedirect';
import { useAuthState } from './useAuthState';
import { log } from '../../utils/logger';

export function useAuth() {
  const navigate = useNavigate();
  const redirect = useAuthRedirect();
  const { loading, error, startLoading, stopLoading, setAuthError } = useAuthState();

  const handleSignIn = useCallback(async (email: string, password: string) => {
    try {
      startLoading();
      await authService.signIn(email, password);
      log('Auth', 'Sign in successful');
      redirect.redirectAfterSignIn();
    } catch (err) {
      setAuthError(err);
      throw err;
    } finally {
      stopLoading();
    }
  }, [navigate]);

  const handleSignUp = useCallback(async (email: string, password: string) => {
    try {
      startLoading();
      await authService.signUp(email, password);
      log('Auth', 'Sign up successful');
      redirect.redirectAfterSignUp();
    } catch (err) {
      setAuthError(err);
      throw err;
    } finally {
      stopLoading();
    }
  }, [navigate]);

  const handleSignOut = useCallback(async () => {
    try {
      startLoading();
      await authService.signOut();
      log('Auth', 'Sign out successful');
      redirect.redirectAfterSignOut();
    } catch (err) {
      setAuthError(err);
      throw err;
    } finally {
      stopLoading();
    }
  }, [navigate]);

  const handleResetPassword = useCallback(async (email: string) => {
    try {
      startLoading();
      await authService.resetPassword(email);
      log('Auth', 'Password reset email sent');
      redirect.redirectAfterPasswordReset();
    } catch (err) {
      setAuthError(err);
      throw err;
    } finally {
      stopLoading();
    }
  }, [navigate]);

  const handleUpdatePassword = useCallback(async (newPassword: string) => {
    try {
      startLoading();
      await authService.updatePassword(newPassword);
      log('Auth', 'Password updated successfully');
      redirect.redirectAfterPasswordUpdate();
    } catch (err) {
      setAuthError(err);
      throw err;
    } finally {
      stopLoading();
    }
  }, [navigate]);

  const handleDeleteAccount = useCallback(async () => {
    try {
      startLoading();
      await authService.deleteAccount();
      log('Auth', 'Account deleted successfully');
      redirect.redirectAfterSignOut();
    } catch (err) {
      setAuthError(err);
      throw err;
    } finally {
      stopLoading();
    }
  }, []);

  return {
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
    resetPassword: handleResetPassword,
    updatePassword: handleUpdatePassword,
    deleteAccount: handleDeleteAccount,
    loading,
    error
  };
}