import { Session, User } from '@supabase/supabase-js';

export interface AuthState {
  session: Session | null;
  loading: boolean;
  error: AuthError | null;
}

export interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
}

export class AuthError extends Error {
  status: number;
  code?: string;
  
  constructor(message: string, status: number = 500, code?: string) {
    super(message);
    this.name = 'AuthError';
    this.status = status;
    this.code = code;
  }

  static isAuthError(error: unknown): error is AuthError {
    return error instanceof AuthError;
  }
}

export type AuthEventType = 
  | 'SIGNED_IN'
  | 'SIGNED_OUT'
  | 'USER_UPDATED'
  | 'USER_DELETED'
  | 'PASSWORD_RECOVERY';

export interface AuthEvent {
  type: AuthEventType;
  session: Session | null;
}