import { createWorker } from 'tesseract.js';
import { OCRConfig } from '../types';
import { log } from '../../../utils/logger';

export class OCRWorker {
  private static instance: Tesseract.Worker | null = null;
  private static isInitializing = false;
  private static initPromise: Promise<void> | null = null;

  static async getInstance(config: OCRConfig): Promise<Tesseract.Worker> {
    if (!this.instance && !this.isInitializing) {
      this.isInitializing = true;
      this.initPromise = this.initialize(config);
    }

    if (this.initPromise) {
      await this.initPromise;
    }

    if (!this.instance) {
      throw new Error('Failed to initialize OCR worker');
    }

    return this.instance;
  }

  private static async initialize(config: OCRConfig): Promise<void> {
    try {
      // Create worker without logger to avoid cloning issues
      const worker = await createWorker();
      
      // Configure worker
      await worker.loadLanguage(config.language);
      await worker.initialize(config.language);
      await worker.setParameters({
        tessedit_char_whitelist: config.whitelist,
        tessedit_pageseg_mode: config.mode === 'single-line' ? '7' : '3'
      });

      this.instance = worker;
      log('OCRWorker', 'Worker initialized successfully');
    } catch (err) {
      log('OCRWorker', 'Failed to initialize worker', err);
      throw err;
    } finally {
      this.isInitializing = false;
      this.initPromise = null;
    }
  }

  static async terminate(): Promise<void> {
    if (this.instance) {
      await this.instance.terminate();
      this.instance = null;
      log('OCRWorker', 'Worker terminated');
    }
  }
}