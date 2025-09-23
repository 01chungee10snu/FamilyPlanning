# Tooltip Contract

## Contract: Tooltip Positioning
**Version**: 1.0.0
**Component**: Tooltip Boundary Management

### Interface
```javascript
interface TooltipContract {
  // Calculate safe position within container
  calculateTooltipPosition(
    mouseEvent: MouseEvent,
    tooltipDimensions: Dimensions,
    containerBounds: DOMRect
  ): Position;

  // Show tooltip with containment
  showTooltip(content: string, event: MouseEvent): void;

  // Hide tooltip
  hideTooltip(): void;

  // Update tooltip content
  updateTooltipContent(content: string): void;
}
```

### Requirements
- **FR-005**: Mouse hover tooltips must remain within container boundaries

### Type Definitions
```typescript
interface Dimensions {
  width: number;
  height: number;
}

interface Position {
  x: number;
  y: number;
}

interface TooltipConfig {
  maxWidth: number;      // Default: 200px
  padding: number;       // Default: 10px
  offset: number;        // Default: 5px
  containment: boolean;  // Default: true
}
```

### Positioning Algorithm
```javascript
function calculateTooltipPosition(event, tooltip, container) {
  const bounds = container.getBoundingClientRect();
  const mouseX = event.clientX - bounds.left;
  const mouseY = event.clientY - bounds.top;

  let tooltipX = mouseX + config.offset;
  let tooltipY = mouseY + config.offset;

  // Right boundary check
  if (tooltipX + tooltip.width > bounds.width) {
    tooltipX = mouseX - tooltip.width - config.offset;
  }

  // Bottom boundary check
  if (tooltipY + tooltip.height > bounds.height) {
    tooltipY = mouseY - tooltip.height - config.offset;
  }

  // Left boundary check
  if (tooltipX < 0) {
    tooltipX = config.padding;
  }

  // Top boundary check
  if (tooltipY < 0) {
    tooltipY = config.padding;
  }

  return { x: tooltipX, y: tooltipY };
}
```

### Test Cases

#### Test 1: Normal Position (No Boundary Collision)
**Given**: Mouse at center of container
**When**: showTooltip("Content", event)
**Then**: Tooltip appears at mouse position + offset

#### Test 2: Right Boundary Collision
**Given**: Mouse near right edge of container
**When**: showTooltip("Content", event)
**Then**: Tooltip appears to left of mouse cursor

#### Test 3: Bottom Boundary Collision
**Given**: Mouse near bottom edge of container
**When**: showTooltip("Content", event)
**Then**: Tooltip appears above mouse cursor

#### Test 4: Corner Collision
**Given**: Mouse at bottom-right corner
**When**: showTooltip("Content", event)
**Then**: Tooltip appears at top-left of mouse

#### Test 5: Content Overflow
**Given**: Tooltip content exceeds maxWidth
**When**: showTooltip("Very long content...", event)
**Then**: Content wraps within maxWidth constraint

### Map-Specific Implementation
```javascript
// Leaflet map tooltip containment
map.on('mouseover', function(e) {
  const mapContainer = document.getElementById('map');
  const tooltipContent = formatDataPoint(e.target.feature);

  const tooltip = L.tooltip({
    permanent: false,
    className: 'map-tooltip',
    offset: L.point(0, 0)
  });

  // Custom position calculation
  const position = calculateTooltipPosition(
    e.originalEvent,
    { width: 200, height: 100 },
    mapContainer.getBoundingClientRect()
  );

  tooltip.setLatLng(e.latlng)
    .setContent(tooltipContent)
    .openOn(map);

  // Manually adjust position after rendering
  const tooltipElement = document.querySelector('.map-tooltip');
  tooltipElement.style.left = position.x + 'px';
  tooltipElement.style.top = position.y + 'px';
});
```

### DOM Structure
```html
<div class="tooltip-container">
  <div class="map-container" id="map">
    <!-- Leaflet map content -->
  </div>
  <div class="tooltip" id="tooltip" style="display: none;">
    <div class="tooltip-content"></div>
  </div>
</div>
```

### CSS Requirements
```css
.tooltip-container {
  position: relative;
  overflow: hidden;
}

.tooltip {
  position: absolute;
  max-width: 200px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 8px;
  border-radius: 4px;
  font-size: 12px;
  pointer-events: none;
  z-index: 1001;
  word-wrap: break-word;
}

.map-tooltip {
  max-width: 200px !important;
}
```

### Edge Cases

#### Rapid Mouse Movement
- Debounce tooltip updates (100ms)
- Cancel previous tooltip on new hover

#### Dynamic Content
- Recalculate position after content update
- Maintain containment during transitions

#### Mobile/Touch Devices
- Disable hover tooltips on touch
- Use tap-to-show pattern instead

### Performance Requirements
- Position calculation: <10ms
- Render time: <50ms
- No visible lag on hover
- Smooth transitions