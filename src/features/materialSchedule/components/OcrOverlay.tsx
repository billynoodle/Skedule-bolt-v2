import React from 'react';
import { Loader2 } from 'lucide-react';

interface OcrOverlayProps {
  processing: boolean;
  error?: string | null;
}

export function OcrOverlay({ processing, error }: OcrOverlayProps) {
  if (!processing && !error) return null;

  return (
    <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
      {processing ? (
        <div className="flex items-center gap-2 text-blue-600">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="font-medium">Processing OCR...</span>
        </div>
      ) : error ? (
        <div className="text-red-600 font-medium">
          {error}
        </div>
      ) : null}
    </div>
  );
}