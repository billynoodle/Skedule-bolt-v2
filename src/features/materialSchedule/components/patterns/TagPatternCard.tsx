import React, { useState } from 'react';
import { Tag, Link as LinkIcon, Edit2, Trash2 } from 'lucide-react';
import { TagPattern } from '../../../../types/tagPattern';
import { LinkedAnnotationsPreview } from './LinkedAnnotationsPreview';
import { ConfirmDialog } from '../../../../components/shared/ConfirmDialog';
import { log } from '../../../../utils/logger';

interface TagPatternCardProps {
  pattern: TagPattern;
  isSelected: boolean;
  isLinked: boolean;
  linkedAnnotations?: string[];
  onLink?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onHover?: (hoveredIds: string[] | null) => void;
}

export function TagPatternCard({
  pattern,
  isSelected,
  isLinked,
  linkedAnnotations = [],
  onLink,
  onEdit,
  onDelete,
  onHover
}: TagPatternCardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (linkedAnnotations.length > 0) {
      onHover?.(linkedAnnotations);
      log('TagPatternCard', 'Pattern hover - highlighting annotations', { 
        patternId: pattern.id, 
        linkedCount: linkedAnnotations.length 
      });
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    onHover?.(null);
  };

  return (
    <>
      <div 
        className={`
          p-4 rounded-lg border transition-all duration-200 transform
          ${isSelected ? 'border-blue-200 bg-blue-50' : 'border-gray-200 bg-white hover:bg-gray-50'}
          ${isHovered ? 'scale-[1.02] shadow-md' : 'scale-100'}
        `}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-lg transition-colors ${isLinked ? 'bg-green-50' : 'bg-blue-50'}`}>
              <Tag className={`w-4 h-4 ${isLinked ? 'text-green-600' : 'text-blue-600'}`} />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">{pattern.prefix}</h3>
              <p className="text-sm text-gray-500">{pattern.description}</p>
            </div>
          </div>
          <div className="flex gap-1">
            {onLink && (
              <button
                onClick={onLink}
                className={`
                  p-1.5 rounded-lg transition-all duration-200
                  ${isLinked 
                    ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                    : 'hover:bg-blue-100 text-gray-500 hover:text-blue-600'
                  }
                `}
                title={isLinked ? 'Unlink annotation' : 'Link annotation'}
              >
                <LinkIcon className={`w-4 h-4 ${isLinked ? 'animate-pulse' : ''}`} />
              </button>
            )}
            {onEdit && (
              <button
                onClick={onEdit}
                className="p-1.5 rounded-lg hover:bg-blue-100 text-gray-500 hover:text-blue-600 transition-colors"
                title="Edit pattern"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="p-1.5 rounded-lg hover:bg-red-100 text-gray-500 hover:text-red-600 transition-colors"
                title="Delete pattern"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {pattern.scheduleTable && (
          <div className="mt-2 text-xs text-gray-500">
            Schedule: {pattern.scheduleTable}
          </div>
        )}

        <LinkedAnnotationsPreview 
          linkedIds={linkedAnnotations}
          isExpanded={isHovered}
        />
      </div>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={() => {
          onDelete?.();
          setShowDeleteConfirm(false);
        }}
        title="Delete Pattern"
        message="Are you sure you want to delete this pattern? This action cannot be undone."
        confirmLabel="Delete"
        confirmVariant="danger"
      />
    </>
  );
}