import { fabric } from 'fabric';
import { log } from '../../../utils/logger';

export function createRect(scale: number, options: fabric.IRectOptions = {}) {
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

  // Configure controls
  rect.setControlsVisibility({
    mtr: false,
    ml: true,
    mr: true,
    mt: true,
    mb: true,
    tl: true,
    tr: true,
    bl: true,
    br: true
  });

  log('FabricHelpers', 'Created rectangle', {
    id: options.id || 'new',
    dimensions: {
      width: rect.width,
      height: rect.height,
      left: rect.left,
      top: rect.top
    }
  });

  return rect;
}

export function updateRectScale(rect: fabric.Rect, scale: number) {
  rect.set({
    strokeWidth: 2 / scale,
    cornerSize: 8 / scale
  });
}

export function getRectDimensions(rect: fabric.Rect, scale: number) {
  return {
    left: rect.left! / scale,
    top: rect.top! / scale,
    width: rect.width! / scale,
    height: rect.height! / scale,
    angle: rect.angle || 0
  };
}