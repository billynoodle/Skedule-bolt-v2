export function isValidUUID(id: string | undefined | null): boolean {
  if (!id) return false;
  
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}

export function generateUUID(): string {
  return crypto.randomUUID();
}

export function validateId(id: string | undefined | null, context: string): string {
  if (!isValidUUID(id)) {
    throw new Error(`Invalid ${context} ID: ${id}`);
  }
  return id as string;
}