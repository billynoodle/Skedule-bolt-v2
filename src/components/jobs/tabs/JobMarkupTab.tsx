import React from 'react';
import { PdfViewer } from '../../../features/materialSchedule/components/PdfViewer';

interface JobMarkupTabProps {
  file: File;
  jobId: string;
}

export function JobMarkupTab({ file, jobId }: JobMarkupTabProps) {
  // Create a hash from the file name only - we don't need lastModified for annotations
  const documentId = btoa(file.name).replace(/[^a-zA-Z0-9]/g, '');

  return (
    <div className="h-[calc(100vh-10rem)] bg-gray-50 rounded-lg overflow-hidden">
      <PdfViewer file={file} jobId={jobId} documentId={documentId} />
    </div>
  );
}