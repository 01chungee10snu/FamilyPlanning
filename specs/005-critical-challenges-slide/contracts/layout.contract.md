# Layout Contract: Critical Challenges Slide

## Grid Structure
```css
.crisis-slide {
  display: grid;
  grid-template-rows: auto 1fr auto;
  height: 100vh;
  padding: 40px;
}

.crisis-panels {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  height: 100%;
}
```

## Panel Specifications
- **Width**: 33.33% - gap
- **Height**: 85% of slide height
- **Padding**: 20px internal
- **Border Radius**: 8px
- **Background**: Dark gradient

## Responsive Breakpoints
- **Full Width**: 1920px (standard)
- **Presentation**: 1280px+ (maintain 3 columns)
- **Tablet**: Not supported (presentation only)
- **Mobile**: Not supported (presentation only)

## Z-Index Hierarchy
1. Navigation controls: 1000
2. Chart tooltips: 500
3. Panel content: 10
4. Background: 1

## Spacing Standards
- **Title to content**: 30px
- **Between sections**: 20px
- **Bullet points**: 10px
- **Chart margins**: 15px

---