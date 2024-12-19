import { log } from '../../../utils/logger';

export interface Pattern {
  id: string;
  prefix: string;
  confidence: number;
}

export interface PatternMatch {
  pattern: Pattern;
  text: string;
  confidence: number;
}

export function matchPattern(text: string, patterns: Pattern[]): PatternMatch | null {
  const cleanText = text.trim().toUpperCase();
  
  for (const pattern of patterns) {
    const prefix = pattern.prefix.toUpperCase();
    if (cleanText.startsWith(prefix)) {
      const confidence = calculateConfidence(cleanText, prefix);
      
      log('PatternMatcher', 'Pattern matched', {
        pattern: pattern.prefix,
        text: cleanText,
        confidence
      });

      return {
        pattern,
        text: cleanText,
        confidence
      };
    }
  }

  return null;
}

function calculateConfidence(text: string, prefix: string): number {
  // More sophisticated confidence calculation
  const prefixMatch = prefix.length / text.length * 100;
  const textQuality = text.length > 2 ? 100 : 50; // Penalize very short texts
  return (prefixMatch + textQuality) / 2;
}