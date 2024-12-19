import { fabric } from 'fabric';
import { log, error } from './logger';

export function getImageDataFromCanvas(
  canvas: fabric.Canvas,
  object: fabric.Object,
  padding: number = 5
): ImageData | null {
  if (!canvas || !object) {
    error('Canvas', 'Invalid canvas or object');
    return null;
  }

  try {
    // Get object bounds with padding
    const bounds = object.getBoundingRect();
    const left = Math.max(0, Math.floor(bounds.left - padding));
    const top = Math.max(0, Math.floor(bounds.top - padding));
    const width = Math.ceil(bounds.width + (padding * 2));
    const height = Math.ceil(bounds.height + (padding * 2));

    // Create temporary canvas for the cropped area
    const tempCanvas = document.createElement('canvas');
    const ctx = tempCanvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) {
      error('Canvas', 'Could not get canvas context');
      return null;
    }

    // Set dimensions
    tempCanvas.width = width;
    tempCanvas.height = height;

    // Get the main canvas context
    const mainCanvas = canvas.lowerCanvasEl;
    
    // Draw the cropped area
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(
      mainCanvas,
      left, top, width, height,
      0, 0, width, height
    );

    const imageData = ctx.getImageData(0, 0, width, height);
    log('Canvas', 'Image data extracted', { 
      dimensions: { width, height },
      bounds: { left, top }
    });

    return imageData;
  } catch (err) {
    error('Canvas', 'Failed to get image data', err);
    return null;
  }
}