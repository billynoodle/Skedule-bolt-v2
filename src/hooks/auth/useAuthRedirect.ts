import { useNavigate } from 'react-router-dom';
import { AUTH_CONFIG } from '../../services/auth/config';

export function useAuthRedirect() {
  const navigate = useNavigate();

  return {
    redirectAfterSignIn: () => navigate(AUTH_CONFIG.redirects.afterSignIn, { replace: true }),
    redirectAfterSignUp: () => navigate(AUTH_CONFIG.redirects.afterSignUp, { replace: true }),
    redirectAfterSignOut: () => navigate(AUTH_CONFIG.redirects.afterSignOut, { replace: true }),
    redirectAfterPasswordReset: () => navigate(AUTH_CONFIG.redirects.afterPasswordReset, { replace: true }),
    redirectAfterPasswordUpdate: () => navigate(AUTH_CONFIG.redirects.afterPasswordUpdate, { replace: true })
  };
}