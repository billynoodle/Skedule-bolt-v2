import React from 'react';
import { ZoomIn, ZoomOut, RotateCw, RotateCcw } from 'lucide-react';

interface ViewerToolbarProps {
  scale: number;
  setScale: (scale: number) => void;
  rotation: number;
  setRotation: (rotation: number) => void;
}

export function ViewerToolbar({
  scale,
  setScale,
  rotation,
  setRotation
}: ViewerToolbarProps) {
  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.1, 5));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.1, 0.1));
  const handleRotateClockwise = () => setRotation(prev => (prev + 90) % 360);
  const handleRotateCounterClockwise = () => setRotation(prev => (prev - 90 + 360) % 360);

  return (
    <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={handleZoomOut}
            className="p-2 rounded-lg hover:bg-gray-100"
            title="Zoom out"
          >
            <ZoomOut className="w-5 h-5" />
          </button>
          <span className="text-sm font-medium text-gray-700">
            {Math.round(scale * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            className="p-2 rounded-lg hover:bg-gray-100"
            title="Zoom in"
          >
            <ZoomIn className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleRotateCounterClockwise}
            className="p-2 rounded-lg hover:bg-gray-100"
            title="Rotate counterclockwise"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
          <button
            onClick={handleRotateClockwise}
            className="p-2 rounded-lg hover:bg-gray-100"
            title="Rotate clockwise"
          >
            <RotateCw className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}