import React, { useState } from 'react';
import { TagPatternCard } from './TagPatternCard';
import { TagPatternForm } from './TagPatternForm';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';
import { EmptyState } from './EmptyState';
import { TagPattern } from '../../../../types/tagPattern';
import { log } from '../../../../utils/logger';

interface TagPatternListProps {
  patterns: TagPattern[];
  selectedAnnotationId: string | null;
  linkedPatterns: Record<string, string[]>;
  loading: boolean;
  error: string | null;
  onLinkPattern?: (patternId: string) => void;
  onUpdatePattern?: (pattern: TagPattern) => Promise<void>;
  onDeletePattern?: (patternId: string) => Promise<void>;
  onHoverPattern?: (annotationIds: string[] | null) => void;
}

export function TagPatternList({
  patterns,
  selectedAnnotationId,
  linkedPatterns,
  loading,
  error,
  onLinkPattern,
  onUpdatePattern,
  onDeletePattern,
  onHoverPattern
}: TagPatternListProps) {
  const [editingPattern, setEditingPattern] = useState<TagPattern | null>(null);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (editingPattern) {
    return (
      <TagPatternForm
        initialValues={editingPattern}
        onSave={async (updates) => {
          if (onUpdatePattern) {
            await onUpdatePattern({
              ...editingPattern,
              ...updates
            });
          }
          setEditingPattern(null);
        }}
        onCancel={() => setEditingPattern(null)}
      />
    );
  }

  if (patterns.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-4">
      {patterns.map(pattern => {
        const isLinked = selectedAnnotationId ? 
          linkedPatterns[pattern.id]?.includes(selectedAnnotationId) : 
          linkedPatterns[pattern.id]?.length > 0;

        return (
          <TagPatternCard
            key={pattern.id}
            pattern={pattern}
            isSelected={false}
            isLinked={isLinked}
            linkedAnnotations={linkedPatterns[pattern.id] || []}
            onLink={onLinkPattern ? () => {
              log('TagPatternList', 'Linking pattern', { 
                patternId: pattern.id,
                annotationId: selectedAnnotationId 
              });
              onLinkPattern(pattern.id);
            } : undefined}
            onEdit={onUpdatePattern ? () => setEditingPattern(pattern) : undefined}
            onDelete={onDeletePattern ? () => onDeletePattern(pattern.id) : undefined}
            onHover={onHoverPattern}
          />
        );
      })}
    </div>
  );
}