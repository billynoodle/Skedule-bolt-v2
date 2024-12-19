import { createWorker } from 'tesseract.js';
import { OcrResult, TagPattern, TagPatternMatch } from '../types/ocr';

let worker: Tesseract.Worker | null = null;

async function initializeWorker() {
  if (!worker) {
    worker = await createWorker({
      // Instead of passing a function, use a boolean to control logging
      logger: process.env.NODE_ENV === 'development',
      errorHandler: (error: any) => {
        console.error('Tesseract worker error:', error);
      }
    });
    
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    await worker.setParameters({
      tessedit_char_whitelist: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ-',
      tessedit_pageseg_mode: '7', // Treat image as a single text line
    });
  }
  return worker;
}

export async function recognizeText(imageData: ImageData): Promise<OcrResult> {
  try {
    const ocrWorker = await initializeWorker();
    
    // Convert ImageData to base64
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');
    
    canvas.width = imageData.width;
    canvas.height = imageData.height;
    ctx.putImageData(imageData, 0, 0);
    
    const base64Image = canvas.toDataURL('image/png');
    
    const result = await ocrWorker.recognize(base64Image);
    
    return {
      text: result.data.text.trim(),
      confidence: result.data.confidence,
      bbox: result.data.words[0]?.bbox || { x0: 0, y0: 0, x1: 0, y1: 0 }
    };
  } catch (error) {
    console.error('OCR error:', error);
    throw new Error('Failed to process image');
  }
}

export function matchTagPattern(text: string, patterns: TagPattern[]): TagPatternMatch | null {
  const cleanText = text.trim().toUpperCase();
  
  for (const pattern of patterns) {
    const prefix = pattern.prefix.toUpperCase();
    if (cleanText.startsWith(prefix)) {
      const confidence = (prefix.length / cleanText.length) * 100;
      return {
        pattern,
        confidence,
        text: cleanText
      };
    }
  }
  return null;
}

export async function cleanup() {
  if (worker) {
    await worker.terminate();
    worker = null;
  }
}