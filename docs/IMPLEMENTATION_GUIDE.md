# Implementation Guide

## Code Organization Best Practices

### 1. Feature-First Organization

```
src/features/
├── materialSchedule/           # Material schedule feature
│   ├── components/            # Feature-specific components
│   │   ├── annotations/       # Annotation-related components
│   │   ├── patterns/         # Pattern-related components
│   │   └── viewer/           # PDF viewer components
│   ├── hooks/                # Feature-specific hooks
│   ├── services/            # Feature-specific services
│   ├── stores/              # Feature-specific state
│   └── types/               # Feature-specific types
```

### 2. Component Structure

```typescript
// Good: Single responsibility component
function TagPatternForm({ onSave, onCancel }: TagPatternFormProps) {
  const [pattern, setPattern] = useState(initialState);
  
  return (
    <form onSubmit={handleSubmit}>
      <PatternFields pattern={pattern} onChange={setPattern} />
      <FormActions onSave={onSave} onCancel={onCancel} />
    </form>
  );
}

// Bad: Mixed responsibilities
function TagPatternManager() {
  // Form state
  // Pattern list state
  // API calls
  // Multiple UI sections
}
```

### 3. Hook Organization

```typescript
// Good: Focused custom hook
function useTagPattern(patternId: string) {
  const [pattern, setPattern] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pattern-specific logic
  return { pattern, loading, error };
}

// Bad: Mixed concerns
function usePatternManager() {
  // Pattern state
  // Form handling
  // API calls
  // UI state
}
```

### 4. Service Layer

```typescript
// Good: Focused service
class TagPatternService {
  async createPattern(pattern: TagPattern): Promise<void> {
    // Pattern creation logic
  }

  async updatePattern(id: string, updates: Partial<TagPattern>): Promise<void> {
    // Pattern update logic
  }
}

// Bad: Mixed responsibilities
class PatternManager {
  // Database operations
  // UI state management
  // Validation logic
  // Event handling
}
```

## Implementation Steps

### 1. Set Up Feature Structure

```bash
mkdir -p src/features/materialSchedule/{components,hooks,services,stores,types}
```

### 2. Define Types

```typescript
// types/tagPattern.ts
export interface TagPattern {
  id: string;
  prefix: string;
  description: string;
  scheduleTable: string;
}

export interface TagPatternMatch {
  pattern: TagPattern;
  confidence: number;
  text: string;
}
```

### 3. Create Store

```typescript
// stores/tagPatternStore.ts
interface TagPatternState {
  patterns: Record<string, TagPattern[]>;
  loading: boolean;
  error: string | null;
}

export const useTagPatternStore = create<TagPatternState>((set) => ({
  patterns: {},
  loading: false,
  error: null,
  
  addPattern: async (pattern: TagPattern) => {
    try {
      set({ loading: true });
      // Add pattern logic
    } catch (err) {
      set({ error: 'Failed to add pattern' });
    } finally {
      set({ loading: false });
    }
  }
}));
```

### 4. Implement Services

```typescript
// services/tagPatternService.ts
export class TagPatternService {
  private supabase: SupabaseClient;

  constructor(supabase: SupabaseClient) {
    this.supabase = supabase;
  }

  async createPattern(pattern: TagPattern): Promise<void> {
    const { error } = await this.supabase
      .from('tag_patterns')
      .insert(pattern);
      
    if (error) throw error;
  }
}
```

### 5. Create Components

```typescript
// components/patterns/TagPatternForm.tsx
export function TagPatternForm({ onSave }: TagPatternFormProps) {
  const [pattern, setPattern] = useState(initialState);
  const { addPattern, loading } = useTagPatternStore();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await addPattern(pattern);
    onSave(pattern);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
}
```

## Error Handling

### 1. Service Layer

```typescript
// services/error.ts
export class ServiceError extends Error {
  constructor(
    message: string,
    public code: string,
    public status: number
  ) {
    super(message);
    this.name = 'ServiceError';
  }
}

// Usage
try {
  await patternService.createPattern(pattern);
} catch (err) {
  if (err instanceof ServiceError) {
    // Handle specific error
  }
}
```

### 2. Component Layer

```typescript
function ErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      fallback={({ error }) => (
        <ErrorDisplay error={error} />
      )}
    >
      {children}
    </ErrorBoundary>
  );
}
```

## State Management

### 1. Store Organization

```typescript
// Single responsibility stores
const usePatternStore = create<PatternState>(() => ({
  // Pattern-specific state
}));

const useViewerStore = create<ViewerState>(() => ({
  // Viewer-specific state
}));
```

### 2. Store Integration

```typescript
function PatternManager() {
  const patterns = usePatternStore(state => state.patterns);
  const viewerState = useViewerStore(state => state.viewerState);

  // Combine states as needed
}
```

## Testing Strategy

### 1. Component Tests

```typescript
describe('TagPatternForm', () => {
  it('should handle pattern creation', async () => {
    const onSave = vi.fn();
    render(<TagPatternForm onSave={onSave} />);
    
    // Test form submission
  });
});
```

### 2. Hook Tests

```typescript
describe('useTagPattern', () => {
  it('should load pattern data', async () => {
    const { result } = renderHook(() => useTagPattern('123'));
    
    // Test hook behavior
  });
});
```

### 3. Service Tests

```typescript
describe('TagPatternService', () => {
  it('should create pattern', async () => {
    const service = new TagPatternService(mockSupabase);
    
    // Test service methods
  });
});
```

## Performance Optimization

### 1. Component Optimization

```typescript
// Memoize expensive components
const MemoizedPatternList = memo(PatternList, (prev, next) => {
  return prev.patterns === next.patterns;
});

// Use callback for stable functions
const handlePatternSave = useCallback((pattern: TagPattern) => {
  // Handle save
}, [dependencies]);
```

### 2. State Updates

```typescript
// Batch related state updates
const handlePatternUpdate = async (pattern: TagPattern) => {
  batch(() => {
    updatePattern(pattern);
    updateUI();
    notifyChanges();
  });
};
```

## Deployment Considerations

### 1. Environment Configuration

```typescript
// config/environment.ts
export const config = {
  api: {
    baseUrl: import.meta.env.VITE_API_URL,
    timeout: 5000
  },
  features: {
    enableOCR: import.meta.env.VITE_ENABLE_OCR === 'true'
  }
};
```

### 2. Error Tracking

```typescript
// utils/errorTracking.ts
export function trackError(error: Error, context: string) {
  // Send to error tracking service
  errorTracker.capture(error, { context });
}
```

## Maintenance Guidelines

### 1. Code Documentation

```typescript
/**
 * Manages tag pattern creation and validation.
 * @param pattern - The pattern to create
 * @throws {ValidationError} If pattern is invalid
 * @throws {DatabaseError} If database operation fails
 */
async function createPattern(pattern: TagPattern): Promise<void> {
  // Implementation
}
```

### 2. Change Management

```typescript
// CHANGELOG.md
## [1.0.0] - 2024-02-20
### Added
- Tag pattern creation
- Pattern matching
- OCR integration

### Changed
- Improved pattern validation
- Updated UI components
```

## Monitoring and Logging

### 1. Performance Monitoring

```typescript
// utils/performance.ts
export function trackOperation(name: string, operation: () => Promise<void>) {
  const start = performance.now();
  
  try {
    await operation();
  } finally {
    const duration = performance.now() - start;
    logMetric(name, duration);
  }
}
```

### 2. Error Logging

```typescript
// utils/logger.ts
export function logError(
  component: string,
  error: Error,
  context?: Record<string, unknown>
) {
  console.error(`[${component}] ${error.message}`, {
    ...context,
    stack: error.stack
  });
}
```