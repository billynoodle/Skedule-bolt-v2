import React, { useState, useCallback } from 'react';
import { Document, Page } from 'react-pdf';
import useMeasure from 'react-use-measure';
import { useViewerStore } from '../../../stores/viewerStore';
import { AnnotationCanvas } from '../annotations/AnnotationCanvas';
import { PDF_OPTIONS } from '../../../lib/pdfInitializer';
import { log } from '../../../utils/logger';

interface PDFRendererProps {
  file: File;
}

export function PDFRenderer({ file }: PDFRendererProps) {
  const [containerRef, bounds] = useMeasure();
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const viewerState = useViewerStore();

  const handleDocumentLoadSuccess = useCallback(() => {
    setLoading(true);
    log('PDFRenderer', 'Document loaded successfully');
  }, []);

  const handlePageLoadSuccess = useCallback((page: any) => {
    const viewport = page.getViewport({ scale: 1, rotation: viewerState.rotation });
    setDimensions({
      width: viewport.width,
      height: viewport.height
    });
    setLoading(false);
    log('PDFRenderer', 'Page loaded successfully', { dimensions: viewport });
  }, [viewerState.rotation]);

  return (
    <div className="relative h-full bg-gray-100">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        </div>
      )}

      <div 
        ref={containerRef} 
        className="relative h-full overflow-auto"
      >
        <div className="relative inline-block">
          <Document
            file={file}
            onLoadSuccess={handleDocumentLoadSuccess}
            loading={null}
            options={PDF_OPTIONS}
            error={
              <div className="flex items-center justify-center h-full">
                <p className="text-red-500">Error loading PDF</p>
              </div>
            }
          >
            <Page
              pageNumber={1}
              scale={viewerState.scale}
              rotate={viewerState.rotation}
              loading={null}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              className="shadow-lg"
              onLoadSuccess={handlePageLoadSuccess}
            />
          </Document>

          {dimensions && (
            <AnnotationCanvas
              width={dimensions.width}
              height={dimensions.height}
              containerBounds={bounds}
            />
          )}
        </div>
      </div>
    </div>
  );
}