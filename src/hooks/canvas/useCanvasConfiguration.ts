import { useEffect } from 'react';
import { fabric } from 'fabric';
import { updateCanvasConfig } from '../../services/canvas';

interface CanvasConfigProps {
  canvas: fabric.Canvas | null;
  width: number;
  height: number;
  scale: number;
  rotation: number;
  mode: 'select' | 'draw';
}

export function useCanvasConfiguration({
  canvas,
  width,
  height,
  scale,
  rotation,
  mode
}: CanvasConfigProps) {
  useEffect(() => {
    if (!canvas) return;

    updateCanvasConfig(canvas, {
      width,
      height,
      scale,
      rotation,
      mode
    });
  }, [canvas, width, height, scale, rotation, mode]);
}