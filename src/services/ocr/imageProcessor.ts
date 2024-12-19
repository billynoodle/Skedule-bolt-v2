import { log } from '../../utils/logger';

export function processImageData(imageData: ImageData): ImageData {
  const enhancedData = enhanceContrast(imageData);
  const binarizedData = binarize(enhancedData);
  
  log('ImageProcessor', 'Image processed', {
    width: imageData.width,
    height: imageData.height
  });
  
  return binarizedData;
}

function enhanceContrast(imageData: ImageData): ImageData {
  const data = new Uint8ClampedArray(imageData.data);
  const contrast = 1.2;
  const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));

  for (let i = 0; i < data.length; i += 4) {
    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
    const newValue = factor * (avg - 128) + 128;
    
    data[i] = newValue;     // R
    data[i + 1] = newValue; // G
    data[i + 2] = newValue; // B
    // Alpha remains unchanged
  }

  return new ImageData(data, imageData.width, imageData.height);
}

function binarize(imageData: ImageData): ImageData {
  const data = new Uint8ClampedArray(imageData.data);
  const threshold = 128;

  for (let i = 0; i < data.length; i += 4) {
    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
    const value = avg > threshold ? 255 : 0;
    
    data[i] = value;     // R
    data[i + 1] = value; // G
    data[i + 2] = value; // B
    // Alpha remains unchanged
  }

  return new ImageData(data, imageData.width, imageData.height);
}