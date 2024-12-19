import React from 'react';
import { Square, MousePointer } from 'lucide-react';
import { useViewerStore } from '../../stores/viewerStore';

interface AnnotationToolbarProps {
  onCreateAnnotation: (config: any) => void;
  onUpdateAnnotation: (id: string, updates: any) => void;
}

export function AnnotationToolbar({
  onCreateAnnotation,
  onUpdateAnnotation
}: AnnotationToolbarProps) {
  const { mode, setMode } = useViewerStore();

  return (
    <div className="flex items-center gap-2 bg-white rounded-lg shadow-lg p-2">
      <button
        onClick={() => setMode('select')}
        className={`p-2 rounded-lg transition-colors ${
          mode === 'select'
            ? 'bg-blue-100 text-blue-600'
            : 'hover:bg-gray-100 text-gray-600'
        }`}
        title="Select Mode"
      >
        <MousePointer className="w-5 h-5" />
      </button>

      <button
        onClick={() => setMode('draw')}
        className={`p-2 rounded-lg transition-colors ${
          mode === 'draw'
            ? 'bg-blue-100 text-blue-600'
            : 'hover:bg-gray-100 text-gray-600'
        }`}
        title="Draw Box"
      >
        <Square className="w-5 h-5" />
      </button>
    </div>
  );
}