import { useRef, useCallback, useEffect } from 'react';
import { CanvasManager } from '../services/canvas/core/CanvasManager';
import { TransformManager } from '../services/canvas/core/TransformManager';
import { AnnotationManager } from '../services/annotations/core/AnnotationManager';
import { AnnotationConfig } from '../services/annotations/types';
import { log } from '../utils/logger';

export function useAnnotationCanvas(config: {
  width: number;
  height: number;
  scale: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const managersRef = useRef<{
    canvas: CanvasManager;
    transform: TransformManager;
    annotation: AnnotationManager;
  }>();

  // Initialize managers
  useEffect(() => {
    if (!canvasRef.current) return;

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

    log('AnnotationCanvas', 'Managers initialized', config);

    return () => {
      canvasManager.dispose();
      managersRef.current = undefined;
      log('AnnotationCanvas', 'Managers disposed');
    };
  }, [config.width, config.height]);

  const createAnnotation = useCallback((annotationConfig: AnnotationConfig) => {
    if (!managersRef.current) return;
    return managersRef.current.annotation.createAnnotation(annotationConfig);
  }, []);

  const updateAnnotation = useCallback((id: string, updates: Partial<AnnotationConfig>) => {
    if (!managersRef.current) return;
    managersRef.current.annotation.updateAnnotation(id, updates);
  }, []);

  const deleteAnnotation = useCallback((id: string) => {
    if (!managersRef.current) return;
    managersRef.current.annotation.deleteAnnotation(id);
  }, []);

  return {
    canvasRef,
    createAnnotation,
    updateAnnotation,
    deleteAnnotation
  };
}