import { GlobalWorkerOptions } from 'pdfjs-dist';
import * as pdfjsLib from 'pdfjs-dist';
import { log } from '../../utils/logger';

// Configure worker
GlobalWorkerOptions.workerSrc = '/assets/pdf.worker.js';

// PDF viewer options with improved quality settings
export const PDF_OPTIONS = {
  cMapUrl: '/assets/cmaps/',
  cMapPacked: true,
  standardFontDataUrl: '/assets/standard_fonts/',
  useWorkerFetch: false,
  isEvalSupported: false,
  useSystemFonts: false,
  disableAutoFetch: false,
  disableStream: false,
  disableFontFace: false,
  enableXfa: false,
  // Improved quality settings
  maxImageSize: 20000 * 20000, // Increased for better quality
  rangeChunkSize: 131072, // Increased chunk size
  isOffscreenCanvasSupported: true,
  useOnlyCssZoom: false,
  verbosity: 1, // Increased for better debugging
  // Additional quality settings
  defaultViewport: {
    scale: 2.0 // Higher initial scale for better quality
  },
  renderInteractiveForms: true,
  enablePrintAutoRotate: true,
  disableRange: false,
  disableCreateObjectURL: false
};

log('PDF:Config', 'PDF configuration initialized', {
  workerSrc: GlobalWorkerOptions.workerSrc,
  options: {
    ...PDF_OPTIONS,
    maxImageSize: `${PDF_OPTIONS.maxImageSize} pixels`,
    rangeChunkSize: `${PDF_OPTIONS.rangeChunkSize} bytes`
  }
});

export const pdfjs = pdfjsLib;