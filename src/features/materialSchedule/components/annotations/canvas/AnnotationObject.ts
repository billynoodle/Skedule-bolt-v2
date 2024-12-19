import { fabric } from 'fabric';
import { log } from '../../../../../utils/logger';

export interface AnnotationObjectConfig {
  id: string;
  left: number;
  top: number;
  width: number;
  height: number;
  angle: number;
  scale: number;
  isHighlighted?: boolean;
  isSelected?: boolean;
}

export function createAnnotationObject(config: AnnotationObjectConfig): fabric.Rect {
  const {
    id,
    left,
    top,
    width,
    height,
    angle,
    scale,
    isHighlighted = false,
    isSelected = false
  } = config;

  const rect = new fabric.Rect({
    id,
    left,
    top,
    width,
    height,
    angle,
    fill: isHighlighted ? 'rgba(37, 99, 235, 0.3)' : 'rgba(37, 99, 235, 0.1)',
    stroke: isHighlighted ? '#1d4ed8' : '#2563eb',
    strokeWidth: (isHighlighted ? 3 : 2) / scale,
    cornerStyle: 'circle',
    cornerSize: 8 / scale,
    transparentCorners: false,
    cornerColor: '#2563eb',
    borderColor: '#2563eb',
    borderScaleFactor: 2,
    padding: 0,
    hasRotatingPoint: false,
    lockUniScaling: true,
    selectable: true,
    evented: true
  });

  log('AnnotationObject', 'Created annotation object', { 
    id,
    isHighlighted,
    isSelected
  });

  return rect;
}

export function updateAnnotationHighlight(
  object: fabric.Object,
  isHighlighted: boolean,
  scale: number
): void {
  object.set({
    fill: isHighlighted ? 'rgba(37, 99, 235, 0.3)' : 'rgba(37, 99, 235, 0.1)',
    stroke: isHighlighted ? '#1d4ed8' : '#2563eb',
    strokeWidth: (isHighlighted ? 3 : 2) / scale,
    dirty: true
  });
}