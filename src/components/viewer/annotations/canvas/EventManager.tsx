import { useEffect } from 'react';
import { fabric } from 'fabric';
import { useAnnotationStore } from '../../../../stores/annotationStore';
import { log } from '../../../../utils/logger';

interface EventManagerProps {
  canvas: fabric.Canvas;
  jobId: string;
  documentId: string;
  onAnnotationComplete?: () => void;
}

export function EventManager({
  canvas,
  jobId,
  documentId,
  onAnnotationComplete
}: EventManagerProps) {
  const { selectAnnotation, setHoveredAnnotation } = useAnnotationStore();

  useEffect(() => {
    const handleSelection = (e: fabric.IEvent) => {
      const selected = e.selected?.[0];
      selectAnnotation(selected?.id as string || null);
      log('EventManager', 'Selection changed', { id: selected?.id });
    };

    const handleHover = (e: fabric.IEvent) => {
      const target = e.target;
      setHoveredAnnotation(target?.id as string || null);
    };

    canvas.on({
      'selection:created': handleSelection,
      'selection:updated': handleSelection,
      'selection:cleared': () => selectAnnotation(null),
      'mouse:over': handleHover,
      'mouse:out': () => setHoveredAnnotation(null),
      'object:modified': () => onAnnotationComplete?.()
    });

    return () => {
      canvas.off('selection:created', handleSelection);
      canvas.off('selection:updated', handleSelection);
      canvas.off('selection:cleared');
      canvas.off('mouse:over', handleHover);
      canvas.off('mouse:out');
      canvas.off('object:modified');
    };
  }, [canvas, selectAnnotation, setHoveredAnnotation, onAnnotationComplete]);

  return null;
}