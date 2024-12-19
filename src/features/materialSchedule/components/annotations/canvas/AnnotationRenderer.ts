import { fabric } from 'fabric';
import { createAnnotationObject, updateAnnotationHighlight } from './AnnotationObject';
import { log } from '../../../../../utils/logger';

export interface RenderConfig {
  canvas: fabric.Canvas;
  annotations: any[];
  scale: number;
  highlightedIds?: string[] | null;
  selectedId?: string | null;
}

export function renderAnnotations(config: RenderConfig): void {
  const { canvas, annotations, scale, highlightedIds, selectedId } = config;

  // Clear existing objects
  canvas.clear();

  // Create and add new objects
  annotations.forEach(annotation => {
    const isHighlighted = highlightedIds?.includes(annotation.id);
    const isSelected = annotation.id === selectedId;

    const object = createAnnotationObject({
      id: annotation.id,
      left: annotation.position.left * scale,
      top: annotation.position.top * scale,
      width: annotation.position.width * scale,
      height: annotation.position.height * scale,
      angle: annotation.position.angle,
      scale,
      isHighlighted,
      isSelected
    });

    canvas.add(object);
  });

  canvas.renderAll();
  log('AnnotationRenderer', 'Rendered annotations', { 
    count: annotations.length,
    highlightedCount: highlightedIds?.length || 0
  });
}

export function updateHighlights(
  canvas: fabric.Canvas,
  highlightedIds: string[] | null,
  scale: number
): void {
  if (!canvas) return;

  canvas.getObjects().forEach(obj => {
    const isHighlighted = highlightedIds?.includes(obj.id as string);
    updateAnnotationHighlight(obj, !!isHighlighted, scale);
  });

  canvas.renderAll();
  log('AnnotationRenderer', 'Updated highlights', { 
    highlightedIds,
    objectCount: canvas.getObjects().length
  });
}