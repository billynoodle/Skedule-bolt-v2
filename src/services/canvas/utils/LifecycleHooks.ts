import { useEffect, useRef } from 'react';
import { fabric } from 'fabric';
import { CanvasCore } from '../core/CanvasCore';
import { CanvasLifecycle } from '../core/CanvasLifecycle';
import { CanvasConfig } from '../types';
import { log } from '../../../utils/logger';

export function useCanvasLifecycle(config: CanvasConfig) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const coreRef = useRef<CanvasCore | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvasId = crypto.randomUUID();
    const core = new CanvasCore(config);
    
    try {
      const canvas = core.initialize(canvasRef.current);
      CanvasLifecycle.register(canvasId, canvas);
      coreRef.current = core;
      
      log('LifecycleHooks', 'Canvas initialized', { id: canvasId });
    } catch (err) {
      log('LifecycleHooks', 'Failed to initialize canvas', err);
    }

    return () => {
      if (coreRef.current) {
        coreRef.current.dispose();
        CanvasLifecycle.unregister(canvasId);
        log('LifecycleHooks', 'Canvas disposed', { id: canvasId });
      }
    };
  }, [config]);

  return {
    canvasRef,
    getCanvas: () => coreRef.current?.getCanvas() || null
  };
}