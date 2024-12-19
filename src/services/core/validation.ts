import { log } from '../../utils/logger';

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export function validateRequired<T>(value: T | null | undefined, fieldName: string): T {
  if (value === null || value === undefined) {
    throw new ValidationError(`${fieldName} is required`);
  }
  return value;
}

export function validateUUID(id: string | null | undefined, context: string): string {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  
  if (!id || !uuidRegex.test(id)) {
    const newId = crypto.randomUUID();
    log('Validation', `Invalid ${context} ID, using generated UUID`, { 
      invalidId: id,
      newId 
    });
    return newId;
  }

  return id;
}

export function validateObject<T extends object>(
  obj: T | null | undefined,
  requiredFields: (keyof T)[],
  context: string
): T {
  const validObj = validateRequired(obj, context);
  
  for (const field of requiredFields) {
    if (!(field in validObj)) {
      throw new ValidationError(`${String(field)} is required in ${context}`);
    }
  }

  return validObj;
}