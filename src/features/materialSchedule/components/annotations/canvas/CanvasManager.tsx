import React from 'react';
import { fabric } from 'fabric';
import { ViewportTransform } from '../../../../../services/canvas/viewportTransform';
import { useViewerStore } from '../../../../../stores/viewerStore';
import { log } from '../../../../../utils/logger';

interface CanvasManagerProps {
  width: number;
  height: number;
  transform: ViewportTransform;
  onPointerEvent?: (e: React.PointerEvent) => { x: number; y: number };
  children?: React.ReactNode;
}

export function CanvasManager({
  width,
  height,
  transform,
  onPointerEvent,
  children
}: CanvasManagerProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const fabricRef = React.useRef<fabric.Canvas | null>(null);
  const { mode } = useViewerStore();

  // Initialize canvas
  React.useEffect(() => {
    if (!canvasRef.current || fabricRef.current) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      width,
      height,
      selection: mode === 'select',
      preserveObjectStacking: true,
      renderOnAddRemove: true,
      enableRetinaScaling: true
    });

    // Apply viewport transform
    canvas.setViewportTransform(transform.getMatrixValues());

    fabricRef.current = canvas;
    log('CanvasManager', 'Canvas initialized', { width, height });

    return () => {
      canvas.dispose();
      fabricRef.current = null;
      log('CanvasManager', 'Canvas disposed');
    };
  }, [width, height, mode, transform]);

  // Update canvas mode
  React.useEffect(() => {
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
    log('CanvasManager', 'Canvas mode updated', { mode });
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
        onPointerDown={onPointerEvent}
        onPointerMove={onPointerEvent}
        onPointerUp={onPointerEvent}
      />
      {React.Children.map(children, child => 
        React.isValidElement(child) 
          ? React.cloneElement(child, { canvas: fabricRef.current })
          : child
      )}
    </div>
  );
}