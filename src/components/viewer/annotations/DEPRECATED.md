# Deprecated Components

The following components and directories are deprecated and should not be used:

- `src/components/viewer/annotations/*`
- `src/components/annotations/*`
- `src/components/PdfViewer.tsx`
- `src/components/FileViewer.tsx`
- `src/components/PlanViewer.tsx`

Please use the new unified components from:
`src/features/materialSchedule/components/annotations/*`

## Migration Guide

1. Replace imports:
```tsx
// ❌ Deprecated
import { PdfViewer } from 'src/components/PdfViewer';
import { AnnotationCanvas } from 'src/components/viewer/annotations';

// ✅ Use instead
import { PdfViewer } from 'src/features/materialSchedule/components/PdfViewer';
import { AnnotationCanvas } from 'src/features/materialSchedule/components/annotations';
```

2. Update component usage:
```tsx
// ❌ Deprecated
<PdfViewer file={file} />

// ✅ Use instead
<AnnotationProvider jobId={jobId} documentId={documentId}>
  <PdfViewer 
    document={document}
    onAnnotationComplete={handleComplete}
  />
</AnnotationProvider>
```