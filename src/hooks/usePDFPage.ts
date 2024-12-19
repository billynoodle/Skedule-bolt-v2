import { useState, useCallback } from 'react';
import { PDFPageProxy } from 'pdfjs-dist';
import { calculatePageDimensions } from '../services/pdf/utils/dimensions';
import { createPDFError, PDF_ERROR_CODES } from '../services/pdf/utils/errors';
import { PDFPageInfo } from '../services/pdf/types';
import { log } from '../utils/logger';

export function usePDFPage() {
  const [pageInfo, setPageInfo] = useState<PDFPageInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadPage = useCallback(async (page: PDFPageProxy) => {
    try {
      setLoading(true);
      setError(null);

      const dimensions = calculatePageDimensions(page);
      const viewport = page.getViewport({ 
        scale: 1,
        rotation: dimensions.rotation 
      });

      setPageInfo({
        page,
        dimensions,
        viewport
      });

      log('PDFPage', 'Page loaded successfully', { dimensions });
    } catch (err) {
      const error = createPDFError(
        'Failed to load PDF page',
        PDF_ERROR_CODES.PAGE_ERROR
      );
      setError(error);
      log('PDFPage', 'Failed to load page', err);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    pageInfo,
    loading,
    error,
    loadPage
  };
}