import React, { useRef } from 'react';
import { useCanvasInitialization, useCanvasConfiguration } from '../../../../hooks/canvas';
import { DrawingManager } from './DrawingManager';
import { EventManager } from './EventManager';
import { StateManager } from './StateManager';

interface CanvasManagerProps {
  width: number;
  height: number;
  scale: number;
  rotation: number;
  mode: 'select' | 'draw';
  jobId: string;
  documentId: string;
  onAnnotationComplete?: () => void;
}

export function CanvasManager({
  width,
  height,
  scale,
  rotation,
  mode,
  jobId,
  documentId,
  onAnnotationComplete
}: CanvasManagerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useCanvasInitialization(canvasRef);

  useCanvasConfiguration({
    canvas: fabricRef.current,
    width,
    height,
    scale,
    rotation,
    mode
  });

  return (
    <div 
      className="absolute inset-0"
      style={{
        pointerEvents: 'none',
        touchAction: 'none'
      }}
    >
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0"
        style={{
          pointerEvents: 'auto',
          touchAction: 'none',
          cursor: mode === 'draw' ? 'crosshair' : 'default'
        }}
      />
      {fabricRef.current && (
        <>
          <DrawingManager
            canvas={fabricRef.current}
            mode={mode}
            scale={scale}
          />
          <EventManager
            canvas={fabricRef.current}
            jobId={jobId}
            documentId={documentId}
            onAnnotationComplete={onAnnotationComplete}
          />
          <StateManager
            canvas={fabricRef.current}
            jobId={jobId}
            documentId={documentId}
          />
        </>
      )}
    </div>
  );
}