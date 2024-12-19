# Services Organization

## Directory Structure
```
services/
├── pdf/                  # PDF handling
│   ├── core/            # Core PDF functionality
│   │   ├── PDFManager.ts
│   │   └── types.ts
│   └── config.ts        # PDF configuration
├── canvas/              # Canvas handling  
│   ├── core/           # Core canvas functionality
│   │   ├── CanvasManager.ts
│   │   ├── TransformManager.ts
│   │   └── types.ts
│   └── utils/          # Canvas utilities
├── annotations/         # Annotation handling
│   ├── core/           # Core annotation functionality
│   │   ├── AnnotationManager.ts
│   │   └── types.ts
│   └── utils/          # Annotation utilities
└── ocr/                # OCR functionality
    ├── core/           # Core OCR functionality
    │   ├── OCRProcessor.ts
    │   └── types.ts
    └── utils/          # OCR utilities
```

## Files to Remove
The following files are deprecated and should be removed:

1. PDF Related:
- src/services/pdf/documentPreparation.ts (merged into PDFManager)
- src/services/pdf/pdfInitializer.ts (merged into config.ts)

2. Canvas Related:
- src/services/canvas/fabricCanvas.ts (merged into CanvasManager)
- src/services/canvas/fabricObjects.ts (merged into AnnotationManager)
- src/services/canvas/viewportTransform.ts (merged into TransformManager)

3. OCR Related:
- src/services/ocr/imageProcessor.ts (merged into OCRProcessor)
- src/services/ocr/ocrProcessor.ts (merged into core/OCRProcessor)
- src/services/ocr/patternMatcher.ts (moved to annotations/utils)

4. Components:
- src/components/viewer/* (replaced by new implementation)
- src/components/annotations/* (replaced by new implementation)
- src/components/pdf/* (replaced by new implementation)