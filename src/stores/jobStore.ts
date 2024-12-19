import { create } from 'zustand';
import { supabase } from '../services/supabase/client';
import { Job, DatabaseJob, mapDatabaseJobToJob, mapJobToDatabase } from '../types/job';
import { log, error } from '../utils/logger';

interface JobState {
  jobs: Job[];
  loading: boolean;
  error: string | null;
  fetchJobs: () => Promise<void>;
  createJob: (job: Omit<Job, 'id' | 'lastModified' | 'documents'>) => Promise<void>;
  updateJob: (id: string, updates: Partial<Job>) => Promise<void>;
  deleteJob: (id: string) => Promise<void>;
}

export const useJobStore = create<JobState>((set, get) => ({
  jobs: [],
  loading: false,
  error: null,

  fetchJobs: async () => {
    try {
      set({ loading: true, error: null });
      
      const { data: jobs, error: err } = await supabase
        .from('jobs')
        .select('*')
        .order('last_modified', { ascending: false });

      if (err) throw err;

      set({ 
        jobs: (jobs as DatabaseJob[]).map(mapDatabaseJobToJob),
        loading: false 
      });

      log('JobStore', 'Jobs fetched successfully', { count: jobs.length });
    } catch (err) {
      error('JobStore', 'Failed to fetch jobs', err);
      set({ error: 'Failed to fetch jobs', loading: false });
    }
  },

  createJob: async (jobData) => {
    try {
      set({ loading: true, error: null });

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      const dbJob = mapJobToDatabase(jobData);

      const { data: job, error: err } = await supabase
        .from('jobs')
        .insert([{ ...dbJob, user_id: user.id }])
        .select()
        .single();

      if (err) throw err;

      const newJob = mapDatabaseJobToJob(job as DatabaseJob);

      set(state => ({ 
        jobs: [newJob, ...state.jobs],
        loading: false 
      }));

      log('JobStore', 'Job created successfully', { id: job.id });
    } catch (err) {
      error('JobStore', 'Failed to create job', err);
      set({ error: 'Failed to create job', loading: false });
    }
  },

  updateJob: async (id, updates) => {
    try {
      if (!id) {
        throw new Error('Job ID is required for update');
      }

      set({ loading: true, error: null });

      // Ensure the job exists before updating
      const existingJob = get().jobs.find(j => j.id === id);
      if (!existingJob) {
        throw new Error('Job not found');
      }

      const dbUpdates = mapJobToDatabase(updates);

      const { data: job, error: err } = await supabase
        .from('jobs')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();

      if (err) throw err;

      const updatedJob = mapDatabaseJobToJob(job as DatabaseJob);
      updatedJob.documents = existingJob.documents;

      set(state => ({
        jobs: state.jobs.map(j => j.id === id ? updatedJob : j),
        loading: false
      }));

      log('JobStore', 'Job updated successfully', { id });
    } catch (err) {
      error('JobStore', 'Failed to update job', err);
      set({ error: 'Failed to update job', loading: false });
      throw err;
    }
  },

  deleteJob: async (id) => {
    try {
      if (!id) {
        throw new Error('Job ID is required for deletion');
      }

      set({ loading: true, error: null });

      // First, get all documents for this job
      const { data: documents, error: docError } = await supabase
        .from('documents')
        .select('file_path')
        .eq('job_id', id);

      if (docError) throw docError;

      // Delete all files from storage
      if (documents && documents.length > 0) {
        const filePaths = documents.map(doc => doc.file_path);
        const { error: storageError } = await supabase.storage
          .from('documents')
          .remove(filePaths);

        if (storageError) throw storageError;
      }

      // Delete all documents from the database
      const { error: docDeleteError } = await supabase
        .from('documents')
        .delete()
        .eq('job_id', id);

      if (docDeleteError) throw docDeleteError;

      // Finally, delete the job
      const { error: jobError } = await supabase
        .from('jobs')
        .delete()
        .eq('id', id);

      if (jobError) throw jobError;

      set(state => ({
        jobs: state.jobs.filter(job => job.id !== id),
        loading: false
      }));

      log('JobStore', 'Job and associated documents deleted successfully', { id });
    } catch (err) {
      error('JobStore', 'Failed to delete job', err);
      set({ error: 'Failed to delete job', loading: false });
      throw err;
    }
  }
}));