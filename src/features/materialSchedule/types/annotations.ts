export interface AnnotationPosition {
  left: number;
  top: number;
  width: number;
  height: number;
  angle: number;
}

export interface Annotation {
  id: string;
  documentId: string;
  type: 'box';
  position: AnnotationPosition;
  tagPatternId?: string;
  extractedText?: string;
  confidence?: number;
}

export interface DocumentState {
  annotations: Annotation[];
  rotation: number;
  scale: number;
}

export interface AnnotationEvent {
  type: 'create' | 'update' | 'delete';
  annotation: Annotation;
}