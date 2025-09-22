# Tasks: Enhanced Presentation Slides with PDF Citations

**Input**: Design documents from `/specs/001-slide-enhancement-pdf/`
**Prerequisites**: plan.md (✓), research.md (✓), data-model.md (✓), contracts/ (✓)

## Execution Flow (main)
```
1. Load plan.md from feature directory
   → Tech stack: JavaScript ES6+, Plotly.js, Leaflet.js, Chart.js, D3.js
   → Structure: Frontend web application with JSON data layer
2. Load design documents:
   → data-model.md: 8 core entities identified
   → contracts/: 3 interface contracts (SlideManager, VisualizationRenderer, CitationManager)
   → research.md: Gap analysis and architecture decisions
3. Generate tasks by category:
   → Setup: 6 tasks for project structure and dependencies
   → Tests: 9 tasks for contract and integration tests
   → Core: 24 tasks for models and services
   → Integration: 8 tasks for data loading and visualization
   → Polish: 10 tasks for optimization and documentation
4. Apply task rules:
   → [P] marks for parallel tasks (different files)
   → Sequential for same file modifications
   → TDD approach: tests before implementation
5. Total: 57 tasks generated
6. Estimated time: 40-50 hours
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions
- Time estimates: S (1-2h), M (3-4h), L (5-8h), XL (>8h)

## Path Structure
```
2_발제/
├── index.html
├── css/
├── js/
│   ├── app.js
│   ├── core/
│   ├── data/
│   └── visualizations/
├── data/
├── tests/
└── slides/
```

## Phase 3.1: Setup & Infrastructure

- [ ] **T001** Create JavaScript module structure at `js/` with subdirectories `core/`, `data/`, `visualizations/`, `utils/` [S]
- [ ] **T002** [P] Create JSON data directory at `data/` with template files for slides.json, citations.json, visualizations.json [S]
- [ ] **T003** [P] Set up CSS file at `css/visualizations.css` for chart-specific styling [S]
- [ ] **T004** Configure ES6 module system in `js/app.js` as main entry point with module imports [S]
- [ ] **T005** [P] Create constants file at `js/utils/constants.js` with slide count, section info, performance targets [S]
- [ ] **T006** [P] Set up development server configuration with CORS headers for local testing [S]

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3

### Contract Tests
- [ ] **T007** [P] Create test file `tests/SlideManager.test.js` with tests for loadSlide(), preloadAdjacentSlides(), renderSlide() [M]
- [ ] **T008** [P] Create test file `tests/VisualizationRenderer.test.js` with tests for renderPlotly(), renderLeaflet(), renderTimeline() [M]
- [ ] **T009** [P] Create test file `tests/CitationManager.test.js` with tests for getCitationsBySlide(), formatCitation(), validatePageNumber() [M]

### Integration Tests
- [ ] **T010** [P] Create test file `tests/integration/navigation.test.js` for slide navigation scenarios [M]
- [ ] **T011** [P] Create test file `tests/integration/visualization.test.js` for chart rendering and updates [M]
- [ ] **T012** [P] Create test file `tests/integration/citation.test.js` for citation tooltip interactions [M]

### Data Validation Tests
- [ ] **T013** [P] Create test file `tests/data/slideData.test.js` to validate all 60 slides structure [S]
- [ ] **T014** [P] Create test file `tests/data/citationData.test.js` to validate PDF page number formats [S]
- [ ] **T015** [P] Create test file `tests/data/visualizationData.test.js` to validate chart configurations [S]

## Phase 3.3: Core Implementation

### Data Models (Based on data-model.md entities)
- [ ] **T016** [P] Implement Slide model at `js/data/models/Slide.js` with validation methods [M]
- [ ] **T017** [P] Implement Section model at `js/data/models/Section.js` with slide grouping logic [S]
- [ ] **T018** [P] Implement Citation model at `js/data/models/Citation.js` with page number validation [M]
- [ ] **T019** [P] Implement Visualization model at `js/data/models/Visualization.js` with type checking [M]
- [ ] **T020** [P] Implement SlideContent model at `js/data/models/SlideContent.js` with element management [M]
- [ ] **T021** [P] Implement NavigationState model at `js/data/models/NavigationState.js` with state persistence [S]
- [ ] **T022** [P] Implement Theme model at `js/data/models/Theme.js` with color palette management [S]
- [ ] **T023** [P] Implement PresentationMetadata model at `js/data/models/PresentationMetadata.js` [S]

### Core Services (Based on contracts)
- [ ] **T024** Implement SlideManager at `js/core/SlideManager.js` fulfilling ISlideManager contract [L]
- [ ] **T025** Implement NavigationController at `js/core/NavigationController.js` with keyboard/touch support [L]
- [ ] **T026** Implement StateManager at `js/core/StateManager.js` with localStorage persistence [M]
- [ ] **T027** Implement CitationManager at `js/data/CitationManager.js` fulfilling ICitationManager contract [L]
- [ ] **T028** Implement DataLoader at `js/data/DataLoader.js` for JSON file loading and caching [M]

### Visualization Services
- [ ] **T029** Implement VisualizationRenderer at `js/visualizations/VisualizationRenderer.js` fulfilling IVisualizationRenderer contract [L]
- [ ] **T030** [P] Implement PlotlyRenderer at `js/visualizations/PlotlyRenderer.js` for interactive charts [M]
- [ ] **T031** [P] Implement LeafletRenderer at `js/visualizations/LeafletRenderer.js` for world maps [M]
- [ ] **T032** [P] Implement TimelineRenderer at `js/visualizations/TimelineRenderer.js` using D3.js [M]
- [ ] **T033** [P] Implement ChartJSRenderer at `js/visualizations/ChartJSRenderer.js` for basic charts [M]

### Utility Functions
- [ ] **T034** [P] Create helpers at `js/utils/helpers.js` with DOM manipulation, debounce, throttle functions [S]
- [ ] **T035** [P] Create formatter at `js/utils/formatter.js` for numbers, dates, citations [S]
- [ ] **T036** [P] Create validator at `js/utils/validator.js` for data validation rules [S]

## Phase 3.4: Data Creation & Content

### JSON Data Files
- [ ] **T037** Create `data/slides.json` with all 60 slides following Slide model structure [XL]
- [ ] **T038** [P] Create `data/sections.json` with 9 section definitions and metadata [M]
- [ ] **T039** [P] Create `data/citations.json` with 60+ PDF citations mapped to slides [L]
- [ ] **T040** [P] Create `data/visualizations.json` with 15+ visualization configurations [L]
- [ ] **T041** [P] Create `data/metadata.json` with presentation metadata and authors [S]

### Slide HTML Templates
- [ ] **T042** Create slide templates for slides 17-30 at `slides/slide[17-30].html` [L]
- [ ] **T043** Create slide templates for slides 31-45 at `slides/slide[31-45].html` [L]
- [ ] **T044** Create slide templates for slides 46-60 at `slides/slide[46-60].html` [L]

## Phase 3.5: Integration

### Main Application Integration
- [ ] **T045** Update `index.html` to load new JavaScript modules and initialize app.js [M]
- [ ] **T046** Integrate SlideManager with existing slide loading mechanism [M]
- [ ] **T047** Connect NavigationController to existing navigation buttons and keyboard handlers [M]
- [ ] **T048** Wire up CitationManager to display tooltips on citation hover [M]

### Visualization Integration
- [ ] **T049** Integrate Plotly charts into designated slides (17, 25, 35, 45, 48, 50) [L]
- [ ] **T050** Integrate Leaflet maps into designated slides (5, 19, 36, 38) [L]
- [ ] **T051** Integrate D3 timelines into designated slides (7, 20) [M]
- [ ] **T052** Ensure all visualizations are responsive and handle resize events [M]

## Phase 3.6: Polish & Optimization

### Performance Optimization
- [ ] **T053** [P] Implement lazy loading for slide content and visualizations [M]
- [ ] **T054** [P] Add service worker at `sw.js` for offline functionality and caching [M]
- [ ] **T055** [P] Optimize images and implement progressive loading [S]

### Testing & Validation
- [ ] **T056** Run and fix all unit tests ensuring 100% pass rate [M]
- [ ] **T057** Perform cross-browser testing (Chrome, Firefox, Safari, Edge) [M]

### Documentation & Deployment
- [ ] **T058** [P] Create API documentation at `docs/api.md` for all public methods [M]
- [ ] **T059** [P] Update README.md with setup instructions and usage guide [S]
- [ ] **T060** [P] Create deployment script for production build optimization [S]

---

## Parallel Execution Examples

### Setup Phase (T001-T006)
```bash
# Can run in parallel (different directories/files)
/spawn task "Create module structure" --agent general-purpose --task T001
/spawn task "Create data directory" --agent general-purpose --task T002 [P]
/spawn task "Setup CSS file" --agent general-purpose --task T003 [P]
/spawn task "Create constants" --agent general-purpose --task T005 [P]
```

### Test Creation (T007-T015)
```bash
# All test files can be created in parallel
/spawn task "Create SlideManager tests" --agent general-purpose --task T007 [P]
/spawn task "Create VisualizationRenderer tests" --agent general-purpose --task T008 [P]
/spawn task "Create CitationManager tests" --agent general-purpose --task T009 [P]
/spawn task "Create navigation integration tests" --agent general-purpose --task T010 [P]
```

### Model Implementation (T016-T023)
```bash
# All models in different files - perfect for parallel
/spawn task "Implement Slide model" --agent general-purpose --task T016 [P]
/spawn task "Implement Section model" --agent general-purpose --task T017 [P]
/spawn task "Implement Citation model" --agent general-purpose --task T018 [P]
/spawn task "Implement Visualization model" --agent general-purpose --task T019 [P]
```

### Visualization Renderers (T030-T033)
```bash
# Each renderer is independent
/spawn task "Implement PlotlyRenderer" --agent general-purpose --task T030 [P]
/spawn task "Implement LeafletRenderer" --agent general-purpose --task T031 [P]
/spawn task "Implement TimelineRenderer" --agent general-purpose --task T032 [P]
/spawn task "Implement ChartJSRenderer" --agent general-purpose --task T033 [P]
```

## Dependencies Graph

```
Setup (T001-T006)
    ↓
Tests (T007-T015) [Parallel]
    ↓
Models (T016-T023) [Parallel]
    ↓
Core Services (T024-T028)
    ↓
Visualizations (T029-T033)
    ↓
Data Creation (T037-T044)
    ↓
Integration (T045-T052)
    ↓
Polish (T053-T060) [Partial Parallel]
```

## Task Validation Checklist
- [x] All 3 contracts have test tasks (T007-T009)
- [x] All 8 entities have model tasks (T016-T023)
- [x] All core services implemented (T024-T033)
- [x] All user stories covered by integration tests
- [x] Setup tasks defined (T001-T006)
- [x] Polish tasks included (T053-T060)
- [x] Parallel tasks marked with [P]
- [x] Dependencies clearly indicated

## Execution Notes

1. **Critical Path**: T001 → T004 → T024-T026 → T045-T047
2. **Parallel Opportunities**:
   - Tests: 9 tasks can run simultaneously
   - Models: 8 tasks can run simultaneously
   - Data creation: 5 tasks can run simultaneously
3. **Risk Areas**:
   - T037 (60 slides JSON) is the largest single task
   - T049-T051 (visualization integration) requires all prior work
4. **Quick Wins**:
   - T001-T006 can be completed in 1 day
   - T007-T015 provide immediate test coverage

---

**Total Tasks**: 60
**Estimated Time**: 45-50 hours
**Parallel Potential**: ~40% of tasks can run in parallel
**Critical Tasks**: T024 (SlideManager), T029 (VisualizationRenderer), T037 (Slides Data)

*Ready for execution - each task is specific and actionable*