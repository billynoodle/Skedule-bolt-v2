import { create } from 'zustand';
import { supabase } from '../services/supabase/client';
import { validateUUID } from '../services/core/validation';
import { log, error } from '../utils/logger';
import { Annotation, DocumentState } from '../types/annotations';

interface AnnotationState {
  documents: Record<string, Record<string, DocumentState>>;
  selectedId: string | null;
  hoveredId: string | null;
  hoveredPatternId: string | null;
  fetchAnnotations: (jobId: string, documentId: string) => Promise<void>;
  addAnnotation: (jobId: string, documentId: string, annotation: Omit<Annotation, 'id'>) => Promise<void>;
  updateAnnotation: (jobId: string, documentId: string, annotation: Annotation) => Promise<void>;
  deleteAnnotation: (jobId: string, documentId: string, annotationId: string) => Promise<void>;
  clearAnnotations: (jobId: string, documentId: string) => Promise<void>;
  selectAnnotation: (id: string | null) => void;
  setHoveredAnnotation: (id: string | null) => void;
  setHoveredPattern: (id: string | null) => void;
  getDocumentState: (jobId: string, documentId: string) => DocumentState;
  setDocumentState: (jobId: string, documentId: string, state: Partial<DocumentState>) => void;
}

const defaultDocumentState: DocumentState = {
  annotations: [],
  rotation: 0,
  scale: 1
};

export const useAnnotationStore = create<AnnotationState>((set, get) => ({
  documents: {},
  selectedId: null,
  hoveredId: null,
  hoveredPatternId: null,

  getDocumentState: (jobId: string, documentId: string): DocumentState => {
    // Validate IDs
    const validJobId = validateUUID(jobId, 'Job');
    const validDocId = validateUUID(documentId, 'Document');
    
    return get().documents[validJobId]?.[validDocId] || defaultDocumentState;
  },

  setDocumentState: (jobId: string, documentId: string, state: Partial<DocumentState>) => {
    const validJobId = validateUUID(jobId, 'Job');
    const validDocId = validateUUID(documentId, 'Document');
    
    set(prev => ({
      documents: {
        ...prev.documents,
        [validJobId]: {
          ...prev.documents[validJobId],
          [validDocId]: {
            ...get().getDocumentState(validJobId, validDocId),
            ...state
          }
        }
      }
    }));
  },

  fetchAnnotations: async (jobId: string, documentId: string) => {
    try {
      const validJobId = validateUUID(jobId, 'Job');
      const validDocId = validateUUID(documentId, 'Document');

      const { data, error: err } = await supabase
        .from('annotations')
        .select('*')
        .eq('document_id', validDocId);

      if (err) throw err;

      const annotations = data.map(a => ({
        id: a.id,
        type: a.type as 'box',
        position: a.position,
        tagPatternId: a.tag_pattern_id,
        extractedText: a.extracted_text,
        confidence: a.confidence
      }));

      get().setDocumentState(validJobId, validDocId, { annotations });
      log('AnnotationStore', 'Annotations fetched', { count: annotations.length });
    } catch (err) {
      error('AnnotationStore', 'Failed to fetch annotations', err);
      throw err;
    }
  },

  addAnnotation: async (jobId: string, documentId: string, annotation: Omit<Annotation, 'id'>) => {
    try {
      const validJobId = validateUUID(jobId, 'Job');
      const validDocId = validateUUID(documentId, 'Document');

      const { data, error: err } = await supabase
        .from('annotations')
        .insert([{
          document_id: validDocId,
          type: annotation.type,
          position: annotation.position
        }])
        .select()
        .single();

      if (err) throw err;

      const newAnnotation: Annotation = {
        id: data.id,
        type: data.type,
        position: data.position,
        tagPatternId: data.tag_pattern_id,
        extractedText: data.extracted_text,
        confidence: data.confidence
      };

      const currentState = get().getDocumentState(validJobId, validDocId);
      get().setDocumentState(validJobId, validDocId, {
        annotations: [...currentState.annotations, newAnnotation]
      });

      log('AnnotationStore', 'Annotation added', { id: data.id });
    } catch (err) {
      error('AnnotationStore', 'Failed to add annotation', err);
      throw err;
    }
  },

  clearAnnotations: async (jobId: string, documentId: string) => {
    try {
      const validJobId = validateUUID(jobId, 'Job');
      const validDocId = validateUUID(documentId, 'Document');

      const { error: err } = await supabase
        .from('annotations')
        .delete()
        .eq('document_id', validDocId);

      if (err) throw err;

      get().setDocumentState(validJobId, validDocId, { annotations: [] });
      set({ selectedId: null });

      log('AnnotationStore', 'Annotations cleared', { documentId: validDocId });
    } catch (err) {
      error('AnnotationStore', 'Failed to clear annotations', err);
      throw err;
    }
  },

  selectAnnotation: (id: string | null) => set({ selectedId: id }),
  setHoveredAnnotation: (id: string | null) => set({ hoveredId: id }),
  setHoveredPattern: (id: string | null) => set({ hoveredPatternId: id })
}));