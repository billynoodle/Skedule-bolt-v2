import { useState, useCallback } from 'react';
import { PDFManager } from '../services/pdf/core/PDFManager';
import { log } from '../utils/logger';

export function usePDFViewer() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pdfManager] = useState(() => new PDFManager());

  const loadDocument = useCallback(async (url: string) => {
    try {
      setLoading(true);
      setError(null);
      await pdfManager.loadDocument(url);
      log('PDFViewer', 'Document loaded successfully');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load document';
      setError(message);
      log('PDFViewer', 'Failed to load document', err);
    } finally {
      setLoading(false);
    }
  }, [pdfManager]);

  return {
    pdfManager,
    loading,
    error,
    loadDocument
  };
}