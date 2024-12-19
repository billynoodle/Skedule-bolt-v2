# Tag Pattern System Documentation

## Overview
The tag pattern system identifies and categorizes materials in construction plans using predefined patterns and OCR results.

## Components

### 1. Pattern Definition
```typescript
interface TagPattern {
  id: string;
  prefix: string;         // Pattern prefix
  description: string;    // Pattern description
  scheduleTable: string;  // Target table
}
```

### 2. Pattern Matching
```typescript
interface TagPatternMatch {
  pattern: TagPattern;    // Matched pattern
  confidence: number;     // Match confidence
  text: string;          // Extracted text
}
```

### 3. Pattern Storage
```typescript
// Supabase table: tag_patterns
- Pattern definitions
- User associations
- Usage tracking
```

## Usage

### Creating Patterns
```typescript
const pattern = {
  prefix: 'P',
  description: 'Piles',
  scheduleTable: 'PILE SCHEDULE'
};

await createTagPattern(documentId, pattern);
```

### Matching Patterns
```typescript
const match = matchTagPattern(extractedText, patterns);
if (match) {
  // Handle matched pattern
}
```

## Best Practices

### Pattern Definition
1. Clear, unique prefixes
2. Descriptive names
3. Proper categorization

### Pattern Management
1. Regular updates
2. Validation rules
3. User feedback

## Integration

### With OCR
1. Text extraction
2. Pattern matching
3. Result validation

### With UI
1. Pattern creation
2. Pattern linking
3. Result display

## Error Handling

### Common Issues
1. Pattern conflicts
2. Match failures
3. Database errors

### Resolution Steps
1. Validate patterns
2. Improve matching
3. Error recovery