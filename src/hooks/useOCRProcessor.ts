import { useState, useCallback } from 'react';
import { OCRProcessor } from '../services/ocr/core/OCRProcessor';
import { OCRConfig, OCRResult } from '../services/ocr/types';
import { log } from '../utils/logger';

export function useOCRProcessor(config: OCRConfig) {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processor] = useState(() => new OCRProcessor());

  const initialize = useCallback(async () => {
    try {
      await processor.initialize(config);
      log('OCR', 'Processor initialized successfully');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to initialize OCR';
      setError(message);
      log('OCR', 'Failed to initialize processor', err);
    }
  }, [processor, config]);

  const processImage = useCallback(async (imageData: ImageData): Promise<OCRResult | null> => {
    try {
      setProcessing(true);
      setError(null);
      const result = await processor.processImage(imageData);
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
  }, [processor]);

  return {
    processing,
    error,
    initialize,
    processImage
  };
}