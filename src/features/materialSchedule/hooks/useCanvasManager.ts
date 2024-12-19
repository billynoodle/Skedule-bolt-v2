import { useRef, useEffect } from 'react';
import { CanvasManager } from '../components/annotations/canvas/CanvasManager';
import { log } from '../../../utils/logger';

export function useCanvasManager() {
  const managerRef = useRef<CanvasManager | null>(null);

  useEffect(() => {
    if (!managerRef.current) {
      managerRef.current = new CanvasManager();
      log('useCanvasManager', 'Created new canvas manager');
    }

    return () => {
      if (managerRef.current && !managerRef.current.isDisposed()) {
        managerRef.current.dispose();
        log('useCanvasManager', 'Disposed canvas manager');
      }
    };
  }, []); // Only run on mount/unmount

  return managerRef.current;
}