import { createWorker } from 'tesseract.js';
import { OcrResult } from '../../types/ocr';
import { error, log } from '../../utils/logger';

let worker: Tesseract.Worker | null = null;

async function initializeWorker() {
  if (!worker) {
    worker = await createWorker({
      logger: process.env.NODE_ENV === 'development',
      errorHandler: (error: any) => {
        console.error('Tesseract worker error:', error);
      }
    });
    
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    await worker.setParameters({
      tessedit_char_whitelist: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ-',
      tessedit_pageseg_mode: '7',
    });
  }
  return worker;
}

export async function recognizeText(imageData: ImageData): Promise<OcrResult> {
  try {
    const ocrWorker = await initializeWorker();
    const base64Image = imageDataToBase64(imageData);
    const result = await ocrWorker.recognize(base64Image);
    
    log('OCRProcessor', 'Text recognized', { confidence: result.data.confidence });
    
    return {
      text: result.data.text.trim(),
      confidence: result.data.confidence,
      bbox: result.data.words[0]?.bbox || { x0: 0, y0: 0, x1: 0, y1: 0 }
    };
  } catch (err) {
    error('OCRProcessor', 'Failed to process image', err);
    throw new Error('Failed to process image');
  }
}

export async function cleanup() {
  if (worker) {
    await worker.terminate();
    worker = null;
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