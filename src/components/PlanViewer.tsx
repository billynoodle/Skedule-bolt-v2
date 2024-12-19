import React, { useState, useEffect } from 'react';
import { PdfViewer } from './pdf';
import { ErrorBoundary } from './ErrorBoundary';

interface PlanViewerProps {
  file: File;
  initialPage?: number;
  onPageChange?: (page: number) => void;
  onAnnotationCreate?: (annotation: any) => void;
  onAnnotationUpdate?: (annotation: any) => void;
  onAnnotationDelete?: (annotation: any) => void;
}

export function PlanViewer({ 
  file, 
  initialPage = 1, 
  onPageChange,
  onAnnotationCreate,
  onAnnotationUpdate,
  onAnnotationDelete 
}: PlanViewerProps) {
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  useEffect(() => {
    const reader = new FileReader();
    reader.onload = () => {
      const arrayBuffer = reader.result as ArrayBuffer;
      const blob = new Blob([arrayBuffer], { type: file.type });
      const url = URL.createObjectURL(blob);
      setFileUrl(url);
    };
    reader.readAsArrayBuffer(file);

    return () => {
      if (fileUrl) {
        URL.revokeObjectURL(fileUrl);
      }
    };
  }, [file]);

  if (!fileUrl) {
    return (
      <div className="flex items-center justify-center h-full bg-white rounded-lg shadow-lg">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="h-full bg-white rounded-lg shadow-lg">
        <PdfViewer
          url={fileUrl}
          initialPage={initialPage}
          onPageChange={onPageChange}
          onAnnotationCreate={onAnnotationCreate}
          onAnnotationUpdate={onAnnotationUpdate}
          onAnnotationDelete={onAnnotationDelete}
        />
      </div>
    </ErrorBoundary>
  );
}