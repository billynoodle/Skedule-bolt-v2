import React, { useCallback, useRef, useEffect } from 'react';
import { fabric } from 'fabric';
import { useViewerStore } from '../../../../../stores/viewerStore';
import { useAnnotationStore } from '../../../../../stores/annotationStore';
import { log } from '../../../../../utils/logger';

interface AnnotationCanvasProps {
  width: number;
  height: number;
  jobId: string;
  documentId: string;
  onAnnotationComplete?: () => void;
}

export function AnnotationCanvas({
  width,
  height,
  jobId,
  documentId,
  onAnnotationComplete
}: AnnotationCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const drawingRef = useRef({
    isDrawing: false,
    startPoint: null as fabric.Point | null,
    activeRect: null as fabric.Rect | null
  });

  const { mode } = useViewerStore();
  const { addAnnotation, getDocumentState } = useAnnotationStore();
  const { scale } = getDocumentState(jobId, documentId);

  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current || fabricRef.current) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: width * scale,
      height: height * scale,
      selection: mode === 'select',
      preserveObjectStacking: true,
      renderOnAddRemove: true,
      enableRetinaScaling: true,
      stopContextMenu: true,
      fireRightClick: true,
      allowTouchScrolling: false
    });

    fabricRef.current = canvas;
    log('AnnotationCanvas', 'Canvas initialized', { width, height, scale });

    return () => {
      canvas.dispose();
      fabricRef.current = null;
    };
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

  // Set up event handlers
  useEffect(() => {
    const canvas = fabricRef.current;
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
  }, [handleMouseDown, handleMouseMove, handleMouseUp]);

  return (
    <div 
      className="absolute inset-0" 
      style={{
        pointerEvents: 'none',
        touchAction: 'none'
      }}
    >
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0"
        style={{
          pointerEvents: 'auto',
          touchAction: 'none',
          cursor: mode === 'draw' ? 'crosshair' : 'default'
        }}
      />
    </div>
  );
}