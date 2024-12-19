import { fabric } from 'fabric';
import { log } from '../../../utils/logger';

export class CanvasContext {
  static ensureContext(canvas: fabric.Canvas | null): fabric.Canvas {
    if (!canvas) {
      throw new Error('Canvas is not initialized');
    }

    const context = canvas.getContext();
    if (!context) {
      throw new Error('Canvas context is not available');
    }

    return canvas;
  }

  static withContext<T>(
    canvas: fabric.Canvas | null, 
    operation: (canvas: fabric.Canvas) => T,
    errorHandler?: (error: Error) => void
  ): T | null {
    try {
      const validCanvas = this.ensureContext(canvas);
      return operation(validCanvas);
    } catch (err) {
      log('CanvasContext', 'Operation failed', err);
      errorHandler?.(err as Error);
      return null;
    }
  }
}