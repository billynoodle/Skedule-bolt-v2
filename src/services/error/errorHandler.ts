import { AppError, ErrorCode, ErrorMetadata } from './types';
import { log, error as logError } from '../../utils/logger';

const ERROR_METADATA: Record<ErrorCode, ErrorMetadata> = {
  AUTH_ERROR: {
    userMessage: 'Authentication failed. Please try signing in again.',
    shouldRetry: false,
    severity: 'high'
  },
  STORAGE_ERROR: {
    userMessage: 'Failed to process file. Please try again.',
    shouldRetry: true,
    severity: 'medium'
  },
  VALIDATION_ERROR: {
    userMessage: 'Invalid input. Please check your data and try again.',
    shouldRetry: false,
    severity: 'low'
  },
  NETWORK_ERROR: {
    userMessage: 'Network connection issue. Please check your connection.',
    shouldRetry: true,
    severity: 'medium'
  },
  UNKNOWN_ERROR: {
    userMessage: 'An unexpected error occurred. Please try again.',
    shouldRetry: true,
    severity: 'high'
  }
};

export function createAppError(
  code: ErrorCode,
  message: string,
  context?: Record<string, any>,
  originalError?: any
): AppError {
  const error = new Error(message) as AppError;
  error.code = code;
  error.context = context;
  error.originalError = originalError;
  return error;
}

export function handleError(error: any): AppError {
  let appError: AppError;

  if (error.code && error.code in ERROR_METADATA) {
    appError = error as AppError;
  } else {
    appError = createAppError(
      'UNKNOWN_ERROR',
      error.message || 'An unknown error occurred',
      undefined,
      error
    );
  }

  const metadata = ERROR_METADATA[appError.code];
  logError('ErrorHandler', metadata.userMessage, {
    error: appError,
    severity: metadata.severity
  });

  return appError;
}