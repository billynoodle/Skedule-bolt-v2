import React, { useCallback, useRef, useEffect, useMemo } from 'react';
import { fabric } from 'fabric';
import { debounce } from 'throttle-debounce';
import { useAnnotations } from '../../../contexts/AnnotationContext';
import { useViewer } from '../../../contexts/ViewerContext';
import { FabricCanvas } from './FabricCanvas';
import { log } from '../../../utils/logger';

interface AnnotationLayerProps {
  width: number;
  height: number;
  scale: number;
  rotation: number;
  onResizeStart?: () => void;
  onResizeEnd?: () => void;
  onAnnotationStart?: () => void;
  onAnnotationEnd?: () => void;
}

export function AnnotationLayer({
  width,
  height,
  scale,
  rotation,
  onResizeStart,
  onResizeEnd,
  onAnnotationStart,
  onAnnotationEnd
}: AnnotationLayerProps) {
  const drawingRef = useRef({
    isDrawing: false,
    startPoint: null as fabric.Point | null,
    activeRect: null as fabric.Rect | null
  });

  const canvasRef = useRef<fabric.Canvas | null>(null);
  const annotationStore = useAnnotations();
  const { annotations, addAnnotation, updateAnnotation, selectAnnotation } = annotationStore();
  const viewerStore = useViewer();
  const { mode } = viewerStore();

  // Calculate canvas dimensions and transformation
  const canvasConfig = useMemo(() => {
    const rad = (rotation * Math.PI) / 180;
    const cos = Math.abs(Math.cos(rad));
    const sin = Math.abs(Math.sin(rad));
    
    // For 90° and 270° rotations, swap width and height
    const isRotated = rotation % 180 !== 0;
    const baseWidth = isRotated ? height : width;
    const baseHeight = isRotated ? width : height;
    
    const dimensions = {
      width: Math.round((baseWidth * cos + baseHeight * sin) * scale),
      height: Math.round((baseWidth * sin + baseHeight * cos) * scale)
    };

    // Calculate transformation matrix
    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;
    const transform = [
      Math.cos(rad), Math.sin(rad),
      -Math.sin(rad), Math.cos(rad),
      centerX - (centerX * Math.cos(rad) - centerY * Math.sin(rad)),
      centerY - (centerX * Math.sin(rad) + centerY * Math.cos(rad))
    ];

    return { dimensions, transform };
  }, [width, height, scale, rotation]);

  const createRect = useCallback((options: Partial<fabric.IRectOptions> = {}) => {
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
      ...options
    });
  }, [scale]);

  const handleMouseDown = useCallback((e: fabric.IEvent<MouseEvent>) => {
    if (mode !== 'draw' || !canvasRef.current || !e.pointer) return;

    const canvas = canvasRef.current;
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
    onAnnotationStart?.();
    
    log('AnnotationLayer', 'Starting drawing', { pointer });
  }, [mode, createRect, onAnnotationStart]);

  const handleMouseMove = useCallback((e: fabric.IEvent<MouseEvent>) => {
    const { isDrawing, startPoint, activeRect } = drawingRef.current;
    const canvas = canvasRef.current;
    
    if (!isDrawing || !startPoint || !activeRect || !canvas || !e.pointer) return;

    const pointer = canvas.getPointer(e.e);
    const width = Math.abs(pointer.x - startPoint.x);
    const height = Math.abs(pointer.y - startPoint.y);
    const left = Math.min(startPoint.x, pointer.x);
    const top = Math.min(startPoint.y, pointer.y);

    activeRect.set({ left, top, width, height });
    canvas.renderAll();
    
    log('AnnotationLayer', 'Drawing', { width, height, left, top });
  }, []);

  const handleMouseUp = useCallback(() => {
    const { isDrawing, activeRect } = drawingRef.current;
    const canvas = canvasRef.current;
    
    if (!isDrawing || !activeRect || !canvas) return;

    if (activeRect.width > 5 && activeRect.height > 5) {
      activeRect.set({
        selectable: true,
        evented: true,
        hasControls: true,
        hasBorders: true
      });

      const annotation = {
        id: activeRect.id as string,
        type: 'box' as const,
        position: {
          left: activeRect.left / scale,
          top: activeRect.top / scale,
          width: activeRect.width / scale,
          height: activeRect.height / scale,
          angle: activeRect.angle || 0
        }
      };

      addAnnotation(annotation);
      log('AnnotationLayer', 'Created annotation', annotation);
    } else {
      canvas.remove(activeRect);
      log('AnnotationLayer', 'Removed small rectangle');
    }

    drawingRef.current = {
      isDrawing: false,
      startPoint: null,
      activeRect: null
    };

    canvas.renderAll();
    onAnnotationEnd?.();
  }, [scale, addAnnotation, onAnnotationEnd]);

  const handleCanvasReady = useCallback((canvas: fabric.Canvas) => {
    log('AnnotationLayer', 'Canvas ready');
    canvasRef.current = canvas;

    // Apply initial transformation
    canvas.setViewportTransform(canvasConfig.transform);

    canvas.on({
      'mouse:down': handleMouseDown,
      'mouse:move': handleMouseMove,
      'mouse:up': handleMouseUp,
      'selection:created': (e) => {
        selectAnnotation(e.selected?.[0]?.id as string);
      },
      'selection:updated': (e) => {
        selectAnnotation(e.selected?.[0]?.id as string);
      },
      'selection:cleared': () => {
        selectAnnotation(null);
      },
      'object:scaling:started': onResizeStart,
      'object:scaling:ended': onResizeEnd,
      'object:modified': debounce(300, (e: fabric.IEvent) => {
        const obj = e.target;
        if (!obj) return;

        const annotation = {
          id: obj.id as string,
          type: 'box' as const,
          position: {
            left: obj.left / scale,
            top: obj.top / scale,
            width: obj.width / scale,
            height: obj.height / scale,
            angle: obj.angle || 0
          }
        };

        updateAnnotation(annotation);
        log('AnnotationLayer', 'Annotation modified', annotation);
      })
    });

    // Set initial canvas state
    canvas.selection = mode === 'select';
    canvas.hoverCursor = mode === 'draw' ? 'crosshair' : 'move';
    canvas.defaultCursor = mode === 'draw' ? 'crosshair' : 'default';
  }, [
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    selectAnnotation,
    updateAnnotation,
    onResizeStart,
    onResizeEnd,
    mode,
    canvasConfig.transform
  ]);

  // Update canvas dimensions and transform
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.setDimensions(canvasConfig.dimensions);
    canvas.setViewportTransform(canvasConfig.transform);
    canvas.renderAll();
    
    log('AnnotationLayer', 'Updated canvas dimensions and zoom', { 
      dimensions: canvasConfig.dimensions,
      scale
    });
  }, [canvasConfig, scale]);

  // Update canvas mode
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.selection = mode === 'select';
    canvas.hoverCursor = mode === 'draw' ? 'crosshair' : 'move';
    canvas.defaultCursor = mode === 'draw' ? 'crosshair' : 'default';
    
    canvas.getObjects().forEach(obj => {
      obj.selectable = mode === 'select';
      obj.evented = mode === 'select';
      obj.hasControls = mode === 'select';
      obj.hasBorders = mode === 'select';
    });

    canvas.renderAll();
    log('AnnotationLayer', 'Updated canvas mode', { mode });
  }, [mode]);

  // Sync annotations
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.clear();

    annotations.forEach(annotation => {
      const rect = createRect({
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
    log('AnnotationLayer', 'Synced annotations', { count: annotations.length });
  }, [annotations, scale, mode, createRect]);

  return (
    <div 
      className="absolute inset-0" 
      style={{
        pointerEvents: 'auto',
        touchAction: 'none',
        cursor: mode === 'draw' ? 'crosshair' : 'default'
      }}
    >
      <FabricCanvas
        width={canvasConfig.dimensions.width}
        height={canvasConfig.dimensions.height}
        onCanvasReady={handleCanvasReady}
        className="annotation-canvas"
      />
    </div>
  );
}