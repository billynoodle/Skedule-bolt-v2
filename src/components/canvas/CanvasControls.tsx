import React from 'react';
import { ZoomIn, ZoomOut, RotateCw, RotateCcw, MousePointer, Square } from 'lucide-react';
import { useCanvas } from './CanvasProvider';

interface CanvasControlsProps {
  onModeChange?: (mode: 'select' | 'draw') => void;
  onScaleChange?: (scale: number) => void;
  onRotationChange?: (rotation: number) => void;
}

export function CanvasControls({
  onModeChange,
  onScaleChange,
  onRotationChange
}: CanvasControlsProps) {
  const { config } = useCanvas();

  const handleZoomIn = () => {
    onScaleChange?.(Math.min(config.scale + 0.1, 5));
  };

  const handleZoomOut = () => {
    onScaleChange?.(Math.max(config.scale - 0.1, 0.1));
  };

  const handleRotateClockwise = () => {
    onRotationChange?.((config.rotation + 90) % 360);
  };

  const handleRotateCounterClockwise = () => {
    onRotationChange?.((config.rotation - 90 + 360) % 360);
  };

  return (
    <div className="absolute top-4 right-4 flex items-center gap-2 bg-white rounded-lg shadow-lg p-2">
      <div className="flex items-center gap-1 border-r border-gray-200 pr-2">
        <button
          onClick={() => onModeChange?.('select')}
          className={`p-2 rounded-lg transition-colors ${
            config.mode === 'select'
              ? 'bg-blue-100 text-blue-600'
              : 'hover:bg-gray-100 text-gray-600'
          }`}
          title="Select Mode"
        >
          <MousePointer className="w-4 h-4" />
        </button>
        <button
          onClick={() => onModeChange?.('draw')}
          className={`p-2 rounded-lg transition-colors ${
            config.mode === 'draw'
              ? 'bg-blue-100 text-blue-600'
              : 'hover:bg-gray-100 text-gray-600'
          }`}
          title="Draw Mode"
        >
          <Square className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={handleZoomOut}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <span className="text-sm font-medium text-gray-700 min-w-[3rem] text-center">
          {Math.round(config.scale * 100)}%
        </span>
        <button
          onClick={handleZoomIn}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center gap-1 border-l border-gray-200 pl-2">
        <button
          onClick={handleRotateCounterClockwise}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
          title="Rotate Counter-clockwise"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        <button
          onClick={handleRotateClockwise}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
          title="Rotate Clockwise"
        >
          <RotateCw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}