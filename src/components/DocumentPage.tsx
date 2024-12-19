import React, { useCallback } from 'react';
import { Document, Page } from 'react-pdf';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

interface DocumentPageProps {
  file: string;
  pageNumber: number;
  numPages: number;
  rotation: number;
  isDrawingMode: boolean;
  loading: boolean;
  scale: number;
  onLoadSuccess: (dimensions: { width: number; height: number }) => void;
  onDocumentLoadSuccess: ({ numPages }: { numPages: number }) => void;
  onTransform: ({ state }: any) => void;
  transformComponentRef: React.RefObject<any>;
}

export function DocumentPage({
  file,
  pageNumber,
  numPages,
  rotation,
  isDrawingMode,
  loading,
  scale,
  onLoadSuccess,
  onDocumentLoadSuccess,
  onTransform,
  transformComponentRef
}: DocumentPageProps) {
  const handlePageLoadSuccess = useCallback((page: any) => {
    const viewport = page.getViewport({ scale: 1, rotation: 0 });
    onLoadSuccess({ width: viewport.width, height: viewport.height });
  }, [onLoadSuccess]);

  return (
    <TransformWrapper
      ref={transformComponentRef}
      initialScale={1}
      minScale={0.2}
      maxScale={5}
      limitToBounds={false}
      disabled={isDrawingMode}
      onTransformed={onTransform}
      centerOnInit
      smooth
      wheel={{
        step: 0.05,
        smoothStep: 0.002,
        wheelDisabled: false,
        touchPadDisabled: false,
        activationKeys: []
      }}
      panning={{
        disabled: isDrawingMode,
        velocityDisabled: false,
        velocity: false,
        lockAxisX: false,
        lockAxisY: false,
        allowLeftClickPan: true,
        allowMiddleClickPan: false,
        allowRightClickPan: false,
        activationKeys: []
      }}
      alignmentAnimation={{
        disabled: true
      }}
      zoomAnimation={{
        disabled: false,
        size: 10,
        animationType: "linear",
        animationTime: 200,
        animationThreshold: 0.01
      }}
      doubleClick={{
        disabled: true
      }}
      pinch={{
        disabled: false,
        step: 5
      }}
    >
      <TransformComponent
        wrapperStyle={{
          width: '100%',
          height: 'calc(100vh - 200px)',
        }}
        contentStyle={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div className="relative flex items-center justify-center">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
            </div>
          )}
          <Document
            file={file}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={null}
            error={
              <div className="flex items-center justify-center h-full">
                <p className="text-red-500">Error loading PDF</p>
              </div>
            }
          >
            <Page
              key={`page_${pageNumber}_${rotation}_${scale}`}
              pageNumber={pageNumber}
              rotate={rotation}
              loading={null}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              className="shadow-lg"
              onLoadSuccess={handlePageLoadSuccess}
              scale={scale}
            />
          </Document>
        </div>
      </TransformComponent>
    </TransformWrapper>
  );
}