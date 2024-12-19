import { Point, Dimensions } from '../types';
import { log } from '../../../utils/logger';

export function scalePoint(point: Point, scale: number): Point {
  return {
    x: point.x * scale,
    y: point.y * scale
  };
}

export function rotatePoint(point: Point, angle: number, center: Point): Point {
  const rad = (angle * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  
  const dx = point.x - center.x;
  const dy = point.y - center.y;
  
  return {
    x: center.x + (dx * cos - dy * sin),
    y: center.y + (dx * sin + dy * cos)
  };
}

export function scaleDimensions(dimensions: Dimensions, scale: number): Dimensions {
  return {
    width: dimensions.width * scale,
    height: dimensions.height * scale
  };
}

export function getBoundingBox(points: Point[]): Dimensions & Point {
  const xs = points.map(p => p.x);
  const ys = points.map(p => p.y);
  
  const left = Math.min(...xs);
  const right = Math.max(...xs);
  const top = Math.min(...ys);
  const bottom = Math.max(...ys);
  
  log('Coordinates', 'Calculated bounding box', {
    left, top,
    width: right - left,
    height: bottom - top
  });

  return {
    x: left,
    y: top,
    width: right - left,
    height: bottom - top
  };
}