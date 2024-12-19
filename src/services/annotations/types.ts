import { Point, Dimensions } from '../canvas/types';

export interface AnnotationConfig {
  id?: string;
  position: Point & Dimensions;
  scale: number;
  style?: AnnotationStyle;
}

export interface AnnotationStyle {
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
}

export interface Annotation {
  id: string;
  type: 'box';
  position: {
    left: number;
    top: number;
    width: number;
    height: number;
    angle: number;
  };
  style?: AnnotationStyle;
  data?: Record<string, any>;
}

export interface AnnotationEvent {
  type: 'create' | 'update' | 'delete' | 'select';
  annotation: Annotation;
}