import { useEffect } from 'react';
import { useCanvas } from '../CanvasProvider';
import { useCanvasDrawing } from './useCanvasDrawing';
import { log } from '../../../utils/logger';

export function useCanvasEvents() {
  const { canvas, eventManager } = useCanvas();
  const { handleMouseDown, handleMouseMove, handleMouseUp } = useCanvasDrawing();

  useEffect(() => {
    if (!canvas || !eventManager) return;

    eventManager.on('mouse:down', handleMouseDown);
    eventManager.on('mouse:move', handleMouseMove);
    eventManager.on('mouse:up', handleMouseUp);

    log('CanvasEvents', 'Event handlers attached');

    return () => {
      eventManager.off('mouse:down', handleMouseDown);
      eventManager.off('mouse:move', handleMouseMove);
      eventManager.off('mouse:up', handleMouseUp);
      log('CanvasEvents', 'Event handlers detached');
    };
  }, [canvas, eventManager, handleMouseDown, handleMouseMove, handleMouseUp]);
}