import { log } from '../../utils/logger';

export interface Point {
  x: number;
  y: number;
}

export interface Dimensions {
  width: number;
  height: number;
}

export class CoordinateSystem {
  private scale: number;
  private rotation: number;
  private dimensions: Dimensions;

  constructor(dimensions: Dimensions, scale: number = 1, rotation: number = 0) {
    this.dimensions = dimensions;
    this.scale = scale;
    this.rotation = rotation;
    
    log('CoordinateSystem', 'Initialized', {
      dimensions,
      scale,
      rotation
    });
  }

  /**
   * Transforms coordinates from screen space to document space
   */
  toDocumentSpace(point: Point): Point {
    const rad = (-this.rotation * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    
    // Center point for rotation
    const centerX = this.dimensions.width / 2;
    const centerY = this.dimensions.height / 2;
    
    // Translate to origin, rotate, then translate back
    const x = centerX + (point.x - centerX) * cos - (point.y - centerY) * sin;
    const y = centerY + (point.x - centerX) * sin + (point.y - centerY) * cos;
    
    // Apply scale
    const scaledX = x / this.scale;
    const scaledY = y / this.scale;
    
    log('CoordinateSystem', 'To document space', {
      input: point,
      output: { x: scaledX, y: scaledY },
      transform: { rotation: this.rotation, scale: this.scale }
    });

    return { x: scaledX, y: scaledY };
  }

  /**
   * Transforms coordinates from document space to screen space
   */
  toScreenSpace(point: Point): Point {
    const rad = (this.rotation * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    
    // Apply scale first
    const scaledX = point.x * this.scale;
    const scaledY = point.y * this.scale;
    
    // Center point for rotation
    const centerX = this.dimensions.width / 2;
    const centerY = this.dimensions.height / 2;
    
    // Translate to origin, rotate, then translate back
    const x = centerX + (scaledX - centerX) * cos - (scaledY - centerY) * sin;
    const y = centerY + (scaledX - centerX) * sin + (scaledY - centerY) * cos;
    
    log('CoordinateSystem', 'To screen space', {
      input: point,
      output: { x, y },
      transform: { rotation: this.rotation, scale: this.scale }
    });

    return { x, y };
  }

  /**
   * Updates the coordinate system parameters
   */
  update(scale?: number, rotation?: number, dimensions?: Dimensions) {
    if (scale !== undefined) this.scale = scale;
    if (rotation !== undefined) this.rotation = rotation;
    if (dimensions) this.dimensions = dimensions;
    
    log('CoordinateSystem', 'Updated parameters', {
      scale: this.scale,
      rotation: this.rotation,
      dimensions: this.dimensions
    });
  }

  /**
   * Gets the current transformation matrix
   */
  getTransformMatrix(): number[] {
    const rad = (this.rotation * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    
    return [
      cos * this.scale, sin * this.scale,
      -sin * this.scale, cos * this.scale,
      this.dimensions.width / 2,
      this.dimensions.height / 2
    ];
  }
}