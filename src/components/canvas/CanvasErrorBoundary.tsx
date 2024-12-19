import React, { Component, ErrorInfo, ReactNode } from 'react';
import { log } from '../../utils/logger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class CanvasErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    log('CanvasErrorBoundary', 'Canvas error caught', { error, errorInfo });
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-4 bg-red-50 rounded-lg border border-red-200">
          <h3 className="text-lg font-medium text-red-800 mb-2">
            Canvas Error
          </h3>
          <p className="text-sm text-red-600">
            {this.state.error?.message || 'An error occurred in the canvas'}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="mt-4 px-4 py-2 text-sm font-medium text-red-600 bg-white rounded-lg border border-red-300 hover:bg-red-50"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}