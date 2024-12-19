export interface Point {
  x: number;
  y: number;
}

export interface Dimensions {
  width: number;
  height: number;
}

export interface CanvasConfig {
  width: number;
  height: number;
  mode: 'select' | 'draw';
  scale: number;
  rotation: number;
}

export interface TransformConfig {
  scale: number;
  rotation: number;
  center?: Point;
}

export interface CanvasObject {
  id: string;
  type: string;
  position: Point;
  dimensions: Dimensions;
  style?: Record<string, any>;
}