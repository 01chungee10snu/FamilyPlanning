# Color Contract: Critical Challenges Slide

## Primary Palette (Crisis Theme)
```css
:root {
  --crisis-danger: #dc2626;      /* Red 600 - Critical metrics */
  --crisis-warning: #ea580c;     /* Orange 600 - Warning indicators */
  --crisis-caution: #ca8a04;     /* Amber 600 - Caution areas */
  --crisis-dark: #1f2937;        /* Gray 800 - Panel backgrounds */
  --crisis-darker: #111827;      /* Gray 900 - Slide background */
}
```

## Text Colors
```css
:root {
  --crisis-text-primary: #ffffff;    /* White - Headers */
  --crisis-text-secondary: #e5e7eb;  /* Gray 200 - Body text */
  --crisis-text-accent: #fbbf24;     /* Amber 400 - Highlights */
}
```

## Gradient Definitions
```css
.panel-funding {
  background: linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%);
}

.panel-africa {
  background: linear-gradient(135deg, #7c2d12 0%, #9a3412 100%);
}

.panel-resource {
  background: linear-gradient(135deg, #713f12 0%, #92400e 100%);
}
```

## Chart Colors
- **Line Chart**: `#ef4444` (Red 500)
- **Bar Chart**: `#f59e0b` (Amber 500)
- **Heat Map**: Red scale (#fee2e2 to #7f1d1d)

## Accessibility
- All text on dark: minimum 7:1 contrast ratio
- Warning colors: Include patterns/icons
- Focus indicators: 3px white outline

---