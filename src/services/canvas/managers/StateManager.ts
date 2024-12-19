import { fabric } from 'fabric';
import { CanvasContext } from '../core/CanvasContext';
import { ContextGuard } from '../utils/ContextGuard';
import { log } from '../../../utils/logger';

export class StateManager {
  private canvas: fabric.Canvas | null = null;
  private initialized = false;

  constructor(canvas: fabric.Canvas | null) {
    this.canvas = canvas;
    this.initialize();
  }

  private initialize(): void {
    if (!this.canvas || this.initialized) return;

    try {
      ContextGuard.assertContext(this.canvas);
      this.initialized = true;
      log('StateManager', 'Initialized successfully');
    } catch (err) {
      log('StateManager', 'Failed to initialize', err);
    }
  }

  updateObjects(callback: (obj: fabric.Object) => void): void {
    if (!this.initialized || !this.canvas) {
      log('StateManager', 'Cannot update objects - manager not initialized');
      return;
    }

    try {
      const objects = this.canvas.getObjects();
      objects.forEach(callback);
      
      if (this.canvas.contextContainer) {
        this.canvas.requestRenderAll();
        log('StateManager', 'Objects updated successfully');
      }
    } catch (err) {
      log('StateManager', 'Failed to update objects', err);
    }
  }

  setObjectState(
    id: string, 
    state: Partial<fabric.IObjectOptions>
  ): void {
    if (!this.initialized || !this.canvas) {
      log('StateManager', 'Cannot set object state - manager not initialized');
      return;
    }

    try {
      const obj = this.canvas.getObjects().find(o => o.id === id);
      if (obj) {
        obj.set(state);
        if (this.canvas.contextContainer) {
          this.canvas.requestRenderAll();
          log('StateManager', 'Object state updated', { id });
        }
      }
    } catch (err) {
      log('StateManager', 'Failed to set object state', err);
    }
  }

  clearState(): void {
    if (!this.initialized || !this.canvas) {
      log('StateManager', 'Cannot clear state - manager not initialized');
      return;
    }

    try {
      this.canvas.clear();
      if (this.canvas.contextContainer) {
        this.canvas.requestRenderAll();
        log('StateManager', 'Canvas state cleared successfully');
      }
    } catch (err) {
      log('StateManager', 'Failed to clear state', err);
    }
  }

  isValid(): boolean {
    return this.initialized && ContextGuard.isCanvasValid(this.canvas);
  }

  dispose(): void {
    this.canvas = null;
    this.initialized = false;
    log('StateManager', 'Disposed');
  }
}