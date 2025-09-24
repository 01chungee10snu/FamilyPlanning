# Quickstart: Critical Challenges Slide Validation

## Setup
1. Open `index.html` in Chrome/Firefox/Safari
2. Navigate to slide 6 (after success/failure comparison)
3. Verify slide displays crisis theme with dark background

## Visual Validation Checklist

### Layout ✓
- [ ] Three equal-width panels displayed
- [ ] Each panel has distinct gradient background
- [ ] Title "위기의 가족계획" prominently displayed
- [ ] All content fits within viewport (no scrolling)

### Panel 1: Funding Decline ✓
- [ ] 📉 Icon visible
- [ ] "50% 자금 감소" metric highlighted
- [ ] Timeline chart shows decline from 1994-2020
- [ ] Three bullet points about MDG and leadership

### Panel 2: Africa Crisis ✓
- [ ] 🌍 Icon visible
- [ ] "3배" Niger population metric highlighted
- [ ] Heat map or markers showing crisis regions
- [ ] Three bullet points about threats

### Panel 3: Resource Gap ✓
- [ ] 💰 Icon visible
- [ ] "$2.3B" funding gap highlighted
- [ ] Bar chart comparing needed vs available
- [ ] Three bullet points about urgency

### Data Accuracy ✓
- [ ] All statistics match edit.md source
- [ ] Source attribution visible (Cleland et al., 2006)
- [ ] Numbers formatted consistently

## Interaction Testing

### Animations
1. Refresh page and navigate to slide 6
2. Verify panels fade in sequentially (left to right)
3. Check charts animate on entry
4. Confirm number counters animate up

### Responsiveness
1. Resize window to various sizes
2. Verify 16:9 aspect ratio maintained
3. Check text remains readable
4. Ensure charts scale appropriately

### Navigation
1. Use arrow keys to enter/exit slide
2. Click navigation to jump to slide
3. Verify smooth transitions
4. Check no console errors

## Performance Validation

### Load Time
- [ ] Slide loads within 1 second
- [ ] Charts render within 2 seconds
- [ ] All animations complete within 3 seconds

### Resource Usage
- [ ] No memory leaks on repeated navigation
- [ ] Charts properly disposed on slide exit
- [ ] Smooth 60fps animations

## Accessibility Testing

### Contrast
- [ ] All text readable on dark backgrounds
- [ ] Minimum 4.5:1 contrast ratio
- [ ] Focus indicators visible

### Screen Reader
- [ ] Slide title announced
- [ ] Key statistics readable
- [ ] Chart data accessible via labels

## Integration Testing

### Presentation Flow
1. Start from slide 1
2. Navigate through to slide 6
3. Verify narrative continuity
4. Check timing (~30-40 seconds reading)

### Data Consistency
- [ ] Country data reused from existing structure
- [ ] Color scheme complements other slides
- [ ] Font styles match presentation

## Troubleshooting

### Common Issues
- **Charts not displaying**: Check Chart.js loaded
- **Map not rendering**: Verify Leaflet initialized
- **Animations janky**: Reduce concurrent animations
- **Text overflow**: Adjust font sizes or content

### Browser Compatibility
- Chrome 100+: Full support ✓
- Firefox 100+: Full support ✓
- Safari 15+: Full support ✓
- Edge 100+: Full support ✓

## Success Criteria
- [ ] All panels display correctly
- [ ] Data visualizations render
- [ ] Animations smooth
- [ ] Content readable
- [ ] Narrative flow maintained
- [ ] 30-40 second timing achieved

---
*Validation guide ready for implementation testing*