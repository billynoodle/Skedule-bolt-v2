import { useState, useCallback } from 'react';
import { OCRService } from '../services/ocr/core/OCRService';
import { OCRConfig, OCRResult } from '../services/ocr/types';
import { log } from '../utils/logger';

export function useOCR(config: OCRConfig) {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [service] = useState(() => new OCRService(config));

  const processImage = useCallback(async (imageData: ImageData): Promise<OCRResult | null> => {
    try {
      setProcessing(true);
      setError(null);
      
      const result = await service.processImage(imageData);
      
      log('OCR', 'Image processed successfully', {
        confidence: result.confidence
      });
      
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to process image';
      setError(message);
      log('OCR', 'Failed to process image', err);
      return null;
    } finally {
      setProcessing(false);
    }
  }, [service]);

  return {
    processing,
    error,
    processImage
  };
}