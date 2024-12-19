import { useState, useCallback } from 'react';
import { ViewportTransform, ViewportDimensions } from '../services/canvas/viewportTransform';
import { log } from '../utils/logger';

export function useViewportTransform(initialDimensions: ViewportDimensions) {
  const [transform] = useState(() => new ViewportTransform(initialDimensions));

  const handlePointerEvent = useCallback((event: React.PointerEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const viewportPoint = transform.fromViewportPoint(x, y);
    
    log('ViewportTransform', 'Pointer event transformed', {
      client: { x: event.clientX, y: event.clientY },
      relative: { x, y },
      viewport: viewportPoint
    });
    
    return viewportPoint;
  }, [transform]);

  const updateTransform = useCallback((dimensions: Partial<ViewportDimensions>) => {
    transform.update(dimensions);
  }, [transform]);

  return {
    transform,
    handlePointerEvent,
    updateTransform
  };
}