import { create } from 'zustand';
import { TagPattern } from '../types/tagPattern';
import { fetchPatterns, createPattern, deletePattern } from '../features/materialSchedule/services/tagPatternService';
import { log, error as logError } from '../utils/logger';

interface TagPatternState {
  patterns: Record<string, TagPattern[]>;
  loading: boolean;
  error: string | null;
  fetchPatterns: (documentId: string) => Promise<void>;
  addPattern: (documentId: string, pattern: Omit<TagPattern, 'id' | 'documentId'>) => Promise<void>;
  removePattern: (documentId: string, patternId: string) => Promise<void>;
  getPatterns: (documentId: string) => TagPattern[];
}

export const useTagPatternStore = create<TagPatternState>((set, get) => ({
  patterns: {},
  loading: false,
  error: null,

  fetchPatterns: async (documentId) => {
    try {
      set({ loading: true, error: null });
      log('TagPatternStore', 'Fetching patterns', { documentId });

      const patterns = await fetchPatterns(documentId);

      set(state => ({
        patterns: {
          ...state.patterns,
          [documentId]: patterns
        },
        loading: false,
        error: null
      }));

      log('TagPatternStore', 'Patterns fetched successfully', { count: patterns.length });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch patterns';
      logError('TagPatternStore', message, err);
      set({ error: message, loading: false });
    }
  },

  addPattern: async (documentId, pattern) => {
    try {
      set({ loading: true, error: null });
      log('TagPatternStore', 'Adding pattern', { documentId, pattern });

      const newPattern = await createPattern(documentId, pattern);

      set(state => ({
        patterns: {
          ...state.patterns,
          [documentId]: [...(state.patterns[documentId] || []), newPattern]
        },
        loading: false,
        error: null
      }));

      log('TagPatternStore', 'Pattern added successfully', { id: newPattern.id });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add pattern';
      logError('TagPatternStore', message, err);
      set({ error: message, loading: false });
      throw err;
    }
  },

  removePattern: async (documentId, patternId) => {
    try {
      set({ loading: true, error: null });
      log('TagPatternStore', 'Removing pattern', { documentId, patternId });

      await deletePattern(patternId);

      set(state => ({
        patterns: {
          ...state.patterns,
          [documentId]: state.patterns[documentId]?.filter(p => p.id !== patternId) || []
        },
        loading: false,
        error: null
      }));

      log('TagPatternStore', 'Pattern removed successfully', { id: patternId });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to remove pattern';
      logError('TagPatternStore', message, err);
      set({ error: message, loading: false });
      throw err;
    }
  },

  getPatterns: (documentId) => {
    return get().patterns[documentId] || [];
  }
}));