# Data Model Specification

**Feature**: Enhanced Presentation Slides with PDF Citations
**Version**: 1.0.0
**Date**: 2025-01-22

## Overview
This document defines the data structures for the 60-slide presentation system with PDF citations and interactive visualizations.

## Core Entities

### 1. Slide
Primary unit of presentation content.

```typescript
interface Slide {
  id: number;                    // Unique identifier (1-60)
  sectionId: number;             // Parent section (1-9)
  order: number;                 // Order within section
  title: string;                 // Slide title
  subtitle?: string;             // Optional subtitle
  type: SlideType;               // Content type
  content: SlideContent;         // Main content
  citations: Citation[];         // PDF references
  visualizations: Visualization[]; // Charts/maps
  notes?: string;                // Speaker notes
  duration?: number;             // Estimated time in seconds
  transition?: TransitionType;   // Animation type
  background?: BackgroundConfig; // Custom background
}

enum SlideType {
  TITLE = 'title',
  CONTENT = 'content',
  VISUALIZATION = 'visualization',
  MIXED = 'mixed',
  SECTION_DIVIDER = 'section_divider'
}

enum TransitionType {
  FADE = 'fade',
  SLIDE = 'slide',
  ZOOM = 'zoom',
  NONE = 'none'
}
```

### 2. Section
Logical grouping of related slides.

```typescript
interface Section {
  id: number;            // Unique identifier (1-9)
  title: string;         // Section title
  titleKo: string;       // Korean title
  description?: string;  // Section overview
  slides: number[];      // Array of slide IDs
  order: number;         // Display order
  color: string;         // Theme color (hex)
  icon?: string;         // Font Awesome icon class
  estimatedDuration: number; // Total minutes
}
```

### 3. Citation
PDF document reference.

```typescript
interface Citation {
  id: string;           // Unique identifier
  slideId: number;      // Associated slide
  pageNumber: string;   // e.g., "p.1810", "Table 1, p.1813"
  text: string;         // Quoted text
  textKo?: string;      // Korean translation
  context: string;      // Surrounding context
  type: CitationType;   // Reference type
  elementId?: string;   // Linked visualization element
  coordinates?: PDFCoordinates; // Exact location in PDF
}

enum CitationType {
  DIRECT_QUOTE = 'direct_quote',
  DATA_POINT = 'data_point',
  STATISTICAL = 'statistical',
  TABLE = 'table',
  FIGURE = 'figure',
  PANEL = 'panel'
}

interface PDFCoordinates {
  page: number;
  x: number;
  y: number;
  width: number;
  height: number;
}
```

### 4. Visualization
Interactive chart or map configuration.

```typescript
interface Visualization {
  id: string;                // Unique identifier
  slideId: number;          // Parent slide
  type: VisualizationType;  // Visualization library
  subtype: string;          // Specific chart type
  data: VisualizationData; // Chart data
  config: any;              // Library-specific config
  interactive: boolean;     // User interaction enabled
  responsive: boolean;      // Auto-resize
  citations: string[];      // Related citation IDs
  caption?: string;         // Description
  captionKo?: string;       // Korean caption
}

enum VisualizationType {
  PLOTLY = 'plotly',
  LEAFLET = 'leaflet',
  CHARTJS = 'chartjs',
  D3 = 'd3',
  CUSTOM = 'custom'
}

interface VisualizationData {
  source: DataSource;      // Data origin
  values: any;             // Actual data
  metadata?: DataMetadata; // Additional info
  lastUpdated?: string;    // ISO date
}

enum DataSource {
  PDF = 'pdf',
  CALCULATED = 'calculated',
  EXTERNAL = 'external',
  MANUAL = 'manual'
}

interface DataMetadata {
  unit?: string;          // e.g., "percentage", "millions"
  precision?: number;     // Decimal places
  nullValue?: any;        // Representation of null
  description?: string;   // Data description
}
```

### 5. SlideContent
Structured content within a slide.

```typescript
interface SlideContent {
  layout: LayoutType;           // Content arrangement
  elements: ContentElement[];   // Content items
  columns?: number;             // Multi-column layout
  spacing?: SpacingConfig;      // Custom spacing
}

enum LayoutType {
  SINGLE = 'single',
  TWO_COLUMN = 'two_column',
  THREE_COLUMN = 'three_column',
  GRID = 'grid',
  CENTERED = 'centered',
  FULLSCREEN = 'fullscreen'
}

interface ContentElement {
  id: string;                   // Element identifier
  type: ElementType;            // Element type
  value: any;                   // Content value
  order: number;                // Display order
  style?: ElementStyle;         // Custom styling
  animation?: AnimationConfig;  // Entry animation
  citationId?: string;         // Linked citation
}

enum ElementType {
  HEADING = 'heading',
  TEXT = 'text',
  LIST = 'list',
  IMAGE = 'image',
  CHART = 'chart',
  MAP = 'map',
  TIMELINE = 'timeline',
  TABLE = 'table',
  QUOTE = 'quote',
  CODE = 'code'
}

interface ElementStyle {
  fontSize?: string;
  fontWeight?: string;
  color?: string;
  backgroundColor?: string;
  padding?: string;
  margin?: string;
  textAlign?: string;
  customClass?: string;
}

interface AnimationConfig {
  type: string;        // Animation name
  duration: number;    // Milliseconds
  delay?: number;      // Delay in ms
  easing?: string;     // Easing function
}
```

## Supporting Entities

### 6. Navigation
Navigation state and configuration.

```typescript
interface NavigationState {
  currentSlide: number;        // Active slide ID
  currentSection: number;      // Active section ID
  history: number[];          // Navigation history
  bookmarks: number[];        // Bookmarked slides
  presentationMode: boolean;  // Fullscreen mode
  speakerNotes: boolean;      // Show notes
}

interface NavigationConfig {
  enableKeyboard: boolean;     // Keyboard shortcuts
  enableTouch: boolean;        // Touch gestures
  enableWheel: boolean;        // Mouse wheel
  autoAdvance?: number;        // Auto-advance in seconds
  loop: boolean;              // Loop to beginning
}
```

### 7. Theme
Visual appearance configuration.

```typescript
interface Theme {
  name: string;
  colors: ColorPalette;
  typography: TypographyConfig;
  spacing: SpacingConfig;
  animations: AnimationDefaults;
}

interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  background: string;
  surface: string;
  error: string;
  warning: string;
  success: string;
  info: string;
}

interface TypographyConfig {
  fontFamily: string;
  headingFamily?: string;
  baseFontSize: string;
  lineHeight: number;
  headingSizes: {
    h1: string;
    h2: string;
    h3: string;
    h4: string;
    h5: string;
    h6: string;
  };
}

interface SpacingConfig {
  base: number;        // Base spacing unit
  scale: number[];     // Spacing scale
}

interface AnimationDefaults {
  duration: number;
  easing: string;
  stagger: number;
}
```

### 8. PresentationMetadata
Overall presentation information.

```typescript
interface PresentationMetadata {
  title: string;
  titleKo: string;
  authors: Author[];
  publication: PublicationInfo;
  created: string;           // ISO date
  modified: string;          // ISO date
  version: string;
  language: Language[];
  tags: string[];
  description: string;
  duration: number;          // Total minutes
  slideCount: number;
  citationCount: number;
  visualizationCount: number;
}

interface Author {
  name: string;
  affiliation: string;
  email?: string;
  orcid?: string;
}

interface PublicationInfo {
  journal: string;
  year: number;
  volume?: string;
  issue?: string;
  pages: string;
  doi: string;
  url?: string;
}

enum Language {
  EN = 'en',
  KO = 'ko'
}
```

## Data Relationships

### Entity Relationship Diagram
```
PresentationMetadata
    |
    └── Section (1:N)
            |
            └── Slide (1:N)
                    |
                    ├── SlideContent (1:1)
                    │       └── ContentElement (1:N)
                    |
                    ├── Citation (1:N)
                    |
                    └── Visualization (1:N)
                            └── VisualizationData (1:1)
```

### Key Relationships
1. **Section → Slides**: One-to-many, ordered
2. **Slide → Citations**: One-to-many, multiple references per slide
3. **Slide → Visualizations**: One-to-many, multiple charts per slide
4. **Visualization → Citations**: Many-to-many through citation IDs
5. **ContentElement → Citation**: One-to-one optional link

## Data Constraints

### Validation Rules
```typescript
const ValidationRules = {
  slide: {
    id: { min: 1, max: 60, unique: true },
    sectionId: { min: 1, max: 9, required: true },
    title: { maxLength: 200, required: true },
    citations: { maxCount: 10 },
    visualizations: { maxCount: 3 }
  },
  citation: {
    pageNumber: { pattern: /^(p\.\d+|Table \d+, p\.\d+|Figure \d+, p\.\d+)$/ },
    text: { maxLength: 1000 },
    context: { maxLength: 500 }
  },
  visualization: {
    data: { maxSize: 1048576 }, // 1MB
    config: { maxSize: 102400 }  // 100KB
  }
};
```

### Required Fields
- Every slide must have at least one citation
- Every visualization must have associated data
- Every section must have at least one slide
- Every citation must reference a valid PDF page

## Storage Strategy

### Primary Storage
```javascript
// JSON files for static data
const dataFiles = {
  'slides.json': 'Complete slide data',
  'sections.json': 'Section metadata',
  'citations.json': 'All citations',
  'visualizations.json': 'Visualization configs',
  'metadata.json': 'Presentation metadata'
};
```

### Runtime Storage
```javascript
// In-memory caching
const cache = {
  slides: new Map(),         // Loaded slides
  visualizations: new Map(), // Rendered visualizations
  citations: new Map()       // Processed citations
};

// LocalStorage for state
const persistentState = {
  'presentation.navigation': NavigationState,
  'presentation.preferences': UserPreferences,
  'presentation.bookmarks': number[]
};

// SessionStorage for temporary
const sessionState = {
  'presentation.cache': 'Preloaded slides',
  'presentation.history': 'Navigation history'
};
```

## Access Patterns

### Common Queries
1. **Get slide by ID**: O(1) with Map
2. **Get slides by section**: O(n) where n = slides in section
3. **Get citations for slide**: O(m) where m = citations
4. **Get next/previous slide**: O(1) with ordering
5. **Search citations by page**: O(n) full scan or indexed

### Optimization Strategies
1. **Preload adjacent slides**: n-1, n, n+1
2. **Lazy load visualizations**: On slide enter
3. **Cache rendered content**: Until memory pressure
4. **Index citations by page**: For quick lookup

## Migration & Versioning

### Data Version Management
```typescript
interface DataVersion {
  version: string;        // Semantic version
  migrated: string;       // ISO date
  migrations: Migration[];
}

interface Migration {
  from: string;
  to: string;
  date: string;
  changes: string[];
}
```

### Backward Compatibility
- Maintain v1 schema for 6 months
- Provide migration tools
- Version all API endpoints
- Document breaking changes

---

## Implementation Notes

### Performance Considerations
- Keep individual slide data under 100KB
- Compress visualization data when possible
- Use pagination for citation searches
- Implement virtual scrolling for slide menu

### Security Considerations
- Sanitize all user-generated content
- Validate citation page numbers
- Limit visualization data size
- Prevent XSS in dynamic content

### Accessibility Requirements
- All visualizations need text alternatives
- Citations must be screen-reader friendly
- Maintain logical tab order
- Provide keyboard navigation

---

*Data Model Complete - Ready for Implementation*