import { useEffect } from 'react';
import { fabric } from 'fabric';
import { createAnnotationRect } from '../../../../services/canvas';
import { log } from '../../../../utils/logger';

interface DrawingManagerProps {
  canvas: fabric.Canvas;
  mode: 'select' | 'draw';
  scale: number;
}

export function DrawingManager({ canvas, mode, scale }: DrawingManagerProps) {
  useEffect(() => {
    canvas.isDrawingMode = mode === 'draw';
    canvas.selection = mode === 'select';
    canvas.defaultCursor = mode === 'draw' ? 'crosshair' : 'default';

    const objects = canvas.getObjects();
    objects.forEach(obj => {
      if (obj instanceof fabric.Rect) {
        obj.set({
          selectable: mode === 'select',
          evented: mode === 'select',
          hasControls: mode === 'select',
          hasBorders: mode === 'select'
        });
      }
    });

    canvas.renderAll();
    log('DrawingManager', 'Drawing mode updated', { mode });
  }, [canvas, mode]);

  return null;
}