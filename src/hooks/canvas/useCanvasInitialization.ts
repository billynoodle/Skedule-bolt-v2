import { useEffect, useRef } from 'react';
import { fabric } from 'fabric';
import { initializeCanvas, disposeCanvas } from '../../services/canvas';
import { log } from '../../utils/logger';

export function useCanvasInitialization(canvasRef: React.RefObject<HTMLCanvasElement>) {
  const fabricRef = useRef<fabric.Canvas | null>(null);

  useEffect(() => {
    if (!canvasRef.current || fabricRef.current) return;

    log('CanvasInitialization', 'Initializing canvas');
    fabricRef.current = initializeCanvas(canvasRef.current);

    return () => {
      if (fabricRef.current) {
        disposeCanvas(fabricRef.current);
        fabricRef.current = null;
      }
    };
  }, []);

  return fabricRef;
}