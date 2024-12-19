import React from 'react';
import { ZoomIn, ZoomOut, RotateCw, RotateCcw } from 'lucide-react';

interface ViewerToolbarProps {
  scale: number;
  onScaleChange: (scale: number) => void;
}

export function ViewerToolbar({ scale, onScaleChange }: ViewerToolbarProps) {
  return (
    <div className="flex items-center gap-4 p-4 bg-white border-b border-gray-200">
      <div className="flex items-center gap-2">
        <button
          onClick={() => onScaleChange(Math.max(0.1, scale - 0.1))}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-5 h-5" />
        </button>
        
        <span className="text-sm font-medium text-gray-700 min-w-[3rem] text-center">
          {Math.round(scale * 100)}%
        </span>
        
        <button
          onClick={() => onScaleChange(Math.min(5, scale + 0.1))}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}