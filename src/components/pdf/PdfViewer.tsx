// src/components/viewer/PdfViewer.tsx
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Document, Page } from 'react-pdf';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { supabase } from '../../services/supabase/client';
import { Document as DocumentType } from '../../types/document';
import { PDF_OPTIONS } from '../../lib/pdfInitializer';
import { AnnotationToolbar } from './annotations/AnnotationToolbar';
import { useViewerStore } from '../../stores/viewerStore';
import { useAnnotationStore } from '../../stores/annotationStore';
import { AnnotationCanvas } from './annotations/canvas/AnnotationCanvas';
import { log, error as logError } from '../../utils/logger';

interface PdfViewerProps {
  document: DocumentType;
  jobId: string;
  documentId: string;
  onAnnotationComplete?: () => void;
}

export function PdfViewer({ document, jobId, documentId, onAnnotationComplete }: PdfViewerProps) {
  const [numPages, setNumPages] = useState(1);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [loading, setLoading] = useState(true);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const transformComponentRef = useRef(null);
  const viewerState = useViewerStore();
  const { 
    getDocumentState, 
    setDocumentRotation, 
    setDocumentScale
  } = useAnnotationStore();
  const { rotation, scale } = getDocumentState(jobId, documentId);

  useEffect(() => {
    async function getSignedUrl() {
      try {
        log('PdfViewer', 'Getting signed URL', { filePath: document.filePath });
        
        const { data, error: urlError } = await supabase.storage
          .from('documents')
          .createSignedUrl(document.filePath, 3600);

        if (urlError) throw urlError;
        if (!data?.signedUrl) throw new Error('No signed URL returned');

        setFileUrl(data.signedUrl);
        log('PdfViewer', 'Signed URL obtained successfully');
      } catch (err) {
        logError('PdfViewer', 'Failed to get signed URL', err);
        setLoading(false);
      }
    }

    if (document.filePath) {
      getSignedUrl();
    }
  }, [document.filePath]);

  const handleDocumentLoadSuccess = useCallback(({ numPages: nextNumPages }) => {
    setNumPages(nextNumPages);
    setLoading(false);
    log('PdfViewer', 'Document loaded successfully', { pages: nextNumPages });
  }, []);

  const handlePageLoadSuccess = useCallback((page: any) => {
    const viewport = page.getViewport({ scale: 1, rotation: 0 });
    const isPortrait = viewport.width < viewport.height;
    
    if (isPortrait && rotation === 0) {
      setDocumentRotation(jobId, documentId, 90);
    }

    const rotated = rotation % 180 !== 0;
    const width = rotated ? viewport.height : viewport.width;
    const height = rotated ? viewport.width : viewport.height;

    setDimensions({ width, height });
    setLoading(false);
    
    log('PdfViewer', 'Page loaded successfully', { 
      dimensions: { width, height },
      rotation,
      isPortrait
    });
  }, [jobId, documentId, rotation, setDocumentRotation]);

  const handleScaleChange = useCallback((newScale: number) => {
    setDocumentScale(jobId, documentId, newScale);
  }, [jobId, documentId, setDocumentScale]);

  if (!fileUrl) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-none bg-white border-b border-gray-200">
        <AnnotationToolbar 
          jobId={jobId} 
          documentId={documentId} 
          scale={scale}
          onScaleChange={handleScaleChange}
        />
      </div>

      <div className="flex-1 relative overflow-hidden bg-gray-100">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
          </div>
        )}

        <TransformWrapper
          ref={transformComponentRef}
          initialScale={1}
          minScale={0.1}
          maxScale={5}
          centerOnInit
          disabled={viewerState.mode === 'draw'}
          wheel={{ disabled: false }}
          panning={{ disabled: viewerState.mode === 'draw' }}
        >
          <TransformComponent
            wrapperStyle={{
              width: '100%',
              height: '100%'
            }}
          >
            <div className="relative">
              <Document
                file={fileUrl}
                onLoadSuccess={handleDocumentLoadSuccess}
                options={PDF_OPTIONS}
                loading={null}
                error={
                  <div className="flex items-center justify-center h-full">
                    <p className="text-red-500">Error loading PDF</p>
                  </div>
                }
              >
                <Page
                  pageNumber={1}
                  scale={scale}
                  rotate={rotation}
                  loading={null}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  className="shadow-lg"
                  onLoadSuccess={handlePageLoadSuccess}
                />
              </Document>

              {dimensions.width > 0 && (
                <AnnotationCanvas
                  width={dimensions.width}
                  height={dimensions.height}
                  containerBounds={{
                    width: dimensions.width * scale,
                    height: dimensions.height * scale,
                    left: 0,
                    top: 0
                  }}
                  jobId={jobId}
                  documentId={documentId}
                  onAnnotationComplete={onAnnotationComplete}
                />
              )}
            </div>
          </TransformComponent>
        </TransformWrapper>
      </div>
    </div>
  );
}
