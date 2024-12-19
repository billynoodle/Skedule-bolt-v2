import { fabric } from 'fabric';
import { CanvasContext } from '../core/CanvasContext';
import { log } from '../../../utils/logger';

export class EventManager {
  private canvas: fabric.Canvas | null = null;
  private handlers: Map<string, Function[]> = new Map();

  constructor(canvas: fabric.Canvas | null) {
    this.canvas = canvas;
  }

  on(eventName: string, handler: Function): void {
    CanvasContext.withContext(this.canvas, (canvas) => {
      canvas.on(eventName, handler as any);
      
      const eventHandlers = this.handlers.get(eventName) || [];
      eventHandlers.push(handler);
      this.handlers.set(eventName, eventHandlers);
      
      log('EventManager', 'Event handler added', { eventName });
    });
  }

  off(eventName: string, handler?: Function): void {
    CanvasContext.withContext(this.canvas, (canvas) => {
      if (handler) {
        canvas.off(eventName, handler as any);
        const eventHandlers = this.handlers.get(eventName) || [];
        this.handlers.set(
          eventName,
          eventHandlers.filter(h => h !== handler)
        );
      } else {
        canvas.off(eventName);
        this.handlers.delete(eventName);
      }
      
      log('EventManager', 'Event handler(s) removed', { eventName });
    });
  }

  clearAllHandlers(): void {
    CanvasContext.withContext(this.canvas, (canvas) => {
      this.handlers.forEach((_, eventName) => {
        canvas.off(eventName);
      });
      this.handlers.clear();
      log('EventManager', 'All event handlers cleared');
    });
  }
}