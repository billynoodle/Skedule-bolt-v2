import React, { useState, useCallback, useEffect } from 'react';
import { useViewerStore } from '../../../stores/viewerStore';
import { AnnotationCanvas } from '../annotations/AnnotationCanvas';
import { log } from '../../../utils/logger';

interface ImageRendererProps {
  file: File;
}

export function ImageRenderer({ file }: ImageRendererProps) {
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const viewerState = useViewerStore();

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handleImageLoad = useCallback((event: React.SyntheticEvent<HTMLImageElement>) => {
    const img = event.currentTarget;
    setDimensions({
      width: img.naturalWidth,
      height: img.naturalHeight
    });
    setLoading(false);
    log('ImageRenderer', 'Image loaded', {
      width: img.naturalWidth,
      height: img.naturalHeight
    });
  }, []);

  if (!imageUrl) return null;

  return (
    <div className="relative h-full bg-gray-100">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        </div>
      )}

      <div className="relative h-full overflow-auto">
        <div className="relative inline-block">
          <img
            src={imageUrl}
            alt="Uploaded content"
            onLoad={handleImageLoad}
            style={{
              transform: `rotate(${viewerState.rotation}deg) scale(${viewerState.scale})`,
              transformOrigin: 'center center',
            }}
            className="max-w-none shadow-lg"
          />

          {dimensions && (
            <AnnotationCanvas
              width={dimensions.width}
              height={dimensions.height}
              containerBounds={{
                width: dimensions.width * viewerState.scale,
                height: dimensions.height * viewerState.scale,
                left: 0,
                top: 0
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}