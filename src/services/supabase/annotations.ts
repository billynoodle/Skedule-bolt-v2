import { supabase } from './client';
import type { Database } from './types';
import { log, error } from '../../utils/logger';

type Annotation = Database['public']['Tables']['annotations']['Row'];
type AnnotationInsert = Database['public']['Tables']['annotations']['Insert'];
type AnnotationUpdate = Database['public']['Tables']['annotations']['Update'];

export async function getAnnotations(documentId: string) {
  try {
    const { data, error: err } = await supabase
      .from('annotations')
      .select('*')
      .eq('document_id', documentId)
      .order('created_at', { ascending: true });

    if (err) throw err;
    log('AnnotationsService', 'Retrieved annotations', { count: data.length });
    return data;
  } catch (err) {
    error('AnnotationsService', 'Failed to get annotations', err);
    throw err;
  }
}

export async function createAnnotation(annotation: AnnotationInsert) {
  try {
    const { data, error: err } = await supabase
      .from('annotations')
      .insert(annotation)
      .select()
      .single();

    if (err) throw err;
    log('AnnotationsService', 'Created annotation', { id: data.id });
    return data;
  } catch (err) {
    error('AnnotationsService', 'Failed to create annotation', err);
    throw err;
  }
}

export async function updateAnnotation(id: string, updates: AnnotationUpdate) {
  try {
    const { data, error: err } = await supabase
      .from('annotations')
      .update({ ...updates, last_modified: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (err) throw err;
    log('AnnotationsService', 'Updated annotation', { id });
    return data;
  } catch (err) {
    error('AnnotationsService', 'Failed to update annotation', err);
    throw err;
  }
}

export async function deleteAnnotation(id: string) {
  try {
    const { error: err } = await supabase
      .from('annotations')
      .delete()
      .eq('id', id);

    if (err) throw err;
    log('AnnotationsService', 'Deleted annotation', { id });
  } catch (err) {
    error('AnnotationsService', 'Failed to delete annotation', err);
    throw err;
  }
}