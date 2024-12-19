import { create } from 'zustand';
import { MaterialScheduleState } from '../types';
import { log } from '../../../utils/logger';

const initialState: MaterialScheduleState = {
  documentId: null,
  annotations: [],
  tagPatterns: [],
  selectedAnnotationId: null,
  hoveredAnnotationId: null,
  hoveredPatternId: null,
  scale: 1,
  rotation: 0,
  mode: 'select'
};

export const useMaterialScheduleStore = create<MaterialScheduleState & {
  setDocumentId: (id: string | null) => void;
  addAnnotation: (annotation: Omit<Annotation, 'id'>) => void;
  updateAnnotation: (id: string, updates: Partial<Annotation>) => void;
  deleteAnnotation: (id: string) => void;
  selectAnnotation: (id: string | null) => void;
  setHoveredAnnotation: (id: string | null) => void;
  setHoveredPattern: (id: string | null) => void;
  addTagPattern: (pattern: Omit<TagPattern, 'id'>) => void;
  removeTagPattern: (id: string) => void;
  linkAnnotationToPattern: (annotationId: string, patternId: string | null) => void;
  setScale: (scale: number) => void;
  setRotation: (rotation: number) => void;
  setMode: (mode: 'select' | 'draw') => void;
}>((set) => ({
  ...initialState,

  setDocumentId: (id) => set({ documentId: id }),

  addAnnotation: (annotation) => set((state) => {
    const newAnnotation = {
      id: crypto.randomUUID(),
      type: 'box' as const,
      ...annotation
    };
    log('MaterialSchedule', 'Added annotation', { id: newAnnotation.id });
    return { annotations: [...state.annotations, newAnnotation] };
  }),

  updateAnnotation: (id, updates) => set((state) => ({
    annotations: state.annotations.map(a => 
      a.id === id ? { ...a, ...updates } : a
    )
  })),

  deleteAnnotation: (id) => set((state) => ({
    annotations: state.annotations.filter(a => a.id !== id),
    selectedAnnotationId: state.selectedAnnotationId === id ? null : state.selectedAnnotationId
  })),

  selectAnnotation: (id) => set({ selectedAnnotationId: id }),
  setHoveredAnnotation: (id) => set({ hoveredAnnotationId: id }),
  setHoveredPattern: (id) => set({ hoveredPatternId: id }),

  addTagPattern: (pattern) => set((state) => ({
    tagPatterns: [...state.tagPatterns, { id: crypto.randomUUID(), ...pattern }]
  })),

  removeTagPattern: (id) => set((state) => ({
    tagPatterns: state.tagPatterns.filter(p => p.id !== id),
    annotations: state.annotations.map(a => 
      a.tagPatternId === id ? { ...a, tagPatternId: undefined } : a
    )
  })),

  linkAnnotationToPattern: (annotationId, patternId) => set((state) => ({
    annotations: state.annotations.map(a =>
      a.id === annotationId ? { ...a, tagPatternId: patternId } : a
    )
  })),

  setScale: (scale) => set({ scale }),
  setRotation: (rotation) => set({ rotation }),
  setMode: (mode) => set({ mode })
}));