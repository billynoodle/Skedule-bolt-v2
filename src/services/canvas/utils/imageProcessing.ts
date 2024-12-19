import { log } from '../../../utils/logger';

export function getImageDataFromCanvas(
  canvas: HTMLCanvasElement,
  region: { x: number; y: number; width: number; height: number }
): ImageData | null {
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  try {
    const imageData = ctx.getImageData(
      region.x,
      region.y,
      region.width,
      region.height
    );

    log('ImageProcessing', 'Extracted image data', {
      dimensions: { width: region.width, height: region.height },
      position: { x: region.x, y: region.y }
    });

    return imageData;
  } catch (err) {
    log('ImageProcessing', 'Failed to get image data', err);
    return null;
  }
}

export function preprocessImageData(imageData: ImageData): ImageData {
  const data = new Uint8ClampedArray(imageData.data);
  
  // Convert to grayscale and enhance contrast
  for (let i = 0; i < data.length; i += 4) {
    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
    const enhanced = Math.min(255, Math.max(0, (avg - 128) * 1.2 + 128));
    data[i] = enhanced;
    data[i + 1] = enhanced;
    data[i + 2] = enhanced;
  }

  log('ImageProcessing', 'Image preprocessed', {
    width: imageData.width,
    height: imageData.height
  });

  return new ImageData(data, imageData.width, imageData.height);
}