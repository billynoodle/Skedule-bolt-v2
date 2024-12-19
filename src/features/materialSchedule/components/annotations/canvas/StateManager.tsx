import React, { useEffect, useRef } from 'react';
import { fabric } from 'fabric';
import { useAnnotationStore } from '../../../../../stores/annotationStore';
import { log } from '../../../../../utils/logger';

interface StateManagerProps {
  canvas: fabric.Canvas;
  jobId: string;
  documentId: string;
}

export function StateManager({ canvas, jobId, documentId }: StateManagerProps) {
  const { getDocumentState, hoveredId, hoveredPatternId } = useAnnotationStore();
  const { annotations = [] } = getDocumentState(jobId, documentId);
  const initRef = useRef(false);

  // Initialize state manager
  useEffect(() => {
    if (!canvas || !canvas.getContext()) {
      log('StateManager', 'Waiting for canvas initialization');
      return;
    }

    // Mark as initialized
    initRef.current = true;
    log('StateManager', 'State manager initialized');

    return () => {
      initRef.current = false;
      log('StateManager', 'State manager disposed');
    };
  }, [canvas]);

  // Handle state updates
  useEffect(() => {
    if (!initRef.current || !canvas || !canvas.getContext()) {
      return;
    }

    try {
      const objects = canvas.getObjects();
      objects.forEach((obj: any) => {
        const annotation = annotations.find(a => a.id === obj.id);
        if (!annotation) return;

        const isHovered = hoveredId === obj.id || 
          (hoveredPatternId && annotation.tagPatternId === hoveredPatternId);

        obj.set({
          stroke: '#2563eb',
          strokeWidth: isHovered ? 3 : 2,
          opacity: annotation.tagPatternId ? 1 : isHovered ? 1 : 0.5
        });
      });

      canvas.requestRenderAll();
      log('StateManager', 'Canvas state updated', { 
        objectCount: objects.length,
        hoveredId, 
        hoveredPatternId 
      });
    } catch (err) {
      log('StateManager', 'Failed to update canvas state', err);
    }
  }, [canvas, annotations, hoveredId, hoveredPatternId]);

  return null;
}