export interface MaterialScheduleState {
  documentId: string | null;
  annotations: Annotation[];
  tagPatterns: TagPattern[];
  selectedAnnotationId: string | null;
  hoveredAnnotationId: string | null;
  hoveredPatternId: string | null;
  scale: number;
  rotation: number;
  mode: 'select' | 'draw';
}

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
  tagPatternId?: string;
  extractedText?: string;
  confidence?: number;
}

export interface TagPattern {
  id: string;
  prefix: string;
  description: string;
  scheduleTable: string;
  linkedAnnotations?: string[];
}

export interface OcrResult {
  text: string;
  confidence: number;
  bbox: {
    x0: number;
    y0: number;
    x1: number;
    y1: number;
  };
}

export interface TagPatternMatch {
  pattern: TagPattern;
  confidence: number;
  text: string;
}