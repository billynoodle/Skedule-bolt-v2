import React from 'react';
import { Link } from 'react-router-dom';
import { Play, ArrowRight } from 'lucide-react';

export function VideoCTA() {
  return (
    <div className="mt-8 text-center">
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm mb-6">
        <Play className="w-4 h-4" />
        <span>See how it works</span>
      </div>
      <div className="flex items-center justify-center gap-4">
        <Link
          to="/demo"
          className="inline-flex items-center px-6 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
        >
          Try the demo
          <ArrowRight className="ml-2 w-5 h-5" />
        </Link>
        <Link
          to="/docs"
          className="inline-flex items-center px-6 py-3 border border-white/20 text-white rounded-lg font-medium hover:bg-white/10 transition-colors"
        >
          View documentation
        </Link>
      </div>
    </div>
  );
}