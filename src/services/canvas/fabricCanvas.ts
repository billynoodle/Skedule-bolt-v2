import { fabric } from 'fabric';
import { log } from '../../utils/logger';

interface CanvasConfig {
  width: number;
  height: number;
  mode: 'select' | 'draw';
  scale: number;
  rotation: number;
}

export function initializeCanvas(element: HTMLCanvasElement): fabric.Canvas {
  const canvas = new fabric.Canvas(element, {
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

  log('FabricCanvas', 'Canvas initialized');
  return canvas;
}

export function updateCanvasConfig(canvas: fabric.Canvas, config: CanvasConfig): void {
  const { width, height, scale, mode } = config;

  canvas.setDimensions({
    width: width * scale,
    height: height * scale
  });

  canvas.selection = mode === 'select';
  canvas.defaultCursor = mode === 'draw' ? 'crosshair' : 'default';
  canvas.hoverCursor = mode === 'draw' ? 'crosshair' : 'move';

  canvas.getObjects().forEach(obj => {
    obj.set({
      selectable: mode === 'select',
      evented: mode === 'select',
      hasControls: mode === 'select',
      hasBorders: mode === 'select'
    });
  });

  canvas.renderAll();
  log('FabricCanvas', 'Canvas configuration updated', { dimensions: { width: width * scale, height: height * scale }, mode });
}

export function disposeCanvas(canvas: fabric.Canvas): void {
  if (canvas) {
    canvas.dispose();
    log('FabricCanvas', 'Canvas disposed');
  }
}