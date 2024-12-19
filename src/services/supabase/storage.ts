import { supabase } from './client';
import { log, error } from '../../utils/logger';

/**
 * Uploads a file to the user's folder in the documents bucket
 * Path format: {userId}/{jobId}/{fileName}
 */
export async function uploadFile(file: File, jobId: string) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No authenticated user');

    // Create path: userId/jobId/fileName
    const filePath = `${user.id}/${jobId}/${file.name}`;

    const { data, error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) throw uploadError;

    log('StorageService', 'File uploaded successfully', { path: filePath });
    return data;
  } catch (err) {
    error('StorageService', 'Failed to upload file', err);
    throw err;
  }
}

/**
 * Deletes a file from the user's folder
 */
export async function deleteFile(filePath: string) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No authenticated user');

    // Verify the file belongs to the user
    if (!filePath.startsWith(`${user.id}/`)) {
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

/**
 * Gets a signed URL for file access
 * URLs expire after 1 hour
 */
export async function getFileUrl(filePath: string) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No authenticated user');

    // Verify the file belongs to the user
    if (!filePath.startsWith(`${user.id}/`)) {
      throw new Error('Unauthorized access to file');
    }

    const { data, error: urlError } = await supabase.storage
      .from('documents')
      .createSignedUrl(filePath, 3600); // 1 hour expiry

    if (urlError) throw urlError;
    if (!data?.signedUrl) throw new Error('Failed to get signed URL');

    return data.signedUrl;
  } catch (err) {
    error('StorageService', 'Failed to get file URL', err);
    throw err;
  }
}

/**
 * Lists files in a job folder
 */
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