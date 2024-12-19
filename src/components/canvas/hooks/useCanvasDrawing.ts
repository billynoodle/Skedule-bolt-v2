import { useCallback, useRef } from 'react';
import { fabric } from 'fabric';
import { useCanvas } from '../CanvasProvider';
import { log } from '../../../utils/logger';

interface DrawingState {
  isDrawing: boolean;
  startPoint: fabric.Point | null;
  activeRect: fabric.Rect | null;
}

export function useCanvasDrawing() {
  const { canvas, config } = useCanvas();
  const drawingRef = useRef<DrawingState>({
    isDrawing: false,
    startPoint: null,
    activeRect: null
  });

  const handleMouseDown = useCallback((e: fabric.IEvent) => {
    if (!canvas || config.mode !== 'draw' || !e.pointer) return;

    const pointer = canvas.getPointer(e.e);
    drawingRef.current = {
      isDrawing: true,
      startPoint: new fabric.Point(pointer.x, pointer.y),
      activeRect: null
    };

    const rect = new fabric.Rect({
      left: pointer.x,
      top: pointer.y,
      width: 0,
      height: 0,
      fill: 'rgba(37, 99, 235, 0.1)',
      stroke: '#2563eb',
      strokeWidth: 2 / config.scale,
      selectable: false,
      evented: false,
      id: crypto.randomUUID()
    });

    canvas.add(rect);
    drawingRef.current.activeRect = rect;
    canvas.renderAll();
    
    log('CanvasDrawing', 'Started drawing', { pointer });
  }, [canvas, config]);

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
    
    log('CanvasDrawing', 'Drawing', { width, height, left, top });
  }, [canvas]);

  const handleMouseUp = useCallback(() => {
    const { isDrawing, activeRect } = drawingRef.current;
    if (!canvas || !isDrawing || !activeRect) return;

    if (activeRect.width! > 5 && activeRect.height! > 5) {
      activeRect.set({
        selectable: config.mode === 'select',
        evented: config.mode === 'select'
      });
      log('CanvasDrawing', 'Completed drawing', { id: activeRect.id });
    } else {
      canvas.remove(activeRect);
      log('CanvasDrawing', 'Cancelled drawing - too small');
    }

    drawingRef.current = {
      isDrawing: false,
      startPoint: null,
      activeRect: null
    };

    canvas.renderAll();
  }, [canvas, config]);

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp
  };
}