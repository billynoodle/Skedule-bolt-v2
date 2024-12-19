import { TagPattern, TagPatternMatch } from '../../types/ocr';
import { log } from '../../utils/logger';

export function matchTagPattern(text: string, patterns: TagPattern[]): TagPatternMatch | null {
  const cleanText = text.trim().toUpperCase();
  
  for (const pattern of patterns) {
    const prefix = pattern.prefix.toUpperCase();
    if (cleanText.startsWith(prefix)) {
      const confidence = calculateConfidence(cleanText, prefix);
      log('PatternMatcher', 'Pattern matched', { pattern, confidence });
      return {
        pattern,
        confidence,
        text: cleanText
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