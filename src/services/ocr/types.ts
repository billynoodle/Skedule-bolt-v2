export interface OCRConfig {
  language: string;
  mode: 'single-line' | 'document';
  whitelist?: string;
  confidence?: number;
}

export interface OCRResult {
  text: string;
  confidence: number;
  bbox: BoundingBox;
  words?: OCRWord[];
}

export interface OCRWord {
  text: string;
  confidence: number;
  bbox: BoundingBox;
}

export interface BoundingBox {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}