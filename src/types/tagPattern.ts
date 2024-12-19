export interface TagPattern {
  id: string;
  documentId: string;
  prefix: string;
  description: string;
  scheduleTable: string;
}

export interface DatabaseTagPattern {
  id: string;
  document_id: string;
  prefix: string;
  description: string;
  schedule_table: string;
  user_id: string;
  created_at: string;
}

export function mapDatabaseTagPatternToTagPattern(dbPattern: DatabaseTagPattern): TagPattern {
  return {
    id: dbPattern.id,
    documentId: dbPattern.document_id,
    prefix: dbPattern.prefix,
    description: dbPattern.description,
    scheduleTable: dbPattern.schedule_table
  };
}