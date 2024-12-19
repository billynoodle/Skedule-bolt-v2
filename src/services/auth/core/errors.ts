import { AuthError } from '../types';
import { AUTH_ERRORS } from '../config';
import { error as logError } from '../../../utils/logger';

export function handleAuthError(err: unknown, context: string): never {
  const authError = err instanceof AuthError ? err : new AuthError(
    err instanceof Error ? err.message : AUTH_ERRORS.UNKNOWN_ERROR,
    500
  );
  
  logError('AuthService', `${context} failed`, authError);
  throw authError;
}

export function createAuthError(message: string, status: number = 500): AuthError {
  return new AuthError(message, status);
}

// Centralized error creation
export const createErrors = {
  invalidCredentials: () => createAuthError(AUTH_ERRORS.INVALID_CREDENTIALS, 401),
  invalidEmail: () => createAuthError(AUTH_ERRORS.INVALID_EMAIL, 400),
  invalidPassword: () => createAuthError(AUTH_ERRORS.INVALID_PASSWORD, 400),
  passwordsDontMatch: () => createAuthError(AUTH_ERRORS.PASSWORDS_DONT_MATCH, 400),
  sessionExpired: () => createAuthError(AUTH_ERRORS.SESSION_EXPIRED, 401),
  networkError: () => createAuthError(AUTH_ERRORS.NETWORK_ERROR, 503),
  unknownError: () => createAuthError(AUTH_ERRORS.UNKNOWN_ERROR, 500)
};