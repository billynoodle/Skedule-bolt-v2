export const AUTH_CONFIG = {
  sessionTimeout: 60 * 60 * 1000, // 60 minutes
  minPasswordLength: 6,
  redirects: {
    afterSignIn: '/dashboard',
    afterSignUp: '/auth/verify-email',
    afterSignOut: '/',
    afterPasswordReset: '/auth/check-email',
    afterPasswordUpdate: '/auth',
    passwordReset: '/auth/update-password' // Added explicit password reset path
  },
  urls: {
    // Add base URL configuration
    site: typeof window !== 'undefined' ? window.location.origin : '',
    auth: {
      callback: '/auth/callback',
      passwordReset: '/auth/update-password'
    }
  }
} as const;

export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: 'Invalid email or password. Please try again.',
  INVALID_EMAIL: 'Invalid email format',
  INVALID_PASSWORD: 'Password must be at least 6 characters',
  PASSWORDS_DONT_MATCH: 'Passwords do not match',
  SESSION_EXPIRED: 'Your session has expired. Please sign in again.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.'
} as const;