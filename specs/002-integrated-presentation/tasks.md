# Tasks: Integrated 20-Minute Presentation

**Input**: Design documents from `/specs/002-integrated-presentation/`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/

## Execution Flow (main)
```
1. Load plan.md from feature directory
   → If not found: ERROR "No implementation plan found"
   → Extract: tech stack, libraries, structure
2. Load optional design documents:
   → data-model.md: Extract entities → model tasks
   → contracts/: Each file → contract test task
   → research.md: Extract decisions → setup tasks
3. Generate tasks by category:
   → Setup: project init, dependencies, linting
   → Tests: contract tests, integration tests
   → Core: models, services, CLI commands
   → Integration: DB, middleware, logging
   → Polish: unit tests, performance, docs
4. Apply task rules:
   → Different files = mark [P] for parallel
   → Same file = sequential (no [P])
   → Tests before implementation (TDD)
5. Number tasks sequentially (T001, T002...)
6. Generate dependency graph
7. Create parallel execution examples
8. Validate task completeness:
   → All contracts have tests?
   → All entities have models?
   → All endpoints implemented?
9. Return: SUCCESS (tasks ready for execution)
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions
- **Single project**: `src/`, `tests/` at repository root
- Paths shown below follow single project structure per plan.md

---

## Phase 3.1: Setup & Infrastructure (8 tasks)
- [ ] T001 Create project directory structure per plan.md (src/data, src/visualizations, src/slides, src/lib, tests/)
- [ ] T002 Create presentation.html with basic HTML5 structure and 16:9 viewport
- [ ] T003 [P] Add CDN links for Chart.js 4.4.0 and Leaflet.js 1.9.4
- [ ] T004 [P] Create CSS foundation with 16:9 aspect ratio enforcement and responsive scaling
- [ ] T005 [P] Set up JavaScript module structure with namespace for PresentationData
- [ ] T006 [P] Create development test harness in tests/test-runner.html
- [ ] T007 [P] Initialize package.json with development dependencies (eslint, prettier)
- [ ] T008 [P] Create .eslintrc.js and .prettierrc for code consistency

## Phase 3.2: Data Extraction & Processing (12 tasks)
**Extract all data from PDF and existing slides - CRITICAL for accuracy**
- [ ] T009 [P] Extract Panel 1-4 content from PDF to src/data/panels-1-4.json
- [ ] T010 [P] Extract Panel 5-8 content from PDF to src/data/panels-5-8.json
- [ ] T011 [P] Extract Table 1 (Population Growth) data to src/data/tables.json
- [ ] T012 [P] Extract Table 2 (Niger indicators) data to src/data/tables.json
- [ ] T013 [P] Extract Table 3 (Contraceptive methods) data to src/data/tables.json
- [ ] T014 [P] Extract country-specific data (Kenya, Nigeria, Brazil, etc.) to src/data/countries.json
- [ ] T015 [P] Extract time-series data (TFR trends, projections) to src/data/timeseries.json
- [ ] T016 [P] Analyze and catalog content from 60+ slide HTML files in slides/
- [ ] T017 Merge duplicate slide content and create slide mapping document
- [ ] T018 Create final 35-40 slide structure with section assignments
- [ ] T019 [P] Validate all extracted data against PDF source (accuracy test)
- [ ] T020 Consolidate all JSON data into single inline JavaScript structure

## Phase 3.3: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.4
**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**
- [ ] T021 [P] Contract test for visualization rendering in tests/contract/test_visualization_render.js
- [ ] T022 [P] Contract test for navigation control in tests/contract/test_navigation.js
- [ ] T023 [P] Contract test for data integration in tests/contract/test_data_integration.js
- [ ] T024 [P] Integration test for slide transitions in tests/integration/test_slide_flow.js
- [ ] T025 [P] Integration test for timer auto-advance in tests/integration/test_timing.js
- [ ] T026 [P] Integration test for keyboard navigation in tests/integration/test_keyboard.js
- [ ] T027 [P] Integration test for touch gestures in tests/integration/test_touch.js
- [ ] T028 [P] Data accuracy validation test in tests/data-accuracy/test_pdf_match.js
- [ ] T029 [P] Timing precision test (20 minutes ±1) in tests/timing/test_duration.js
- [ ] T030 [P] Aspect ratio compliance test in tests/visualization/test_aspect_ratio.js

## Phase 3.4: Core Visualization Components (10 tasks)
**Build reusable visualization modules**
- [ ] T031 [P] Implement ChartRenderer class in src/visualizations/charts.js
- [ ] T032 [P] Implement MapRenderer class in src/visualizations/maps.js
- [ ] T033 [P] Implement TimelineRenderer class in src/visualizations/timelines.js
- [ ] T034 [P] Create chart configurations for line/bar/pie charts
- [ ] T035 [P] Create Leaflet map configurations with choropleth styling
- [ ] T036 [P] Create timeline visualization with D3.js (if needed) or custom CSS/JS
- [ ] T037 [P] Implement tooltip system for all visualizations (Korean/English)
- [ ] T038 [P] Add interactive controls (zoom, pan, filter) to maps
- [ ] T039 [P] Create time-slider component for temporal data
- [ ] T040 [P] Build legend components for all visualization types

## Phase 3.5: Slide Content Implementation (8 tasks)
**Create slide modules for each section**
- [ ] T041 Create introduction slides (3-4 slides) in src/slides/intro.js
- [ ] T042 Create benefits section slides (7-8 slides) in src/slides/benefits.js
- [ ] T043 Create unmet need slides (7-8 slides) in src/slides/unmet.js
- [ ] T044 Create solutions slides (7-8 slides) in src/slides/solutions.js
- [ ] T045 Create costs/recommendations slides (5-6 slides) in src/slides/costs.js
- [ ] T046 Integrate Panel 1-8 at appropriate narrative points
- [ ] T047 Add speaker notes to each slide
- [ ] T048 Ensure Korean primary/English secondary text throughout

## Phase 3.6: Navigation & Timing System (8 tasks)
**Implement presentation control system**
- [ ] T049 Implement NavigationController in src/lib/navigation.js
- [ ] T050 Add keyboard event handlers (arrows, space, numbers, etc.)
- [ ] T051 Add mouse/touch event handlers (click areas, swipe gestures)
- [ ] T052 Implement TimingController in src/lib/timing.js
- [ ] T053 Create auto-advance timer with per-slide durations
- [ ] T054 Build progress bar and timer display UI
- [ ] T055 Add pause/resume functionality with state preservation
- [ ] T056 Implement section jump navigation (1-5 keys)

## Phase 3.7: Integration & Assembly (6 tasks)
**Combine all components into single HTML file**
- [ ] T057 Create IntegrationManager in src/lib/integration.js
- [ ] T058 Inline all CSS styles into <style> tags
- [ ] T059 Inline all JavaScript modules into <script> tags
- [ ] T060 Inline all JSON data as JavaScript objects
- [ ] T061 Build final presentation.html with all components integrated
- [ ] T062 Optimize file size (minify, compress) to stay under 10MB

## Phase 3.8: Polish & Optimization (8 tasks)
**Final quality improvements**
- [ ] T063 [P] Add loading screen with progress indicator
- [ ] T064 [P] Implement fullscreen mode toggle (ESC key)
- [ ] T065 [P] Add help overlay (? key) with control reference
- [ ] T066 [P] Create print-friendly CSS for slide handouts
- [ ] T067 [P] Add accessibility features (ARIA labels, keyboard focus)
- [ ] T068 [P] Performance optimization (lazy loading, virtualization)
- [ ] T069 [P] Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] T070 [P] Create backup PDF export of all slides

## Phase 3.9: Validation & Documentation (5 tasks)
**Final checks and documentation**
- [ ] T071 Run complete data accuracy validation suite
- [ ] T072 Conduct full 20-minute presentation timing test
- [ ] T073 Verify all constitutional requirements are met
- [ ] T074 Update quickstart.md with final instructions
- [ ] T075 Create presentation-notes.md for presenters

---

## Total Tasks: 75

### Task Categories:
- Setup: 8 tasks
- Data Extraction: 12 tasks
- Testing: 10 tasks
- Visualizations: 10 tasks
- Slides: 8 tasks
- Navigation: 8 tasks
- Integration: 6 tasks
- Polish: 8 tasks
- Validation: 5 tasks

### Parallel Execution Opportunities:
**Phase 3.1 Setup (T003-T008)**: 6 parallel tasks
```bash
# Can run simultaneously
Task agents for: T003, T004, T005, T006, T007, T008
```

**Phase 3.2 Data Extraction (T009-T016, T019)**: 9 parallel tasks
```bash
# Can run simultaneously
Task agents for: T009, T010, T011, T012, T013, T014, T015, T016, T019
```

**Phase 3.3 Tests (T021-T030)**: 10 parallel tasks
```bash
# All tests can be written in parallel
Task agents for: T021, T022, T023, T024, T025, T026, T027, T028, T029, T030
```

**Phase 3.4 Visualizations (T031-T040)**: 10 parallel tasks
```bash
# All visualization components independent
Task agents for: T031, T032, T033, T034, T035, T036, T037, T038, T039, T040
```

**Phase 3.8 Polish (T063-T070)**: 8 parallel tasks
```bash
# All polish tasks independent
Task agents for: T063, T064, T065, T066, T067, T068, T069, T070
```

### Dependencies:
- Phase 3.2 must complete before Phase 3.5 (need data for slides)
- Phase 3.3 tests must be written before Phase 3.4 implementation
- Phase 3.4 must complete before Phase 3.7 (need components to integrate)
- Phase 3.5 must complete before Phase 3.7 (need slides to integrate)
- Phase 3.6 must complete before Phase 3.7 (need navigation to integrate)
- Phase 3.7 must complete before Phase 3.8 (need integrated file to polish)
- All phases must complete before Phase 3.9 validation

### Critical Path:
1. Setup → Data Extraction → Tests
2. Visualizations + Slides + Navigation (parallel)
3. Integration
4. Polish + Validation

### Estimated Timeline:
- With parallel execution: 4-5 days
- Sequential execution: 10-12 days

---

## Quick Start for Task Execution:

### Begin with setup and data extraction (parallel):
```bash
# Terminal 1
execute_task T001 T002

# Terminal 2-7 (parallel)
execute_task T003
execute_task T004
execute_task T005
execute_task T006
execute_task T007
execute_task T008
```

### Extract all data (highly parallel):
```bash
# Can run up to 9 parallel terminals
execute_task T009  # Panels 1-4
execute_task T010  # Panels 5-8
execute_task T011  # Table 1
execute_task T012  # Table 2
execute_task T013  # Table 3
execute_task T014  # Countries
execute_task T015  # Time series
execute_task T016  # Slide analysis
execute_task T019  # Validation
```

### Write all tests before implementation (TDD):
```bash
# 10 parallel test creation tasks
execute_task T021-T030  # All tests in parallel
```

Then proceed with implementation phases sequentially as per dependencies.