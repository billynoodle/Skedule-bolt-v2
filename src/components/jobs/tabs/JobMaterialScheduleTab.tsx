import React, { useState, useCallback } from 'react';
import { Document } from '../../../types/document';
import { PdfViewer } from '../../../features/materialSchedule/components/PdfViewer';
import { PatternPanel } from '../../../features/materialSchedule/components/patterns/PatternPanel';
import { OcrOverlay } from '../../../features/materialSchedule/components/OcrOverlay';
import { useOcrProcessing } from '../../../features/materialSchedule/hooks/useOcrProcessing';
import { useTagPatterns } from '../../../features/materialSchedule/hooks/useTagPatterns';
import { useAnnotationStore } from '../../../stores/annotationStore';
import { log } from '../../../utils/logger';

interface JobMaterialScheduleTabProps {
  document: Document;
  jobId: string;
}

export function JobMaterialScheduleTab({ document, jobId }: JobMaterialScheduleTabProps) {
  const [autoLinkEnabled, setAutoLinkEnabled] = useState(true);
  const [ocrError, setOcrError] = useState<string | null>(null);
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);
  const [showPatternForm, setShowPatternForm] = useState(false);
  const [hoveredAnnotationIds, setHoveredAnnotationIds] = useState<string[] | null>(null);

  const { selectedId } = useAnnotationStore();
  const { 
    patterns,
    linkedPatterns,
    loading,
    error,
    savePattern,
    updatePattern,
    deletePattern,
    linkPattern,
    fetchPatterns
  } = useTagPatterns(document.id);

  const { processing, processAnnotation } = useOcrProcessing({
    onTextExtracted: (text, confidence) => {
      log('MaterialSchedule', 'Text extracted', { text, confidence });
    },
    onError: (error) => {
      setOcrError(error);
      setTimeout(() => setOcrError(null), 3000);
    }
  });

  const handleAnnotationComplete = useCallback(() => {
    if (autoLinkEnabled) {
      setShowPatternForm(true);
      log('MaterialSchedule', 'Auto-link enabled, showing pattern form');
    }
  }, [autoLinkEnabled]);

  const handlePatternSave = async (pattern: any) => {
    try {
      const savedPattern = await savePattern(pattern);
      if (selectedId && autoLinkEnabled) {
        await linkPattern(selectedId, savedPattern.id);
      }
      setShowPatternForm(false);
    } catch (err) {
      console.error('Failed to save pattern:', err);
    }
  };

  const handlePatternLink = async (patternId: string) => {
    if (selectedId) {
      await linkPattern(selectedId, patternId);
    }
  };

  return (
    <div className="h-[calc(100vh-12rem)] flex">
      <div className={`flex-1 min-w-0 bg-white rounded-${isPanelCollapsed ? 'xl' : 'l-xl'} border border-gray-200`}>
        <PdfViewer
          document={document}
          jobId={jobId}
          documentId={document.id}
          onAnnotationComplete={handleAnnotationComplete}
          highlightedAnnotationIds={hoveredAnnotationIds}
        />
      </div>

      {processing && <OcrOverlay processing={processing} error={ocrError} />}

      <PatternPanel
        patterns={patterns}
        selectedAnnotationId={selectedId}
        linkedPatterns={linkedPatterns}
        loading={loading}
        error={error}
        autoLinkEnabled={autoLinkEnabled}
        onAutoLinkChange={setAutoLinkEnabled}
        onSavePattern={handlePatternSave}
        onUpdatePattern={updatePattern}
        onDeletePattern={deletePattern}
        onLinkPattern={handlePatternLink}
        onHoverPattern={setHoveredAnnotationIds}
        isCollapsed={isPanelCollapsed}
        onCollapse={setIsPanelCollapsed}
        showPatternForm={showPatternForm}
        onPatternFormClose={() => setShowPatternForm(false)}
        onAddPattern={() => setShowPatternForm(true)}
      />
    </div>
  );
}