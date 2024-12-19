import { useState, useCallback } from 'react';
import { TagPattern } from '../types/ocr';

export function usePatternHistory() {
  const [history, setHistory] = useState<TagPattern[][]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  const pushState = useCallback((patterns: TagPattern[]) => {
    setHistory(prev => [...prev.slice(0, currentIndex + 1), patterns]);
    setCurrentIndex(prev => prev + 1);
  }, [currentIndex]);

  const undo = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      return history[currentIndex - 1];
    }
    return null;
  }, [currentIndex, history]);

  const canUndo = currentIndex > 0;

  return {
    pushState,
    undo,
    canUndo
  };
}