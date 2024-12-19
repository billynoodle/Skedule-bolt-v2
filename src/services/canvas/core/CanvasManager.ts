import { fabric } from 'fabric';
import { log, error } from '../../../utils/logger';
import { CanvasConfig } from '../types';

export class CanvasManager {
  private canvas: fabric.Canvas | null = null;
  private readonly instances = new Map<string, fabric.Canvas>();

  initialize(element: HTMLCanvasElement, config: CanvasConfig): fabric.Canvas {
    try {
      this.canvas = new fabric.Canvas(element, {
        width: config.width,
        height: config.height,
        selection: config.mode === 'select',
        preserveObjectStacking: true,
        renderOnAddRemove: true,
        enableRetinaScaling: true
      });

      const id = crypto.randomUUID();
      this.instances.set(id, this.canvas);
      
      log('CanvasManager', 'Canvas initialized', { id, config });
      return this.canvas;
    } catch (err) {
      error('CanvasManager', 'Failed to initialize canvas', err);
      throw err;
    }
  }

  updateConfig(config: Partial<CanvasConfig>): void {
    if (!this.canvas) return;

    try {
      if (config.width || config.height) {
        this.canvas.setDimensions({
          width: config.width,
          height: config.height
        });
      }

      if (config.mode) {
        this.canvas.selection = config.mode === 'select';
        this.updateObjectsInteractivity(config.mode === 'select');
      }

      this.canvas.requestRenderAll();
      log('CanvasManager', 'Canvas config updated', config);
    } catch (err) {
      error('CanvasManager', 'Failed to update canvas config', err);
    }
  }

  private updateObjectsInteractivity(selectable: boolean): void {
    if (!this.canvas) return;
    
    this.canvas.getObjects().forEach(obj => {
      obj.set({
        selectable,
        evented: selectable,
        hasControls: selectable,
        hasBorders: selectable
      });
    });
  }

  dispose(id?: string): void {
    if (id) {
      const canvas = this.instances.get(id);
      if (canvas) {
        canvas.dispose();
        this.instances.delete(id);
        log('CanvasManager', 'Canvas instance disposed', { id });
      }
    } else {
      this.instances.forEach((canvas, id) => {
        canvas.dispose();
        this.instances.delete(id);
      });
      log('CanvasManager', 'All canvas instances disposed');
    }
  }
}