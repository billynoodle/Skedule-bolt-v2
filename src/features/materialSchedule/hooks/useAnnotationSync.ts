import { useEffect } from 'react';
import { fabric } from 'fabric';
import { Annotation } from '../types/annotations';
import { createRect } from '../utils/fabricHelpers';
import { log } from '../../../utils/logger';

interface UseAnnotationSyncProps {
  canvas: fabric.Canvas | null;
  annotations: Annotation[];
  scale: number;
  mode: 'select' | 'draw';
}

export function useAnnotationSync({
  canvas,
  annotations,
  scale,
  mode
}: UseAnnotationSyncProps) {
  useEffect(() => {
    if (!canvas) return;

    // Clear existing objects
    canvas.clear();

    // Add annotations
    annotations.forEach(annotation => {
      const rect = createRect(scale, {
        left: annotation.position.left * scale,
        top: annotation.position.top * scale,
        width: annotation.position.width * scale,
        height: annotation.position.height * scale,
        angle: annotation.position.angle,
        id: annotation.id,
        selectable: mode === 'select',
        evented: mode === 'select'
      });

      canvas.add(rect);
    });

    canvas.renderAll();
    log('AnnotationSync', 'Synced annotations', { count: annotations.length });
  }, [canvas, annotations, scale, mode]);
}