import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Job } from '../../types/job';
import { JobDetailsTab } from './tabs/JobDetailsTab';
import { JobDocumentsTab } from './tabs/JobDocumentsTab';
import { JobMaterialScheduleTab } from './tabs/JobMaterialScheduleTab';
import { Document } from '../../types/document';

type TabType = 'details' | 'documents' | 'schedule';

interface JobDetailsProps {
  job: Job;
  onBack: () => void;
  onUpdateJob: (job: Job) => void;
}

export function JobDetails({ job, onBack, onUpdateJob }: JobDetailsProps) {
  const [activeTab, setActiveTab] = useState<TabType>('details');
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  const handleDocumentSelect = (document: Document) => {
    setSelectedDocument(document);
    setActiveTab('schedule');
  };

  const tabs: { id: TabType; label: string }[] = [
    { id: 'details', label: 'Details' },
    { id: 'documents', label: 'Documents' },
    { id: 'schedule', label: 'Material Schedule' }
  ];

  return (
    <div className="h-full flex flex-col bg-white rounded-xl shadow-sm">
      <div className="border-b border-gray-200">
        <div className="flex justify-between items-center px-4">
          <nav className="flex -mb-px">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
          <button
            onClick={onBack}
            className="flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Jobs
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="p-4">
          {activeTab === 'details' && (
            <JobDetailsTab job={job} onUpdateJob={onUpdateJob} />
          )}

          {activeTab === 'documents' && (
            <JobDocumentsTab
              jobId={job.id}
              onDocumentSelect={handleDocumentSelect}
            />
          )}

          {activeTab === 'schedule' && selectedDocument && (
            <JobMaterialScheduleTab document={selectedDocument} jobId={job.id} />
          )}

          {activeTab === 'schedule' && !selectedDocument && (
            <div className="text-center py-12">
              <p className="text-gray-500">
                Please select a document from the Documents tab to start material scheduling
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}