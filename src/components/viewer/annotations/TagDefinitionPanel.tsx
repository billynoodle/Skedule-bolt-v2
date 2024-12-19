import React, { useState } from 'react';
import { X, Plus, Tag, Save } from 'lucide-react';

interface TagPattern {
  id: string;
  prefix: string;
  description: string;
  scheduleTable: string;
}

interface TagDefinitionPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (pattern: TagPattern) => void;
}

export function TagDefinitionPanel({ isOpen, onClose, onSave }: TagDefinitionPanelProps) {
  const [newPattern, setNewPattern] = useState({
    prefix: '',
    description: '',
    scheduleTable: ''
  });

  const handleSave = () => {
    if (newPattern.prefix && newPattern.scheduleTable) {
      onSave?.({
        id: crypto.randomUUID(),
        ...newPattern
      });
      setNewPattern({
        prefix: '',
        description: '',
        scheduleTable: ''
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="absolute top-full right-0 mt-2 w-96 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Define Tag Pattern</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          Define the tags you want to identify and their corresponding schedule tables
        </p>
      </div>

      <div className="p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Tag Prefix
          </label>
          <input
            type="text"
            value={newPattern.prefix}
            onChange={e => setNewPattern({ ...newPattern, prefix: e.target.value })}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            placeholder="e.g., P for Piles"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <input
            type="text"
            value={newPattern.description}
            onChange={e => setNewPattern({ ...newPattern, description: e.target.value })}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            placeholder="What these tags represent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Schedule Table Title
          </label>
          <input
            type="text"
            value={newPattern.scheduleTable}
            onChange={e => setNewPattern({ ...newPattern, scheduleTable: e.target.value })}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            placeholder="e.g., PILE SCHEDULE"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={!newPattern.prefix || !newPattern.scheduleTable}
          className="w-full flex items-center justify-center gap-2 p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-4 h-4" />
          <span>Save Tag Pattern</span>
        </button>
      </div>
    </div>
  );
}