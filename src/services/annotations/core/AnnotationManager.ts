import { fabric } from 'fabric';
import { TransformManager } from '../../canvas/core/TransformManager';
import { Annotation, AnnotationConfig } from '../types';
import { log, error } from '../../../utils/logger';

export class AnnotationManager {
  constructor(
    private canvas: fabric.Canvas,
    private transformManager: TransformManager
  ) {
    log('AnnotationManager', 'Initialized');
  }

  createAnnotation(config: AnnotationConfig): Annotation {
    try {
      const canvasCoords = this.transformManager.toCanvasCoordinates(
        config.position,
        config.scale
      );

      const annotation = new fabric.Rect({
        ...canvasCoords,
        width: config.position.width * config.scale,
        height: config.position.height * config.scale,
        fill: 'rgba(37, 99, 235, 0.1)',
        stroke: '#2563eb',
        strokeWidth: 2 / config.scale,
        cornerStyle: 'circle',
        cornerSize: 8 / config.scale,
        transparentCorners: false,
        id: config.id || crypto.randomUUID()
      });

      this.canvas.add(annotation);
      this.setupAnnotationEvents(annotation);

      log('AnnotationManager', 'Annotation created', { id: annotation.id });
      return annotation;
    } catch (err) {
      error('AnnotationManager', 'Failed to create annotation', err);
      throw err;
    }
  }

  updateAnnotation(id: string, updates: Partial<AnnotationConfig>): void {
    const annotation = this.findAnnotation(id);
    if (!annotation) return;

    try {
      if (updates.position) {
        const canvasCoords = this.transformManager.toCanvasCoordinates(
          updates.position,
          updates.scale || 1
        );
        annotation.set({
          ...canvasCoords,
          width: updates.position.width * (updates.scale || 1),
          height: updates.position.height * (updates.scale || 1)
        });
      }

      this.canvas.requestRenderAll();
      log('AnnotationManager', 'Annotation updated', { id });
    } catch (err) {
      error('AnnotationManager', 'Failed to update annotation', err);
    }
  }

  deleteAnnotation(id: string): void {
    const annotation = this.findAnnotation(id);
    if (!annotation) return;

    try {
      this.canvas.remove(annotation);
      log('AnnotationManager', 'Annotation deleted', { id });
    } catch (err) {
      error('AnnotationManager', 'Failed to delete annotation', err);
    }
  }

  private findAnnotation(id: string): fabric.Object | undefined {
    return this.canvas.getObjects().find(obj => obj.id === id);
  }

  private setupAnnotationEvents(annotation: fabric.Object): void {
    annotation.on({
      'modified': () => {
        const position = this.transformManager.toDocumentCoordinates(
          { x: annotation.left!, y: annotation.top! },
          this.canvas.getZoom()
        );
        
        log('AnnotationManager', 'Annotation modified', {
          id: annotation.id,
          position
        });
      }
    });
  }
}