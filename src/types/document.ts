export interface Document {
  id: string;
  jobId: string;
  name: string;
  filePath: string;
  createdAt: Date;
  lastModified: Date;
}

export interface DatabaseDocument {
  id: string;
  job_id: string;
  name: string;
  file_path: string;
  created_at: string;
  last_modified: string;
  user_id: string;
}

export function mapDatabaseDocumentToDocument(dbDoc: DatabaseDocument): Document {
  return {
    id: dbDoc.id,
    jobId: dbDoc.job_id,
    name: dbDoc.name,
    filePath: dbDoc.file_path,
    createdAt: new Date(dbDoc.created_at),
    lastModified: new Date(dbDoc.last_modified)
  };
}