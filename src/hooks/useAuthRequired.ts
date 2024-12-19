import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthManager } from '../services/auth/core/AuthManager';
import { log } from '../utils/logger';

export function useAuthRequired() {
  const navigate = useNavigate();
  const authManager = AuthManager.getInstance();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await authManager.requireAuth();
      } catch (err) {
        log('Auth', 'Authentication required, redirecting to login');
        navigate('/auth', { replace: true });
      }
    };

    checkAuth();
  }, [navigate]);

  return authManager;
}