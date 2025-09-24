# Research: Data Corrections for PDF Source Alignment

## Overview
Research findings for implementing data corrections to align presentation with the Lancet 2006 paper source material.

## Technical Decisions

### 1. Data Correction Strategy
**Decision**: In-place modification with backup
**Rationale**:
- Single HTML file architecture requires direct editing
- Backup ensures rollback capability
- Preserves existing visualization implementations
**Alternatives considered**:
- Separate correction file: Rejected due to single-file constraint
- Complete rewrite: Rejected to preserve existing functionality

### 2. Data Validation Approach
**Decision**: Manual cross-reference with PDF source
**Rationale**:
- Academic accuracy requirements demand exact matching
- PDF tables and panels provide authoritative source
- Visual validation confirms corrections display properly
**Alternatives considered**:
- Automated PDF parsing: Rejected due to complexity for 5 corrections
- External data sources: Rejected, must match specific 2006 publication

### 3. Color Enhancement Strategy
**Decision**: Apply ColorConcept.png improvements selectively
**Rationale**:
- Maintain consistency across presentation
- Enhance readability without disrupting existing design
- Focus on data visibility improvements
**Alternatives considered**:
- Complete redesign: Rejected to minimize scope
- No visual changes: Rejected as improvements were requested

### 4. Qualitative Insights Integration
**Decision**: Add as supplementary text within existing slide structure
**Rationale**:
- Maintains slide count and timing
- Provides context without disrupting flow
- Uses existing layout patterns
**Alternatives considered**:
- New slides: Rejected due to 20-minute constraint
- Footnotes: Rejected for readability during presentation

## Best Practices Applied

### HTML5 Single-File Development
- All scripts and styles inline
- Data structures as JavaScript objects
- No external dependencies beyond CDN libraries
- Maintain file size under 10MB limit

### Chart.js Data Updates
- Modify data arrays directly in configuration objects
- Preserve existing chart options and styling
- Ensure tooltips reflect corrected values
- Maintain animation settings

### Academic Data Presentation
- Exact numerical fidelity to source
- Clear citation of source tables/panels
- Consistent decimal precision
- No interpolation or estimation

### Version Control Best Practices
- Timestamped backup before modifications
- Clear commit messages documenting each correction
- Preserve original data in comments for reference
- Tag release after validation complete

## Implementation Patterns

### Slide Location Pattern
```javascript
// Pattern for locating specific slides
const slides = document.querySelectorAll('.slide');
const targetSlide = Array.from(slides).find(slide =>
  slide.querySelector('h2')?.textContent.includes('Niger')
);
```

### Data Correction Pattern
```javascript
// Pattern for updating chart data
const chartConfig = window.chartConfigs[chartId];
chartConfig.data.datasets[0].data = [14, 50]; // Corrected values
chartConfig.options.plugins.tooltip.callbacks.label = function(context) {
  return `${context.parsed.y} million`; // Updated units
};
```

### Backup Creation Pattern
```javascript
// Pattern for creating timestamped backup
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const backupName = `index_backup_${timestamp}.html`;
```

## Risk Mitigation

### Data Accuracy Risks
- **Risk**: Transcription errors from PDF
- **Mitigation**: Double-check each value, maintain source reference comments

### Visual Consistency Risks
- **Risk**: Corrections disrupting layout
- **Mitigation**: Test at multiple screen sizes, preserve existing CSS

### Performance Impact Risks
- **Risk**: Additional content affecting load time
- **Mitigation**: Optimize text content, maintain CDN usage for libraries

### Browser Compatibility Risks
- **Risk**: Changes breaking older browser support
- **Mitigation**: Use ES6 features conservatively, test across target browsers

## Validation Requirements

### Data Validation Checklist
- [ ] Niger population: 14 million (2005)
- [ ] Niger contraceptive use: 4.6% (1998)
- [ ] Niger projection: 50 million (2050)
- [ ] Brazil TFR endpoint: 2.5 (not 2.3)
- [ ] Pakistan contraceptive rate: 12% (1990)
- [ ] Asia statistics: Total only, no sub-regions
- [ ] Unmet demand: Qualitative insights included

### Visual Validation Checklist
- [ ] All slides maintain 16:9 aspect ratio
- [ ] Charts display corrected values in tooltips
- [ ] Color improvements enhance readability
- [ ] Animations function correctly
- [ ] Text remains readable at presentation distance

### Technical Validation Checklist
- [ ] File size remains under 10MB
- [ ] Load time under 3 seconds
- [ ] No console errors
- [ ] CDN libraries load successfully
- [ ] Backup file created successfully

## Conclusion
All technical unknowns have been resolved. The approach focuses on minimal, targeted corrections while preserving existing functionality. Implementation can proceed with Phase 1 design artifacts.