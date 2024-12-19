# PDF Handling Guide: Step by Step

## Overview
This guide explains exactly how PDFs are handled in our application, from upload to display and annotation.

## Step 1: PDF Upload
When a user uploads a PDF:

1. The file is validated:
   - Checks file type is "application/pdf"
   - Verifies file size is under 50MB
   - Reads first 5 bytes to confirm PDF header ("%PDF-")

2. The file is processed for storage:
   - Creates a unique file path using user ID and job ID
   - Uploads to Supabase storage
   - Creates database record with metadata

## Step 2: PDF Loading

1. Worker Initialization:
   - Loads PDF.js worker from `/assets/pdf.worker.js`
   - Sets up worker configuration for PDF processing
   - Initializes worker with language and font support

2. Document Loading:
   - Creates signed URL for PDF access
   - Loads PDF document using PDF.js
   - Initializes document with configuration:
     ```javascript
     {
       cMapUrl: '/assets/cmaps/',
       cMapPacked: true,
       standardFontDataUrl: '/assets/standard_fonts/',
       useWorkerFetch: false,
       isEvalSupported: false,
       useSystemFonts: false
     }
     ```

## Step 3: PDF Rendering

1. Page Setup:
   - Gets first page of PDF
   - Creates viewport with initial scale (1.0)
   - Determines page dimensions
   - Checks orientation (portrait/landscape)

2. Canvas Preparation:
   - Creates main canvas element
   - Sets canvas dimensions based on page size
   - Applies any rotation (0, 90, 180, 270 degrees)
   - Scales canvas based on zoom level

3. Rendering Process:
   - Renders PDF page to canvas
   - Disables text and annotation layers
   - Applies any transformations (scale/rotation)
   - Updates view when complete

## Step 4: Annotation Layer

1. Canvas Layer Setup:
   - Creates Fabric.js canvas over PDF
   - Matches dimensions with PDF page
   - Synchronizes transformations
   - Sets up event listeners

2. Coordinate System:
   - PDF coordinates (0,0 at bottom-left)
   - Canvas coordinates (0,0 at top-left)
   - Transforms between coordinate systems
   - Handles scaling and rotation

## Step 5: User Interactions

1. Zooming:
   - Updates scale factor
   - Recalculates page dimensions
   - Redraws PDF and annotations
   - Maintains annotation positions

2. Rotation:
   - Rotates page in 90-degree increments
   - Updates viewport rotation
   - Transforms annotation coordinates
   - Redraws entire view

3. Panning:
   - Handles mouse/touch drag events
   - Updates view position
   - Maintains annotation alignment
   - Syncs PDF and annotation layers

## Step 6: Memory Management

1. Cleanup Process:
   - Destroys PDF document when unmounting
   - Cleans up worker instances
   - Releases canvas resources
   - Clears cached data

2. Resource Optimization:
   - Reuses canvas when possible
   - Implements lazy loading for pages
   - Manages memory usage
   - Handles garbage collection

## Step 7: Error Handling

1. Load Failures:
   - Validates PDF structure
   - Handles corrupt files
   - Shows user-friendly errors
   - Provides retry options

2. Render Issues:
   - Handles missing fonts
   - Manages failed page loads
   - Recovers from render errors
   - Maintains application state

## Step 8: Performance Optimization

1. Initial Load:
   - Loads first page immediately
   - Defers other page loading
   - Shows loading indicators
   - Maintains responsiveness

2. Rendering:
   - Uses hardware acceleration
   - Implements canvas recycling
   - Optimizes redraw calls
   - Manages render quality

## Common Issues and Solutions

1. PDF Won't Load
   - Check file corruption
   - Verify PDF version compatibility
   - Validate file permissions
   - Check network connectivity

2. Slow Performance
   - Reduce initial page quality
   - Implement progressive loading
   - Optimize canvas operations
   - Use memory efficiently

3. Display Issues
   - Verify browser compatibility
   - Check PDF formatting
   - Validate font availability
   - Handle special characters

## Technical Details

1. PDF.js Configuration:
```javascript
const PDF_OPTIONS = {
  cMapUrl: '/assets/cmaps/',
  cMapPacked: true,
  standardFontDataUrl: '/assets/standard_fonts/',
  useWorkerFetch: false,
  isEvalSupported: false,
  useSystemFonts: false,
  disableAutoFetch: false,
  disableStream: false,
  disableFontFace: false
};
```

2. Canvas Setup:
```javascript
const canvas = new fabric.Canvas('annotationCanvas', {
  selection: true,
  preserveObjectStacking: true,
  renderOnAddRemove: true,
  enableRetinaScaling: true
});
```

3. Coordinate Transformation:
```javascript
function transformCoordinates(x: number, y: number, scale: number, rotation: number) {
  const rad = (rotation * Math.PI) / 180;
  return {
    x: (x * Math.cos(rad) - y * Math.sin(rad)) * scale,
    y: (x * Math.sin(rad) + y * Math.cos(rad)) * scale
  };
}
```

## Best Practices

1. File Handling:
   - Always validate PDFs before processing
   - Handle large files appropriately
   - Implement proper error handling
   - Provide progress feedback

2. Memory Management:
   - Clean up resources properly
   - Implement page unloading
   - Monitor memory usage
   - Handle device limitations

3. User Experience:
   - Show loading states
   - Provide error feedback
   - Maintain responsiveness
   - Support touch devices