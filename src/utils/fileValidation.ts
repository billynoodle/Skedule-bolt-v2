export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
export const SUPPORTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const SUPPORTED_DOCUMENT_TYPES = ['application/pdf'];

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

export function validateFile(file: File): FileValidationResult {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: `File size exceeds maximum limit of ${MAX_FILE_SIZE / 1024 / 1024}MB`
    };
  }

  // Check file type
  const isValidType = [...SUPPORTED_IMAGE_TYPES, ...SUPPORTED_DOCUMENT_TYPES].includes(
    file.type
  );
  if (!isValidType) {
    return {
      isValid: false,
      error: 'Unsupported file type. Please upload a PDF or image file.'
    };
  }

  return { isValid: true };
}

export function validateFiles(files: File[]): FileValidationResult {
  for (const file of files) {
    const result = validateFile(file);
    if (!result.isValid) {
      return result;
    }
  }
  return { isValid: true };
}