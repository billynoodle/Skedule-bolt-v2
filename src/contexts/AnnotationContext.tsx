import { createContext, useContext, ReactNode } from 'react';
import { create } from 'zustand';

export interface Annotation {
  id: string;
  type: 'box' | 'measurement' | 'text';
  position: {
    left: number;
    top: number;
    width: number;
    height: number;
    angle: number;
  };
  data?: Record<string, unknown>;
}

interface AnnotationState {
  annotations: Annotation[];
  selectedAnnotationId: string | null;
  addAnnotation: (annotation: Annotation) => void;
  updateAnnotation: (annotation: Annotation) => void;
  deleteAnnotation: (id: string) => void;
  selectAnnotation: (id: string | null) => void;
  clearAnnotations: () => void;
}

const useAnnotationStore = create<AnnotationState>((set) => ({
  annotations: [],
  selectedAnnotationId: null,
  addAnnotation: (annotation) =>
    set((state) => ({ annotations: [...state.annotations, annotation] })),
  updateAnnotation: (annotation) =>
    set((state) => ({
      annotations: state.annotations.map((a) =>
        a.id === annotation.id ? annotation : a
      )
    })),
  deleteAnnotation: (id) =>
    set((state) => ({
      annotations: state.annotations.filter((a) => a.id !== id),
      selectedAnnotationId: state.selectedAnnotationId === id ? null : state.selectedAnnotationId
    })),
  selectAnnotation: (id) => set({ selectedAnnotationId: id }),
  clearAnnotations: () => set({ annotations: [], selectedAnnotationId: null })
}));

const AnnotationContext = createContext<typeof useAnnotationStore | null>(null);

export function AnnotationProvider({ children }: { children: ReactNode }) {
  return (
    <AnnotationContext.Provider value={useAnnotationStore}>
      {children}
    </AnnotationContext.Provider>
  );
}

export function useAnnotations() {
  const context = useContext(AnnotationContext);
  if (!context) {
    throw new Error('useAnnotations must be used within an AnnotationProvider');
  }
  return context;
}