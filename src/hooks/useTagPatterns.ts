// src/hooks/useTagPatterns.ts
import { useCallback } from 'react';
import { useAnnotationStore } from '../stores/annotationStore';
import { useTagPatternStore, TagPattern } from '../stores/tagPatternStore';
import { log } from '../utils/logger';

export function useTagPatterns(jobId: string, documentId: string) {
  const {
    getDocumentState,
    linkAnnotationToPattern,
    setHoveredAnnotation,
    hoveredId,
    hoveredPatternId,
    selectedId,
    setHoveredPattern
  } = useAnnotationStore();

  const {
    patterns,
    loading,
    error,
    fetchPatterns,
    addPattern,
    removePattern,
    getPatterns
  } = useTagPatternStore();

  const handlePatternHover = useCallback((patternId: string | null) => {
    setHoveredPattern(patternId);
    log('TagPatterns', 'Pattern hover', { patternId });
  }, [setHoveredPattern]);

  const handleAnnotationHover = useCallback((annotationId: string | null) => {
    setHoveredAnnotation(annotationId);
    if (annotationId) {
      const { annotations = [] } = getDocumentState(jobId, documentId);
      const annotation = annotations.find(a => a.id === annotationId);
      if (annotation?.tagPatternId) {
        setHoveredPattern(annotation.tagPatternId);
      }
    } else {
      setHoveredPattern(null);
    }
    log('TagPatterns', 'Annotation hover', { annotationId });
  }, [jobId, documentId, getDocumentState, setHoveredAnnotation, setHoveredPattern]);

  const handleToggleLink = useCallback((patternId: string) => {
    if (selectedId) {
      linkAnnotationToPattern(jobId, documentId, selectedId, patternId);
      log('TagPatterns', 'Pattern link toggled', { patternId, annotationId: selectedId });
    }
  }, [jobId, documentId, selectedId, linkAnnotationToPattern]);

  return {
    handlePatternHover,
    handleAnnotationHover,
    handleToggleLink,
    hoveredId,
    hoveredPatternId,
    selectedId,
    getTagPatterns: () => getPatterns(documentId),
    getAnnotationsByPattern: (patternId: string) => {
      const { annotations = [] } = getDocumentState(jobId, documentId);
      return annotations.filter(a => a.tagPatternId === patternId);
    },
    addPattern,
    removePattern,
    loading,
    error
  };
}
