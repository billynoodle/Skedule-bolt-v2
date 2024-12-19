import { PDFPageProxy } from 'pdfjs-dist';
import { PDFDimensions } from '../types';
import { log } from '../../../utils/logger';

export function calculatePageDimensions(page: PDFPageProxy): PDFDimensions {
  const viewport = page.getViewport({ scale: 1, rotation: 0 });
  const isPortrait = viewport.width < viewport.height;
  
  // Determine if rotation is needed
  const rotation = isPortrait ? 90 : 0;
  
  // Get dimensions after rotation
  const rotatedViewport = page.getViewport({ scale: 1, rotation });
  
  const dimensions: PDFDimensions = {
    width: rotatedViewport.width,
    height: rotatedViewport.height,
    rotation,
    isPortrait
  };

  log('PDFDimensions', 'Calculated page dimensions', dimensions);
  return dimensions;
}