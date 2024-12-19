import { supabase } from './client';
import type { Database } from './types';
import { log, error } from '../../utils/logger';

type TagPattern = Database['public']['Tables']['tag_patterns']['Row'];
type TagPatternInsert = Database['public']['Tables']['tag_patterns']['Insert'];
type TagPatternUpdate = Database['public']['Tables']['tag_patterns']['Update'];

export async function getTagPatterns(documentId: string) {
  try {
    const { data, error: err } = await supabase
      .from('tag_patterns')
      .select('*')
      .eq('document_id', documentId)
      .order('created_at', { ascending: true });

    if (err) throw err;
    log('TagPatternsService', 'Retrieved tag patterns', { count: data.length });
    return data;
  } catch (err) {
    error('TagPatternsService', 'Failed to get tag patterns', err);
    throw err;
  }
}

export async function createTagPattern(pattern: TagPatternInsert) {
  try {
    const { data, error: err } = await supabase
      .from('tag_patterns')
      .insert(pattern)
      .select()
      .single();

    if (err) throw err;
    log('TagPatternsService', 'Created tag pattern', { id: data.id });
    return data;
  } catch (err) {
    error('TagPatternsService', 'Failed to create tag pattern', err);
    throw err;
  }
}

export async function deleteTagPattern(id: string) {
  try {
    const { error: err } = await supabase
      .from('tag_patterns')
      .delete()
      .eq('id', id);

    if (err) throw err;
    log('TagPatternsService', 'Deleted tag pattern', { id });
  } catch (err) {
    error('TagPatternsService', 'Failed to delete tag pattern', err);
    throw err;
  }
}