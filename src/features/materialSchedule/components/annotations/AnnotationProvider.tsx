import React, { createContext, useContext, ReactNode } from 'react';
import { useAnnotationStore } from '../../../../stores/annotationStore';
import { useViewerStore } from '../../../../stores/viewerStore';

interface AnnotationContextValue {
  jobId: string;
  documentId: string;
  mode: 'select' | 'draw';
  scale: number;
}

const AnnotationContext = createContext<AnnotationContextValue | null>(null);

interface AnnotationProviderProps {
  children: ReactNode;
  jobId: string;
  documentId: string;
}

export function AnnotationProvider({ children, jobId, documentId }: AnnotationProviderProps) {
  const { mode } = useViewerStore();
  const { getDocumentState } = useAnnotationStore();
  const { scale } = getDocumentState(jobId, documentId);

  return (
    <AnnotationContext.Provider value={{ jobId, documentId, mode, scale }}>
      {children}
    </AnnotationContext.Provider>
  );
}

export function useAnnotation() {
  const context = useContext(AnnotationContext);
  if (!context) {
    throw new Error('useAnnotation must be used within an AnnotationProvider');
  }
  return context;
}