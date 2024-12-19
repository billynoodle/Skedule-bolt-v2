import { useEffect } from 'react';
import { fabric } from 'fabric';
import { createRect, scaleRect } from '../canvas/CanvasObjects';
import { log } from '../../../../utils/logger';

interface UseCanvasSyncProps {
  canvas: fabric.Canvas | null;
  annotations: any[];
  scale: number;
  mode: 'select' | 'draw';
  hoveredId: string | null;
  hoveredPatternId: string | null;
}

export function useCanvasSync({
  canvas,
  annotations,
  scale,
  mode,
  hoveredId,
  hoveredPatternId
}: UseCanvasSyncProps) {
  // Sync annotations
  useEffect(() => {
    if (!canvas) return;

    canvas.clear();

    annotations.forEach(annotation => {
      const rect = createRect(scale, {
        left: annotation.position.left * scale,
        top: annotation.position.top * scale,
        width: annotation.position.width * scale,
        height: annotation.position.height * scale,
        angle: annotation.position.angle,
        selectable: mode === 'select',
        evented: mode === 'select',
        hasControls: mode === 'select',
        hasBorders: mode === 'select',
        id: annotation.id
      });

      canvas.add(rect);
    });

    canvas.renderAll();
    log('CanvasSync', 'Synced annotations', { count: annotations.length });
  }, [canvas, annotations, scale, mode]);

  // Handle hover states
  useEffect(() => {
    if (!canvas) return;

    canvas.getObjects().forEach((obj: any) => {
      const annotation = annotations.find(a => a.id === obj.id);
      if (!annotation) return;

      if (hoveredId === obj.id || (hoveredPatternId && annotation.tagPatternId === hoveredPatternId)) {
        obj.set({
          stroke: '#2563eb',
          strokeWidth: 3,
          opacity: 1
        });
      } else {
        obj.set({
          stroke: '#2563eb',
          strokeWidth: 2,
          opacity: annotation.tagPatternId ? 1 : 0.5
        });
      }
    });

    canvas.renderAll();
  }, [canvas, hoveredId, hoveredPatternId, annotations]);

  return null;
}