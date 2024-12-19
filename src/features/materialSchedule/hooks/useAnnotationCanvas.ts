import { useRef, useEffect, useCallback } from 'react';
import { fabric } from 'fabric';
import { log } from '../../../utils/logger';

interface UseAnnotationCanvasProps {
  width: number;
  height: number;
  scale: number;
  mode: 'select' | 'draw';
  onAnnotationCreate: (annotation: any) => void;
  onAnnotationUpdate: (id: string, updates: any) => void;
  onAnnotationSelect: (id: string | null) => void;
  onAnnotationHover: (id: string | null) => void;
}

export function useAnnotationCanvas({
  width,
  height,
  scale,
  mode,
  onAnnotationCreate,
  onAnnotationUpdate,
  onAnnotationSelect,
  onAnnotationHover
}: UseAnnotationCanvasProps) {
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

  // Create rectangle with consistent styling
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

  // Handle mouse down event
  const handleMouseDown = useCallback((e: fabric.IEvent) => {
    if (mode !== 'draw' || !e.pointer) {
      log('AnnotationCanvas', 'Ignoring mouse down - not in draw mode');
      return;
    }

    log('AnnotationCanvas', 'Mouse down in draw mode', { pointer: e.pointer });
    
    // Prevent event from propagating to TransformWrapper
    e.e.stopPropagation();
    e.e.preventDefault();

    const canvas = fabricRef.current;
    if (!canvas) return;

    drawingRef.current = {
      isDrawing: true,
      startPoint: new fabric.Point(e.pointer.x, e.pointer.y),
      activeRect: null
    };

    const rect = createRect({
      left: e.pointer.x,
      top: e.pointer.y,
      width: 0,
      height: 0,
      selectable: false,
      evented: false,
      id: crypto.randomUUID()
    });

    canvas.add(rect);
    drawingRef.current.activeRect = rect;
    canvas.renderAll();
  }, [mode, createRect]);

  // Handle mouse move event
  const handleMouseMove = useCallback((e: fabric.IEvent) => {
    const { isDrawing, startPoint, activeRect } = drawingRef.current;
    if (!isDrawing || !startPoint || !activeRect || !e.pointer) {
      return;
    }

    // Prevent event from propagating
    e.e.stopPropagation();
    e.e.preventDefault();

    log('AnnotationCanvas', 'Mouse move while drawing', { pointer: e.pointer });

    const width = Math.abs(e.pointer.x - startPoint.x);
    const height = Math.abs(e.pointer.y - startPoint.y);
    const left = Math.min(startPoint.x, e.pointer.x);
    const top = Math.min(startPoint.y, e.pointer.y);

    activeRect.set({ left, top, width, height });
    fabricRef.current?.renderAll();
  }, []);

  // Handle mouse up event
  const handleMouseUp = useCallback((e: fabric.IEvent) => {
    const { isDrawing, activeRect } = drawingRef.current;
    if (!isDrawing || !activeRect) {
      return;
    }

    // Prevent event from propagating
    e.e.stopPropagation();
    e.e.preventDefault();

    log('AnnotationCanvas', 'Mouse up after drawing');

    const canvas = fabricRef.current;
    if (!canvas) return;

    if (activeRect.width! > 5 && activeRect.height! > 5) {
      activeRect.set({
        selectable: mode === 'select',
        evented: mode === 'select',
        hasControls: mode === 'select',
        hasBorders: mode === 'select'
      });

      const annotation = {
        id: activeRect.id,
        type: 'box' as const,
        position: {
          left: activeRect.left! / scale,
          top: activeRect.top! / scale,
          width: activeRect.width! / scale,
          height: activeRect.height! / scale,
          angle: activeRect.angle || 0
        }
      };

      onAnnotationCreate(annotation);
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
  }, [mode, scale, onAnnotationCreate]);

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
      'selection:created': (e) => onAnnotationSelect(e.selected?.[0]?.id as string),
      'selection:updated': (e) => onAnnotationSelect(e.selected?.[0]?.id as string),
      'selection:cleared': () => onAnnotationSelect(null),
      'mouse:over': (e) => e.target && onAnnotationHover(e.target.id as string),
      'mouse:out': () => onAnnotationHover(null),
      'object:modified': (e) => {
        if (!e.target) return;
        const obj = e.target;
        onAnnotationUpdate(obj.id as string, {
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
      log('AnnotationCanvas', 'Canvas disposed');
    };
  }, [
    width,
    height,
    scale,
    mode,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    onAnnotationSelect,
    onAnnotationHover,
    onAnnotationUpdate
  ]);

  return {
    canvasRef,
    fabricRef
  };
}