import React, { createContext, useContext, ReactNode, useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { CanvasCore } from '../../services/canvas/core/CanvasCore';
import { StateManager } from '../../services/canvas/managers/StateManager';
import { EventManager } from '../../services/canvas/managers/EventManager';
import { RenderManager } from '../../services/canvas/managers/RenderManager';
import { CanvasConfig } from '../../services/canvas/types';
import { log } from '../../utils/logger';

interface CanvasContextValue {
  canvas: fabric.Canvas | null;
  stateManager: StateManager | null;
  eventManager: EventManager | null;
  renderManager: RenderManager | null;
  config: CanvasConfig;
  isInitialized: boolean;
}

const CanvasContext = createContext<CanvasContextValue | null>(null);

interface CanvasProviderProps {
  children: ReactNode;
  config: CanvasConfig;
  onInit?: () => void;
}

export function CanvasProvider({ children, config, onInit }: CanvasProviderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const coreRef = useRef<CanvasCore | null>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const managersRef = useRef<{
    state: StateManager | null;
    event: EventManager | null;
    render: RenderManager | null;
  }>({ state: null, event: null, render: null });

  useEffect(() => {
    if (!canvasRef.current) return;

    const core = new CanvasCore(config);
    
    try {
      const fabricCanvas = core.initialize(canvasRef.current);
      coreRef.current = core;
      
      // Initialize managers
      managersRef.current = {
        state: new StateManager(fabricCanvas),
        event: new EventManager(fabricCanvas),
        render: new RenderManager(fabricCanvas)
      };

      setCanvas(fabricCanvas);
      setIsInitialized(true);
      onInit?.();
      
      log('CanvasProvider', 'Canvas and managers initialized successfully');
    } catch (err) {
      log('CanvasProvider', 'Failed to initialize canvas', err);
    }

    return () => {
      // Clean up managers first
      Object.values(managersRef.current).forEach(manager => manager?.dispose?.());
      managersRef.current = { state: null, event: null, render: null };

      // Then dispose canvas
      if (coreRef.current) {
        coreRef.current.dispose();
        setCanvas(null);
        setIsInitialized(false);
        log('CanvasProvider', 'Canvas and managers disposed');
      }
    };
  }, [config, onInit]);

  const value: CanvasContextValue = {
    canvas,
    stateManager: managersRef.current.state,
    eventManager: managersRef.current.event,
    renderManager: managersRef.current.render,
    config,
    isInitialized
  };

  return (
    <CanvasContext.Provider value={value}>
      <div className="relative">
        <canvas ref={canvasRef} className="absolute top-0 left-0" />
        {children}
      </div>
    </CanvasContext.Provider>
  );
}

export function useCanvas() {
  const context = useContext(CanvasContext);
  if (!context) {
    throw new Error('useCanvas must be used within a CanvasProvider');
  }
  return context;
}