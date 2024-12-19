import { create } from 'zustand';
import { supabase } from '../services/supabase/client';
import { Document, DatabaseDocument, mapDatabaseDocumentToDocument } from '../types/document';
import { log, error } from '../utils/logger';

interface DocumentState {
  documents: Record<string, Document[]>; // jobId -> documents
  loading: boolean;
  error: string | null;
  fetchDocuments: (jobId: string) => Promise<void>;
  uploadDocument: (jobId: string, file: File) => Promise<void>;
  deleteDocument: (jobId: string, documentId: string) => Promise<void>;
}

export const useDocumentStore = create<DocumentState>((set, get) => ({
  documents: {},
  loading: false,
  error: null,

  fetchDocuments: async (jobId) => {
    try {
      set({ loading: true, error: null });

      const { data: documents, error: err } = await supabase
        .from('documents')
        .select('*')
        .eq('job_id', jobId)
        .order('created_at', { ascending: false });

      if (err) throw err;

      set(state => ({ 
        documents: {
          ...state.documents,
          [jobId]: (documents as DatabaseDocument[]).map(mapDatabaseDocumentToDocument)
        },
        loading: false 
      }));

      log('DocumentStore', 'Documents fetched successfully', { jobId, count: documents.length });
    } catch (err) {
      error('DocumentStore', 'Failed to fetch documents', err);
      set({ error: 'Failed to fetch documents', loading: false });
    }
  },

  uploadDocument: async (jobId, file) => {
    try {
      set({ loading: true, error: null });

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      // Upload file to storage
      const filePath = `${user.id}/${jobId}/${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Create document record
      const { data: document, error: dbError } = await supabase
        .from('documents')
        .insert([{
          job_id: jobId,
          name: file.name,
          file_path: filePath,
          user_id: user.id
        }])
        .select()
        .single();

      if (dbError) throw dbError;

      const newDocument = mapDatabaseDocumentToDocument(document as DatabaseDocument);

      set(state => ({
        documents: {
          ...state.documents,
          [jobId]: [...(state.documents[jobId] || []), newDocument]
        },
        loading: false
      }));

      log('DocumentStore', 'Document uploaded successfully', { jobId, name: file.name });
    } catch (err) {
      error('DocumentStore', 'Failed to upload document', err);
      set({ error: 'Failed to upload document', loading: false });
    }
  },

  deleteDocument: async (jobId, documentId) => {
    try {
      set({ loading: true, error: null });

      const document = get().documents[jobId]?.find(d => d.id === documentId);
      if (!document) throw new Error('Document not found');

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('documents')
        .remove([document.filePath]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('documents')
        .delete()
        .eq('id', documentId);

      if (dbError) throw dbError;

      set(state => ({
        documents: {
          ...state.documents,
          [jobId]: state.documents[jobId]?.filter(d => d.id !== documentId) || []
        },
        loading: false
      }));

      log('DocumentStore', 'Document deleted successfully', { jobId, documentId });
    } catch (err) {
      error('DocumentStore', 'Failed to delete document', err);
      set({ error: 'Failed to delete document', loading: false });
    }
  }
}));