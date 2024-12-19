import { create } from 'zustand';

type ToolMode = 'select' | 'draw';

interface ViewerState {
  scale: number;
  rotation: number;
  mode: ToolMode;
  setScale: (scale: number) => void;
  setRotation: (rotation: number) => void;
  setMode: (mode: ToolMode) => void;
}

export const useViewerStore = create<ViewerState>((set) => ({
  scale: 1,
  rotation: 0,
  mode: 'select',
  setScale: (scale) => set({ scale }),
  setRotation: (rotation) => set({ rotation }),
  setMode: (mode) => set({ mode })
}));