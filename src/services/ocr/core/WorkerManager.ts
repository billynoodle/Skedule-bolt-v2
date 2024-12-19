import { createWorker } from 'tesseract.js';
import { OCRConfig } from '../types';
import { log } from '../../../utils/logger';

export class WorkerManager {
  private static instance: WorkerManager | null = null;
  private worker: Tesseract.Worker | null = null;
  private isInitializing = false;
  private initPromise: Promise<void> | null = null;

  private constructor() {}

  static getInstance(): WorkerManager {
    if (!this.instance) {
      this.instance = new WorkerManager();
    }
    return this.instance;
  }

  async getWorker(config: OCRConfig): Promise<Tesseract.Worker> {
    if (!this.worker && !this.isInitializing) {
      this.isInitializing = true;
      this.initPromise = this.initialize(config);
    }

    if (this.initPromise) {
      await this.initPromise;
    }

    if (!this.worker) {
      throw new Error('Failed to initialize OCR worker');
    }

    return this.worker;
  }

  private async initialize(config: OCRConfig): Promise<void> {
    try {
      // Create worker with minimal options to avoid cloning issues
      this.worker = await createWorker({
        logger: m => log('OCRWorker', 'Progress', { status: m.status }),
        errorHandler: m => log('OCRWorker', 'Error', { error: m })
      });
      
      // Configure worker
      await this.worker.loadLanguage(config.language);
      await this.worker.initialize(config.language);
      await this.worker.setParameters({
        tessedit_char_whitelist: config.whitelist,
        tessedit_pageseg_mode: config.mode === 'single-line' ? '7' : '3'
      });

      log('WorkerManager', 'Worker initialized successfully');
    } catch (err) {
      log('WorkerManager', 'Failed to initialize worker', err);
      throw err;
    } finally {
      this.isInitializing = false;
      this.initPromise = null;
    }
  }

  async terminate(): Promise<void> {
    if (this.worker) {
      await this.worker.terminate();
      this.worker = null;
      log('WorkerManager', 'Worker terminated');
    }
  }
}