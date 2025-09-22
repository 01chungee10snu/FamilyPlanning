# Family Planning: The Unfinished Agenda - Interactive Presentation

A comprehensive, interactive presentation system for academic research on family planning policies, built with modern web technologies and designed for professional presentations.

## 📋 Project Overview

This project is an interactive presentation system covering the research paper "Family Planning: The Unfinished Agenda" by John Bongaarts and John Casterline. The presentation includes 16 comprehensive slides covering historical development, current status, case studies, and policy recommendations for family planning initiatives.

### Key Features

- **Interactive Navigation**: Keyboard, mouse, and touch navigation support
- **Dynamic Visualizations**: Interactive charts, maps, and timelines
- **Citation System**: Hover tooltips for academic references
- **Responsive Design**: Optimized for various screen sizes and presentation modes
- **Modern Architecture**: ES6 modules with clean separation of concerns
- **Multi-language Support**: Korean primary with English support
- **Professional Styling**: Clean, academic presentation layout

## 🚀 Setup Instructions

### Prerequisites

- Modern web browser with ES6 module support (Chrome 61+, Firefox 60+, Safari 11+, Edge 79+)
- Local development server (recommended for optimal performance)

### Quick Start

1. **Clone or Download the Repository**
   ```bash
   git clone <repository-url>
   cd family-planning-presentation
   ```

2. **Serve the Files**

   Using Python:
   ```bash
   python -m http.server 8000
   ```

   Using Node.js:
   ```bash
   npx serve .
   ```

   Using Live Server (VS Code extension):
   - Right-click on `index.html` → "Open with Live Server"

3. **Open in Browser**
   Navigate to `http://localhost:8000` (or your server URL)

### File Structure

```
family-planning-presentation/
├── index.html                 # Main entry point
├── README.md                  # This file
├── css/
│   ├── main.css              # Primary styles
│   └── components.css        # Component-specific styles
├── js/
│   ├── app.js                # Main application entry
│   ├── core/                 # Core system modules
│   │   ├── SlideManager.js
│   │   ├── NavigationController.js
│   │   └── StateManager.js
│   ├── data/                 # Data handling modules
│   │   ├── DataLoader.js
│   │   └── CitationManager.js
│   ├── visualizations/       # Visualization renderers
│   │   ├── VisualizationRenderer.js
│   │   ├── ChartJSRenderer.js
│   │   ├── LeafletRenderer.js
│   │   ├── PlotlyRenderer.js
│   │   └── TimelineRenderer.js
│   └── utils/                # Utility modules
│       ├── constants.js
│       └── helpers.js
├── data/                     # JSON data files
│   ├── slides.json
│   ├── sections.json
│   ├── citations.json
│   ├── visualizations.json
│   └── metadata.json
└── slides/                   # Individual slide HTML files
    ├── slide01-title.html
    ├── slide02-core-message.html
    └── ... (slides 03-16)
```

## 🎯 Features

### Navigation Systems

#### Keyboard Navigation
- **Arrow Keys**: Navigate between slides
- **Space/Page Down**: Next slide
- **Page Up**: Previous slide
- **Home**: Jump to first slide
- **End**: Jump to last slide
- **Numbers (1-9)**: Direct slide navigation
- **F/Escape**: Toggle fullscreen
- **P**: Toggle presentation mode
- **H/?**: Show help dialog
- **M**: Toggle slide menu

#### Mouse Navigation
- **Left Half Click**: Previous slide
- **Right Half Click**: Next slide
- **Mouse Wheel**: Navigate slides
- **Navigation Buttons**: UI controls

#### Touch Navigation
- **Swipe Left**: Next slide
- **Swipe Right**: Previous slide
- **Tap Navigation**: Touch-friendly UI controls

### Interactive Elements

#### Slide Menu
- Quick navigation to any slide
- Visual progress indicator
- Hover effects and smooth transitions
- Responsive design for mobile devices

#### Citation System
- Hover tooltips showing full citation details
- Visual indicators for cited content
- Academic-standard formatting
- Non-intrusive presentation

#### Visualization Renderer
- Dynamic chart generation using Chart.js
- Interactive maps with Leaflet
- Timeline visualizations
- Plotly integration for complex data
- Responsive and accessible charts

### Presentation Modes

#### Standard Mode
- Full navigation controls visible
- Slide menu accessible
- Citation tooltips active
- Responsive layout

#### Presentation Mode
- Clean, distraction-free interface
- Hidden navigation (shows on hover)
- Optimized for projector display
- Cursor auto-hide functionality

#### Fullscreen Mode
- Native browser fullscreen
- Optimized keyboard navigation
- Escape key support
- Maintained aspect ratios

## 🏗️ Technical Architecture

### Module System

The application uses ES6 modules with a clean architecture:

#### Core Layer
- **SlideManager**: Handles slide loading, caching, and transitions
- **NavigationController**: Manages all user interactions and navigation
- **StateManager**: Maintains application state across sessions

#### Data Layer
- **DataLoader**: Handles JSON data loading and preprocessing
- **CitationManager**: Manages academic citations and tooltips

#### Visualization Layer
- **VisualizationRenderer**: Coordinates multiple chart libraries
- **Renderer Modules**: Specialized renderers for different chart types

#### Utility Layer
- **Constants**: Application-wide configuration
- **Helpers**: Shared utility functions and performance tools

### Performance Features

#### Caching System
- **Slide Caching**: LRU cache for slide content
- **Preloading**: Adjacent slide preloading
- **Resource Management**: Automatic memory cleanup

#### Optimization Strategies
- **Lazy Loading**: Load visualizations on demand
- **Module Loading**: Async module imports
- **Resource Batching**: Efficient network requests
- **Performance Monitoring**: Built-in metrics tracking

### Error Handling

#### Graceful Degradation
- **Module Loading Fallbacks**: Handle missing dependencies
- **Network Error Recovery**: Offline capability planning
- **Browser Compatibility**: Fallback for older browsers
- **User Feedback**: Clear error messages and recovery options

#### Development Tools
- **Console Logging**: Detailed debugging information
- **Performance Tracking**: Load time and render metrics
- **Error Boundaries**: Comprehensive error catching
- **Development Mode**: Enhanced debugging features

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px - 1920px
- **Large Display**: > 1920px

### Adaptive Features
- **Navigation Scaling**: Responsive button sizes
- **Menu Layout**: Adaptive slide menu positioning
- **Typography**: Scalable text and spacing
- **Touch Targets**: Optimized for touch devices

## 🔧 Configuration

### Environment Variables
```javascript
// js/utils/constants.js
export const TOTAL_SLIDES = 16;
export const TOTAL_SECTIONS = 4;
export const CACHE_SIZE = 10;
export const PRELOAD_RANGE = 2;
```

### Customization Options
- **Color Themes**: Modify CSS custom properties
- **Font Families**: Update font stack in main.css
- **Transition Effects**: Configure in SlideManager
- **Performance Targets**: Adjust in constants.js

## 🎨 Styling System

### CSS Architecture
- **Component-based**: Modular stylesheets
- **CSS Custom Properties**: Theme configuration
- **Responsive Design**: Mobile-first approach
- **Animation System**: Smooth transitions and effects

### Font Integration
- **Primary**: Seoul Namsan family for Korean text
- **Fallback**: Pretendard Variable for web compatibility
- **System Fonts**: Native font stack support

## 📊 Data Structure

### Slide Data Format
```json
{
  "id": "slide-01",
  "order": 1,
  "title": "Family Planning: The Unfinished Agenda",
  "sectionId": "introduction",
  "content": {
    "ko": "Korean content...",
    "en": "English content..."
  },
  "visualizations": ["chart-01", "map-01"],
  "citations": ["bongaarts2011", "casterline2012"]
}
```

### Citation Format
```json
{
  "id": "bongaarts2011",
  "title": "Population and Development Review",
  "authors": "John Bongaarts, John Casterline",
  "journal": "Population and Development Review",
  "year": 2011,
  "shortForm": "Bongaarts & Casterline, 2011"
}
```

## 🧪 Testing

### Browser Testing
- Chrome 90+ ✅
- Firefox 88+ ✅
- Safari 14+ ✅
- Edge 90+ ✅

### Device Testing
- Desktop/Laptop displays ✅
- Tablet (iPad, Android) ✅
- Mobile phones (iOS, Android) ✅
- Presentation projectors ✅

### Performance Benchmarks
- **Load Time**: < 3 seconds on 3G
- **Transition Time**: < 300ms between slides
- **Memory Usage**: < 100MB for full session
- **Cache Hit Rate**: > 80% for navigation

## 🔄 Development Workflow

### Local Development
1. **Install Development Server**: Use Python, Node.js, or VS Code Live Server
2. **Enable Developer Tools**: Chrome DevTools for debugging
3. **Monitor Performance**: Built-in performance tracking
4. **Test Across Browsers**: Ensure compatibility

### Building for Production
1. **Minify Assets**: Compress CSS and JS files
2. **Optimize Images**: Compress visualization assets
3. **Configure CDN**: Set up external resource delivery
4. **Test Performance**: Validate load times and responsiveness

### Deployment Options
- **Static Hosting**: GitHub Pages, Netlify, Vercel
- **CDN Deployment**: CloudFlare, AWS CloudFront
- **Academic Servers**: University hosting platforms
- **Presentation Systems**: Integration with presentation software

## 📚 Academic Content

### Research Coverage
1. **Historical Development**: Evolution of family planning initiatives
2. **Current Status**: Global population trends and projections
3. **Regional Analysis**: Case studies from various countries
4. **Policy Impact**: Economic and health outcomes
5. **Future Scenarios**: Demographic projections and policy implications

### Visual Elements
- **Interactive World Map**: Country-specific data visualization
- **Population Charts**: Trend analysis and projections
- **Timeline Graphics**: Historical development visualization
- **Comparison Tables**: Cross-country analysis
- **Policy Frameworks**: Implementation strategies

## 🤝 Contributing

### Development Guidelines
- Follow ES6 module patterns
- Maintain responsive design principles
- Ensure accessibility compliance
- Add comprehensive error handling
- Update documentation for new features

### Code Style
- Use consistent indentation (4 spaces)
- Follow camelCase naming conventions
- Add JSDoc comments for functions
- Maintain clean separation of concerns

## 📄 License

This project is developed for academic purposes. Please ensure proper attribution when using or adapting the content.

## 🆘 Support

### Troubleshooting
- **Module Loading Issues**: Ensure development server is running
- **Browser Compatibility**: Update to latest browser version
- **Performance Issues**: Check network connection and device resources
- **Display Problems**: Verify screen resolution and browser zoom

### Common Issues
1. **Blank Screen**: Check browser console for module loading errors
2. **Navigation Not Working**: Verify JavaScript is enabled
3. **Slow Loading**: Use local development server instead of file:// protocol
4. **Missing Visualizations**: Check Chart.js and Leaflet CDN connections

### Getting Help
- Check browser developer console for error messages
- Verify all files are present and accessible
- Test with latest browser versions
- Review network requests in developer tools

---

**Built with**: ES6 Modules, Chart.js, Leaflet, CSS Grid, Intersection Observer API

**Compatible with**: Modern browsers supporting ES6 modules and CSS Grid

**Optimized for**: Academic presentations, research demonstrations, and educational use