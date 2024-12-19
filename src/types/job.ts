export interface Job {
  id: string;
  title: string;
  client: string;
  status: 'active' | 'completed' | 'on-hold';
  lastModified: Date;
  dueDate: Date | null;
  project?: string | null;
  section?: string | null;
  reference?: string | null;
  address?: string | null;
  drawingNumber?: string | null;
  documents: File[];
}

export interface DatabaseJob {
  id: string;
  title: string;
  client: string;
  status: 'active' | 'completed' | 'on-hold';
  last_modified: string;
  due_date: string | null;
  project: string | null;
  section: string | null;
  reference: string | null;
  address: string | null;
  drawing_number: string | null;
  user_id: string;
}

export function mapDatabaseJobToJob(dbJob: DatabaseJob): Job {
  return {
    id: dbJob.id,
    title: dbJob.title,
    client: dbJob.client,
    status: dbJob.status,
    lastModified: new Date(dbJob.last_modified),
    dueDate: dbJob.due_date ? new Date(dbJob.due_date) : null,
    project: dbJob.project,
    section: dbJob.section,
    reference: dbJob.reference,
    address: dbJob.address,
    drawingNumber: dbJob.drawing_number,
    documents: []
  };
}

export function mapJobToDatabase(job: Partial<Job>): Partial<DatabaseJob> {
  const dbJob: Partial<DatabaseJob> = {
    ...(job.title && { title: job.title }),
    ...(job.client && { client: job.client }),
    ...(job.status && { status: job.status }),
    ...(job.project !== undefined && { project: job.project }),
    ...(job.section !== undefined && { section: job.section }),
    ...(job.reference !== undefined && { reference: job.reference }),
    ...(job.address !== undefined && { address: job.address }),
    ...(job.drawingNumber !== undefined && { drawing_number: job.drawingNumber }),
    ...(job.dueDate && { due_date: job.dueDate.toISOString() }),
    last_modified: new Date().toISOString()
  };
  return dbJob;
}