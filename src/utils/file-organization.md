# Code Organization Guidelines

## Directory Structure

```
src/
├── components/           # UI Components
│   ├── common/          # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── Modal.tsx
│   ├── layout/          # Layout components
│   └── features/        # Feature-specific components
│       ├── jobs/        # Job-related components
│       ├── documents/   # Document-related components
│       └── annotations/ # Annotation-related components
├── hooks/               # Custom React hooks
│   ├── useAuth.ts      # Authentication hook
│   └── useJobs.ts      # Jobs data hook
├── services/           # API and external services
│   ├── api/           # API clients
│   └── storage/       # Storage service
├── stores/            # State management
├── types/             # TypeScript types/interfaces
└── utils/             # Utility functions
```

## Implementation Steps

1. Break down large components:
   - Split `JobsDashboard.tsx` into smaller components:
     - `JobsList.tsx`
     - `JobFilters.tsx`
     - `JobActions.tsx`

2. Extract reusable logic:
   - Move PDF handling logic to `services/pdf/`
   - Move file upload logic to `services/upload/`
   - Create shared hooks for common operations

3. Create feature folders:
   - Group related components together
   - Include feature-specific types and utilities

4. Implement shared utilities:
   - Create common validation functions
   - Extract shared business logic
   - Implement reusable formatting helpers

## Example Component Structure

```typescript
// components/features/jobs/JobCard.tsx
import { formatDate } from '@/utils/date';
import { useJobActions } from '@/hooks/useJobActions';
import { Job } from '@/types/job';

interface JobCardProps {
  job: Job;
}

export function JobCard({ job }: JobCardProps) {
  // Component logic
}
```

## Best Practices

1. Keep files under 200 lines
2. One component per file
3. Group related functionality
4. Use absolute imports
5. Maintain consistent naming