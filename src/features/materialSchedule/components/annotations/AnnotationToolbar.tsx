import React, { useState } from 'react';
import { Square, MousePointer, Trash2, XCircle, ZoomIn, ZoomOut, Undo2 } from 'lucide-react';
import { useViewerStore } from '../../../../stores/viewerStore';
import { useAnnotationStore } from '../../../../stores/annotationStore';
import { ConfirmDialog } from '../../../../components/shared/ConfirmDialog';
import { log, error as logError } from '../../../../utils/logger';

interface AnnotationToolbarProps {
  jobId: string;
  documentId: string;
  scale: number;
  onScaleChange: (scale: number) => void;
}

export function AnnotationToolbar({ 
  jobId, 
  documentId,
  scale,
  onScaleChange
}: AnnotationToolbarProps) {
  const { mode, setMode } = useViewerStore();
  const { 
    selectedId, 
    deleteAnnotation, 
    clearAnnotations 
  } = useAnnotationStore();
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleModeChange = (newMode: 'select' | 'draw') => {
    setMode(newMode);
    log('AnnotationToolbar', 'Mode changed', { mode: newMode });
  };

  const handleClearAnnotations = async () => {
    try {
      await clearAnnotations(jobId, documentId);
      setShowClearConfirm(false);
      log('AnnotationToolbar', 'Annotations cleared successfully');
    } catch (err) {
      logError('AnnotationToolbar', 'Failed to clear annotations', err);
    }
  };

  const handleDeleteSelected = async () => {
    if (!selectedId) return;
    try {
      await deleteAnnotation(jobId, documentId, selectedId);
      log('AnnotationToolbar', 'Selected annotation deleted');
    } catch (err) {
      logError('AnnotationToolbar', 'Failed to delete annotation', err);
    }
  };

  return (
    <div className="relative flex items-center justify-between p-2 bg-white border-b border-gray-200">
      <div className="flex items-center space-x-2">
        <button
          onClick={() => handleModeChange('select')}
          className={`p-2 rounded-xl transition-all duration-200 ${
            mode === 'select'
              ? 'bg-blue-100 text-blue-600 shadow-sm'
              : 'hover:bg-gray-100 text-gray-600'
          }`}
          title="Select Mode"
        >
          <MousePointer className="w-5 h-5" />
        </button>

        <button
          onClick={() => handleModeChange('draw')}
          className={`p-2 rounded-xl transition-all duration-200 ${
            mode === 'draw'
              ? 'bg-blue-100 text-blue-600 shadow-sm'
              : 'hover:bg-gray-100 text-gray-600'
          }`}
          title="Draw Box"
        >
          <Square className="w-5 h-5" />
        </button>

        <div className="w-px h-6 bg-gray-200 mx-2" />

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onScaleChange(Math.max(scale - 0.1, 0.1))}
            className="p-2 rounded-xl hover:bg-gray-100 text-gray-600 transition-all duration-200"
            title="Zoom Out"
          >
            <ZoomOut className="w-5 h-5" />
          </button>
          <span className="text-sm font-medium text-gray-700 min-w-[3rem] text-center">
            {Math.round(scale * 100)}%
          </span>
          <button
            onClick={() => onScaleChange(Math.min(scale + 0.1, 5))}
            className="p-2 rounded-xl hover:bg-gray-100 text-gray-600 transition-all duration-200"
            title="Zoom In"
          >
            <ZoomIn className="w-5 h-5" />
          </button>
        </div>

        <div className="w-px h-6 bg-gray-200 mx-2" />

        <button
          onClick={handleDeleteSelected}
          disabled={!selectedId}
          className={`p-2 rounded-xl transition-all duration-200 ${
            selectedId
              ? 'text-red-600 hover:bg-red-50'
              : 'text-gray-400 cursor-not-allowed'
          }`}
          title="Delete Selected"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowClearConfirm(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-200"
          title="Clear All Annotations"
        >
          <XCircle className="w-4 h-4" />
          <span className="text-sm font-medium">Clear All</span>
        </button>
      </div>

      <ConfirmDialog
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        onConfirm={handleClearAnnotations}
        title="Clear All Annotations"
        message="Are you sure you want to clear all annotations? This action cannot be undone."
        confirmLabel="Clear All"
        confirmVariant="danger"
      />
    </div>
  );
}