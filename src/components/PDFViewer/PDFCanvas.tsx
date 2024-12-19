import React from 'react';
import { useCanvasSetup } from '../../hooks/useCanvasSetup';

interface PDFCanvasProps {
  width: number;
  height: number;
  scale: number;
  onLoad?: () => void;
}

export function PDFCanvas({ width, height, scale, onLoad }: PDFCanvasProps) {
  const { canvasRef } = useCanvasSetup({
    width,
    height,
    scale
  });

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0"
      style={{
        width: width * scale,
        height: height * scale
      }}
      onLoad={onLoad}
    />
  );
}