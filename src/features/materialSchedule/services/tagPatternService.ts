import { supabase } from '../../../services/supabase/client';
import { TagPattern } from '../../../types/tagPattern';
import { log, error as logError } from '../../../utils/logger';

export async function createTagPattern(documentId: string, pattern: Omit<TagPattern, 'id' | 'documentId'>) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No authenticated user');

    log('TagPatternService', 'Creating pattern', { documentId, pattern });

    const { data, error: err } = await supabase
      .from('tag_patterns')
      .insert({
        document_id: documentId,
        prefix: pattern.prefix,
        description: pattern.description,
        schedule_table: pattern.scheduleTable,
        user_id: user.id
      })
      .select()
      .single();

    if (err) throw err;

    log('TagPatternService', 'Pattern created successfully', { id: data.id });
    return data;
  } catch (err) {
    logError('TagPatternService', 'Failed to create pattern', err);
    throw err;
  }
}

export async function getTagPatterns(documentId: string) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No authenticated user');

    log('TagPatternService', 'Fetching patterns', { documentId });

    const { data, error: err } = await supabase
      .from('tag_patterns')
      .select('*')
      .eq('document_id', documentId)
      .eq('user_id', user.id);

    if (err) throw err;

    log('TagPatternService', 'Patterns fetched successfully', { count: data?.length });
    return data;
  } catch (err) {
    logError('TagPatternService', 'Failed to fetch patterns', err);
    throw err;
  }
}

export async function deleteTagPattern(patternId: string) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No authenticated user');

    log('TagPatternService', 'Deleting pattern', { patternId });

    const { error: err } = await supabase
      .from('tag_patterns')
      .delete()
      .eq('id', patternId)
      .eq('user_id', user.id);

    if (err) throw err;

    log('TagPatternService', 'Pattern deleted successfully');
  } catch (err) {
    logError('TagPatternService', 'Failed to delete pattern', err);
    throw err;
  }
}

export async function linkPatternToAnnotation(patternId: string, annotationId: string) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No authenticated user');

    log('TagPatternService', 'Linking pattern to annotation', { patternId, annotationId });

    const { error: err } = await supabase
      .from('annotations')
      .update({ tag_pattern_id: patternId })
      .eq('id', annotationId)
      .eq('user_id', user.id);

    if (err) throw err;

    log('TagPatternService', 'Pattern linked successfully');
  } catch (err) {
    logError('TagPatternService', 'Failed to link pattern', err);
    throw err;
  }
}