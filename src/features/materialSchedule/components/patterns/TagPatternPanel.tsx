import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { TagPatternForm } from './TagPatternForm';
import { TagPatternList } from './TagPatternList';
import { useTagPatterns } from '../../hooks/useTagPatterns';
import { log } from '../../../../utils/logger';

interface TagPatternPanelProps {
  documentId: string;
  isCollapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
  autoLinkEnabled: boolean;
  onAutoLinkChange: (enabled: boolean) => void;
}

export function TagPatternPanel({
  documentId,
  isCollapsed,
  onCollapse,
  autoLinkEnabled,
  onAutoLinkChange
}: TagPatternPanelProps) {
  const [isAddingPattern, setIsAddingPattern] = useState(false);
  const {
    patterns,
    loading,
    error,
    selectedAnnotationId,
    savePattern,
    deletePattern
  } = useTagPatterns(documentId);

  if (isCollapsed) {
    return (
      <button
        onClick={() => onCollapse(false)}
        className="w-8 bg-white border-l border-gray-200 hover:bg-gray-50 flex items-center justify-center"
      >
        <ChevronLeft className="w-5 h-5 text-gray-400" />
      </button>
    );
  }

  return (
    <div className="w-96 bg-white rounded-r-xl border-t border-r border-b border-gray-200">
      <div className="h-full flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-medium text-gray-900">Material Schedule</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onAutoLinkChange(!autoLinkEnabled)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  autoLinkEnabled
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                Auto-link {autoLinkEnabled ? 'ON' : 'OFF'}
              </button>
              <button
                onClick={() => setIsAddingPattern(true)}
                className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
              <button
                onClick={() => onCollapse(true)}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4">
          {error && (
            <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-200">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            </div>
          ) : isAddingPattern ? (
            <TagPatternForm
              onSave={async (pattern) => {
                await savePattern(pattern);
                setIsAddingPattern(false);
                log('TagPatternPanel', 'Pattern saved');
              }}
              onCancel={() => setIsAddingPattern(false)}
            />
          ) : (
            <TagPatternList
              patterns={patterns}
              selectedAnnotationId={selectedAnnotationId}
              onPatternSelect={(id) => {
                log('TagPatternPanel', 'Pattern selected', { id });
              }}
              onPatternDelete={deletePattern}
            />
          )}
        </div>
      </div>
    </div>
  );
}