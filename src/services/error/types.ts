export interface AppError extends Error {
  code: string;
  context?: Record<string, any>;
  originalError?: any;
}

export type ErrorCode = 
  | 'AUTH_ERROR'
  | 'STORAGE_ERROR'
  | 'VALIDATION_ERROR'
  | 'NETWORK_ERROR'
  | 'UNKNOWN_ERROR';

export interface ErrorMetadata {
  userMessage: string;
  shouldRetry: boolean;
  severity: 'low' | 'medium' | 'high';
}