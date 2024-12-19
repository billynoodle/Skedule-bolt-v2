import React, { useState } from 'react';
import { PdfViewer } from './PdfViewer';
import { PatternPanel } from './patterns/PatternPanel';
import { useViewerStore } from '../../../stores/viewerStore';
import { useAnnotationStore } from '../../../stores/annotationStore';
import { log } from '../../../utils/logger';

interface MaterialScheduleTabProps {
  document: {
    id: string;
    filePath: string;
  };
  jobId: string;
}

export function MaterialScheduleTab({ document, jobId }: MaterialScheduleTabProps) {
  const [autoLinkEnabled, setAutoLinkEnabled] = useState(true);
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);
  const viewerStore = useViewerStore();
  const { selectedId } = useAnnotationStore();

  const handleAnnotationComplete = () => {
    if (autoLinkEnabled) {
      viewerStore.setMode('select');
      log('MaterialSchedule', 'Auto-switching to select mode');
    }
  };

  return (
    <div className="h-[calc(100vh-12rem)] flex">
      <div className={`flex-1 min-w-0 bg-white rounded-${isPanelCollapsed ? 'xl' : 'l-xl'} border border-gray-200`}>
        <PdfViewer
          document={document}
          jobId={jobId}
          onAnnotationComplete={handleAnnotationComplete}
        />
      </div>

      <PatternPanel
        documentId={document.id}
        isCollapsed={isPanelCollapsed}
        onCollapse={setIsPanelCollapsed}
        selectedAnnotationId={selectedId}
        autoLinkEnabled={autoLinkEnabled}
        onAutoLinkChange={setAutoLinkEnabled}
      />
    </div>
  );
}