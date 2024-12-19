# Deprecated Components

The following components are deprecated and will be removed in a future version:

- `AnnotationToolbar`
- `AnnotationLayer`
- `canvas/AnnotationCanvas`

Please use the new `AnnotationCanvas` component instead, which provides:

- Improved canvas management
- Better error handling
- Proper state synchronization
- Supabase integration
- Tag pattern support

## Migration Guide

1. Replace old components:

```tsx
// Old
import { LegacyAnnotationCanvas } from './annotations';

// New
import { AnnotationCanvas } from './annotations';
```

2. Update props:

```tsx
// Old
<LegacyAnnotationCanvas
  width={width}
  height={height}
  containerBounds={bounds}
  jobId={jobId}
  documentId={documentId}
/>

// New
<AnnotationCanvas
  width={width}
  height={height}
  jobId={jobId}
  documentId={documentId}
  onAnnotationComplete={handleComplete}
/>
```

The new component handles container bounds internally and provides better event handling.