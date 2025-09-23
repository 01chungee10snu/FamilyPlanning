# Data Model: Presentation Refinements

**Feature**: Presentation Refinements and Data Validation
**Version**: 1.0.0
**Date**: 2025-09-24

## Overview
This document defines the data structures for presentation refinements including navigation state, citations, slide corrections, and visualization updates.

## Core Entities

### 1. NavigationState
**Purpose**: Manages page counter and slide navigation
**Structure**:
```javascript
{
  currentSlide: number,      // 1-based index
  totalSlides: number,       // Total slide count (35-40)
  isVisible: boolean,        // Show/hide page counter
  format: string            // Display format template
}
```
**Validation**:
- currentSlide must be between 1 and totalSlides
- totalSlides updates after slide 10 removal
- format default: "{current} | {total}"

### 2. Citation
**Purpose**: Manages reference formatting and display
**Structure**:
```javascript
{
  id: string,               // Unique identifier
  type: "full" | "intext",  // Citation type
  authors: string[],         // Author names
  year: number,             // Publication year
  title: string,            // Work title
  journal: string,          // Publication venue
  volume: string,           // Volume/issue
  pages: string,            // Page range
  display: string           // Formatted output
}
```
**Validation**:
- APA format compliance
- Year must be 4 digits
- In-text format: "(Authors, Year)"

### 3. SlideCorrection
**Purpose**: Tracks content updates per slide
**Structure**:
```javascript
{
  slideNumber: number,      // Slide identifier
  corrections: [{
    element: string,        // Element identifier
    type: "text" | "data" | "style",
    oldValue: any,          // Previous value
    newValue: any,          // Corrected value
    source: string         // PDF reference
  }],
  isRemoved: boolean      // For slide 10
}
```
**Validation**:
- All corrections must have source reference
- Removed slides excluded from navigation

### 4. VisualizationUpdate
**Purpose**: Manages chart and map modifications
**Structure**:
```javascript
{
  vizId: string,           // Visualization identifier
  type: "chart" | "map" | "table",
  dataUpdates: [{
    key: string,           // Data point key
    oldValue: number,      // Previous value
    newValue: number,      // Corrected value
    citation: string       // Source citation
  }],
  tooltipConfig: {
    containment: boolean,  // Boundary containment
    maxWidth: number,      // Maximum width in pixels
    positioning: string    // Position strategy
  }
}
```
**Validation**:
- All data updates require citation
- Tooltip must stay within container

### 5. CountryData
**Purpose**: Manages country-specific information
**Structure**:
```javascript
{
  countryCode: string,     // ISO 3166-1 alpha-2
  countryName: string,     // Display name
  tfr: {
    initial: number,       // Starting TFR value
    final: number,         // Ending TFR value
    year: number          // Reference year
  },
  contraceptiveUse: {
    initial: number,       // Starting percentage
    final: number,         // Ending percentage
  },
  showFlag: boolean,       // Display country flag
  additionalData: object   // Other metrics
}
```
**Validation**:
- TFR values must be positive
- Percentages between 0-100
- Valid country codes only

## State Management

### PresentationState
**Purpose**: Global presentation state container
**Structure**:
```javascript
{
  navigation: NavigationState,
  citations: Citation[],
  corrections: SlideCorrection[],
  visualizations: VisualizationUpdate[],
  countryData: CountryData[],
  validationStatus: {
    dataVerified: boolean,
    citationsComplete: boolean,
    uiFixed: boolean
  }
}
```

## Data Relationships

```
PresentationState
├── NavigationState (1:1)
├── Citations (1:many)
│   └── Referenced by SlideCorrections
├── SlideCorrections (1:many)
│   └── Links to VisualizationUpdates
├── VisualizationUpdates (1:many)
│   └── Contains CountryData references
└── CountryData (1:many)
```

## Specific Data Corrections

### Slide 1
- Title text color: #FFFFFF
- Citation: Full APA format for Cleland et al., 2006

### Slide 2
- TFR source citation: (UN Population Division, 2006)
- Contraceptive use citation: (UN Population Division, 2006)

### Slide 3
- Regional growth table: Complete data from PDF
- Tooltip containment: Max width 200px

### Slide 4
- Niger TFR: 7.5 (1998)
- Population projections: 50M (with decline), 82M (current trend)
- Unmet need: 17% (56% no future intent)

### Slide 5
- Kenya TFR: 8.0 → current
- Kenya contraceptive: 7% → 27%
- Flags: Kenya ✓, Brazil ✓, Iran ✗, Thailand ✗

### Slide 6
- Bangladesh/Pakistan comparison with citations
- Population differential: 62M by 2050

### Slide 7
- MDG relationships with family planning
- Demographic dividend: ~1/3 East Asia growth

### Slide 8
- Infant mortality: "nearly 10%" (not 20%)
- Remove unsourced statistics

### Slide 9
- Add South Korea Panel 4 data
- Demographic dividend visualization

### Slide 10
- Complete removal from presentation

## Validation Rules

### Data Integrity
1. Every numerical value must trace to PDF source
2. Unverifiable data must be removed
3. Citations required for all data points

### UI Consistency
1. Page counter visible on all slides
2. Tooltips contained within boundaries
3. Consistent citation formatting

### Content Accuracy
1. TFR values to 1 decimal place
2. Percentages as whole numbers
3. Years in full format (YYYY)

## Migration Strategy

### Implementation Order
1. Create NavigationState for page counter
2. Process SlideCorrections sequentially
3. Update VisualizationUpdates with new data
4. Apply Citation formatting globally
5. Remove slide 10 and renumber

### Rollback Plan
1. Preserve original presentation.html
2. Create versioned backup before changes
3. Test each correction independently
4. Validate against PDF after each change

## Performance Considerations

### Data Size
- Inline data adds ~5KB for corrections
- Citation text adds ~2KB
- Navigation state: <1KB

### Rendering Impact
- Tooltip calculations: <10ms per hover
- Page counter update: <5ms per transition
- Citation rendering: One-time cost

## Testing Requirements

### Unit Tests
- Citation formatting validation
- Data correction accuracy
- Navigation state management

### Integration Tests
- Tooltip boundary containment
- Page counter visibility
- Slide removal impact

### Validation Tests
- PDF source verification
- APA format compliance
- Performance benchmarks