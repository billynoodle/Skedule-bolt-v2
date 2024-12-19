import { supabase } from '../client';
import { validateUUID } from '../../core/validation';
import { log, error } from '../../../utils/logger';

export async function uploadFile(file: File, jobId: string) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No authenticated user');

    // Validate jobId
    const validJobId = validateUUID(jobId, 'Job');

    // Create path: userId/jobId/fileName
    const filePath = `${user.id}/${validJobId}/${file.name}`;

    log('StorageService', 'Uploading file', { 
      path: filePath,
      size: file.size,
      type: file.type
    });

    const { data, error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) throw uploadError;
    if (!data) throw new Error('Upload failed with no error');

    // Create document record
    const { data: document, error: dbError } = await supabase
      .from('documents')
      .insert([{
        id: crypto.randomUUID(),
        job_id: validJobId,
        name: file.name,
        file_path: filePath,
        user_id: user.id
      }])
      .select()
      .single();

    if (dbError) throw dbError;

    log('StorageService', 'File uploaded successfully', { 
      path: filePath,
      documentId: document.id
    });

    return document;
  } catch (err) {
    error('StorageService', 'Failed to upload file', err);
    throw err;
  }
}