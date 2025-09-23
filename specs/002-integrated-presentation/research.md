# Research Document: Integrated 20-Minute Presentation

**Feature**: 002-integrated-presentation
**Date**: 2025-09-23
**Purpose**: Technical research and decision documentation for Phase 0

## Executive Summary
This document captures all technical research, decisions, and rationale for implementing a single-file HTML presentation that integrates 60+ slides and PDF data into a 20-minute format with interactive visualizations.

## 1. Visualization Library Research

### Chart.js Selection
**Decision**: Use Chart.js 4.4.0 via CDN for standard charts
**Rationale**:
- Excellent browser compatibility
- Built-in interactivity and tooltips
- Lightweight when loaded from CDN (~200KB gzipped)
- Supports all required chart types (bar, line, pie, scatter, doughnut)
- Korean/English label support built-in

**Alternatives Considered**:
- D3.js: Too complex for standard charts, larger file size
- Plotly.js: Larger bundle size (3MB+), overkill for requirements
- Google Charts: Requires internet connection, privacy concerns

### Leaflet.js for Geographic Visualization
**Decision**: Use Leaflet 1.9.4 via CDN for all maps
**Rationale**:
- Industry standard for web maps
- Small footprint (~140KB gzipped)
- Excellent plugin ecosystem
- Built-in choropleth support
- Time-slider plugins available

**Alternatives Considered**:
- Mapbox GL: Requires API key, not fully offline
- D3 geo: More complex, larger custom code required
- Google Maps: Not offline-capable, requires API key

### Timeline Visualization Approach
**Decision**: Custom implementation using HTML/CSS/JavaScript
**Rationale**:
- Full control over appearance and behavior
- Minimal code footprint
- Can integrate with slide timing system
- No external dependencies needed

**Alternatives Considered**:
- Vis.js Timeline: Too heavy for simple timelines
- TimelineJS: Requires specific data format, harder to customize

## 2. Data Extraction Strategy

### PDF Data Extraction Method
**Decision**: Manual extraction with structured JSON output
**Rationale**:
- Ensures 100% accuracy (constitutional requirement)
- One-time effort for finite data set
- Human verification of context and meaning
- Handles complex tables and figures

**Process**:
1. Manual review of each panel, table, and figure
2. Extract numerical values with context
3. Structure in JSON with source references
4. Double-check against original PDF

**Alternatives Considered**:
- Automated PDF parsing: Risk of errors, complex table structures
- OCR-based extraction: Accuracy concerns with numbers

### Data Structure Format
**Decision**: Hierarchical JSON with type-specific schemas
```json
{
  "panels": {
    "panel1": {
      "title": "Key Messages",
      "content": {...},
      "source_page": 1810
    }
  },
  "tables": {
    "table1": {
      "title": "Population Growth",
      "headers": [...],
      "data": [...],
      "source_page": 1813
    }
  },
  "countries": {
    "kenya": {
      "tfr_1980": 7.8,
      "tfr_2005": 5.0,
      "coordinates": [-1.286, 36.817]
    }
  }
}
```

## 3. Slide Consolidation Strategy

### Content Analysis Approach
**Decision**: Three-pass consolidation process
**Rationale**:
- Systematic approach prevents content loss
- Identifies redundancies efficiently
- Maintains narrative coherence

**Process**:
1. **First Pass**: Catalog all slide content and categorize
2. **Second Pass**: Identify duplicates and overlaps
3. **Third Pass**: Merge and create final 35-40 slide structure

### Slide Timing Algorithm
**Decision**: Weighted timing based on content complexity
```javascript
const calculateSlideDuration = (slide) => {
  const baseTime = 30; // seconds
  const textComplexity = slide.wordCount / 150; // reading speed
  const visualComplexity = slide.visualizations.length * 5;
  return Math.min(45, baseTime + textComplexity + visualComplexity);
};
```

**Rationale**:
- Adaptive to content density
- Ensures 20-minute target
- Maximum 45 seconds prevents lingering

## 4. Single-File Architecture

### Build Strategy
**Decision**: Inline everything except CDN libraries
**Rationale**:
- Maximum portability
- No build step required for users
- Works offline after initial load
- Simplifies deployment

**Implementation**:
```html
<!DOCTYPE html>
<html>
<head>
  <!-- External CDN libraries -->
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css">
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0"></script>

  <!-- Inline styles -->
  <style>
    /* All custom CSS here */
  </style>
</head>
<body>
  <!-- HTML structure -->

  <script>
    // All JavaScript code inline
    // All data as JavaScript objects
  </script>
</body>
</html>
```

### Size Optimization Techniques
**Decision**: Multi-strategy optimization
**Techniques**:
1. Minify CSS and JavaScript before inlining
2. Use CSS custom properties for repeated values
3. Share visualization configurations via templates
4. Compress JSON data structure (remove whitespace)
5. Lazy-load complex visualizations

**Target**: Keep under 10MB limit with room for growth

## 5. Navigation and Timing System

### Navigation Controls
**Decision**: Keyboard + Mouse + Touch support
**Implementation**:
- Arrow keys: Previous/Next slide
- Space/Enter: Next slide
- ESC: Toggle fullscreen
- Number keys: Jump to section
- Mouse: Click areas and buttons
- Touch: Swipe gestures

### Timing Display
**Decision**: Multi-level timing information
**Components**:
1. Overall progress bar (0-20 minutes)
2. Current slide timer
3. Section markers
4. Time remaining display
5. Pace indicator (ahead/behind schedule)

### Auto-advance Feature
**Decision**: Optional with manual override
**Rationale**:
- Supports both rehearsal and presentation modes
- Can pause for questions
- Resumes from current position

## 6. Browser Compatibility

### Target Browsers
**Decision**: Modern browsers only (2020+)
**Minimum Versions**:
- Chrome 100+
- Firefox 100+
- Safari 15+
- Edge 100+

**Rationale**:
- ES6 module support required
- Modern CSS Grid and Flexbox
- Native lazy loading
- Intersection Observer API

### Fallback Strategy
**Decision**: Progressive enhancement with feature detection
```javascript
if (!window.IntersectionObserver) {
  // Load polyfill or provide basic functionality
}
```

## 7. Performance Optimization

### Initial Load Strategy
**Decision**: Progressive rendering
**Phases**:
1. Critical CSS and structure (< 100ms)
2. First slide content (< 500ms)
3. Navigation system (< 1s)
4. Remaining slides lazy-loaded
5. Visualizations on-demand

### Memory Management
**Decision**: Slide virtualization
**Approach**:
- Only keep 3 slides in DOM (previous, current, next)
- Destroy off-screen visualizations
- Recreate when needed
- Cache rendered visualization configs

## 8. Quality Assurance Strategy

### Data Accuracy Validation
**Decision**: Automated comparison tests
**Method**:
```javascript
// Test each data point against source
testDataAccuracy() {
  const sourceData = loadPDFExtract();
  const presentationData = loadPresentationData();

  for (const point of sourceData) {
    assertEqual(presentationData[point.id], point.value);
  }
}
```

### Visual Testing
**Decision**: Screenshot comparison
**Tools**:
- Playwright for cross-browser screenshots
- Visual regression with 5% threshold
- Manual review of flagged differences

### Timing Validation
**Decision**: Automated playthrough
**Method**:
- Simulate presentation at normal speed
- Measure total duration
- Flag if outside 19-21 minute range

## Research Conclusions

All technical decisions align with constitutional requirements and project constraints. The approach prioritizes:

1. **Data Accuracy**: Manual extraction with validation
2. **Performance**: Progressive loading and virtualization
3. **Portability**: Single-file with CDN dependencies only
4. **User Experience**: Multiple navigation methods and timing aids
5. **Maintainability**: Structured code organization despite inline requirement

No unresolved technical questions remain. Ready to proceed with Phase 1 design artifacts.