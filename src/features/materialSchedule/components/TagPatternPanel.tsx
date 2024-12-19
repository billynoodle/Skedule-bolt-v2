import React, { useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { TagPatternForm } from './TagPatternForm';
import { TagPatternList } from './TagPatternList';
import { useTagPatternStore } from '../../../stores/tagPatternStore';
import { log } from '../../../utils/logger';

interface TagPatternPanelProps {
  documentId: string;
  isCollapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
  isAddingPattern: boolean;
  onAddPattern: (adding: boolean) => void;
  autoLinkEnabled: boolean;
  onAutoLinkChange: (enabled: boolean) => void;
  selectedAnnotationId: string | null;
  onError: (error: string | null) => void;
}

export function TagPatternPanel({
  documentId,
  isCollapsed,
  onCollapse,
  isAddingPattern,
  onAddPattern,
  autoLinkEnabled,
  onAutoLinkChange,
  selectedAnnotationId,
  onError
}: TagPatternPanelProps) {
  const { patterns, loading, error: storeError } = useTagPatternStore();

  // Fetch patterns when component mounts
  useEffect(() => {
    const fetchPatterns = async () => {
      try {
        await tagPatternStore.fetchPatterns(documentId);
      } catch (err) {
        onError('Failed to load patterns');
        log('TagPatternPanel', 'Failed to fetch patterns', err);
      }
    };
    fetchPatterns();
  }, [documentId, tagPatternStore, onError]);

  const handleSavePattern = async (pattern: { prefix: string; description: string; scheduleTable: string }) => {
    try {
      log('TagPatternPanel', 'Saving pattern', { pattern });
      
      await tagPatternStore.addPattern(documentId, pattern);
      
      // Refetch patterns after saving
      await tagPatternStore.fetchPatterns(documentId);
      
      onAddPattern(false);
      log('TagPatternPanel', 'Pattern saved and refreshed successfully');
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Failed to save pattern');
      error('TagPatternPanel', 'Failed to save pattern', err);
    }
  };

  const patterns = tagPatternStore.getPatterns(documentId);

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
                onClick={() => onAddPattern(true)}
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
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            </div>
          ) : storeError ? (
            <div className="text-center py-8 text-red-600">
              {storeError}
            </div>
          ) : isAddingPattern ? (
            <TagPatternForm
              onSave={handleSavePattern}
              onCancel={() => onAddPattern(false)}
            />
          ) : (
            <TagPatternList
              patterns={patterns[documentId] || []}
              selectedAnnotationId={selectedAnnotationId}
              documentId={documentId}
            />
          )}
        </div>
      </div>
    </div>
  );
}