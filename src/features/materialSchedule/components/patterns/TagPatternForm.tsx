import React, { useState } from 'react';
import { Save, X } from 'lucide-react';
import { log } from '../../../../utils/logger';

interface TagPatternFormProps {
  onSave: (pattern: { prefix: string; description: string; scheduleTable: string }) => Promise<void>;
  onCancel: () => void;
  initialValues?: {
    prefix: string;
    description: string;
    scheduleTable: string;
  };
}

export function TagPatternForm({ onSave, onCancel, initialValues }: TagPatternFormProps) {
  const [pattern, setPattern] = useState({
    prefix: initialValues?.prefix || '',
    description: initialValues?.description || '',
    scheduleTable: initialValues?.scheduleTable || ''
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pattern.prefix || !pattern.scheduleTable) return;

    try {
      setSaving(true);
      setError(null);
      log('TagPatternForm', 'Saving pattern', { pattern });
      await onSave(pattern);
      log('TagPatternForm', 'Pattern saved successfully');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save pattern';
      setError(message);
      log('TagPatternForm', 'Failed to save pattern', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tag Prefix
        </label>
        <input
          type="text"
          value={pattern.prefix}
          onChange={e => setPattern({ ...pattern, prefix: e.target.value })}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          placeholder="e.g., P for Piles"
          required
          disabled={saving}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <input
          type="text"
          value={pattern.description}
          onChange={e => setPattern({ ...pattern, description: e.target.value })}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          placeholder="What these tags represent"
          disabled={saving}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Schedule Table Title
        </label>
        <input
          type="text"
          value={pattern.scheduleTable}
          onChange={e => setPattern({ ...pattern, scheduleTable: e.target.value })}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          placeholder="e.g., PILE SCHEDULE"
          required
          disabled={saving}
        />
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="flex-1 p-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <X className="w-4 h-4 inline-block mr-1" />
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving || !pattern.prefix || !pattern.scheduleTable}
          className="flex-1 p-2 rounded-lg bg-blue-600 text-sm font-medium text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4 inline-block mr-1" />
          {saving ? 'Saving...' : initialValues ? 'Update Pattern' : 'Save Pattern'}
        </button>
      </div>
    </form>
  );
}