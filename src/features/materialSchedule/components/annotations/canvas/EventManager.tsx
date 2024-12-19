import React, { useEffect } from 'react';
import { fabric } from 'fabric';
import { useAnnotationStore } from '../../../../../stores/annotationStore';
import { log } from '../../../../../utils/logger';

interface EventManagerProps {
  canvas: fabric.Canvas | null;
}

export function EventManager({ canvas }: EventManagerProps) {
  const { selectAnnotation, setHoveredAnnotation } = useAnnotationStore();

  useEffect(() => {
    if (!canvas) return;

    const handleSelection = (e: fabric.IEvent) => {
      const selected = e.selected?.[0];
      selectAnnotation(selected?.id as string || null);
      log('EventManager', 'Selection changed', { id: selected?.id });
    };

    const handleHover = (e: fabric.IEvent) => {
      const target = e.target;
      setHoveredAnnotation(target?.id as string || null);
      log('EventManager', 'Hover changed', { id: target?.id });
    };

    canvas.on({
      'selection:created': handleSelection,
      'selection:updated': handleSelection,
      'selection:cleared': () => selectAnnotation(null),
      'mouse:over': handleHover,
      'mouse:out': () => setHoveredAnnotation(null)
    });

    return () => {
      canvas.off({
        'selection:created': handleSelection,
        'selection:updated': handleSelection,
        'selection:cleared': () => selectAnnotation(null),
        'mouse:over': handleHover,
        'mouse:out': () => setHoveredAnnotation(null)
      });
    };
  }, [canvas, selectAnnotation, setHoveredAnnotation]);

  return null;
}