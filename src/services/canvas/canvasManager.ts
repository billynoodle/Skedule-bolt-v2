import { fabric } from 'fabric';
import { ViewportTransform } from './viewportTransform';
import { log } from '../../utils/logger';

export interface CanvasConfig {
  width: number;
  height: number;
  mode: 'select' | 'draw';
  transform: ViewportTransform;
}

export class CanvasManager {
  private canvas: fabric.Canvas | null = null;
  private config: CanvasConfig;

  constructor(config: CanvasConfig) {
    this.config = config;
  }

  initialize(element: HTMLCanvasElement): fabric.Canvas {
    // Clean up existing canvas first
    this.dispose();

    // Create new canvas with proper context
    const ctx = element.getContext('2d');
    if (!ctx) {
      throw new Error('Could not get canvas context');
    }

    this.canvas = new fabric.Canvas(element, {
      width: this.config.width,
      height: this.config.height,
      selection: this.config.mode === 'select',
      preserveObjectStacking: true,
      renderOnAddRemove: true,
      enableRetinaScaling: true
    });

    // Apply viewport transform
    this.canvas.setViewportTransform(this.config.transform.getMatrixValues());

    log('CanvasManager', 'Canvas initialized', { 
      width: this.config.width, 
      height: this.config.height,
      mode: this.config.mode,
      transform: this.config.transform.getMatrixValues()
    });

    return this.canvas;
  }

  dispose(): void {
    if (this.canvas) {
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
      }
    }
  }

  updateConfig(config: Partial<CanvasConfig>): void {
    this.config = { ...this.config, ...config };
    
    if (this.canvas) {
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
    }
  }

  getCanvas(): fabric.Canvas | null {
    return this.canvas;
  }
}