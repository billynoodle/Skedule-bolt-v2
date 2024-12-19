import { AnnotationConfig } from '../types';
import { log } from '../../../utils/logger';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validateAnnotation(config: AnnotationConfig): ValidationResult {
  const errors: string[] = [];

  // Validate position
  if (!config.position) {
    errors.push('Position is required');
  } else {
    if (typeof config.position.x !== 'number') errors.push('Invalid x coordinate');
    if (typeof config.position.y !== 'number') errors.push('Invalid y coordinate');
    if (config.position.width <= 0) errors.push('Width must be positive');
    if (config.position.height <= 0) errors.push('Height must be positive');
  }

  // Validate scale
  if (typeof config.scale !== 'number' || config.scale <= 0) {
    errors.push('Scale must be a positive number');
  }

  const isValid = errors.length === 0;
  
  log('AnnotationValidation', isValid ? 'Validation passed' : 'Validation failed', {
    errors: errors.length > 0 ? errors : undefined
  });

  return { isValid, errors };
}