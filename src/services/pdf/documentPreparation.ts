import { GlobalWorkerOptions } from 'pdfjs-dist';
import * as pdfjsLib from 'pdfjs-dist';
import { log } from '../../utils/logger';

// Configure worker
GlobalWorkerOptions.workerSrc = '/assets/pdf.worker.js';

// PDF viewer options
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

export interface DocumentDimensions {
  width: number;
  height: number;
  rotation: number;
  isPortrait: boolean;
}

export class DocumentPreparationService {
  /**
   * Analyzes a PDF page and determines optimal viewing settings
   */
  static analyzePage(page: pdfjsLib.PDFPageProxy): DocumentDimensions {
    const viewport = page.getViewport({ scale: 1, rotation: 0 });
    const isPortrait = viewport.width < viewport.height;
    
    // Determine if rotation is needed
    const rotation = isPortrait ? 90 : 0;
    
    // Get dimensions after rotation
    const rotatedViewport = page.getViewport({ scale: 1, rotation });
    
    log('DocumentPreparation', 'Page analysis complete', {
      originalDimensions: { width: viewport.width, height: viewport.height },
      rotatedDimensions: { width: rotatedViewport.width, height: rotatedViewport.height },
      isPortrait,
      rotation
    });

    return {
      width: rotatedViewport.width,
      height: rotatedViewport.height,
      rotation,
      isPortrait
    };
  }

  /**
   * Prepares a PDF page for rendering
   */
  static async preparePage(page: pdfjsLib.PDFPageProxy): Promise<{
    dimensions: DocumentDimensions;
    viewport: pdfjsLib.PageViewport;
  }> {
    try {
      const dimensions = this.analyzePage(page);
      const viewport = page.getViewport({ 
        scale: 1, 
        rotation: dimensions.rotation 
      });

      log('DocumentPreparation', 'Page prepared successfully', {
        dimensions,
        viewport: {
          width: viewport.width,
          height: viewport.height,
          rotation: viewport.rotation
        }
      });

      return { dimensions, viewport };
    } catch (err) {
      log('DocumentPreparation', 'Failed to prepare page', { error: err });
      throw err;
    }
  }
}

export const pdfjs = pdfjsLib;