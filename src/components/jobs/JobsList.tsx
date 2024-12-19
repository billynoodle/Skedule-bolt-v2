import React, { useState, useRef } from 'react';
import { Plus, Search, Building2, Calendar, Clock, MoreVertical, FolderOpen } from 'lucide-react';
import { format } from 'date-fns';
import { Job } from '../../types/job';
import { getStatusColor } from '../../utils/jobUtils';
import { JobActionsMenu } from './JobActionsMenu';
import { EditJobModal } from './EditJobModal';
import { NewJobModal } from './NewJobModal';

interface JobsListProps {
  jobs: Job[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectJob: (jobId: string) => void;
  onUpdateJob: (job: Job) => void;
  onDeleteJob: (jobId: string) => void;
  onCreateJob: (job: Job) => void;
}

export function JobsList({ 
  jobs, 
  searchQuery, 
  onSearchChange, 
  onSelectJob,
  onUpdateJob,
  onDeleteJob,
  onCreateJob
}: JobsListProps) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [isNewJobModalOpen, setIsNewJobModalOpen] = useState(false);
  const menuButtonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.client.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRowClick = (jobId: string, isActionButton: boolean) => {
    if (!isActionButton) {
      onSelectJob(jobId);
    }
  };

  const handleStatusChange = (jobId: string, newStatus: 'active' | 'completed' | 'on-hold') => {
    const job = jobs.find(j => j.id === jobId);
    if (job) {
      onUpdateJob({
        ...job,
        status: newStatus,
        lastModified: new Date()
      });
    }
  };

  const handleEditJob = (jobId: string) => {
    const job = jobs.find(j => j.id === jobId);
    if (job) {
      setEditingJob(job);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="bg-white rounded-lg shadow flex-1 flex flex-col min-h-0">
        <div className="p-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Search jobs..."
              />
            </div>
            <button 
              onClick={() => setIsNewJobModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Job
            </button>
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Job Details
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Modified
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredJobs.map((job) => (
                <tr 
                  key={job.id} 
                  onClick={(e) => handleRowClick(job.id, (e.target as HTMLElement).closest('.action-button') !== null)}
                  className="hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                        <Building2 className="h-5 w-5" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{job.title}</div>
                        <div className="text-sm text-gray-500">ID: {job.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{job.client}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(job.status)}`}>
                      {job.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm text-gray-900">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                      {job.dueDate ? format(job.dueDate, 'MMM d, yyyy') : 'No due date'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-2 text-gray-400" />
                      {format(job.lastModified, 'MMM d, yyyy')}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-3">
                      <button 
                        onClick={() => onSelectJob(job.id)}
                        className="action-button text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50 transition-colors duration-150"
                      >
                        <FolderOpen className="h-5 w-5" />
                      </button>
                      <div className="relative">
                        <button 
                          ref={el => menuButtonRefs.current[job.id] = el}
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(openMenuId === job.id ? null : job.id);
                          }}
                          className="action-button text-gray-400 hover:text-gray-500 p-1 rounded-full hover:bg-gray-50 transition-colors duration-150"
                        >
                          <MoreVertical className="h-5 w-5" />
                        </button>
                        <JobActionsMenu
                          isOpen={openMenuId === job.id}
                          onClose={() => setOpenMenuId(null)}
                          jobId={job.id}
                          jobStatus={job.status}
                          buttonRef={{ current: menuButtonRefs.current[job.id] }}
                          onStatusChange={handleStatusChange}
                          onDeleteJob={onDeleteJob}
                          onEditJob={handleEditJob}
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredJobs.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12">
                    <div className="text-center">
                      <Building2 className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No jobs found</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {searchQuery ? 'Try adjusting your search terms' : 'Get started by creating a new job'}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {editingJob && (
        <EditJobModal
          job={editingJob}
          isOpen={true}
          onClose={() => setEditingJob(null)}
          onSave={(updatedJob) => {
            onUpdateJob(updatedJob);
            setEditingJob(null);
          }}
        />
      )}

      <NewJobModal
        isOpen={isNewJobModalOpen}
        onClose={() => setIsNewJobModalOpen(false)}
        onSave={onCreateJob}
      />
    </div>
  );
}