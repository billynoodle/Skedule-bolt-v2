import { useState, useCallback } from 'react';
import { PDFPageProxy } from 'pdfjs-dist';
import { DocumentPreparationService, DocumentDimensions } from '../../../services/pdf/documentPreparation';
import { CoordinateSystem } from '../../../services/canvas/coordinateSystem';
import { log } from '../../../utils/logger';

export function useDocumentPreparation() {
  const [dimensions, setDimensions] = useState<DocumentDimensions | null>(null);
  const [coordinateSystem, setCoordinateSystem] = useState<CoordinateSystem | null>(null);

  const preparePage = useCallback(async (page: PDFPageProxy) => {
    try {
      // Prepare page and get optimal settings
      const { dimensions: documentDimensions, viewport } = 
        await DocumentPreparationService.preparePage(page);
      
      setDimensions(documentDimensions);

      // Create coordinate system with proper transformation
      const system = new CoordinateSystem(
        {
          width: viewport.width,
          height: viewport.height
        },
        1,
        documentDimensions.rotation
      );
      
      setCoordinateSystem(system);

      log('DocumentPreparation', 'Page prepared successfully', {
        dimensions: documentDimensions,
        transform: system.getTransformMatrix()
      });

      return { documentDimensions, system };
    } catch (err) {
      log('DocumentPreparation', 'Failed to prepare page', { error: err });
      throw err;
    }
  }, []);

  return {
    dimensions,
    coordinateSystem,
    preparePage
  };
}