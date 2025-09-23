# Navigation Contract

## Contract: Page Counter Display
**Version**: 1.0.0
**Component**: NavigationState

### Interface
```javascript
interface NavigationContract {
  // Initialize page counter
  initializePageCounter(totalSlides: number): void;

  // Update current slide
  updateCurrentSlide(slideNumber: number): void;

  // Get formatted display
  getPageCounterDisplay(): string;

  // Toggle visibility
  togglePageCounter(visible: boolean): void;
}
```

### Requirements
- **FR-001**: Display current and total page numbers

### Input Validation
```javascript
{
  slideNumber: {
    type: "number",
    min: 1,
    max: "totalSlides",
    required: true
  },
  totalSlides: {
    type: "number",
    min: 1,
    max: 100,
    required: true
  }
}
```

### Output Format
```javascript
{
  display: "12 | 38",  // current | total
  current: 12,
  total: 38,
  isVisible: true
}
```

### Test Cases

#### Test 1: Initialize Page Counter
**Given**: Presentation with 38 slides
**When**: initializePageCounter(38)
**Then**: Display shows "1 | 38"

#### Test 2: Update Current Slide
**Given**: Page counter initialized
**When**: updateCurrentSlide(15)
**Then**: Display shows "15 | 38"

#### Test 3: Boundary Validation
**Given**: Total slides = 38
**When**: updateCurrentSlide(39)
**Then**: Error: "Slide number exceeds total"

#### Test 4: Visibility Toggle
**Given**: Page counter visible
**When**: togglePageCounter(false)
**Then**: Counter element hidden

### DOM Structure
```html
<div class="page-counter" id="pageCounter">
  <span class="current">1</span>
  <span class="separator"> | </span>
  <span class="total">38</span>
</div>
```

### CSS Requirements
```css
.page-counter {
  position: fixed;
  bottom: 20px;
  right: 20px;
  font-size: 14px;
  color: #666;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.9);
  padding: 5px 10px;
  border-radius: 4px;
}
```

### Event Handlers
- `slidechange`: Update current slide number
- `presentationload`: Initialize with total count
- `keypress`: Hide/show on 'H' key