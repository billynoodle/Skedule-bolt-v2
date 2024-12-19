import React, { useEffect, useState } from 'react';
import { usePDFViewer } from '../../hooks/usePDFViewer';
import { useAnnotationCanvas } from '../../hooks/useAnnotationCanvas';
import { useOCRProcessor } from '../../hooks/useOCRProcessor';
import { ViewerToolbar } from './ViewerToolbar';
import { AnnotationToolbar } from './AnnotationToolbar';
import { OCROverlay } from './OCROverlay';
import { log } from '../../utils/logger';

interface PDFViewerProps {
  url: string;
  onAnnotationCreate?: (annotation: any) => void;
  onAnnotationUpdate?: (annotation: any) => void;
  onTextExtracted?: (text: string, confidence: number) => void;
}

export function PDFViewer({
  url,
  onAnnotationCreate,
  onAnnotationUpdate,
  onTextExtracted
}: PDFViewerProps) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [scale, setScale] = useState(1);
  
  // Initialize services
  const { pdfManager, loading: pdfLoading, error: pdfError, loadDocument } = usePDFViewer();
  const { canvasRef, createAnnotation, updateAnnotation } = useAnnotationCanvas({
    width: dimensions.width,
    height: dimensions.height,
    scale
  });
  const { processing: ocrProcessing, error: ocrError, initialize: initOCR, processImage } = useOCRProcessor({
    language: 'eng',
    mode: 'single-line',
    whitelist: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ-'
  });

  // Load document
  useEffect(() => {
    loadDocument(url);
  }, [url, loadDocument]);

  // Initialize OCR
  useEffect(() => {
    initOCR();
  }, [initOCR]);

  // Handle page load
  const handlePageLoad = async (page: any) => {
    const viewport = page.getViewport({ scale: 1 });
    setDimensions({
      width: viewport.width,
      height: viewport.height
    });
    log('PDFViewer', 'Page loaded', { dimensions: viewport });
  };

  // Handle annotation creation
  const handleAnnotationCreate = async (config: any) => {
    const annotation = createAnnotation(config);
    if (!annotation) return;

    onAnnotationCreate?.(annotation);

    // Process OCR if enabled
    if (onTextExtracted) {
      const imageData = await getAnnotationImageData(annotation);
      if (imageData) {
        const result = await processImage(imageData);
        if (result) {
          onTextExtracted(result.text, result.confidence);
        }
      }
    }
  };

  // Handle annotation update
  const handleAnnotationUpdate = (id: string, updates: any) => {
    updateAnnotation(id, updates);
    onAnnotationUpdate?.(updates);
  };

  if (pdfError) {
    return (
      <div className="flex items-center justify-center h-full bg-red-50 text-red-600 p-4">
        Failed to load PDF: {pdfError}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-100">
      <ViewerToolbar scale={scale} onScaleChange={setScale} />
      
      <div className="flex-1 relative overflow-hidden">
        {pdfLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
          </div>
        )}

        <div className="relative h-full">
          {/* PDF Canvas */}
          <canvas ref={canvasRef} className="absolute inset-0" />
          
          {/* Annotation Toolbar */}
          <div className="absolute top-4 right-4 z-10">
            <AnnotationToolbar
              onCreateAnnotation={handleAnnotationCreate}
              onUpdateAnnotation={handleAnnotationUpdate}
            />
          </div>

          {/* OCR Processing Overlay */}
          {ocrProcessing && (
            <OCROverlay processing={ocrProcessing} error={ocrError} />
          )}
        </div>
      </div>
    </div>
  );
}