import { useState, useCallback } from 'react';

export interface Annotation {
  id: string;
  type: 'box';
  position: {
    left: number;
    top: number;
    width: number;
    height: number;
    angle: number;
  };
  data: Record<string, any>;
}

export function useAnnotations() {
  const [annotations, setAnnotations] = useState<Annotation[]>([]);

  const addAnnotation = useCallback((annotation: Annotation) => {
    setAnnotations(prev => [...prev, annotation]);
  }, []);

  const updateAnnotation = useCallback((annotation: Annotation) => {
    setAnnotations(prev =>
      prev.map(a => (a.id === annotation.id ? annotation : a))
    );
  }, []);

  const deleteAnnotation = useCallback((annotationId: string) => {
    setAnnotations(prev => prev.filter(a => a.id !== annotationId));
  }, []);

  return {
    annotations,
    addAnnotation,
    updateAnnotation,
    deleteAnnotation
  };
}