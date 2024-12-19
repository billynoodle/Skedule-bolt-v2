import { supabase } from './client';
import type { Database } from './types';
import { log, error } from '../../utils/logger';

type Job = Database['public']['Tables']['jobs']['Row'];
type JobInsert = Database['public']['Tables']['jobs']['Insert'];
type JobUpdate = Database['public']['Tables']['jobs']['Update'];

export async function getJobs() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      error('JobsService', 'No authenticated user found');
      throw new Error('No authenticated user');
    }

    log('JobsService', 'Fetching jobs', { userId: user.id });

    const { data, error: err } = await supabase
      .from('jobs')
      .select('*')
      .eq('user_id', user.id)
      .order('last_modified', { ascending: false });

    if (err) {
      error('JobsService', 'Database error while fetching jobs', err);
      throw err;
    }

    log('JobsService', 'Retrieved jobs', { 
      count: data?.length || 0, 
      userId: user.id,
      firstJobId: data?.[0]?.id
    });
    
    return data;
  } catch (err) {
    error('JobsService', 'Failed to get jobs', err);
    throw err;
  }
}

export async function createJob(job: Omit<JobInsert, 'user_id'>) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      error('JobsService', 'No authenticated user found');
      throw new Error('No authenticated user');
    }

    log('JobsService', 'Creating job', { 
      userId: user.id,
      jobTitle: job.title
    });

    const jobData = {
      ...job,
      user_id: user.id,
      created_at: new Date().toISOString(),
      last_modified: new Date().toISOString()
    };

    const { data, error: err } = await supabase
      .from('jobs')
      .insert(jobData)
      .select()
      .single();

    if (err) {
      error('JobsService', 'Database error while creating job', err);
      throw err;
    }

    log('JobsService', 'Created job', { 
      id: data.id, 
      userId: user.id,
      title: data.title
    });
    
    return data;
  } catch (err) {
    error('JobsService', 'Failed to create job', err);
    throw err;
  }
}

export async function updateJob(id: string, updates: Omit<JobUpdate, 'user_id'>) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      error('JobsService', 'No authenticated user found');
      throw new Error('No authenticated user');
    }

    log('JobsService', 'Updating job', { 
      id,
      userId: user.id,
      updates: Object.keys(updates)
    });

    const { data, error: err } = await supabase
      .from('jobs')
      .update({ 
        ...updates, 
        last_modified: new Date().toISOString(),
        user_id: user.id 
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (err) {
      error('JobsService', 'Database error while updating job', err);
      throw err;
    }

    log('JobsService', 'Updated job', { 
      id, 
      userId: user.id,
      title: data.title
    });
    
    return data;
  } catch (err) {
    error('JobsService', 'Failed to update job', err);
    throw err;
  }
}

export async function deleteJob(id: string) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      error('JobsService', 'No authenticated user found');
      throw new Error('No authenticated user');
    }

    log('JobsService', 'Deleting job', { 
      id,
      userId: user.id
    });

    const { error: err } = await supabase
      .from('jobs')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (err) {
      error('JobsService', 'Database error while deleting job', err);
      throw err;
    }

    log('JobsService', 'Deleted job', { 
      id, 
      userId: user.id 
    });
  } catch (err) {
    error('JobsService', 'Failed to delete job', err);
    throw err;
  }
}