// Export only the new, unified components
export * from './AnnotationCanvas';
export * from './AnnotationToolbar';
export * from './AnnotationProvider';

// Mark deprecated exports
/** @deprecated Use new AnnotationCanvas component instead */
export * from './canvas/AnnotationCanvas';
/** @deprecated Use new unified components instead */
export * from './canvas/StateManager';