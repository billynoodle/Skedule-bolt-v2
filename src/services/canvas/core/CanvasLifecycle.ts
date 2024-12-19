import { fabric } from 'fabric';
import { log } from '../../../utils/logger';

export class CanvasLifecycle {
  private static instances = new Map<string, fabric.Canvas>();

  static register(id: string, canvas: fabric.Canvas): void {
    this.instances.set(id, canvas);
    log('CanvasLifecycle', 'Canvas registered', { id });
  }

  static unregister(id: string): void {
    const canvas = this.instances.get(id);
    if (canvas) {
      canvas.dispose();
      this.instances.delete(id);
      log('CanvasLifecycle', 'Canvas unregistered', { id });
    }
  }

  static get(id: string): fabric.Canvas | undefined {
    return this.instances.get(id);
  }

  static disposeAll(): void {
    this.instances.forEach((canvas, id) => {
      canvas.dispose();
      log('CanvasLifecycle', 'Canvas disposed', { id });
    });
    this.instances.clear();
  }
}