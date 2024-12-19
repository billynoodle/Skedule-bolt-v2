import { useEffect, useRef } from 'react';
import { CanvasManager } from '../services/canvas/core/CanvasManager';
import { TransformManager } from '../services/canvas/core/TransformManager';
import { AnnotationManager } from '../services/annotations/core/AnnotationManager';
import { log } from '../utils/logger';

interface CanvasSetupConfig {
  width: number;
  height: number;
  scale: number;
}

export function useCanvasSetup(config: CanvasSetupConfig) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const managersRef = useRef<{
    canvas: CanvasManager;
    transform: TransformManager;
    annotation: AnnotationManager;
  }>();

  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize managers
    const canvasManager = new CanvasManager();
    const canvas = canvasManager.initialize(canvasRef.current, {
      width: config.width,
      height: config.height,
      scale: config.scale,
      mode: 'select',
      rotation: 0
    });

    const transformManager = new TransformManager(canvas);
    const annotationManager = new AnnotationManager(canvas, transformManager);

    managersRef.current = {
      canvas: canvasManager,
      transform: transformManager,
      annotation: annotationManager
    };

    log('CanvasSetup', 'Canvas managers initialized', config);

    return () => {
      canvasManager.dispose();
      managersRef.current = undefined;
      log('CanvasSetup', 'Canvas managers disposed');
    };
  }, [config.width, config.height, config.scale]);

  return {
    canvasRef,
    getManagers: () => managersRef.current
  };
}