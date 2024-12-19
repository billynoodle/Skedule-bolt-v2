# OCR System Documentation

## Overview
The OCR system is designed to extract text from annotated areas in construction plans. It uses Tesseract.js for text recognition and includes preprocessing steps to improve accuracy.

## Components

### 1. Image Processing
```typescript
// services/ocr/imageProcessor.ts
- Contrast enhancement
- Noise reduction
- Binarization
- Scale adjustment
```

### 2. OCR Processing
```typescript
// services/ocr/ocrProcessor.ts
- Text recognition
- Confidence scoring
- Word detection
- Pattern matching
```

### 3. Pattern Matching
```typescript
// services/ocr/patternMatcher.ts
- Tag pattern recognition
- Material identification
- Validation rules
```

## Configuration

### OCR Settings
```typescript
interface OcrConfig {
  language: string;        // OCR language
  mode: string;           // Recognition mode
  confidence: number;     // Minimum confidence
  whitelist: string;      // Allowed characters
}
```

### Processing Options
```typescript
interface ProcessingOptions {
  contrast: number;       // Image contrast
  threshold: number;      // Binarization threshold
  denoise: boolean;       // Noise reduction
  scale: number;         // Image scaling
}
```

## Usage Example

```typescript
// Example usage in a component
const { processAnnotation } = useOcrProcessing({
  onTextExtracted: (text, confidence, result) => {
    // Handle extracted text
  },
  onError: (error) => {
    // Handle error
  },
  ocrConfig: {
    language: 'eng',
    mode: 'single-line',
    confidence: 60,
    whitelist: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ-'
  },
  processingOptions: {
    contrast: 1.2,
    threshold: 128,
    denoise: true,
    scale: 1
  }
});
```

## Error Handling

### Common Issues
1. Low confidence results
2. Image quality problems
3. Pattern matching failures

### Resolution Steps
1. Adjust preprocessing
2. Update OCR configuration
3. Refine pattern definitions

## Performance Optimization

### Image Processing
- Efficient algorithms
- Memory management
- Canvas optimization

### OCR Processing
- Worker management
- Batch processing
- Result caching

## Best Practices

### Image Preparation
1. Ensure good contrast
2. Remove noise
3. Proper scaling

### Pattern Definition
1. Clear prefix rules
2. Confidence thresholds
3. Validation checks

## Testing

### Unit Tests
- Image processing
- OCR accuracy
- Pattern matching

### Integration Tests
- End-to-end workflow
- Error scenarios
- Performance metrics