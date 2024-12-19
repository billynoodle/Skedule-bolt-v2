import { supabase } from '../client';
import { createFilePath } from './paths';
import { StorageFile, UploadOptions } from './types';
import { validateFiles } from '../../../utils/fileValidation';
import { createAppError, handleError } from '../../error/errorHandler';
import { log } from '../../../utils/logger';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

async function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function batchUpload(
  files: File[],
  jobId: string,
  options?: UploadOptions
): Promise<StorageFile[]> {
  // Validate all files first
  const validation = validateFiles(files);
  if (!validation.isValid) {
    throw createAppError('VALIDATION_ERROR', validation.error || 'Invalid files');
  }

  const results: StorageFile[] = [];
  const errors: Error[] = [];

  for (const file of files) {
    let retries = 0;
    while (retries < MAX_RETRIES) {
      try {
        const filePath = await createFilePath(file.name, jobId);
        const { data, error: uploadError } = await supabase.storage
          .from('documents')
          .upload(filePath, file, options);

        if (uploadError) throw uploadError;
        if (!data) throw new Error('Upload failed with no error');

        results.push(data);
        break;
      } catch (err) {
        retries++;
        if (retries === MAX_RETRIES) {
          errors.push(handleError(err));
        } else {
          await delay(RETRY_DELAY * retries);
        }
      }
    }
  }

  if (errors.length > 0) {
    throw createAppError(
      'STORAGE_ERROR',
      `Failed to upload ${errors.length} files`,
      { errors }
    );
  }

  log('StorageService', 'Batch upload completed', { count: results.length });
  return results;
}

export async function batchDelete(filePaths: string[]): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw createAppError('AUTH_ERROR', 'No authenticated user');

  // Validate all paths belong to user
  const invalidPaths = filePaths.filter(
    path => !path.startsWith(`${user.id}/`)
  );
  if (invalidPaths.length > 0) {
    throw createAppError(
      'VALIDATION_ERROR',
      'Unauthorized access to files',
      { paths: invalidPaths }
    );
  }

  const { error } = await supabase.storage
    .from('documents')
    .remove(filePaths);

  if (error) throw handleError(error);
  
  log('StorageService', 'Batch delete completed', { count: filePaths.length });
}