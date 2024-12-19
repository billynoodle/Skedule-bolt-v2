import React, { useEffect, useState } from 'react';
import { JobsList } from './jobs/JobsList';
import { JobDetails } from './jobs/JobDetails';
import { useJobStore } from '../stores/jobStore';
import { Job } from '../types/job';

export function JobsDashboard() {
  const { jobs, loading, error, fetchJobs, createJob, updateJob, deleteJob } = useJobStore();
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const selectedJob = selectedJobId ? jobs.find(job => job.id === selectedJobId) : null;

  const handleJobSelect = (jobId: string) => {
    setSelectedJobId(jobId);
  };

  const handleUpdateJob = async (updatedJob: Job) => {
    try {
      await updateJob(updatedJob.id, updatedJob);
    } catch (err) {
      console.error('Failed to update job:', err);
      // Handle error (e.g., show notification)
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    try {
      await deleteJob(jobId);
      if (selectedJobId === jobId) {
        setSelectedJobId(null);
      }
    } catch (err) {
      console.error('Failed to delete job:', err);
      // Handle error (e.g., show notification)
    }
  };

  const handleCreateJob = async (newJob: Omit<Job, 'id' | 'lastModified' | 'documents'>) => {
    try {
      await createJob(newJob);
    } catch (err) {
      console.error('Failed to create job:', err);
      // Handle error (e.g., show notification)
    }
  };

  const handleBackToList = () => {
    setSelectedJobId(null);
  };

  if (loading) {
    return (
      <div className="h-[calc(100vh-7rem)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[calc(100vh-7rem)] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchJobs}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-7rem)]">
      {selectedJob ? (
        <JobDetails 
          job={selectedJob} 
          onBack={handleBackToList}
          onUpdateJob={handleUpdateJob}
        />
      ) : (
        <JobsList 
          jobs={jobs}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSelectJob={handleJobSelect}
          onUpdateJob={handleUpdateJob}
          onDeleteJob={handleDeleteJob}
          onCreateJob={handleCreateJob}
        />
      )}
    </div>
  );
}