import { useCallback } from 'react';
import { fabric } from 'fabric';
import { debounce } from 'throttle-debounce';
import { createRect } from '../canvas/CanvasObjects';
import { log } from '../../../../utils/logger';

interface UseCanvasEventsProps {
  scale: number;
  mode: 'select' | 'draw';
  onAnnotationCreate: (annotation: any) => void;
  onAnnotationUpdate: (annotation: any) => void;
  onSelectionChange: (id: string | null) => void;
  onHoverChange: (id: string | null) => void;
  onAnnotationComplete?: () => void;
}

export function useCanvasEvents({
  scale,
  mode,
  onAnnotationCreate,
  onAnnotationUpdate,
  onSelectionChange,
  onHoverChange,
  onAnnotationComplete
}: UseCanvasEventsProps) {
  const handleMouseDown = useCallback((e: fabric.IEvent, canvas: fabric.Canvas) => {
    if (mode !== 'draw' || !e.pointer) return null;

    const pointer = canvas.getPointer(e.e);
    const rect = createRect(scale, {
      left: pointer.x,
      top: pointer.y,
      width: 0,
      height: 0,
      selectable: false,
      evented: false,
      id: crypto.randomUUID()
    });

    canvas.add(rect);
    canvas.renderAll();

    log('CanvasEvents', 'Started drawing', { position: pointer });

    return {
      isDrawing: true,
      startPoint: new fabric.Point(pointer.x, pointer.y),
      activeRect: rect
    };
  }, [mode, scale]);

  const handleMouseMove = useCallback((e: fabric.IEvent, canvas: fabric.Canvas, drawingState: any) => {
    if (!drawingState?.isDrawing || !drawingState?.startPoint || !drawingState?.activeRect || !e.pointer) return;

    const pointer = canvas.getPointer(e.e);
    const width = Math.abs(pointer.x - drawingState.startPoint.x);
    const height = Math.abs(pointer.y - drawingState.startPoint.y);
    const left = Math.min(drawingState.startPoint.x, pointer.x);
    const top = Math.min(drawingState.startPoint.y, pointer.y);

    drawingState.activeRect.set({ left, top, width, height });
    canvas.renderAll();

    log('CanvasEvents', 'Drawing', { width, height, left, top });
  }, []);

  const handleMouseUp = useCallback((canvas: fabric.Canvas, drawingState: any) => {
    if (!drawingState?.isDrawing || !drawingState?.activeRect) return;

    if (drawingState.activeRect.width > 5 && drawingState.activeRect.height > 5) {
      drawingState.activeRect.set({
        selectable: mode === 'select',
        evented: mode === 'select',
        hasControls: mode === 'select',
        hasBorders: mode === 'select'
      });

      const annotation = {
        id: drawingState.activeRect.id,
        type: 'box',
        position: {
          left: drawingState.activeRect.left / scale,
          top: drawingState.activeRect.top / scale,
          width: drawingState.activeRect.width / scale,
          height: drawingState.activeRect.height / scale,
          angle: drawingState.activeRect.angle || 0
        }
      };

      onAnnotationCreate(annotation);
      onAnnotationComplete?.();
      log('CanvasEvents', 'Created annotation', annotation);
    } else {
      canvas.remove(drawingState.activeRect);
      log('CanvasEvents', 'Removed small rectangle');
    }

    canvas.renderAll();
  }, [scale, mode, onAnnotationCreate, onAnnotationComplete]);

  const handleObjectModified = useCallback(debounce(300, (e: fabric.IEvent) => {
    const obj = e.target;
    if (!obj) return;

    const annotation = {
      id: obj.id,
      type: 'box',
      position: {
        left: obj.left! / scale,
        top: obj.top! / scale,
        width: obj.width! / scale,
        height: obj.height! / scale,
        angle: obj.angle || 0
      }
    };

    onAnnotationUpdate(annotation);
    log('CanvasEvents', 'Updated annotation', annotation);
  }), [scale, onAnnotationUpdate]);

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleObjectModified
  };
}