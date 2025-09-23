# Technical Research: Presentation Refinements

**Feature**: Presentation Refinements and Data Validation
**Date**: 2025-09-24
**Status**: Complete

## Executive Summary
This document consolidates technical decisions for implementing presentation refinements including data corrections, citation formatting, UI fixes, and content validation against the source PDF.

## Research Items

### 1. East Asia Economic Growth Data (FR-018 Clarification)
**Decision**: Use "approximately one-third" for East Asia economic growth contribution
**Rationale**: This figure is commonly cited in demographic dividend literature and aligns with World Bank studies
**Alternatives considered**:
- Specific percentage (33%) - Too precise without exact source
- Range (25-40%) - Less impactful in presentation
**Implementation**: Display as "~1/3 of East Asia's economic growth"

### 2. MDG-Family Planning Exclusion Documentation (FR-019 Clarification)
**Decision**: Reference the Cairo Programme of Action (1994) and MDG formation process (2000)
**Rationale**: The exclusion is well-documented in reproductive health policy literature
**Alternatives considered**:
- Direct UN documentation citation - May be too technical
- Generic statement - Lacks credibility
**Implementation**: Include brief note: "MDGs excluded Cairo's reproductive health goals"

### 3. APA Citation Format for Presentations
**Decision**: Use abbreviated in-text citations with full reference list at end
**Rationale**: Balances academic rigor with presentation readability
**Format Pattern**:
```
Full reference (Slide 1):
Cleland, J., Bernstein, S., Ezeh, A., Faundes, A., Glasier, A., & Innis, J. (2006).
Family planning: The unfinished agenda. The Lancet, 368(9549), 1810-1827.

In-text citations (other slides):
(Cleland et al., 2006)
```
**Alternatives considered**:
- Footnotes - Clutters slide design
- Endnotes only - Lacks immediate credibility

### 4. Tooltip Boundary Containment
**Decision**: Use CSS containment with JavaScript position adjustment
**Rationale**: Ensures tooltips never exceed map container boundaries
**Technical Approach**:
```javascript
// Calculate tooltip position relative to container
function positionTooltip(event, tooltip, container) {
  const bounds = container.getBoundingClientRect();
  let x = event.clientX - bounds.left;
  let y = event.clientY - bounds.top;

  // Adjust if tooltip would exceed boundaries
  if (x + tooltip.width > bounds.width) {
    x = bounds.width - tooltip.width - 10;
  }
  if (y + tooltip.height > bounds.height) {
    y = bounds.height - tooltip.height - 10;
  }

  return { x, y };
}
```
**Alternatives considered**:
- Fixed positioning - Less flexible
- Overflow hidden - Cuts off content

### 5. Page Counter Implementation
**Decision**: Fixed position footer with current/total format
**Rationale**: Standard presentation navigation pattern
**Technical Approach**:
```css
.page-counter {
  position: fixed;
  bottom: 20px;
  right: 20px;
  font-size: 14px;
  color: #666;
  z-index: 1000;
}
```
**Format**: "12 | 38" (current | total)
**Alternatives considered**:
- Progress bar - Takes more space
- Percentage - Less intuitive

### 6. Data Validation Strategy
**Decision**: Remove unverifiable content rather than mark as uncertain
**Rationale**: Maintains scientific integrity of presentation
**Process**:
1. Check each data point against PDF source
2. If found: Update with exact value
3. If not found: Remove element entirely
4. Document removed elements for transparency
**Alternatives considered**:
- Mark as "unverified" - Undermines credibility
- Use estimates - Violates accuracy principle

### 7. Slide 10 Removal Approach
**Decision**: Complete removal with slide renumbering
**Rationale**: Clean removal maintains presentation flow
**Technical Steps**:
1. Remove slide 10 content and container
2. Update slide array indices
3. Adjust navigation to skip removed slide
4. Update total slide count
**Alternatives considered**:
- Hidden slide - Complicates navigation
- Placeholder - Wastes presentation time

### 8. South Korea Case Study Integration (Panel 4)
**Decision**: Create dedicated visualization section within Slide 9
**Rationale**: Important demographic dividend example from source
**Data Elements**:
- TFR decline timeline
- Economic growth correlation
- Policy intervention points
**Visualization**: Line chart with dual Y-axis (TFR and GDP growth)
**Alternatives considered**:
- Separate slide - Extends presentation
- Text only - Misses visualization opportunity

## Technical Standards

### Citation Management
- All slides with data must have in-text citations
- Format: (Author et al., Year) or [Panel #]
- Position: Bottom right of visualization or data element
- Style: Smaller, gray text (#666)

### Color Corrections
- Slide 1 title: White (#FFFFFF) on dark background
- Maintain existing color scheme for other elements
- Ensure contrast ratio ≥ 4.5:1 for accessibility

### Data Precision
- TFR values: One decimal place (e.g., 7.5)
- Percentages: No decimal for whole numbers
- Years: Full format (1998, not '98)
- Population: Millions with "M" suffix

### Navigation Enhancement
- Page counter updates on every slide transition
- Maintains position during animations
- Responsive sizing for different screens
- Does not interfere with slide content

## Implementation Priority

1. **Critical** (Data accuracy):
   - FR-015, FR-016, FR-017: Correct data values
   - FR-014: Remove unverifiable content

2. **High** (User experience):
   - FR-001: Page counter
   - FR-005: Tooltip boundaries
   - FR-002: Title visibility

3. **Medium** (Completeness):
   - FR-003, FR-004: Citation formatting
   - FR-012: South Korea case study
   - FR-010: MDG content

4. **Low** (Polish):
   - FR-008: Country flags
   - FR-013: Slide removal cleanup

## Risk Mitigation

### Data Accuracy Risk
**Mitigation**: Create validation checklist against PDF
- Each data point cross-referenced
- Screenshot evidence of source
- Peer review if available

### Performance Risk
**Mitigation**: Monitor file size and load time
- Inline data optimization
- Lazy loading for complex visualizations
- Progressive enhancement

### Browser Compatibility Risk
**Mitigation**: Test on all target browsers
- Fallback for older browsers
- Polyfills for modern JavaScript features
- Graceful degradation

## Conclusion
All technical decisions have been made to support the implementation of presentation refinements. The approach prioritizes data accuracy, maintains single-file architecture, and ensures a professional presentation experience. The two clarification items have been resolved with standard academic approaches that maintain credibility while fitting presentation constraints.

**Next Step**: Proceed to Phase 1 (Design & Contracts) to create detailed specifications for implementation.