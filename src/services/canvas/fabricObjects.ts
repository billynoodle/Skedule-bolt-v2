import { fabric } from 'fabric';

export interface RectConfig extends fabric.IRectOptions {
  id?: string;
  scale?: number;
}

export function createAnnotationRect(scale: number = 1, options: RectConfig = {}): fabric.Rect {
  return new fabric.Rect({
    fill: 'rgba(37, 99, 235, 0.1)',
    stroke: '#2563eb',
    strokeWidth: 2 / scale,
    cornerStyle: 'circle',
    cornerSize: 8 / scale,
    transparentCorners: false,
    cornerColor: '#2563eb',
    borderColor: '#2563eb',
    borderScaleFactor: 2,
    padding: 0,
    hasRotatingPoint: false,
    lockUniScaling: true,
    ...options
  });
}

export function updateRectScale(rect: fabric.Rect, scale: number): void {
  rect.set({
    strokeWidth: 2 / scale,
    cornerSize: 8 / scale
  });
}

export function scaleRect(rect: fabric.Rect, scale: number, position: any): void {
  const scaledPosition = {
    left: position.left * scale,
    top: position.top * scale,
    width: position.width * scale,
    height: position.height * scale,
    angle: position.angle || 0
  };

  rect.set(scaledPosition);
  updateRectScale(rect, scale);
}