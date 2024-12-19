import { useState, useCallback } from 'react';
import { fabric } from 'fabric';
import { OcrConfig, OcrResult, ProcessingOptions } from '../services/ocr/types';
import { processImageData } from '../services/ocr/imageProcessor';
import { recognizeText } from '../services/ocr/ocrProcessor';
import { getImageDataFromCanvas } from '../../../utils/canvas';
import { log } from '../../../utils/logger';

interface UseOcrProcessingProps {
  onTextExtracted: (text: string, confidence: number, result: OcrResult) => void;
  onError?: (error: string) => void;
  ocrConfig?: OcrConfig;
  processingOptions?: ProcessingOptions;
}

export function useOcrProcessing({
  onTextExtracted,
  onError,
  ocrConfig,
  processingOptions
}: UseOcrProcessingProps) {
  const [processing, setProcessing] = useState(false);

  const processAnnotation = useCallback(async (
    canvas: fabric.Canvas,
    object: fabric.Object
  ) => {
    try {
      setProcessing(true);
      log('OCR', 'Starting OCR for annotation');

      // Get image data from canvas area
      const rawImageData = getImageDataFromCanvas(canvas, object);
      if (!rawImageData) {
        throw new Error('Failed to get image data from canvas');
      }

      // Process image for better OCR results
      const processedImageData = processImageData(rawImageData, processingOptions);

      // Perform OCR
      const result = await recognizeText(processedImageData, ocrConfig);
      
      onTextExtracted(result.text, result.confidence, result);
      log('OCR', 'OCR completed successfully', { 
        text: result.text,
        confidence: result.confidence
      });

      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'OCR processing failed';
      onError?.(message);
      throw err;
    } finally {
      setProcessing(false);
    }
  }, [onTextExtracted, onError, ocrConfig, processingOptions]);

  return {
    processing,
    processAnnotation
  };
}