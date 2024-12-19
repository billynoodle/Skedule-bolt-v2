import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Document, Page } from 'react-pdf';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { getFileUrl } from '../../../services/supabase/storage/access';
import { AnnotationCanvas } from './annotations/canvas/AnnotationCanvas';
import { AnnotationToolbar } from './annotations/AnnotationToolbar';
import { useViewerStore } from '../../../stores/viewerStore';
import { useAnnotationStore } from '../../../stores/annotationStore';
import { PDF_OPTIONS } from '../../../services/pdf/config';
import { log } from '../../../utils/logger';

interface PdfViewerProps {
  document: {
    id: string;
    filePath: string;
  };
  jobId: string;
  onAnnotationComplete?: () => void;
}

export function PdfViewer({ document, jobId, onAnnotationComplete }: PdfViewerProps) {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);
  const transformComponentRef = useRef(null);
  const viewerStore = useViewerStore();
  const annotationStore = useAnnotationStore();
  const { scale, rotation } = annotationStore.getDocumentState(jobId, document.id);

  // Get signed URL for document
  useEffect(() => {
    let mounted = true;
    
    async function fetchUrl() {
      try {
        setLoading(true);
        const url = await getFileUrl(document.filePath);
        if (mounted) {
          setFileUrl(url);
          log('PdfViewer', 'Got signed URL');
        }
      } catch (err) {
        log('PdfViewer', 'Failed to get signed URL', err);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchUrl();
    return () => { mounted = false; };
  }, [document.filePath]);

  const handleDocumentLoadSuccess = useCallback(() => {
    log('PdfViewer', 'Document loaded successfully');
  }, []);

  const handlePageLoadSuccess = useCallback((page: any) => {
    const viewport = page.getViewport({ scale: 1, rotation });
    setDimensions({
      width: viewport.width,
      height: viewport.height
    });
    setLoading(false);
    log('PdfViewer', 'Page loaded successfully', { dimensions: viewport });
  }, [rotation]);

  const handleScaleChange = useCallback((newScale: number) => {
    annotationStore.setDocumentState(jobId, document.id, { scale: newScale });
  }, [jobId, document.id, annotationStore]);

  if (!fileUrl) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-none">
        <AnnotationToolbar 
          jobId={jobId} 
          documentId={document.id}
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
          disabled={viewerStore.mode === 'draw'}
          wheel={{ disabled: false }}
          panning={{ disabled: viewerStore.mode === 'draw' }}
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
                options={{
                  ...PDF_OPTIONS,
                  defaultViewport: {
                    ...PDF_OPTIONS.defaultViewport,
                    rotation
                  }
                }}
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

              {dimensions && (
                <AnnotationCanvas
                  width={dimensions.width}
                  height={dimensions.height}
                  jobId={jobId}
                  documentId={document.id}
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