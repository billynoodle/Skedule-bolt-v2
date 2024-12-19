import { log } from '../../utils/logger';

export interface ViewportDimensions {
  width: number;
  height: number;
  scale: number;
  rotation: number;
  dpr: number;
}

export class ViewportTransform {
  private dimensions: ViewportDimensions;
  private transformMatrix: DOMMatrix;

  constructor(dimensions: ViewportDimensions) {
    this.dimensions = dimensions;
    this.transformMatrix = this.calculateTransform();
    
    log('ViewportTransform', 'Initialized', {
      dimensions,
      matrix: this.getMatrixValues()
    });
  }

  private calculateTransform(): DOMMatrix {
    const { width, height, scale, rotation, dpr } = this.dimensions;
    const matrix = new DOMMatrix();
    
    // Center the transform origin
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Apply device pixel ratio
    matrix.scaleSelf(dpr, dpr);
    
    // Move to center, apply transforms, move back
    matrix.translateSelf(centerX, centerY)
         .rotateSelf(rotation)
         .scaleSelf(scale, scale)
         .translateSelf(-centerX, -centerY);

    return matrix;
  }

  public toViewportPoint(x: number, y: number): { x: number; y: number } {
    const point = new DOMPoint(x, y).matrixTransform(this.transformMatrix);
    
    log('ViewportTransform', 'Point to viewport', {
      input: { x, y },
      output: { x: point.x, y: point.y }
    });
    
    return { x: point.x, y: point.y };
  }

  public fromViewportPoint(x: number, y: number): { x: number; y: number } {
    const inverse = this.transformMatrix.inverse();
    const point = new DOMPoint(x, y).matrixTransform(inverse);
    
    log('ViewportTransform', 'Point from viewport', {
      input: { x, y },
      output: { x: point.x, y: point.y }
    });
    
    return { x: point.x, y: point.y };
  }

  public getMatrixValues(): number[] {
    const m = this.transformMatrix;
    return [m.a, m.b, m.c, m.d, m.e, m.f];
  }

  public update(dimensions: Partial<ViewportDimensions>): void {
    this.dimensions = { ...this.dimensions, ...dimensions };
    this.transformMatrix = this.calculateTransform();
    
    log('ViewportTransform', 'Updated transform', {
      dimensions: this.dimensions,
      matrix: this.getMatrixValues()
    });
  }
}