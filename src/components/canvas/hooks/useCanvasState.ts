import { useEffect, useCallback } from 'react';
import { useCanvas } from '../CanvasProvider';
import { log } from '../../../utils/logger';

export function useCanvasState() {
  const { canvas, stateManager, config } = useCanvas();

  useEffect(() => {
    if (!canvas || !stateManager || !stateManager.isValid()) {
      log('CanvasState', 'Invalid canvas state - skipping update');
      return;
    }

    try {
      stateManager.updateObjects(obj => {
        obj.set({
          selectable: config.mode === 'select',
          evented: config.mode === 'select',
          hasControls: config.mode === 'select',
          hasBorders: config.mode === 'select'
        });
      });

      log('CanvasState', 'Canvas state updated', { mode: config.mode });
    } catch (err) {
      log('CanvasState', 'Failed to update canvas state', err);
    }
  }, [canvas, stateManager, config.mode]);

  const updateObjectState = useCallback((id: string, state: any) => {
    if (!stateManager?.isValid()) {
      log('CanvasState', 'Cannot update object state - invalid state manager');
      return;
    }
    stateManager.setObjectState(id, state);
  }, [stateManager]);

  const clearState = useCallback(() => {
    if (!stateManager?.isValid()) {
      log('CanvasState', 'Cannot clear state - invalid state manager');
      return;
    }
    stateManager.clearState();
  }, [stateManager]);

  return {
    updateObjectState,
    clearState
  };
}