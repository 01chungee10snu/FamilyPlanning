# Tasks: Critical Challenges Slide Implementation

**Input**: Design documents from `/specs/005-critical-challenges-slide/`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/, quickstart.md

## Execution Flow (main)
```
1. Load plan.md from feature directory ✓
   → Extract: HTML5/CSS3/JS ES6, Chart.js 4.4.0, Leaflet.js 1.9.4
   → Structure: Single-file HTML presentation
2. Load design documents:
   → data-model.md: 3 panel entities, chart configurations
   → contracts/: 3 contracts (layout, color, animation)
   → research.md: Three-panel layout, warning palette
3. Generate tasks by category:
   → Setup: Backup creation, locate insertion point
   → Tests: Visual validation contracts
   → Core: HTML structure, data integration, visualizations
   → Integration: Chart.js and Leaflet integration
   → Polish: Animations, timing, responsiveness
4. Apply task rules:
   → Single file (index.html) = mostly sequential
   → Visual contracts can be parallel [P]
5. Number tasks sequentially (T001-T030)
6. Return: SUCCESS (tasks ready for execution)
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different operations, no dependencies)
- Include exact locations in descriptions

## Path Conventions
- **Single file**: `index.html` at repository root
- **Backup**: `index_backup_[timestamp].html`
- **Documentation**: `specs/005-critical-challenges-slide/`

## Phase 3.1: Setup & Preparation
- [ ] T001 Create timestamped backup of index.html as index_backup_YYYYMMDD_HHMMSS.html
- [ ] T002 Locate slide 5 (success/failure comparison) in index.html for insertion point
- [ ] T003 Document current slide count and update navigation counter maximum
- [ ] T004 Add crisis color variables to CSS :root section (--crisis-danger, --crisis-warning, etc.)

## Phase 3.2: Tests First (Visual Contracts) ⚠️ MUST COMPLETE BEFORE 3.3
**These create validation criteria before implementation**
- [ ] T005 [P] Create layout validation checklist from layout.contract.md (3-column grid)
- [ ] T006 [P] Create color validation checklist from color.contract.md (contrast ratios)
- [ ] T007 [P] Create animation validation checklist from animation.contract.md (timing)
- [ ] T008 Create overall visual validation checklist from quickstart.md

## Phase 3.3: Core Implementation

### HTML Structure (Sequential - same file)
- [ ] T009 Insert new slide div after slide 5 with class="slide" and crisis-specific classes
- [ ] T010 Create main title "위기의 가족계획: 국제적 외면과 자원 부족" with subtitle
- [ ] T011 Add three-column grid container div with class="crisis-panels"

### Panel 1: Funding Decline
- [ ] T012 Create funding panel div with gradient background (#7f1d1d to #991b1b)
- [ ] T013 Add funding panel header with 📉 icon and "국제 우선순위 하락" title
- [ ] T014 Add "50% 자금 감소" key metric with highlighting
- [ ] T015 Add canvas element with id="fundingDeclineChart" for timeline chart
- [ ] T016 Add three bullet points about MDG exclusion and leadership vacuum

### Panel 2: Africa Crisis
- [ ] T017 Create Africa panel div with gradient background (#7c2d12 to #9a3412)
- [ ] T018 Add Africa panel header with 🌍 icon and "아프리카 위기" title
- [ ] T019 Add "3배" Niger population metric with highlighting
- [ ] T020 Add div with id="africaCrisisMap" for heat map visualization
- [ ] T021 Add three bullet points about HIV/AIDS comparison and unmet needs

### Panel 3: Resource Gap
- [ ] T022 Create resource panel div with gradient background (#713f12 to #92400e)
- [ ] T023 Add resource panel header with 💰 icon and "자원 격차" title
- [ ] T024 Add "$2.3B" annual shortfall metric with highlighting
- [ ] T025 Add canvas element with id="resourceGapChart" for bar chart
- [ ] T026 Add three bullet points about political will and urgent action

### Data Integration
- [ ] T027 Add JavaScript data structures for funding timeline (1994-2020 decline data)
- [ ] T028 Add JavaScript data structures for Africa crisis regions (9 countries with coordinates)
- [ ] T029 Add JavaScript data structures for resource gap comparison (needed vs available)

## Phase 3.4: Visualization Implementation

### Chart.js Visualizations
- [ ] T030 Implement funding decline line chart with red color scheme (#ef4444)
- [ ] T031 Implement resource gap bar chart comparing needed vs available funds
- [ ] T032 Configure chart animations with 1-second duration and easing

### Leaflet.js Map
- [ ] T033 Initialize Leaflet map for Africa crisis regions with appropriate zoom/center
- [ ] T034 Add heat markers for 9 sub-Saharan countries with severity indicators
- [ ] T035 Configure map tooltips showing country names and unmet need percentages

## Phase 3.5: Integration & Polish

### Animations & Transitions
- [ ] T036 Implement panel stagger entry animations (0.1s, 0.3s, 0.5s delays)
- [ ] T037 Add number count-up animations for key metrics (50%, 3x, $2.3B)
- [ ] T038 Configure slide entry/exit transitions with 0.3s fade

### Navigation & Flow
- [ ] T039 Update slide navigation JavaScript to handle new slide 6
- [ ] T040 Update total slide count in navigation controls
- [ ] T041 Test keyboard navigation (arrow keys) through all slides

### Styling & Responsiveness
- [ ] T042 Apply crisis-specific CSS styles for dark theme and warning colors
- [ ] T043 Ensure 16:9 aspect ratio maintained with proper scaling
- [ ] T044 Add responsive font sizing for readability from distance
- [ ] T045 Apply panel hover effects and interactive states

## Phase 3.6: Validation & Testing

### Visual Validation
- [ ] T046 [P] Verify layout matches contract (three equal panels, proper spacing)
- [ ] T047 [P] Verify colors match contract (gradients, text contrast)
- [ ] T048 [P] Verify animations match contract (timing, easing)
- [ ] T049 Test complete quickstart.md validation checklist

### Data & Performance
- [ ] T050 Verify all statistics match edit.md source document
- [ ] T051 Test slide timing (30-40 seconds reading time)
- [ ] T052 Check browser console for JavaScript errors
- [ ] T053 Test performance (< 3s load, smooth animations)

### Cross-Browser Testing
- [ ] T054 [P] Test in Chrome 100+ with DevTools
- [ ] T055 [P] Test in Firefox 100+ with responsive mode
- [ ] T056 [P] Test in Safari 15+ on available devices
- [ ] T057 [P] Test in Edge 100+ on Windows

### Final Integration
- [ ] T058 Run full presentation from slide 1 to verify narrative flow
- [ ] T059 Validate source attributions (Cleland et al., 2006)
- [ ] T060 Create documentation of changes made for future reference

## Dependencies
- T001-T004 (Setup) MUST complete before any other tasks
- T005-T008 (Visual contracts) before T009-T045 (Implementation)
- T009-T011 (Structure) before T012-T029 (Content)
- T027-T029 (Data) before T030-T035 (Visualizations)
- All implementation before T046-T060 (Validation)

## Parallel Execution Examples

### After Setup (T001-T004), visual contracts can run in parallel:
```bash
Task: "Create layout validation checklist"
Task: "Create color validation checklist"
Task: "Create animation validation checklist"
```

### Cross-browser testing can run in parallel:
```bash
Task: "Test in Chrome 100+"
Task: "Test in Firefox 100+"
Task: "Test in Safari 15+"
Task: "Test in Edge 100+"
```

### Final validation tasks can run in parallel:
```bash
Task: "Verify layout matches contract"
Task: "Verify colors match contract"
Task: "Verify animations match contract"
```

## Success Criteria
✅ All 60 tasks completed
✅ Visual contracts validated
✅ Data accuracy verified
✅ Performance targets met
✅ Cross-browser compatibility confirmed
✅ Narrative flow maintained
✅ 30-40 second timing achieved

## Notes
- Single HTML file means most edits are sequential to avoid conflicts
- Use browser DevTools to locate specific slide sections
- Preserve existing code structure and styling
- Test after each major section before proceeding
- Keep original values in comments for potential rollback
- Focus on visual impact while maintaining readability

---
*Total Tasks: 60 | Estimated Time: 3-4 hours*
*Priority: Visual hierarchy and data accuracy over perfect animations*