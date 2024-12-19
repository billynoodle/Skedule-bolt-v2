import { supabase } from '../client';

export async function createFilePath(fileName: string, jobId: string): Promise<string> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('No authenticated user');
  
  return `${user.id}/${jobId}/${fileName}`;
}

export function validateUserAccess(filePath: string, userId: string): boolean {
  return filePath.startsWith(`${userId}/`);
}

export function getJobPrefix(userId: string, jobId: string): string {
  return `${userId}/${jobId}`;
}