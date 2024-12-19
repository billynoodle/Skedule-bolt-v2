import React, { useEffect, useRef } from 'react';
import { fabric } from 'fabric';
import { log } from '../../../utils/logger';

interface FabricCanvasProps {
  width: number;
  height: number;
  onCanvasReady?: (canvas: fabric.Canvas) => void;
  className?: string;
}

export function FabricCanvas({ width, height, onCanvasReady, className }: FabricCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Clean up existing canvas before creating a new one
    if (fabricRef.current) {
      try {
        fabricRef.current.dispose();
        fabricRef.current = null;
        log('FabricCanvas', 'Previous canvas disposed');
      } catch (error) {
        console.error('Error disposing canvas:', error);
      }
    }

    const canvas = new fabric.Canvas(canvasRef.current, {
      width,
      height,
      selection: true,
      preserveObjectStacking: true,
      renderOnAddRemove: true,
      enableRetinaScaling: true,
      stopContextMenu: true,
      fireRightClick: true,
      allowTouchScrolling: false
    });

    fabricRef.current = canvas;
    onCanvasReady?.(canvas);
    log('FabricCanvas', 'Canvas initialized', { width, height });

    return () => {
      if (fabricRef.current) {
        try {
          fabricRef.current.dispose();
          fabricRef.current = null;
          log('FabricCanvas', 'Canvas disposed');
        } catch (error) {
          console.error('Error disposing canvas:', error);
        }
      }
    };
  }, [width, height, onCanvasReady]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ touchAction: 'none' }}
    />
  );
}