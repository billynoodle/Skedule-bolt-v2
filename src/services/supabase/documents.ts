import { supabase } from './client';
import { uploadFile, deleteFile } from './storage';
import type { Database } from './types';
import { log, error } from '../../utils/logger';

type Document = Database['public']['Tables']['documents']['Row'];
type DocumentInsert = Database['public']['Tables']['documents']['Insert'];

export async function uploadDocument(file: File, jobId: string) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No authenticated user');

    // Upload file to storage
    const storageFile = await uploadFile(file, jobId);
    
    // Create document record
    const document: DocumentInsert = {
      job_id: jobId,
      name: file.name,
      file_path: storageFile.path,
      user_id: user.id,
      last_modified: new Date().toISOString()
    };

    const { data, error: insertError } = await supabase
      .from('documents')
      .insert(document)
      .select()
      .single();

    if (insertError) throw insertError;

    log('DocumentsService', 'Document created', { id: data.id, userId: user.id });
    return data;
  } catch (err) {
    error('DocumentsService', 'Failed to upload document', err);
    throw err;
  }
}

export async function getDocuments(jobId: string) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No authenticated user');

    const { data, error: err } = await supabase
      .from('documents')
      .select('*')
      .eq('job_id', jobId)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (err) throw err;
    log('DocumentsService', 'Retrieved documents', { count: data.length, userId: user.id });
    return data;
  } catch (err) {
    error('DocumentsService', 'Failed to get documents', err);
    throw err;
  }
}

export async function deleteDocument(id: string, filePath: string) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No authenticated user');

    // Delete file from storage
    await deleteFile(filePath);

    // Delete document record
    const { error: dbError } = await supabase
      .from('documents')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (dbError) throw dbError;
    log('DocumentsService', 'Document deleted', { id, userId: user.id });
  } catch (err) {
    error('DocumentsService', 'Failed to delete document', err);
    throw err;
  }
}