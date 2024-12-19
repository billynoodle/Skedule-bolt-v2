import React, { useMemo } from 'react';
import { PDFRenderer } from './renderers/PDFRenderer';
import { ImageRenderer } from './renderers/ImageRenderer';
import { ViewerProvider } from '../../contexts/ViewerContext';
import { AnnotationProvider } from '../../contexts/AnnotationContext';

interface FileViewerProps {
  file: File;
  onError?: (error: string) => void;
}

export function FileViewer({ file, onError }: FileViewerProps) {
  const Renderer = useMemo(() => {
    if (file.type === 'application/pdf') {
      return PDFRenderer;
    }
    if (file.type.startsWith('image/')) {
      return ImageRenderer;
    }
    onError?.('Unsupported file type');
    return null;
  }, [file.type, onError]);

  if (!Renderer) {
    return null;
  }

  return (
    <ViewerProvider>
      <AnnotationProvider>
        <div className="relative h-full bg-white rounded-lg shadow-lg overflow-hidden">
          <Renderer file={file} />
        </div>
      </AnnotationProvider>
    </ViewerProvider>
  );
}