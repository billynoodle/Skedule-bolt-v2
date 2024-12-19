import { fabric } from 'fabric';
import { log } from '../../../../utils/logger';

export interface CanvasConfig {
  width: number;
  height: number;
  mode: 'select' | 'draw';
  scale: number;
  rotation: number;
}

export function initializeCanvas(canvasElement: HTMLCanvasElement): fabric.Canvas {
  const canvas = new fabric.Canvas(canvasElement, {
    selection: true,
    preserveObjectStacking: true,
    renderOnAddRemove: true,
    enableRetinaScaling: true,
    stopContextMenu: true,
    fireRightClick: true,
    allowTouchScrolling: false,
    uniformScaling: false,
    centeredScaling: true,
    centeredRotation: true
  });

  log('CanvasSetup', 'Canvas initialized');
  return canvas;
}

export function updateCanvasConfig(canvas: fabric.Canvas, config: CanvasConfig) {
  const { width, height, scale, rotation, mode } = config;

  // Set canvas dimensions
  canvas.setDimensions({
    width: width * scale,
    height: height * scale
  });

  // Update canvas interaction settings
  canvas.selection = mode === 'select';
  canvas.defaultCursor = mode === 'draw' ? 'crosshair' : 'default';
  canvas.hoverCursor = mode === 'draw' ? 'crosshair' : 'move';

  // Update all objects on canvas
  canvas.getObjects().forEach(obj => {
    obj.set({
      selectable: mode === 'select',
      evented: mode === 'select',
      hasControls: mode === 'select',
      hasBorders: mode === 'select'
    });
  });

  canvas.renderAll();

  log('CanvasSetup', 'Canvas configuration updated', {
    dimensions: { width: width * scale, height: height * scale },
    scale,
    rotation,
    mode
  });
}