# Research: Critical Challenges Slide Implementation

## Design Decisions

### 1. Slide Placement
**Decision**: Insert after current slide 5 (merged success/failure cases)
**Rationale**: Creates natural narrative arc from "what works" to "current crisis" to "solutions needed"
**Alternatives considered**:
- After slide 1 (too early, breaks positive opening)
- End of presentation (loses urgency impact)
- Replace existing slide (reduces content coverage)

### 2. Visual Layout Pattern
**Decision**: Three-column crisis panel layout with timeline
**Rationale**: Matches three main themes from edit.md while maintaining visual balance
**Alternatives considered**:
- Single column list (too text-heavy)
- Two-panel split (doesn't accommodate all themes)
- Full infographic (too complex for 30-40 second viewing)

### 3. Data Visualization Approach
**Decision**: Combined timeline + statistics cards + mini heat map
**Rationale**: Multiple visualization types prevent monotony while emphasizing different aspects
**Alternatives considered**:
- Single large chart (less information density)
- Text-only statistics (violates data-driven principle)
- Full interactive map (too complex for time constraint)

### 4. Color Scheme
**Decision**: Warning palette (oranges/reds) with dark backgrounds
**Rationale**: Conveys urgency without being alarmist, contrasts with success slides' greens/blues
**Alternatives considered**:
- Maintain positive colors (doesn't convey crisis)
- Black/white only (too stark)
- Purple/grey (doesn't match severity)

### 5. Typography Hierarchy
**Decision**: Large header, icon-based section titles, progressive data reveal
**Rationale**: Enables quick scanning while presenter provides detail
**Alternatives considered**:
- Equal weight sections (no visual priority)
- Small text for more content (unreadable from distance)
- Bullet points only (boring, less impactful)

## Technical Approaches

### Chart.js Configuration
```javascript
// Funding decline timeline
{
  type: 'line',
  data: {
    labels: ['1994', '1995', '2000', '2003', '2010', '2020'],
    datasets: [{
      label: 'International Funding',
      data: [100, 95, 70, 60, 55, 50], // Normalized percentages
      borderColor: '#ef4444',
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      tension: 0.3
    }]
  }
}
```

### Leaflet.js Heat Map
```javascript
// Africa crisis regions
const heatData = [
  {country: 'Niger', severity: 100, coords: [13.5, 2.1]},
  {country: 'Chad', severity: 85, coords: [15.0, 19.0]},
  // ... 9 sub-Saharan countries
];
```

### CSS Grid Layout
```css
.crisis-panel {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 20px;
  height: 85%;
}
```

## Content Organization

### Panel 1: International Priority Decline
- **Header Icon**: 📉
- **Key Stat**: "50% funding decrease"
- **Timeline**: 1994-2020 decline visualization
- **Bullets**:
  - MDG excluded family planning
  - US leadership vacuum
  - Need for new champions

### Panel 2: Africa Crisis
- **Header Icon**: 🌍
- **Key Stat**: "Niger: 3x population by 2050"
- **Mini Map**: Heat map of crisis regions
- **Bullets**:
  - Greater threat than HIV/AIDS
  - 9 countries >30% unmet need
  - Catastrophic projections

### Panel 3: Resource Gap
- **Header Icon**: 💰
- **Key Stat**: "$2.3B annual shortfall"
- **Bar Chart**: Needed vs Available resources
- **Bullets**:
  - Political commitment weakened
  - "Unfinished agenda"
  - Urgent action required

## Animation Strategy
- **Entry**: Fade in panels sequentially (0.3s each)
- **Data Reveal**: Numbers count up on entry
- **Charts**: Animate drawing on slide load
- **Exit**: Simple fade to next slide

## Accessibility Considerations
- **High Contrast**: Dark backgrounds with bright text
- **Icon Support**: Icons supplement but don't replace text
- **Font Sizing**: Minimum 18px for body text
- **Color Coding**: Patterns in addition to colors

## Performance Optimizations
- **Lazy Loading**: Charts initialize only when slide visible
- **Simplified Maps**: Use markers instead of full choropleth
- **CSS Animations**: GPU-accelerated transitions
- **Data Caching**: Reuse existing countryData object

## Integration Points
- **Slide Navigation**: Update existing slide counter
- **Style Inheritance**: Reuse existing CSS classes
- **Data Sharing**: Leverage existing countryData structure
- **Chart Instances**: Add to existing charts object

## Risk Mitigation
- **Content Overflow**: Use overflow-y: auto as fallback
- **Chart Failures**: Provide static fallback images
- **Translation**: Prepare both Korean and English versions
- **Timing**: Test with actual presenters for pacing

---
*Research completed: All technical decisions documented and ready for Phase 1 design*