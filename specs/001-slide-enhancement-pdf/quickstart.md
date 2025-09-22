# Quick Start Guide: Enhanced Presentation System

**Version**: 1.0.0
**Feature**: 60-slide academic presentation with PDF citations and visualizations

## Prerequisites

### Required Software
- Modern web browser (Chrome 90+, Firefox 88+, Safari 14+)
- Text editor (VS Code recommended)
- Local web server (Live Server extension or Python SimpleHTTPServer)
- Git for version control

### Browser DevTools
Enable developer tools for debugging:
- Chrome/Edge: F12 or Ctrl+Shift+I
- Firefox: F12 or Ctrl+Shift+I
- Safari: Enable Developer menu in Preferences

## Project Setup

### 1. Clone and Navigate
```bash
# Clone the repository
git clone [repository-url]
cd "2_발제"

# Checkout feature branch
git checkout 001-slide-enhancement-pdf
```

### 2. Directory Structure
```
2_발제/
├── index.html           # Main application
├── css/                 # Stylesheets
│   ├── main.css        # Core styles
│   ├── components.css  # Component styles
│   └── visualizations.css # (new) Visualization styles
├── js/                  # JavaScript modules
│   ├── app.js          # (new) Main entry point
│   ├── core/           # (new) Core modules
│   ├── data/           # (new) Data management
│   └── visualizations/ # (new) Chart renderers
├── data/               # (new) JSON data files
│   ├── slides.json     # 60 slides data
│   ├── citations.json  # PDF references
│   └── visualizations.json # Chart configs
└── slides/             # Individual slide HTML
```

### 3. Install Dependencies
No build step required! Libraries are loaded from CDN:

```html
<!-- Already included in index.html -->
<script src="https://cdn.plot.ly/plotly-2.27.0.min.js"></script>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script src="https://d3js.org/d3.v7.min.js"></script>
```

### 4. Start Local Server
```bash
# Option 1: Python (if installed)
python -m http.server 8000

# Option 2: Node.js (if installed)
npx http-server

# Option 3: VS Code Live Server
# Right-click index.html → "Open with Live Server"
```

Navigate to `http://localhost:8000` (or port shown)

## Basic Usage

### Navigation Controls
- **Next/Previous**: Arrow buttons or ← → keys
- **Jump to slide**: Number keys (1-9 for sections)
- **Fullscreen**: F key or button
- **Menu**: M key or hamburger icon
- **Search**: Ctrl+F to find citations

### Presentation Modes
1. **Standard View**: Default browser window
2. **Fullscreen**: Optimal for presentation
3. **Speaker View**: With notes (press S)
4. **Print View**: Export to PDF (Ctrl+P)

## Development Workflow

### 1. Adding a New Slide
```javascript
// 1. Add slide data to data/slides.json
{
  "id": 61,
  "sectionId": 9,
  "title": "New Slide Title",
  "content": {
    "layout": "two_column",
    "elements": [...]
  },
  "citations": [
    {
      "pageNumber": "p.1825",
      "text": "Quote from PDF"
    }
  ]
}

// 2. Create HTML template in slides/slide61.html
<div class="slide-content">
  <h2>New Slide Title</h2>
  <!-- Content here -->
</div>

// 3. Update section in data/sections.json
{
  "id": 9,
  "slides": [56, 57, 58, 59, 60, 61] // Add new ID
}
```

### 2. Adding a Visualization
```javascript
// 1. Define in data/visualizations.json
{
  "id": "viz-population-growth",
  "slideId": 17,
  "type": "plotly",
  "subtype": "line",
  "data": {
    "source": "pdf",
    "values": {...}
  },
  "config": {
    "title": "Population Growth 1960-2050",
    "xaxis": { "title": "Year" },
    "yaxis": { "title": "Population (millions)" }
  }
}

// 2. Add container in slide HTML
<div id="viz-population-growth" class="visualization-container"></div>

// 3. Renderer will auto-initialize on slide load
```

### 3. Adding PDF Citations
```javascript
// In data/citations.json
{
  "id": "cite-001",
  "slideId": 4,
  "pageNumber": "p.1810",
  "text": "Family planning has the potential to reduce poverty",
  "textKo": "가족계획은 빈곤을 줄일 수 있는 잠재력이 있다",
  "type": "direct_quote"
}

// In slide HTML
<span class="citation" data-cite="cite-001">
  Family planning reduces poverty
  <sup>[1]</sup>
</span>
```

## Testing

### Visual Testing
1. Open DevTools Console
2. Check for errors on load
3. Test all navigation methods
4. Verify visualizations render
5. Check citations display

### Performance Testing
```javascript
// In console
performance.mark('slideLoadStart');
// ... navigate to slide
performance.mark('slideLoadEnd');
performance.measure('slideLoad', 'slideLoadStart', 'slideLoadEnd');
console.log(performance.getEntriesByName('slideLoad'));
```

### Responsive Testing
1. DevTools → Toggle device toolbar
2. Test common viewports:
   - Mobile: 375×667 (iPhone SE)
   - Tablet: 768×1024 (iPad)
   - Desktop: 1920×1080

## Common Tasks

### Update Slide Content
```bash
# Edit the slide data
nano data/slides.json

# Refresh browser (F5)
# Changes appear immediately
```

### Change Theme Colors
```css
/* In css/main.css */
:root {
  --primary-color: #2c3e50;  /* Change this */
  --accent-color: #e74c3c;   /* And this */
}
```

### Export Presentation
```javascript
// In console
presentationManager.exportToPDF(); // Generates PDF
presentationManager.exportData();  // Exports all data
```

## Troubleshooting

### Slide Not Loading
```javascript
// Check console for errors
console.log(slideManager.getCacheStatus());
// Clear cache if needed
slideManager.clearCache(true);
```

### Visualization Not Rendering
```javascript
// Check if library loaded
console.log(typeof Plotly); // Should not be 'undefined'
// Re-initialize renderer
visualizationRenderer.initialize({ lazyLoad: false });
```

### Citation Tooltips Not Showing
```javascript
// Verify citations loaded
console.log(citationManager.getStatistics());
// Re-bind tooltip handlers
citationManager.initializeTooltips();
```

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| ← → | Navigate slides |
| ↑ ↓ | Navigate sections |
| 1-9 | Jump to section |
| F | Fullscreen |
| ESC | Exit fullscreen |
| M | Toggle menu |
| S | Speaker notes |
| H | Help overlay |
| Space | Play/Pause |

## API Reference

### Global Objects
```javascript
// Available in browser console
window.slideManager       // Slide management
window.navigationController // Navigation control
window.visualizationRenderer // Chart rendering
window.citationManager    // Citation handling
window.presentationState  // Current state
```

### Event System
```javascript
// Listen for slide changes
document.addEventListener('slidechange', (e) => {
  console.log('Slide changed to:', e.detail.slideId);
});

// Listen for visualization updates
document.addEventListener('vizupdate', (e) => {
  console.log('Visualization updated:', e.detail.vizId);
});
```

## Best Practices

1. **Always include PDF page numbers** in citations
2. **Test on multiple devices** before presenting
3. **Preload adjacent slides** for smooth transitions
4. **Use keyboard shortcuts** during presentation
5. **Keep visualizations under 1000 data points**
6. **Cache slide data** in localStorage for offline use
7. **Validate citations** before deployment

## Support & Resources

### Documentation
- [Full API Documentation](./docs/api.md)
- [Data Model Reference](./data-model.md)
- [Visualization Guide](./docs/visualizations.md)

### Getting Help
- Check browser console for errors
- Review [research.md](./research.md) for technical details
- Consult [plan.md](./plan.md) for architecture

### Performance Tips
- Enable browser caching
- Use production CDN links
- Minimize custom CSS
- Optimize image sizes

---

**Quick Command Reference**
```bash
# Start development
npm run dev  # or python -m http.server

# Run tests
npm test     # or open test.html

# Build for production
npm run build # Optimizes assets

# Deploy
npm run deploy # Pushes to hosting
```

---

*Ready to start developing! Open index.html and begin creating your 60-slide presentation.*