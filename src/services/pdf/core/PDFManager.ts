import { PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist';
import { PDF_OPTIONS } from '../config';
import { PDFDimensions } from '../types';
import { log, error } from '../../../utils/logger';

export class PDFManager {
  private document: PDFDocumentProxy | null = null;
  private page: PDFPageProxy | null = null;

  async loadDocument(url: string): Promise<void> {
    try {
      log('PDFManager', 'Loading document', { url });
      
      const pdfjsLib = await import('pdfjs-dist');
      
      this.document = await pdfjsLib.getDocument({
        url,
        ...PDF_OPTIONS
      }).promise;
      
      log('PDFManager', 'Document loaded successfully');
    } catch (err) {
      error('PDFManager', 'Failed to load document', err);
      throw err;
    }
  }

  async getPage(pageNumber: number = 1): Promise<PDFPageProxy> {
    if (!this.document) {
      throw new Error('Document not loaded');
    }

    try {
      this.page = await this.document.getPage(pageNumber);
      log('PDFManager', 'Page loaded', { pageNumber });
      return this.page;
    } catch (err) {
      error('PDFManager', 'Failed to get page', err);
      throw err;
    }
  }

  getPageDimensions(page: PDFPageProxy): PDFDimensions {
    // Get natural dimensions
    const viewport = page.getViewport({ scale: 1, rotation: 0 });
    const isPortrait = viewport.width < viewport.height;
    
    // For landscape documents, keep original orientation
    const rotation = isPortrait ? 90 : 0;
    
    // Get dimensions after rotation if needed
    const rotatedViewport = page.getViewport({ scale: 1, rotation });
    
    const dimensions: PDFDimensions = {
      width: rotatedViewport.width,
      height: rotatedViewport.height,
      rotation,
      isPortrait
    };

    log('PDFManager', 'Page dimensions calculated', dimensions);
    return dimensions;
  }

  dispose(): void {
    if (this.document) {
      this.document.destroy();
      this.document = null;
      this.page = null;
      log('PDFManager', 'Resources disposed');
    }
  }
}