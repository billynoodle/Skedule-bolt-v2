import { fabric } from 'fabric';
import { CanvasContext } from '../core/CanvasContext';
import { log } from '../../../utils/logger';

export class RenderManager {
  private canvas: fabric.Canvas | null = null;
  private renderQueue: (() => void)[] = [];
  private isRendering = false;

  constructor(canvas: fabric.Canvas | null) {
    this.canvas = canvas;
  }

  queueRender(operation: () => void): void {
    this.renderQueue.push(operation);
    this.processQueue();
  }

  private async processQueue(): Promise<void> {
    if (this.isRendering || this.renderQueue.length === 0) return;

    this.isRendering = true;

    try {
      CanvasContext.withContext(this.canvas, (canvas) => {
        while (this.renderQueue.length > 0) {
          const operation = this.renderQueue.shift();
          operation?.();
        }
        canvas.renderAll();
        log('RenderManager', 'Render queue processed');
      });
    } finally {
      this.isRendering = false;
    }
  }

  requestRender(): void {
    CanvasContext.withContext(this.canvas, (canvas) => {
      canvas.requestRenderAll();
      log('RenderManager', 'Render requested');
    });
  }

  cancelRender(): void {
    this.renderQueue = [];
    log('RenderManager', 'Render queue cleared');
  }
}