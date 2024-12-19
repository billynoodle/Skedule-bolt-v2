import { PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist';

export interface PDFViewerConfig {
  url: string;
  scale?: number;
  rotation?: number;
  pageNumber?: number;
}

export interface PDFDimensions {
  width: number;
  height: number;
  rotation: number;
  isPortrait: boolean;
}

export interface PDFPageInfo {
  page: PDFPageProxy;
  dimensions: PDFDimensions;
  viewport: any;
}

export interface PDFError extends Error {
  code: string;
  name: 'PDFError';
}