// src/hooks/useDocumentUpload.ts
import { useState } from 'react';
import { uploadDocument } from '../services/supabase/documents';

interface UseDocumentUploadResult {
  uploading: boolean;
  error: string | null;
  upload: (file: File, jobId: string) => Promise<void>;
}

export function useDocumentUpload(): UseDocumentUploadResult {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = async (file: File, jobId: string) => {
    try {
      setUploading(true);
      setError(null);
      await uploadDocument(file, jobId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload document');
      throw err;
    } finally {
      setUploading(false);
    }
  };

  return { uploading, error, upload };
}
