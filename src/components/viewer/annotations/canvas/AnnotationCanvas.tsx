// src/components/viewer/annotations/canvas/AnnotationCanvas.tsx
import React, { useCallback, useRef, useEffect } from 'react';
import { fabric } from 'fabric';
import { useViewerStore } from '../../../../stores/viewerStore';
import { useAnnotationStore } from '../../../../stores/annotationStore';
import { log } from '../../../../utils/logger';

interface AnnotationCanvasProps {
  width: number;
  height: number;
  containerBounds: {
    width: number;
    height: number;
    left: number;
    top: number;
  };
  jobId: string;
  documentId: string;
  onAnnotationComplete?: () => void;
}

export function AnnotationCanvas({
  width,
  height,
  containerBounds,
  jobId,
  documentId,
  onAnnotationComplete
}: AnnotationCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const drawingRef = useRef<{
    isDrawing: boolean;
    startPoint: fabric.Point | null;
    activeRect: fabric.Rect | null;
  }>({
    isDrawing: false,
    startPoint: null,
    activeRect: null
  });

  const { mode } = useViewerStore();
  const {
    getDocumentState,
    addAnnotation,
    updateAnnotation,
    selectAnnotation,
    setHoveredAnnotation,
    hoveredId,
    hoveredPatternId
  } = useAnnotationStore();

  const { annotations = [], scale } = getDocumentState(jobId, documentId);

  const createRect = useCallback((options: fabric.IRectOptions = {}) => {
    return new fabric.Rect({
      fill: 'rgba(37, 99, 235, 0.1)',
      stroke: '#2563eb',
      strokeWidth: 2 / scale,
      cornerStyle: 'circle',
      cornerSize: 8 / scale,
      transparentCorners: false,
      cornerColor: '#2563eb',
      borderColor: '#2563eb',
      borderScaleFactor: 2,
      padding: 0,
      hasRotatingPoint: false,
      lockUniScaling: true,
      ...options
    });
  }, [scale]);

  const handleMouseDown = useCallback((e: fabric.IEvent) => {
    if (mode !== 'draw' || !fabricRef.current || !e.pointer) return;

    const canvas = fabricRef.current;
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
    
    log('AnnotationCanvas', 'Started drawing', { position: pointer });
  }, [mode, createRect]);

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
      log('AnnotationCanvas', 'Created annotation', annotation);
    } else {
      canvas.remove(activeRect);
      log('AnnotationCanvas', 'Removed small rectangle');
    }

    drawingRef.current = {
      isDrawing: false,
      startPoint: null,
      activeRect: null
    };

    canvas.renderAll();
  }, [scale, jobId, documentId, addAnnotation, onAnnotationComplete]);

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

    canvas.on({
      'mouse:down': handleMouseDown,
      'mouse:move': handleMouseMove,
      'mouse:up': handleMouseUp,
      'selection:created': (e) => selectAnnotation(e.selected?.[0]?.id as string),
      'selection:updated': (e) => selectAnnotation(e.selected?.[0]?.id as string),
      'selection:cleared': () => selectAnnotation(null),
      'mouse:over': (e) => e.target && setHoveredAnnotation(e.target.id as string),
      'mouse:out': () => setHoveredAnnotation(null),
      'object:modified': (e) => {
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
      }
    });

    fabricRef.current = canvas;
    log('AnnotationCanvas', 'Canvas initialized');

    return () => {
      canvas.dispose();
      fabricRef.current = null;
    };
  }, [
    width,
    height,
    scale,
    mode,
    jobId,
    documentId,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    selectAnnotation,
    setHoveredAnnotation,
    updateAnnotation
  ]);

  // Update canvas dimensions and scale
  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    canvas.setDimensions({
      width: width * scale,
      height: height * scale
    });

    canvas.getObjects().forEach(obj => {
      const annotation = annotations.find(a => a.id === obj.id);
      if (!annotation) return;

      obj.set({
        left: annotation.position.left * scale,
        top: annotation.position.top * scale,
        width: annotation.position.width * scale,
        height: annotation.position.height * scale,
        angle: annotation.position.angle
      });
    });

    canvas.renderAll();
  }, [width, height, scale, annotations]);

  // Update canvas mode
  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    canvas.selection = mode === 'select';
    canvas.defaultCursor = mode === 'draw' ? 'crosshair' : 'default';
    
    canvas.getObjects().forEach(obj => {
      obj.set({
        selectable: mode === 'select',
        evented: mode === 'select',
        hasControls: mode === 'select',
        hasBorders: mode === 'select'
      });
    });

    canvas.renderAll();
    log('AnnotationCanvas', 'Mode updated', { mode });
  }, [mode]);

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
