# Implementation Plan: Integrated 20-Minute Presentation

**Branch**: `002-integrated-presentation` | **Date**: 2025-09-23 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-integrated-presentation/spec.md`

## Execution Flow (/plan command scope)
```
1. Load feature spec from Input path
   → If not found: ERROR "No feature spec at {path}"
2. Fill Technical Context (scan for NEEDS CLARIFICATION)
   → Detect Project Type from context (web=frontend+backend, mobile=app+api)
   → Set Structure Decision based on project type
3. Fill the Constitution Check section based on the content of the constitution document.
4. Evaluate Constitution Check section below
   → If violations exist: Document in Complexity Tracking
   → If no justification possible: ERROR "Simplify approach first"
   → Update Progress Tracking: Initial Constitution Check
5. Execute Phase 0 → research.md
   → If NEEDS CLARIFICATION remain: ERROR "Resolve unknowns"
6. Execute Phase 1 → contracts, data-model.md, quickstart.md, agent-specific template file (e.g., `CLAUDE.md` for Claude Code)
7. Re-evaluate Constitution Check section
   → If new violations: Refactor design, return to Phase 1
   → Update Progress Tracking: Post-Design Constitution Check
8. Plan Phase 2 → Describe task generation approach (DO NOT create tasks.md)
9. STOP - Ready for /tasks command
```

**IMPORTANT**: The /plan command STOPS at step 7. Phases 2-4 are executed by other commands:
- Phase 2: /tasks command creates tasks.md
- Phase 3-4: Implementation execution (manual or via tools)

## Summary
Create a single-file HTML presentation integrating 60+ existing slides and PDF data into a cohesive 20-minute presentation (35-40 slides) with interactive data visualizations, geographic maps for country data, and precise timing control while maintaining 100% data accuracy from source materials.

## Technical Context
**Language/Version**: HTML5/CSS3/JavaScript ES6
**Primary Dependencies**: Chart.js 4.4+, Leaflet.js 1.9+, D3.js 7.0 (for complex visualizations)
**Storage**: Inline JSON data structures within HTML file
**Testing**: Browser-based visual testing, data accuracy validation scripts
**Target Platform**: Modern web browsers (Chrome 100+, Firefox 100+, Safari 15+, Edge 100+)
**Project Type**: single (single-file presentation)
**Performance Goals**: <3s initial load, 60fps slide transitions, <100ms interaction response
**Constraints**: <10MB total file size, no server dependencies, offline-capable
**Scale/Scope**: 35-40 slides, ~50 data visualizations, 8 panels, 20-minute runtime

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Core Principles Compliance
1. **Single-File Architecture** ✅
   - All code will be inline in single HTML file
   - External CDN dependencies allowed (Chart.js, Leaflet.js)
   - No server requirements

2. **Data-Driven Visualization** ✅
   - All numeric data will be visualized interactively
   - No raw numbers as static text
   - Every PDF data point gets visual representation

3. **16:9 Presentation Format** ✅
   - Strict aspect ratio enforcement in CSS
   - Responsive scaling within ratio bounds
   - Professional presentation display

4. **Time-Series Geographic Integration** ✅
   - Leaflet.js for all geographic visualizations
   - Timeline controls for temporal data
   - Combined time-series maps where applicable

5. **20-Minute Presentation Scope** ✅
   - 35-40 slides with timing metadata
   - Average 30-35 seconds per slide
   - All content condensed to fit constraint

### Visualization Standards Compliance
- **Charts**: Interactive tooltips, consistent colors, accessibility ✅
- **Maps**: Leaflet.js, choropleth, time sliders, drill-down ✅
- **Performance**: <10MB, <3s render, smooth transitions ✅

### Data Integration Workflow Compliance
- PDF data extraction and JSON conversion ✅
- Slide content merging and deduplication ✅
- Quality validation against source ✅

**Constitution Check Result**: PASS - All principles satisfied

## Project Structure

### Documentation (this feature)
```
specs/002-integrated-presentation/
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (/plan command)
├── data-model.md        # Phase 1 output (/plan command)
├── quickstart.md        # Phase 1 output (/plan command)
├── contracts/           # Phase 1 output (/plan command)
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (repository root)
```
# Option 1: Single project (DEFAULT) - Selected for single-file presentation
src/
├── data/                # Extracted JSON data from PDF and slides
│   ├── panels.json      # Panel 1-8 content
│   ├── tables.json      # Numerical data from tables
│   ├── countries.json   # Geographic data
│   └── timeseries.json  # Temporal data
├── visualizations/      # Visualization components
│   ├── charts.js        # Chart.js configurations
│   ├── maps.js          # Leaflet map components
│   └── timelines.js     # Timeline visualizations
├── slides/              # Slide content modules
│   ├── intro.js         # Introduction section
│   ├── benefits.js      # Benefits section
│   ├── unmet.js         # Unmet need section
│   ├── solutions.js     # Solutions section
│   └── costs.js         # Costs/recommendations
└── lib/                 # Core presentation engine
    ├── navigation.js    # Slide navigation
    ├── timing.js        # 20-minute timing control
    └── integration.js   # Data integration logic

tests/
├── data-accuracy/       # Validate against PDF source
├── visualization/       # Visual regression tests
└── timing/             # 20-minute timing tests
```

**Structure Decision**: Option 1 (Single project) - appropriate for single-file deliverable

## Phase 0: Outline & Research

### Research Tasks Completed:
1. **Visualization Library Selection**
   - Chart.js for standard charts (bar, line, pie, scatter)
   - Leaflet.js for geographic maps and choropleth
   - D3.js for complex custom visualizations (optional, only if needed)
   - Decision: Use CDN versions to minimize file size

2. **Data Extraction Strategy**
   - Manual extraction from PDF for accuracy
   - Structured JSON format for all data points
   - Source reference for each data point

3. **Slide Consolidation Approach**
   - Analyze 60+ existing HTML files
   - Identify duplicate/overlapping content
   - Merge into 35-40 cohesive slides
   - Maintain narrative flow per spec requirements

4. **Timing Control Mechanism**
   - JavaScript-based timer with per-slide duration
   - Progress indicator showing time elapsed/remaining
   - Auto-advance option with manual override

5. **Single-File Build Strategy**
   - Inline all CSS as <style> tags
   - Inline all JavaScript in <script> tags
   - Inline JSON data as JavaScript objects
   - Base64 encode small images if needed
   - External CDN for large libraries only

**Output**: See research.md for detailed findings and decisions

## Phase 1: Design & Contracts
*Prerequisites: research.md complete*

### Data Model Design
Generated comprehensive data model covering:
- Slide structure with timing metadata
- Panel content with placement rules
- Visualization configurations
- Country/region geographic data
- Time-series data structures
- Navigation state management

### Visualization Contracts
Created contracts for each visualization type:
- Chart rendering contracts (Chart.js configs)
- Map rendering contracts (Leaflet configurations)
- Timeline contracts (custom implementation)
- Data accuracy validation contracts

### Integration Contracts
Defined integration points:
- PDF data → JSON conversion rules
- Slide HTML → unified structure mapping
- Panel placement algorithm
- Timing synchronization protocol

### Test Specifications
Generated test cases for:
- Data accuracy validation (100% fidelity requirement)
- Timing precision (20 minutes ± 1 minute)
- Visualization rendering across browsers
- Navigation state management
- Aspect ratio maintenance

### Quickstart Guide
Created quickstart.md with:
- How to open and present
- Navigation controls
- Timing features
- Troubleshooting guide

**Output**: data-model.md, /contracts/*, quickstart.md, CLAUDE.md (agent file)

## Phase 2: Task Planning Approach
*This section describes what the /tasks command will do - DO NOT execute during /plan*

**Task Generation Strategy**:
- Extract and validate all PDF data → data extraction tasks [P]
- Process each slide HTML file → content analysis tasks [P]
- Create visualization components → chart/map tasks [P]
- Build slide templates → slide creation tasks
- Implement navigation system → navigation tasks
- Add timing control → timing tasks
- Integrate all components → integration task
- Validate against requirements → validation tasks

**Task Categories**:
1. **Data Extraction** (10-12 tasks)
   - Extract each panel (1-8)
   - Extract tables and figures
   - Extract country data
   - Validate accuracy

2. **Content Processing** (8-10 tasks)
   - Analyze existing slides
   - Identify duplicates
   - Merge related content
   - Create narrative flow

3. **Visualization Creation** (12-15 tasks)
   - Configure Chart.js charts
   - Setup Leaflet maps
   - Create timelines
   - Add interactivity

4. **Presentation Assembly** (5-8 tasks)
   - Build HTML structure
   - Inline all resources
   - Add navigation
   - Implement timing

5. **Quality Assurance** (5-6 tasks)
   - Data accuracy tests
   - Timing validation
   - Cross-browser testing
   - Performance optimization

**Ordering Strategy**:
- Data extraction first (foundation)
- Parallel visualization development
- Sequential slide assembly
- Final integration and testing

**Estimated Output**: 40-50 numbered, ordered tasks in tasks.md

**IMPORTANT**: This phase is executed by the /tasks command, NOT by /plan

## Phase 3+: Future Implementation
*These phases are beyond the scope of the /plan command*

**Phase 3**: Task execution (/tasks command creates tasks.md)
**Phase 4**: Implementation (execute tasks following single-file architecture)
**Phase 5**: Validation (verify 20-minute timing, data accuracy, visualizations)

## Complexity Tracking
*No violations - Constitution fully satisfied*

## Progress Tracking
*This checklist is updated during execution flow*

**Phase Status**:
- [x] Phase 0: Research complete (/plan command)
- [x] Phase 1: Design complete (/plan command)
- [x] Phase 2: Task planning complete (/plan command - describe approach only)
- [ ] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:
- [x] Initial Constitution Check: PASS
- [x] Post-Design Constitution Check: PASS
- [x] All NEEDS CLARIFICATION resolved
- [x] Complexity deviations documented (none required)

---
*Based on Constitution v1.0.0 - See `.specify/memory/constitution.md`*