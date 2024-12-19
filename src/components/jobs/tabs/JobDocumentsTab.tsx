import React, { useEffect } from 'react';
import { FileText, Eye, Upload, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { useDocumentStore } from '../../../stores/documentStore';

interface JobDocumentsTabProps {
  jobId: string;
  onDocumentSelect: (document: Document) => void;
}

export function JobDocumentsTab({ jobId, onDocumentSelect }: JobDocumentsTabProps) {
  const { documents, loading, error, fetchDocuments, uploadDocument, deleteDocument } = useDocumentStore();
  const jobDocuments = documents[jobId] || [];

  useEffect(() => {
    fetchDocuments(jobId);
  }, [jobId, fetchDocuments]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    for (const file of files) {
      await uploadDocument(jobId, file);
    }
    event.target.value = '';
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = async (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    const files = Array.from(event.dataTransfer.files);
    for (const file of files) {
      await uploadDocument(jobId, file);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => fetchDocuments(jobId)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-gray-900">Documents</h3>
        <div>
          <input
            id="file-upload"
            type="file"
            className="hidden"
            accept=".pdf,.png,.jpg,.jpeg"
            multiple
            onChange={handleFileUpload}
          />
          <label
            htmlFor="file-upload"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 cursor-pointer"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Documents
          </label>
        </div>
      </div>

      {jobDocuments.length === 0 ? (
        <div 
          className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No documents</h3>
          <p className="mt-1 text-sm text-gray-500">
            Drag and drop your files here, or click upload to browse
          </p>
        </div>
      ) : (
        <div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {jobDocuments.map((doc) => (
            <div
              key={doc.id}
              className="relative group p-4 rounded-lg border border-gray-200 hover:border-gray-300 bg-white transition-all duration-200"
            >
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-lg bg-blue-50">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {doc.name}
                  </p>
                  <div className="mt-1 flex items-center text-xs text-gray-500">
                    <span>{format(doc.lastModified, 'MMM d, yyyy')}</span>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteDocument(jobId, doc.id);
                  }}
                  className="relative z-20 p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={() => onDocumentSelect(doc)}
                className="absolute inset-0 z-10 flex items-center justify-center bg-gray-900 bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200"
              >
                <Eye className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all duration-200" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}