import React, { useCallback, useEffect, useRef } from 'react';
import { fabric } from 'fabric';
import { useAnnotation } from './AnnotationProvider';
import { useAnnotationStore } from '../../../../stores/annotationStore';
import { log, error, canvasDebug } from '../../../../utils/logger';

interface AnnotationCanvasProps {
  width: number;
  height: number;
  onAnnotationComplete?: () => void;
}

export function AnnotationCanvas({ width, height, onAnnotationComplete }: AnnotationCanvasProps) {
  const { jobId, documentId, mode, scale } = useAnnotation();
  const { addAnnotation, updateAnnotation } = useAnnotationStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const drawingRef = useRef({
    isDrawing: false,
    startPoint: null as fabric.Point | null,
    activeRect: null as fabric.Rect | null
  });

  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current || fabricRef.current) return;

    try {
      log('AnnotationCanvas', 'Initializing canvas', { width, height, scale, mode });

      const canvas = new fabric.Canvas(canvasRef.current, {
        width: width * scale,
        height: height * scale,
        selection: mode === 'select',
        preserveObjectStacking: true,
        renderOnAddRemove: true,
        enableRetinaScaling: true,
        defaultCursor: mode === 'draw' ? 'crosshair' : 'default',
        hoverCursor: mode === 'draw' ? 'crosshair' : 'move'
      });

      // Set up canvas container
      const container = canvas.wrapperEl;
      if (!container) {
        throw new Error('Canvas wrapper element not found');
      }

      container.style.position = 'absolute';
      container.style.width = '100%';
      container.style.height = '100%';
      container.style.pointerEvents = 'auto';
      container.style.touchAction = 'none';

      // Set up event handlers
      canvas.on({
        'mouse:down': handleMouseDown,
        'mouse:move': handleMouseMove,
        'mouse:up': handleMouseUp,
        'object:modified': handleObjectModified
      });

      log('AnnotationCanvas', 'Canvas initialized', {
        canvas: canvasDebug(canvas)
      });

      fabricRef.current = canvas;

      return () => {
        canvas.off();
        canvas.dispose();
        fabricRef.current = null;
        log('AnnotationCanvas', 'Canvas disposed');
      };
    } catch (err) {
      error('AnnotationCanvas', 'Failed to initialize canvas', err);
      throw err;
    }
  }, [width, height, scale, mode]);

  // Handle mouse down
  const handleMouseDown = useCallback((e: fabric.IEvent) => {
    if (mode !== 'draw' || !fabricRef.current || !e.pointer) return;

    const canvas = fabricRef.current;
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
      strokeWidth: 2 / scale,
      selectable: false,
      evented: false,
      id: crypto.randomUUID()
    });

    canvas.add(rect);
    drawingRef.current.activeRect = rect;
    canvas.renderAll();
    
    log('AnnotationCanvas', 'Started drawing', { pointer });
  }, [mode, scale]);

  // Handle mouse move
  const handleMouseMove = useCallback((e: fabric.IEvent) => {
    const { isDrawing, startPoint, activeRect } = drawingRef.current;
    const canvas = fabricRef.current;
    
    if (!isDrawing || !startPoint || !activeRect || !canvas || !e.pointer) return;

    const pointer = canvas.getPointer(e.e);
    const width = Math.abs(pointer.x - startPoint.x);
    const height = Math.abs(pointer.y - startPoint.y);
    const left = Math.min(startPoint.x, pointer.x);
    const top = Math.min(startPoint.y, pointer.y);

    activeRect.set({ left, top, width, height });
    canvas.renderAll();
    
    log('AnnotationCanvas', 'Drawing', { width, height, left, top });
  }, []);

  // Handle mouse up
  const handleMouseUp = useCallback(() => {
    const { isDrawing, activeRect } = drawingRef.current;
    const canvas = fabricRef.current;
    
    if (!isDrawing || !activeRect || !canvas) return;

    if (activeRect.width! > 5 && activeRect.height! > 5) {
      const annotation = {
        type: 'box' as const,
        position: {
          left: activeRect.left! / scale,
          top: activeRect.top! / scale,
          width: activeRect.width! / scale,
          height: activeRect.height! / scale,
          angle: activeRect.angle || 0
        }
      };

      addAnnotation(jobId, documentId, annotation);
      onAnnotationComplete?.();
      log('AnnotationCanvas', 'Created annotation');
    } else {
      canvas.remove(activeRect);
      log('AnnotationCanvas', 'Cancelled drawing - too small');
    }

    drawingRef.current = {
      isDrawing: false,
      startPoint: null,
      activeRect: null
    };

    canvas.renderAll();
  }, [scale, jobId, documentId, addAnnotation, onAnnotationComplete]);

  // Handle object modification
  const handleObjectModified = useCallback((e: fabric.IEvent) => {
    if (!e.target) return;
    
    const obj = e.target;
    updateAnnotation(jobId, documentId, {
      id: obj.id as string,
      type: 'box',
      position: {
        left: obj.left! / scale,
        top: obj.top! / scale,
        width: obj.width! / scale,
        height: obj.height! / scale,
        angle: obj.angle || 0
      }
    });
    
    log('AnnotationCanvas', 'Updated annotation', { id: obj.id });
  }, [jobId, documentId, scale, updateAnnotation]);

  // Update canvas mode
  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    try {
      log('AnnotationCanvas', 'Updating canvas mode', {
        mode,
        canvas: canvasDebug(canvas)
      });

      canvas.isDrawingMode = mode === 'draw';
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
    } catch (err) {
      error('AnnotationCanvas', 'Failed to update canvas mode', err);
    }
  }, [mode]);

  return (
    <div 
      className="absolute inset-0"
      style={{ 
        touchAction: 'none',
        pointerEvents: 'none'
      }}
    >
      <canvas
        ref={canvasRef}
        className={`${mode === 'draw' ? 'drawing-mode' : 'selection-mode'} upper-canvas`}
      />
    </div>
  );
}