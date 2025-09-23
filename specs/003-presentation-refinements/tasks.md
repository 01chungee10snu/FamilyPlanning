# Tasks: Presentation Refinements and Data Validation

**Input**: Design documents from `/specs/003-presentation-refinements/`
**Prerequisites**: plan.md (✓), research.md (✓), data-model.md (✓), contracts/ (✓)

## Execution Flow (main)
```
1. Load plan.md from feature directory
   → Tech stack: HTML5, CSS3, JavaScript ES6
   → Libraries: Chart.js 4.4.0, Leaflet.js 1.9.4 (CDN)
   → Structure: Single-file HTML presentation
2. Load optional design documents:
   → data-model.md: 5 entities identified (NavigationState, Citation, SlideCorrection, VisualizationUpdate, CountryData)
   → contracts/: 4 contracts (navigation, citation, tooltip, data-validation)
   → research.md: Technical decisions for APA citations, tooltips, validation
3. Generate tasks by category:
   → Setup: Backup and validation preparation
   → Tests: Manual validation scripts for each contract
   → Core: Implementation of navigation, citations, corrections
   → Integration: Single-file inline updates
   → Polish: Final validation against PDF
4. Apply task rules:
   → Single file = all sequential (no [P] markers)
   → Tests before implementation (validation first)
   → Data corrections by slide order
5. Number tasks sequentially (T001-T025)
6. Validate task completeness:
   → All contracts covered ✓
   → All entities implemented ✓
   → All 19 FRs addressed ✓
9. Return: SUCCESS (tasks ready for execution)
```

## Format: `[ID] Description`
- No [P] markers - all tasks modify single presentation.html file
- Tasks must be executed sequentially to avoid conflicts

## Path Conventions
- **Single file**: `presentation.html` at repository root
- **Backup**: `presentation.backup.html` for safety
- **Validation**: Manual testing against PDF source

## Phase 3.1: Setup and Preparation
- [x] T001 Create backup copy of presentation.html as presentation.backup.html
- [x] T002 Create validation checklist document based on quickstart.md requirements
- [x] T003 Open PDF source document "Family planning the unfinished agenda.pdf" for reference

## Phase 3.2: Navigation Implementation (FR-001)
- [x] T004 Add page counter HTML structure to presentation.html with div.page-counter element
- [x] T005 Add page counter CSS styles (position: fixed, bottom: 20px, right: 20px)
- [x] T006 Implement JavaScript navigation state management (currentSlide, totalSlides)
- [x] T007 Add slide change event listeners to update page counter display
- [x] T008 Test page counter visibility and updates on all slides

## Phase 3.3: Citation System (FR-002, FR-003, FR-004)
- [x] T009 Update slide 1 title text color to white (#FFFFFF)
- [x] T010 Add full APA citation for Cleland et al. 2006 to slide 1
- [x] T011 Implement citation formatting functions (formatFullCitation, formatInTextCitation)
- [x] T012 Add in-text citations to all data visualizations on slides 2-9
- [x] T013 Validate all citations follow APA format

## Phase 3.4: Tooltip Boundary Fix (FR-005)
- [x] T014 Implement calculateTooltipPosition function with boundary detection
- [x] T015 Update Leaflet map tooltip handlers on slide 3
- [x] T016 Apply tooltip containment to all map visualizations
- [x] T017 Test tooltip behavior at map edges and corners

## Phase 3.5: Data Corrections - Slides 1-5
- [x] T018 Slide 2: Add TFR and contraceptive use data source citations
- [x] T019 Slide 3: Complete regional growth table with PDF data (FR-006)
- [x] T020 Slide 4: Correct Niger TFR to 7.5 (1998), add population projections (FR-007, FR-017)
- [x] T021 Slide 5: Update Kenya TFR to 8.0, contraceptive use 7%→27% (FR-015, FR-016)
- [x] T022 Slide 5: Add Kenya and Brazil flags, remove Iran and Thailand flags (FR-008)

## Phase 3.6: Data Corrections - Slides 6-9
- [x] T023 Slide 6: Validate and add Bangladesh/Pakistan TFR comparison with citations (FR-009)
- [x] T024 Slide 7: Expand MDG content with family planning relationships (FR-010)
- [x] T025 Slide 8: Correct infant mortality to "nearly 10%", remove unverified stats (FR-011)
- [x] T026 Slide 9: Add South Korea case study from Panel 4 of PDF (FR-012)
- [x] T027 Slide 9: Add demographic dividend reference (~1/3 East Asia growth) (FR-018)

## Phase 3.7: Content Removal and Cleanup
- [x] T028 Remove slide 10 completely from presentation (FR-013)
- [x] T029 Update slide numbering and navigation to skip removed slide
- [x] T030 Update totalSlides count in navigation state
- [x] T031 Remove any unverifiable data elements across all slides (FR-014)

## Phase 3.8: Final Validation and Polish
- [x] T032 Run through complete presentation checking against quickstart.md checklist
- [x] T033 Validate all data values against PDF source document
- [x] T034 Test presentation in Chrome, Firefox, Safari, Edge
- [x] T035 Verify load time <3s and transitions at 60fps
- [x] T036 Confirm presentation duration remains at 20 minutes
- [x] T037 Final review: All 19 functional requirements satisfied

## Dependencies
- T001-T003 (Setup) must complete first
- T004-T008 (Navigation) before any slide modifications
- T009-T013 (Citations) can proceed after navigation
- T014-T017 (Tooltips) independent of citations
- T018-T027 (Data corrections) in slide order
- T028-T031 (Removal) after all corrections
- T032-T037 (Validation) only after all implementation complete

## Execution Notes
```
IMPORTANT: This is a single-file HTML presentation.
- All tasks modify presentation.html inline
- No parallel execution possible
- Backup file before starting (T001)
- Test frequently to catch issues early
- Keep PDF source open for reference
```

## Validation Checkpoints
After each phase, verify:
- Phase 3.2: Page counter visible and functional
- Phase 3.3: Citations properly formatted
- Phase 3.4: Tooltips stay within boundaries
- Phase 3.5: Slides 1-5 data accurate
- Phase 3.6: Slides 6-9 data accurate
- Phase 3.7: Slide 10 removed, navigation works
- Phase 3.8: All requirements met

## Task Count Summary
- Setup: 3 tasks
- Navigation: 5 tasks
- Citations: 5 tasks
- Tooltips: 4 tasks
- Data Corrections: 10 tasks
- Removal: 4 tasks
- Validation: 6 tasks
- **Total: 37 tasks**

## Success Criteria
- [x] All 19 functional requirements implemented
- [x] Page counter shows on all slides
- [x] Citations in APA format
- [x] Tooltips contained within maps
- [x] All data validated against PDF
- [x] Slide 10 removed
- [x] 20-minute presentation maintained
- [x] Cross-browser compatibility verified

## Notes
- Single-file architecture means no parallel tasks
- Each task directly modifies presentation.html
- Maintain backup for rollback if needed
- PDF validation is critical for data accuracy
- Test after each major section