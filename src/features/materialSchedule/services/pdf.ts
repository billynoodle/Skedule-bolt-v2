import { GlobalWorkerOptions } from 'pdfjs-dist';
import * as pdfjsLib from 'pdfjs-dist';
import { log } from '../../../utils/logger';

log('PDF:Init', 'Configuring PDF.js worker', {
  workerSrc: '/assets/pdf.worker.js'
});

GlobalWorkerOptions.workerSrc = '/assets/pdf.worker.js';

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
  rangeChunkSize: 65536,
  maxImageSize: 10000 * 10000,
  isOffscreenCanvasSupported: true,
  useOnlyCssZoom: false,
  verbosity: 0
};

log('PDF:Init', 'PDF viewer options configured', {
  options: {
    ...PDF_OPTIONS,
    maxImageSize: `${PDF_OPTIONS.maxImageSize} pixels`,
    rangeChunkSize: `${PDF_OPTIONS.rangeChunkSize} bytes`
  }
});

export const pdfjs = pdfjsLib;