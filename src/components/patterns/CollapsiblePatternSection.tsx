import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Plus } from 'lucide-react';
import { TagPatternForm } from './TagPatternForm';
import { TagPatternList } from './TagPatternList';
import { TagPattern } from '../../types/ocr';

interface CollapsiblePatternSectionProps {
  patterns: TagPattern[];
  selectedId: string | null;
  hoveredId: string | null;
  hoveredPatternId: string | null;
  onPatternHover: (id: string | null) => void;
  onAnnotationHover: (id: string | null) => void;
  onToggleLink: (patternId: string) => void;
  onRemovePattern: (patternId: string) => void;
  onSavePattern: (pattern: TagPattern, shouldAutoLink?: boolean) => void;
}

export function CollapsiblePatternSection({
  patterns,
  selectedId,
  hoveredId,
  hoveredPatternId,
  onPatternHover,
  onAnnotationHover,
  onToggleLink,
  onRemovePattern,
  onSavePattern
}: CollapsiblePatternSectionProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isAddingPattern, setIsAddingPattern] = useState(false);

  return (
    <div className="border-t border-gray-200">
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors duration-200"
      >
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-medium text-gray-900">Tag Patterns</h3>
          <span className="text-sm text-gray-500">({patterns.length})</span>
        </div>
        {isCollapsed ? (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        )}
      </button>

      {!isCollapsed && (
        <div className="p-4 space-y-4">
          {isAddingPattern ? (
            <TagPatternForm
              onSave={(pattern) => {
                onSavePattern(pattern, true);
                setIsAddingPattern(false);
              }}
              onCancel={() => setIsAddingPattern(false)}
              selectedAnnotationId={selectedId}
            />
          ) : (
            <div className="flex justify-end">
              <button
                onClick={() => setIsAddingPattern(true)}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
              >
                <Plus className="w-4 h-4" />
                Add Pattern
              </button>
            </div>
          )}

          <TagPatternList
            patterns={patterns}
            selectedId={selectedId}
            hoveredId={hoveredId}
            hoveredPatternId={hoveredPatternId}
            onPatternHover={onPatternHover}
            onAnnotationHover={onAnnotationHover}
            onToggleLink={onToggleLink}
            onRemovePattern={onRemovePattern}
          />
        </div>
      )}
    </div>
  );
}