import React, { useRef, useCallback } from 'react';
import { fabric } from 'fabric';
import { useViewerStore } from '../../../../../stores/viewerStore';
import { useAnnotationStore } from '../../../../../stores/annotationStore';
import { log } from '../../../../../utils/logger';

interface DrawingManagerProps {
  canvas: fabric.Canvas | null;
  jobId: string;
  documentId: string;
  onComplete?: () => void;
}

export function DrawingManager({
  canvas,
  jobId,
  documentId,
  onComplete
}: DrawingManagerProps) {
  const drawingRef = useRef({
    isDrawing: false,
    startPoint: null as fabric.Point | null,
    activeRect: null as fabric.Rect | null
  });

  const { mode } = useViewerStore();
  const { addAnnotation } = useAnnotationStore();

  const createRect = useCallback((options: fabric.IRectOptions = {}) => {
    return new fabric.Rect({
      fill: 'rgba(37, 99, 235, 0.1)',
      stroke: '#2563eb',
      strokeWidth: 2,
      cornerStyle: 'circle',
      cornerSize: 8,
      transparentCorners: false,
      cornerColor: '#2563eb',
      borderColor: '#2563eb',
      borderScaleFactor: 2,
      padding: 0,
      hasRotatingPoint: false,
      lockUniScaling: true,
      ...options
    });
  }, []);

  const handleMouseDown = useCallback((e: fabric.IEvent) => {
    if (!canvas || mode !== 'draw' || !e.pointer) return;

    const pointer = canvas.getPointer(e.e);
    drawingRef.current = {
      isDrawing: true,
      startPoint: new fabric.Point(pointer.x, pointer.y),
      activeRect: null
    };

    const rect = createRect({
      left: pointer.x,
      top: pointer.y,
      width: 0,
      height: 0,
      selectable: false,
      evented: false,
      id: crypto.randomUUID()
    });

    canvas.add(rect);
    drawingRef.current.activeRect = rect;
    canvas.renderAll();

    log('DrawingManager', 'Started drawing', { pointer });
  }, [canvas, mode, createRect]);

  const handleMouseMove = useCallback((e: fabric.IEvent) => {
    const { isDrawing, startPoint, activeRect } = drawingRef.current;
    if (!canvas || !isDrawing || !startPoint || !activeRect || !e.pointer) return;

    const pointer = canvas.getPointer(e.e);
    const width = Math.abs(pointer.x - startPoint.x);
    const height = Math.abs(pointer.y - startPoint.y);
    const left = Math.min(startPoint.x, pointer.x);
    const top = Math.min(startPoint.y, pointer.y);

    activeRect.set({ left, top, width, height });
    canvas.renderAll();

    log('DrawingManager', 'Drawing', { width, height, left, top });
  }, [canvas]);

  const handleMouseUp = useCallback(() => {
    const { isDrawing, activeRect } = drawingRef.current;
    if (!canvas || !isDrawing || !activeRect) return;

    if (activeRect.width! > 5 && activeRect.height! > 5) {
      const annotation = {
        type: 'box' as const,
        position: {
          left: activeRect.left!,
          top: activeRect.top!,
          width: activeRect.width!,
          height: activeRect.height!,
          angle: activeRect.angle || 0
        }
      };

      addAnnotation(jobId, documentId, annotation);
      onComplete?.();
      log('DrawingManager', 'Created annotation', { id: activeRect.id });
    } else {
      canvas.remove(activeRect);
      log('DrawingManager', 'Cancelled drawing - too small');
    }

    drawingRef.current = {
      isDrawing: false,
      startPoint: null,
      activeRect: null
    };

    canvas.renderAll();
  }, [canvas, jobId, documentId, addAnnotation, onComplete]);

  React.useEffect(() => {
    if (!canvas) return;

    canvas.on({
      'mouse:down': handleMouseDown,
      'mouse:move': handleMouseMove,
      'mouse:up': handleMouseUp
    });

    return () => {
      canvas.off({
        'mouse:down': handleMouseDown,
        'mouse:move': handleMouseMove,
        'mouse:up': handleMouseUp
      });
    };
  }, [canvas, handleMouseDown, handleMouseMove, handleMouseUp]);

  return null;
}