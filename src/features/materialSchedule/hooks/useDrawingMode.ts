import { useCallback, useRef } from 'react';
import { fabric } from 'fabric';
import { CanvasManager } from '../components/annotations/canvas/CanvasManager';
import { createRect } from '../utils/fabricHelpers';
import { log } from '../../../utils/logger';

interface UseDrawingModeProps {
  canvasManager: CanvasManager | null;
  scale: number;
  mode: 'select' | 'draw';
  onComplete?: (rect: fabric.Rect) => void;
}

export function useDrawingMode({
  canvasManager,
  scale,
  mode,
  onComplete
}: UseDrawingModeProps) {
  const drawingRef = useRef({
    isDrawing: false,
    startPoint: null as fabric.Point | null,
    activeRect: null as fabric.Rect | null
  });

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (mode !== 'draw') return;

    const canvas = canvasManager?.getCanvas();
    if (!canvas) return;

    // Convert mouse coordinates to canvas coordinates
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    drawingRef.current = {
      isDrawing: true,
      startPoint: new fabric.Point(x, y),
      activeRect: null
    };

    const newRect = createRect(scale, {
      left: x,
      top: y,
      width: 0,
      height: 0,
      selectable: false,
      evented: false
    });

    canvas.add(newRect);
    drawingRef.current.activeRect = newRect;
    canvas.renderAll();

    log('DrawingMode', 'Started drawing', { x, y });
  }, [mode, scale, canvasManager]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const { isDrawing, startPoint, activeRect } = drawingRef.current;
    if (!isDrawing || !startPoint || !activeRect) return;

    const canvas = canvasManager?.getCanvas();
    if (!canvas) return;

    // Convert mouse coordinates to canvas coordinates
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const width = Math.abs(x - startPoint.x);
    const height = Math.abs(y - startPoint.y);
    const left = Math.min(startPoint.x, x);
    const top = Math.min(startPoint.y, y);

    activeRect.set({ left, top, width, height });
    canvas.renderAll();

    log('DrawingMode', 'Drawing', { width, height, left, top });
  }, [canvasManager]);

  const handleMouseUp = useCallback((e: React.MouseEvent) => {
    const { isDrawing, activeRect } = drawingRef.current;
    if (!isDrawing || !activeRect) return;

    const canvas = canvasManager?.getCanvas();
    if (!canvas) return;

    if (activeRect.width! > 5 && activeRect.height! > 5) {
      activeRect.set({
        selectable: mode === 'select',
        evented: mode === 'select'
      });
      onComplete?.(activeRect);
      log('DrawingMode', 'Completed drawing');
    } else {
      canvas.remove(activeRect);
      log('DrawingMode', 'Cancelled drawing - too small');
    }

    drawingRef.current = {
      isDrawing: false,
      startPoint: null,
      activeRect: null
    };

    canvas.renderAll();
  }, [mode, canvasManager, onComplete]);

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    isDrawing: drawingRef.current.isDrawing
  };
}