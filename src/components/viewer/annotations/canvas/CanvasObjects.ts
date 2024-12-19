import { fabric } from 'fabric';
import { log } from '../../../../utils/logger';

export interface RectOptions extends fabric.IRectOptions {
  id?: string;
}

export function createRect(scale: number, options: RectOptions = {}) {
  const rect = new fabric.Rect({
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

  // Ensure corners scale properly with document
  rect.setControlsVisibility({
    mtr: false, // Disable rotation control
    ml: true,
    mr: true,
    mt: true,
    mb: true,
    tl: true,
    tr: true,
    bl: true,
    br: true
  });

  return rect;
}

export function updateRectScale(rect: fabric.Rect, scale: number) {
  rect.set({
    strokeWidth: 2 / scale,
    cornerSize: 8 / scale
  });
}

export function scaleRect(rect: fabric.Rect, scale: number, position: any) {
  // Convert position to canvas coordinates
  const scaledPosition = {
    left: position.left * scale,
    top: position.top * scale,
    width: position.width * scale,
    height: position.height * scale,
    angle: position.angle || 0
  };

  rect.set(scaledPosition);
  updateRectScale(rect, scale);

  log('CanvasObjects', 'Scaled rectangle', { 
    scale, 
    originalPosition: position,
    scaledPosition 
  });
}