import { supabase } from '../client';
import { validateUserAccess } from './paths';
import { log, error } from '../../../utils/logger';

const SIGNED_URL_EXPIRY = 3600; // 1 hour

export async function getFileUrl(filePath: string): Promise<string> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No authenticated user');

    if (!validateUserAccess(filePath, user.id)) {
      throw new Error('Unauthorized access to file');
    }

    const { data, error: urlError } = await supabase.storage
      .from('documents')
      .createSignedUrl(filePath, SIGNED_URL_EXPIRY);

    if (urlError) throw urlError;
    if (!data?.signedUrl) throw new Error('Failed to get signed URL');

    return data.signedUrl;
  } catch (err) {
    error('StorageService', 'Failed to get file URL', err);
    throw err;
  }
}

export async function listJobFiles(jobId: string) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No authenticated user');

    const prefix = `${user.id}/${jobId}`;
    
    const { data, error: listError } = await supabase.storage
      .from('documents')
      .list(prefix);

    if (listError) throw listError;
    
    log('StorageService', 'Files listed successfully', { prefix });
    return data;
  } catch (err) {
    error('StorageService', 'Failed to list files', err);
    throw err;
  }
}