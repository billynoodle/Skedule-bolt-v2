import { useState } from 'react';
import { AuthError } from '../../services/auth/types';

export function useAuthState() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AuthError | null>(null);

  const startLoading = () => {
    setLoading(true);
    setError(null);
  };

  const stopLoading = () => {
    setLoading(false);
  };

  const setAuthError = (err: unknown) => {
    setError(err instanceof AuthError ? err : new AuthError(
      err instanceof Error ? err.message : 'Authentication failed',
      500
    ));
  };

  return {
    loading,
    error,
    startLoading,
    stopLoading,
    setAuthError
  };
}