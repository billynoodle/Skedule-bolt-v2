import { fabric } from 'fabric';
import { log } from '../../../utils/logger';
import { Point } from '../types';

export class TransformManager {
  constructor(private canvas: fabric.Canvas) {
    log('TransformManager', 'Initialized');
  }

  updateTransform(scale: number, rotation: number): void {
    const matrix = this.calculateTransformMatrix(scale, rotation);
    this.canvas.setViewportTransform(matrix);
    this.updateObjectsScale(scale);
    
    log('TransformManager', 'Transform updated', { scale, rotation });
  }

  toCanvasCoordinates(point: Point, scale: number): Point {
    return {
      x: point.x * scale,
      y: point.y * scale
    };
  }

  toDocumentCoordinates(point: Point, scale: number): Point {
    return {
      x: point.x / scale,
      y: point.y / scale
    };
  }

  private calculateTransformMatrix(scale: number, rotation: number): number[] {
    const rad = (rotation * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    
    return [
      cos * scale, sin * scale,
      -sin * scale, cos * scale,
      0, 0
    ];
  }

  private updateObjectsScale(scale: number): void {
    this.canvas.getObjects().forEach(obj => {
      if (obj.type === 'annotation') {
        obj.set({
          strokeWidth: 2 / scale,
          cornerSize: 8 / scale
        });
      }
    });
    this.canvas.requestRenderAll();
  }
}