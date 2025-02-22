import { fabric } from 'fabric';
import { ViewportTransform } from '../../../../../services/canvas/viewportTransform';
import { log } from '../../../../../utils/logger';

export interface CanvasConfig {
  width: number;
  height: number;
  mode: 'select' | 'draw';
  transform: ViewportTransform;
}

export class CanvasManager {
  private canvas: fabric.Canvas | null = null;
  private config: CanvasConfig;
  private disposed = false;

  constructor(config: CanvasConfig) {
    this.config = config;
  }

  initialize(element: HTMLCanvasElement): fabric.Canvas {
    if (this.disposed) {
      throw new Error('Cannot initialize disposed CanvasManager');
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
        enableRetinaScaling: true,
        stopContextMenu: true,
        fireRightClick: true,
        allowTouchScrolling: false
      });

      // Apply viewport transform
      if (this.canvas && this.config.transform) {
        this.canvas.setViewportTransform(this.config.transform.getMatrixValues());
      }

      log('CanvasManager', 'Canvas initialized', { 
        width: this.config.width, 
        height: this.config.height,
        mode: this.config.mode
      });

      return this.canvas;
    } catch (err) {
      log('CanvasManager', 'Failed to initialize canvas', err);
      this.dispose();
      throw err;
    }
  }

  dispose(): void {
    if (this.canvas && !this.disposed) {
      try {
        // Remove all event listeners first
        this.canvas.off();
        
        // Clear all objects
        this.canvas.clear();
        
        // Dispose the canvas
        this.canvas.dispose();
        
        log('CanvasManager', 'Canvas disposed successfully');
      } catch (err) {
        log('CanvasManager', 'Error disposing canvas', err);
      } finally {
        this.canvas = null;
        this.disposed = true;
      }
    }
  }

  updateConfig(config: Partial<CanvasConfig>): void {
    if (this.disposed) {
      throw new Error('Cannot update disposed CanvasManager');
    }

    this.config = { ...this.config, ...config };
    
    if (this.canvas) {
      try {
        if (config.width || config.height) {
          this.canvas.setDimensions({
            width: this.config.width,
            height: this.config.height
          });
        }

        if (config.mode) {
          this.canvas.selection = config.mode === 'select';
          this.canvas.defaultCursor = config.mode === 'draw' ? 'crosshair' : 'default';
          
          this.canvas.getObjects().forEach(obj => {
            obj.set({
              selectable: config.mode === 'select',
              evented: config.mode === 'select',
              hasControls: config.mode === 'select',
              hasBorders: config.mode === 'select'
            });
          });
        }

        if (config.transform) {
          this.canvas.setViewportTransform(config.transform.getMatrixValues());
        }

        this.canvas.requestRenderAll();
        log('CanvasManager', 'Canvas config updated', config);
      } catch (err) {
        log('CanvasManager', 'Failed to update canvas config', err);
        throw err;
      }
    }
  }

  getCanvas(): fabric.Canvas | null {
    if (this.disposed) {
      return null;
    }
    return this.canvas;
  }

  isDisposed(): boolean {
    return this.disposed;
  }
}