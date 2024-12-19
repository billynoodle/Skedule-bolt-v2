import { ReactNode } from 'react';

export interface BaseRendererProps {
  file: File;
  children?: ReactNode;
}

export interface RendererDimensions {
  width: number;
  height: number;
}

export interface RendererState {
  dimensions: RendererDimensions | null;
  loading: boolean;
  error: string | null;
}