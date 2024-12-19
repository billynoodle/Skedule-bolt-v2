import { useState, useCallback, useEffect, useRef } from 'react';
import { supabase } from '../../../services/supabase/client';
import { AuthManager } from '../../../services/auth/core/AuthManager';
import { validateUUID } from '../../../services/core/validation';
import { TagPattern } from '../../../types/tagPattern';
import { log, error as logError } from '../../../utils/logger';

export function useTagPatterns(documentId: string) {
  const [patterns, setPatterns] = useState<TagPattern[]>([]);
  const [linkedPatterns, setLinkedPatterns] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchTimeoutRef = useRef<number>();
  const authManager = AuthManager.getInstance();

  // Validate documentId
  const validDocumentId = validateUUID(documentId, 'Document');

  // Fetch patterns with debounce
  const fetchPatterns = useCallback(async () => {
    if (fetchTimeoutRef.current) {
      window.clearTimeout(fetchTimeoutRef.current);
    }

    fetchTimeoutRef.current = window.setTimeout(async () => {
      try {
        const user = await authManager.requireAuth();

        const { data, error: err } = await supabase
          .from('tag_patterns')
          .select('*')
          .eq('document_id', validDocumentId)
          .eq('user_id', user.id);

        if (err) throw err;

        setPatterns(data || []);
        setLoading(false);
        setError(null);
        log('TagPatterns', 'Patterns fetched', { count: data?.length });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch patterns';
        logError('TagPatterns', message, err);
        setError(message);
        setLoading(false);
      }
    }, 300); // 300ms debounce
  }, [validDocumentId]);

  // Initial fetch
  useEffect(() => {
    fetchPatterns();
    return () => {
      if (fetchTimeoutRef.current) {
        window.clearTimeout(fetchTimeoutRef.current);
      }
    };
  }, [fetchPatterns]);

  const savePattern = useCallback(async (pattern: Omit<TagPattern, 'id' | 'documentId'>) => {
    try {
      const user = await authManager.requireAuth();
      
      const { data, error: err } = await supabase
        .from('tag_patterns')
        .insert([{
          document_id: validDocumentId,
          prefix: pattern.prefix,
          description: pattern.description,
          schedule_table: pattern.scheduleTable,
          user_id: user.id
        }])
        .select()
        .single();

      if (err) throw err;

      setPatterns(prev => [...prev, data]);
      log('TagPatterns', 'Pattern saved', { id: data.id });
      
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save pattern';
      logError('TagPatterns', message, err);
      throw err;
    }
  }, [validDocumentId]);

  const deletePattern = useCallback(async (patternId: string) => {
    try {
      const user = await authManager.requireAuth();
      
      const { error: err } = await supabase
        .from('tag_patterns')
        .delete()
        .eq('id', patternId)
        .eq('user_id', user.id);

      if (err) throw err;

      setPatterns(prev => prev.filter(p => p.id !== patternId));
      log('TagPatterns', 'Pattern deleted', { id: patternId });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete pattern';
      logError('TagPatterns', message, err);
      throw err;
    }
  }, []);

  const linkPattern = useCallback(async (annotationId: string, patternId: string) => {
    try {
      const user = await authManager.requireAuth();
      
      const { error: err } = await supabase
        .from('annotations')
        .update({ tag_pattern_id: patternId })
        .eq('id', annotationId)
        .eq('user_id', user.id);

      if (err) throw err;

      setLinkedPatterns(prev => ({
        ...prev,
        [patternId]: [...(prev[patternId] || []), annotationId]
      }));

      log('TagPatterns', 'Pattern linked', { patternId, annotationId });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to link pattern';
      logError('TagPatterns', message, err);
      throw err;
    }
  }, []);

  return {
    patterns,
    linkedPatterns,
    loading,
    error,
    savePattern,
    deletePattern,
    linkPattern,
    fetchPatterns
  };
}