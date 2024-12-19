import { useState, useCallback } from 'react';
import { fabric } from 'fabric';
import { recognizeText } from '../services/ocr/ocrProcessor';
import { matchTagPattern } from '../services/ocr/patternMatcher';
import { processImageData } from '../services/ocr/imageProcessor';
import { getImageDataFromCanvas } from '../utils/canvas';
import { TagPattern, OcrResult, TagPatternMatch } from '../types/ocr';
import { log, error } from '../utils/logger';

interface UseOcrProcessingProps {
  onTextExtracted: (text: string, confidence: number) => void;
  onPatternMatch?: (match: TagPatternMatch) => void;
  onError?: (error: string) => void;
}

export function useOcrProcessing({
  onTextExtracted,
  onPatternMatch,
  onError
}: UseOcrProcessingProps) {
  const [processing, setProcessing] = useState(false);

  const processAnnotation = useCallback(async (
    canvas: fabric.Canvas,
    object: fabric.Object,
    patterns: TagPattern[]
  ) => {
    try {
      setProcessing(true);
      log('OCRProcessing', 'Starting OCR for annotation');

      // Get image data from canvas area
      const rawImageData = getImageDataFromCanvas(canvas, object);
      if (!rawImageData) {
        throw new Error('Failed to get image data from canvas');
      }

      // Process image for better OCR results
      const processedImageData = processImageData(rawImageData);

      // Perform OCR
      const result = await recognizeText(processedImageData);
      log('OCRProcessing', 'OCR completed', { text: result.text, confidence: result.confidence });
      
      onTextExtracted(result.text, result.confidence);

      // Check for pattern match if patterns exist
      if (patterns.length > 0) {
        const match = matchTagPattern(result.text, patterns);
        if (match && onPatternMatch) {
          log('OCRProcessing', 'Pattern matched', { pattern: match.pattern.prefix });
          onPatternMatch(match);
        }
      }
    } catch (err) {
      error('OCRProcessing', 'Failed to process annotation', err);
      onError?.(err instanceof Error ? err.message : 'OCR processing failed');
    } finally {
      setProcessing(false);
    }
  }, [onTextExtracted, onPatternMatch, onError]);

  return {
    processing,
    processAnnotation
  };
}