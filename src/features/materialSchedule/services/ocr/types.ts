export interface OcrConfig {
  language?: string;
  mode?: 'document' | 'single-line';
  confidence?: number;
  whitelist?: string;
}

export interface OcrResult {
  text: string;
  confidence: number;
  bbox: BoundingBox;
  words?: OcrWord[];
}

export interface OcrWord {
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

export interface ProcessingOptions {
  contrast?: number;
  threshold?: number;
  denoise?: boolean;
  scale?: number;
}