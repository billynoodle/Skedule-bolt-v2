import React from 'react';
import { Box } from 'lucide-react';

interface LinkedAnnotationsPreviewProps {
  linkedIds: string[];
  isExpanded: boolean;
}

export function LinkedAnnotationsPreview({ linkedIds, isExpanded }: LinkedAnnotationsPreviewProps) {
  if (linkedIds.length === 0) return null;

  return (
    <div 
      className={`
        mt-2 pt-2 border-t border-gray-200 transition-all duration-200
        ${isExpanded ? 'opacity-100' : 'opacity-70'}
      `}
    >
      <div className="flex items-center gap-1 mb-1">
        <Box className="w-3 h-3 text-gray-400" />
        <span className="text-xs font-medium text-gray-500">
          Linked Annotations ({linkedIds.length})
        </span>
      </div>
      <div className="flex flex-wrap gap-1">
        {linkedIds.map((id) => (
          <span
            key={id}
            className={`
              inline-flex items-center px-2 py-1 rounded-md text-xs
              ${isExpanded 
                ? 'bg-blue-100 text-blue-600' 
                : 'bg-gray-100 text-gray-600'
              }
              transition-colors duration-200
            `}
          >
            Box {id.slice(0, 4)}
          </span>
        ))}
      </div>
    </div>
  );
}