import { createContext, useContext, ReactNode } from 'react';
import { create } from 'zustand';

interface ViewerState {
  scale: number;
  rotation: number;
  mode: 'select' | 'draw';
  setScale: (scale: number) => void;
  setRotation: (rotation: number) => void;
  setMode: (mode: 'select' | 'draw') => void;
}

const useViewerStore = create<ViewerState>((set) => ({
  scale: 1,
  rotation: 0,
  mode: 'select',
  setScale: (scale) => set({ scale }),
  setRotation: (rotation) => set({ rotation }),
  setMode: (mode) => set({ mode })
}));

const ViewerContext = createContext<typeof useViewerStore | null>(null);

export function ViewerProvider({ children }: { children: ReactNode }) {
  return (
    <ViewerContext.Provider value={useViewerStore}>
      {children}
    </ViewerContext.Provider>
  );
}

export function useViewer() {
  const context = useContext(ViewerContext);
  if (!context) {
    throw new Error('useViewer must be used within a ViewerProvider');
  }
  return context;
}