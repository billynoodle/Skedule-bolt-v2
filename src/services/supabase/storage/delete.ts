import { supabase } from '../client';
import { validateUserAccess } from './paths';
import { log, error } from '../../../utils/logger';

export async function deleteFile(filePath: string): Promise<void> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No authenticated user');

    if (!validateUserAccess(filePath, user.id)) {
      throw new Error('Unauthorized access to file');
    }

    const { error: deleteError } = await supabase.storage
      .from('documents')
      .remove([filePath]);

    if (deleteError) throw deleteError;
    log('StorageService', 'File deleted successfully', { path: filePath });
  } catch (err) {
    error('StorageService', 'Failed to delete file', err);
    throw err;
  }
}