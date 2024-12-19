import React from 'react';
import { Square, Circle, Type, Ruler, MousePointer } from 'lucide-react';
import { useViewerStore } from '../../stores/viewerStore';
import { log } from '../../utils/logger';

const tools = [
  { id: 'select', icon: MousePointer, label: 'Select' },
  { id: 'box', icon: Square, label: 'Rectangle' },
  { id: 'circle', icon: Circle, label: 'Circle' },
  { id: 'text', icon: Type, label: 'Text' },
  { id: 'measure', icon: Ruler, label: 'Measure' }
] as const;

type ToolType = typeof tools[number]['id'];

export function VerticalToolbar() {
  const { mode, setMode } = useViewerStore();

  const handleToolSelect = (toolId: ToolType) => {
    setMode(toolId as any);
    log('VerticalToolbar', 'Tool selected', { tool: toolId });
  };

  return (
    <div className="h-full w-14 flex flex-col items-center py-4 bg-white border-r border-gray-200 shadow-sm">
      {tools.map((tool) => (
        <button
          key={tool.id}
          onClick={() => handleToolSelect(tool.id)}
          className={`p-2.5 mb-2 rounded-lg transition-colors relative group ${
            mode === tool.id
              ? 'bg-blue-100 text-blue-600'
              : 'hover:bg-gray-100 text-gray-600'
          }`}
          title={tool.label}
        >
          <tool.icon className="w-5 h-5" />
          <span className="absolute left-full ml-2 px-2 py-1 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
            {tool.label}
          </span>
        </button>
      ))}
    </div>
  );
}