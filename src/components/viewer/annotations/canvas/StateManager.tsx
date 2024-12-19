import { useEffect } from 'react';
import { fabric } from 'fabric';
import { useAnnotationStore } from '../../../../stores/annotationStore';
import { log } from '../../../../utils/logger';

interface StateManagerProps {
  canvas: fabric.Canvas;
  jobId: string;
  documentId: string;
}

export function StateManager({ canvas, jobId, documentId }: StateManagerProps) {
  const { getDocumentState, hoveredId, hoveredPatternId } = useAnnotationStore();
  const { annotations = [] } = getDocumentState(jobId, documentId);

  useEffect(() => {
    canvas.getObjects().forEach((obj: any) => {
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

    canvas.renderAll();
    log('StateManager', 'Canvas state updated', { 
      hoveredId, 
      hoveredPatternId,
      annotationCount: annotations.length 
    });
  }, [canvas, annotations, hoveredId, hoveredPatternId]);

  return null;
}