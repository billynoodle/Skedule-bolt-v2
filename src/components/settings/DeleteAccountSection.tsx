import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { useAuth } from '../../hooks/auth';
import { ConfirmDialog } from '../shared/ConfirmDialog';

export function DeleteAccountSection() {
  const [showConfirm, setShowConfirm] = useState(false);
  const { deleteAccount, loading, error } = useAuth();

  const handleDelete = async () => {
    try {
      await deleteAccount();
    } catch (err) {
      console.error('Failed to delete account:', err);
    } finally {
      setShowConfirm(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-red-50">
          <AlertTriangle className="w-5 h-5 text-red-600" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Delete Account
          </h2>
          <p className="text-sm text-gray-600">
            Permanently delete your account and all associated data
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-200">
          {error.message}
        </div>
      )}

      <button
        onClick={() => setShowConfirm(true)}
        disabled={loading}
        className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Deleting Account...' : 'Delete Account'}
      </button>

      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Account"
        message="Are you sure you want to delete your account? This action cannot be undone and will permanently delete all your data."
        confirmLabel="Delete Account"
        confirmVariant="danger"
      />
    </div>
  );
}