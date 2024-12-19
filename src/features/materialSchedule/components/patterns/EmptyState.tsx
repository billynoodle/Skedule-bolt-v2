import React from 'react';
import { Tag } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="text-center py-12">
      <div className="mx-auto w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-4">
        <Tag className="w-6 h-6 text-blue-600" />
      </div>
      <h3 className="text-sm font-medium text-gray-900">No tag patterns yet</h3>
      <p className="mt-1 text-sm text-gray-500">
        Create a pattern to start organizing your annotations
      </p>
    </div>
  );
}