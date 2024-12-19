import { PDFError } from '../types';

export function createPDFError(message: string, code: string): PDFError {
  const error = new Error(message) as PDFError;
  error.name = 'PDFError';
  error.code = code;
  return error;
}

export const PDF_ERROR_CODES = {
  LOAD_ERROR: 'PDF_LOAD_ERROR',
  PAGE_ERROR: 'PDF_PAGE_ERROR',
  RENDER_ERROR: 'PDF_RENDER_ERROR',
  INVALID_STATE: 'PDF_INVALID_STATE'
} as const;