import React, { useState } from 'react';
import { Tag, AlertCircle, Link as LinkIcon, Edit2 } from 'lucide-react';
import { TagPattern, TagAnnotation } from '../../types/ocr';
import { ConfirmDialog } from '../shared/ConfirmDialog';

interface TagPatternListProps {
  patterns: TagPattern[];
  annotations: TagAnnotation[];
  selectedId: string | null;
  hoveredId: string | null;
  hoveredPatternId: string | null;
  onPatternHover: (id: string | null) => void;
  onAnnotationHover: (id: string | null) => void;
  onToggleLink: (patternId: string) => void;
  onRemovePattern: (patternId: string) => void;
  onEditPattern: (pattern: TagPattern) => void;
}

export function TagPatternList({
  patterns,
  annotations,
  selectedId,
  hoveredId,
  hoveredPatternId,
  onPatternHover,
  onAnnotationHover,
  onToggleLink,
  onRemovePattern,
  onEditPattern
}: TagPatternListProps) {
  const [patternToDelete, setPatternToDelete] = useState<string | null>(null);

  return (
    <div className="space-y-2">
      {patterns.map((pattern) => {
        const linkedAnnotations = annotations.filter(
          a => a.tagPatternId === pattern.id
        );
        const isHovered = hoveredPatternId === pattern.id;
        const hasSelectedAnnotation = selectedId !== null;
        const isLinkedToSelected = selectedId && linkedAnnotations.some(a => a.id === selectedId);

        return (
          <div
            key={pattern.id}
            className={`
              p-3 rounded-lg transition-colors
              ${isHovered ? 'bg-blue-50' : 'bg-gray-50 hover:bg-gray-100'}
            `}
            onMouseEnter={() => onPatternHover(pattern.id)}
            onMouseLeave={() => onPatternHover(null)}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-gray-900">
                    {pattern.prefix}
                  </span>
                  {linkedAnnotations.length > 0 && (
                    <span className="text-xs bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full">
                      {linkedAnnotations.length}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  {pattern.description}
                </p>
                <p className="mt-0.5 text-xs text-gray-400">
                  Table: {pattern.scheduleTable}
                </p>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => onEditPattern(pattern)}
                  className="p-1.5 rounded-lg hover:bg-blue-100 text-gray-500 hover:text-blue-600 transition-colors"
                  title="Edit pattern"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onToggleLink(pattern.id)}
                  disabled={!hasSelectedAnnotation}
                  className={`p-1.5 rounded-lg transition-colors ${
                    !hasSelectedAnnotation
                      ? 'text-gray-300 cursor-not-allowed'
                      : isLinkedToSelected
                      ? 'bg-blue-100 text-blue-600'
                      : 'hover:bg-blue-100 text-gray-500 hover:text-blue-600'
                  }`}
                  title={
                    !hasSelectedAnnotation
                      ? 'Select an annotation to link'
                      : isLinkedToSelected
                      ? 'Unlink annotation'
                      : 'Link annotation'
                  }
                >
                  <LinkIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPatternToDelete(pattern.id)}
                  className="p-1.5 rounded-lg hover:bg-red-100 text-gray-500 hover:text-red-600 transition-colors"
                  title="Remove pattern"
                >
                  <AlertCircle className="w-4 h-4" />
                </button>
              </div>
            </div>

            {linkedAnnotations.length > 0 && (
              <div className="mt-2 pt-2 border-t border-gray-200">
                <div className="text-xs font-medium text-gray-500 mb-1">
                  Linked Annotations
                </div>
                <div className="flex flex-wrap gap-1">
                  {linkedAnnotations.map((annotation) => (
                    <span
                      key={annotation.id}
                      className={`inline-flex items-center px-2 py-1 rounded-md text-xs ${
                        hoveredId === annotation.id
                          ? 'bg-blue-100 text-blue-600'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                      onMouseEnter={() => onAnnotationHover(annotation.id)}
                      onMouseLeave={() => onAnnotationHover(null)}
                    >
                      Box {annotation.id.slice(0, 4)}
                      {annotation.extractedText && (
                        <span className="ml-1 text-gray-400">
                          ({annotation.extractedText})
                        </span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}

      <ConfirmDialog
        isOpen={!!patternToDelete}
        onClose={() => setPatternToDelete(null)}
        onConfirm={() => {
          if (patternToDelete) {
            onRemovePattern(patternToDelete);
            setPatternToDelete(null);
          }
        }}
        title="Remove Pattern"
        message="Are you sure you want to remove this pattern? All linked annotations will be unlinked."
        confirmLabel="Remove"
        confirmVariant="danger"
      />
    </div>
  );
}