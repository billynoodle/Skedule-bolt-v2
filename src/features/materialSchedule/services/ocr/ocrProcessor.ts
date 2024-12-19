import { createWorker } from 'tesseract.js';
import { OcrConfig, OcrResult } from './types';
import { log, error } from '../../../../utils/logger';

let worker: Tesseract.Worker | null = null;

const DEFAULT_CONFIG: OcrConfig = {
  language: 'eng',
  mode: 'single-line',
  confidence: 60,
  whitelist: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ-'
};

async function initializeWorker(config: OcrConfig = DEFAULT_CONFIG) {
  if (!worker) {
    worker = await createWorker({
      logger: process.env.NODE_ENV === 'development',
      errorHandler: (err: any) => {
        error('OCR', 'Tesseract worker error', err);
      }
    });
    
    await worker.loadLanguage(config.language || 'eng');
    await worker.initialize(config.language || 'eng');
    await worker.setParameters({
      tessedit_char_whitelist: config.whitelist,
      tessedit_pageseg_mode: config.mode === 'single-line' ? '7' : '3'
    });

    log('OCR', 'Worker initialized', { config });
  }
  return worker;
}

export async function recognizeText(
  imageData: ImageData, 
  config: OcrConfig = DEFAULT_CONFIG
): Promise<OcrResult> {
  try {
    const ocrWorker = await initializeWorker(config);
    const base64Image = imageDataToBase64(imageData);
    
    const result = await ocrWorker.recognize(base64Image);
    
    // Filter results based on confidence threshold
    const words = result.data.words
      .filter(word => word.confidence >= (config.confidence || 0))
      .map(word => ({
        text: word.text.trim(),
        confidence: word.confidence,
        bbox: word.bbox
      }));

    const response: OcrResult = {
      text: result.data.text.trim(),
      confidence: result.data.confidence,
      bbox: result.data.words[0]?.bbox || { x0: 0, y0: 0, x1: 0, y1: 0 },
      words
    };

    log('OCR', 'Text recognized', { 
      confidence: response.confidence,
      wordCount: words.length 
    });

    return response;
  } catch (err) {
    error('OCR', 'Failed to process image', err);
    throw new Error('Failed to process image');
  }
}

export async function cleanup() {
  if (worker) {
    await worker.terminate();
    worker = null;
    log('OCR', 'Worker terminated');
  }
}

function imageDataToBase64(imageData: ImageData): string {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');
  
  canvas.width = imageData.width;
  canvas.height = imageData.height;
  ctx.putImageData(imageData, 0, 0);
  
  return canvas.toDataURL('image/png');
}