import { fabric } from 'fabric';
import { log } from '../../../utils/logger';
import { CanvasConfig } from '../types';

export class CanvasCore {
  private canvas: fabric.Canvas | null = null;
  private config: CanvasConfig;

  constructor(config: CanvasConfig) {
    this.config = config;
  }

  initialize(element: HTMLCanvasElement): fabric.Canvas {
    if (!element) {
      throw new Error('Canvas element is required');
    }

    // Clean up existing canvas first
    this.dispose();

    try {
      this.canvas = new fabric.Canvas(element, {
        width: this.config.width,
        height: this.config.height,
        selection: this.config.mode === 'select',
        preserveObjectStacking: true,
        renderOnAddRemove: true,
        enableRetinaScaling: true
      });

      log('CanvasCore', 'Canvas initialized', { 
        width: this.config.width, 
        height: this.config.height,
        mode: this.config.mode
      });

      return this.canvas;
    } catch (err) {
      log('CanvasCore', 'Failed to initialize canvas', err);
      throw err;
    }
  }

  dispose(): void {
    if (this.canvas) {
      try {
        this.canvas.dispose();
        this.canvas = null;
        log('CanvasCore', 'Canvas disposed successfully');
      } catch (err) {
        log('CanvasCore', 'Error disposing canvas', err);
      }
    }
  }

  getCanvas(): fabric.Canvas | null {
    return this.canvas;
  }

  isInitialized(): boolean {
    return this.canvas !== null;
  }
}