import { OCRWorker } from './OCRWorker';
import { OCRConfig, OCRResult } from '../types';
import { log } from '../../../utils/logger';

export class OCRProcessor {
  private config: OCRConfig;

  constructor(config: OCRConfig) {
    this.config = config;
  }

  async processImage(imageData: ImageData): Promise<OCRResult> {
    try {
      const worker = await OCRWorker.getInstance(this.config);
      const base64Image = this.imageDataToBase64(imageData);
      const result = await worker.recognize(base64Image);

      const ocrResult: OCRResult = {
        text: result.data.text.trim(),
        confidence: result.data.confidence,
        bbox: result.data.words[0]?.bbox || { x0: 0, y0: 0, x1: 0, y1: 0 }
      };

      log('OCRProcessor', 'Text recognized', { 
        confidence: ocrResult.confidence,
        text: ocrResult.text
      });

      return ocrResult;
    } catch (err) {
      log('OCRProcessor', 'Failed to process image', err);
      throw err;
    }
  }

  private imageDataToBase64(imageData: ImageData): string {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');

    canvas.width = imageData.width;
    canvas.height = imageData.height;
    ctx.putImageData(imageData, 0, 0);

    return canvas.toDataURL('image/png');
  }

  async dispose(): Promise<void> {
    await OCRWorker.terminate();
  }
}