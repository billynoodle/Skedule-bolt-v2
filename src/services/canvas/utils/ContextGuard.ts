import { fabric } from 'fabric';

export class ContextGuard {
  static assertCanvas(canvas: fabric.Canvas | null): asserts canvas is fabric.Canvas {
    if (!canvas) {
      throw new Error('Canvas is not initialized');
    }
  }

  static assertContext(canvas: fabric.Canvas | null): void {
    this.assertCanvas(canvas);
    if (!canvas.getContext()) {
      throw new Error('Canvas context is not available');
    }
  }

  static isCanvasValid(canvas: fabric.Canvas | null): boolean {
    if (!canvas) return false;
    try {
      this.assertContext(canvas);
      return true;
    } catch {
      return false;
    }
  }
}