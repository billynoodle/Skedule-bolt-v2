import React, { useState, useEffect } from 'react';
import { Save, X } from 'lucide-react';
import { TagPattern } from '../../types/ocr';

interface TagPatternFormProps {
  onSave: (pattern: TagPattern, shouldAutoLink?: boolean) => void;
  onCancel: () => void;
  selectedAnnotationId?: string | null;
  editingPattern?: TagPattern | null;
}

export function TagPatternForm({ 
  onSave, 
  onCancel, 
  selectedAnnotationId,
  editingPattern 
}: TagPatternFormProps) {
  const [newPattern, setNewPattern] = useState({
    prefix: '',
    description: '',
    scheduleTable: ''
  });

  useEffect(() => {
    if (editingPattern) {
      setNewPattern({
        prefix: editingPattern.prefix,
        description: editingPattern.description,
        scheduleTable: editingPattern.scheduleTable
      });
    }
  }, [editingPattern]);

  const handleSave = () => {
    if (newPattern.prefix && newPattern.scheduleTable) {
      onSave({
        id: editingPattern?.id || crypto.randomUUID(),
        ...newPattern
      }, !editingPattern); // Only auto-link for new patterns
    }
  };

  return (
    <div className="mb-4 p-4 bg-gray-50 rounded-lg space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tag Prefix
        </label>
        <input
          type="text"
          value={newPattern.prefix}
          onChange={e => setNewPattern({ ...newPattern, prefix: e.target.value })}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          placeholder="e.g., P for Piles"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <input
          type="text"
          value={newPattern.description}
          onChange={e => setNewPattern({ ...newPattern, description: e.target.value })}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          placeholder="What these tags represent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Schedule Table Title
        </label>
        <input
          type="text"
          value={newPattern.scheduleTable}
          onChange={e => setNewPattern({ ...newPattern, scheduleTable: e.target.value })}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          placeholder="e.g., PILE SCHEDULE"
        />
      </div>

      <div className="flex gap-2">
        <button
          onClick={onCancel}
          className="flex-1 p-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <X className="w-4 h-4 inline-block mr-1" />
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={!newPattern.prefix || !newPattern.scheduleTable}
          className="flex-1 p-2 rounded-lg bg-blue-600 text-sm font-medium text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-4 h-4 inline-block mr-1" />
          {editingPattern ? 'Update Pattern' : 'Save Pattern'}
        </button>
      </div>
    </div>
  );
}