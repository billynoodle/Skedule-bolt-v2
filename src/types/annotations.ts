export interface Annotation {
  id: string;
  documentId: string;
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

export interface DocumentState {
  annotations: Annotation[];
  rotation: number;
  scale: number;
}