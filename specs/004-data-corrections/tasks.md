# Tasks: Data Corrections for PDF Source Alignment

**Input**: Design documents from `/specs/004-data-corrections/`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/, quickstart.md

## Execution Flow (main)
```
1. Load plan.md from feature directory
   → Extract: HTML5/CSS3/JS ES6, Chart.js 4.4.0, Leaflet.js 1.9.4
   → Structure: Single-file HTML presentation
2. Load design documents:
   → data-model.md: 5 SlideCorrection entities
   → contracts/: 2 validation contracts
   → research.md: Backup strategy, correction patterns
3. Generate tasks by category:
   → Setup: Backup creation
   → Tests: Validation contracts
   → Core: Data corrections for 5 slides
   → Integration: Visual enhancements
   → Polish: Final validation and documentation
4. Apply task rules:
   → Single file (index.html) = mostly sequential
   → Validation tasks can be parallel [P]
5. Number tasks sequentially (T001-T015)
6. Return: SUCCESS (tasks ready for execution)
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different operations, no dependencies)
- Include exact locations and values in descriptions

## Path Conventions
- **Single file**: `index.html` at repository root
- **Backup**: `index_backup_[timestamp].html`
- **Documentation**: `specs/004-data-corrections/`

## Phase 3.1: Setup & Backup
- [x] T001 Create timestamped backup of index.html as index_backup_YYYYMMDD_HHMMSS.html
- [x] T002 Verify backup file created successfully and is readable (index_backup_20250924_125210.html)
- [x] T003 Document original values in comments for rollback reference

## Phase 3.2: Tests First (Validation Preparation) ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: Setup validation framework before making corrections**
- [x] T004 [P] Create validation checklist for Slide 3 (Asia population: 3,905M/5,217M)
- [x] T005 [P] Create validation checklist for Slide 4 (Niger: 14M, 4.6%, 50M)
- [x] T006 [P] Create validation checklist for Slide 5 (Brazil TFR: 2.5)
- [x] T007 [P] Create validation checklist for Slide 6 (Pakistan: 12%)
- [x] T008 [P] Create validation checklist for Slide 10 (qualitative insights)

## Phase 3.3: Core Implementation (Data Corrections)
**Execute only after validation checklists are ready**

### Slide 3: Global Population Trends (Asia simplification)
- [x] T009 Locate slide 3 "글로벌 인구 동향과 지역별 현황" in index.html
- [x] T010 Replace sub-regional Asia data with total only: 2005=3,905M, 2050=5,217M
- [x] T011 Update chart configuration to show single Asia entry instead of sub-regions
- [x] T012 Verify chart tooltips display correct values

### Slide 4: Niger Crisis (3 corrections)
- [x] T013 Locate slide 4 "사하라 이남 아프리카: 니제르 위기" in index.html
- [x] T014 Update current population from 12.5 million to 14 million (2005)
- [x] T015 Update contraceptive use from 5% to 4.6% (1998)
- [x] T016 Update 2050 projection from "<50 million" to "50 million"
- [x] T017 Verify all three values appear in both text and charts

### Slide 5: Brazil Success Story (TFR correction)
- [x] T018 Locate slide 5 "성공 스토리: 케냐와 브라질" in index.html
- [x] T019 Update Brazil TFR endpoint from 2.3 to 2.5 (1996)
- [x] T020 Update chart data array to reflect new endpoint value
- [x] T021 Verify line chart shows correct endpoint at 2.5

### Slide 6: Pakistan Contrast (contraceptive rate)
- [x] T022 Locate slide 6 "남아시아 대조: 방글라데시 vs 파키스탄" in index.html
- [x] T023 Update Pakistan contraceptive rate from "30% 정체" to "12%" (1990)
- [x] T024 Update chart/timeline to show 12% for 1990 baseline
- [x] T025 Verify comparison with Bangladesh shows correct contrast

### Slide 10: Unmet Demand (add insights)
- [x] T026 Locate slide 10 "미충족 수요: 정의와 지역별 분포" in index.html
- [x] T027 Add insight: "사하라 이남: 출산 간격 조정 수요 > 가족 수 제한 수요"
- [x] T028 Add insight: "아시아/라틴: 최빈곤층 미충족 수요가 최부유층보다 2배 높음"
- [x] T029 Format insights as bullet points maintaining slide layout

## Phase 3.4: Integration & Enhancement
- [x] T030 Apply ColorConcept.png improvements to corrected slides if needed
- [x] T031 Verify 16:9 aspect ratio maintained on all corrected slides
- [x] T032 Test slide transitions and animations still work smoothly
- [x] T033 Ensure all Chart.js and Leaflet.js visualizations render correctly

## Phase 3.5: Polish & Validation
- [x] T034 [P] Run browser console checks for JavaScript errors
- [x] T035 [P] Validate file size remains under 10MB (102KB confirmed)
- [x] T036 [P] Test load time is under 3 seconds
- [x] T037 Execute quickstart.md validation steps for all 5 corrected slides
- [x] T038 Cross-reference all corrections with main.pdf source tables/panels
- [x] T039 Generate validation report documenting all changes
- [x] T040 Update CHANGELOG.md with correction details

## Dependencies
- Backup (T001-T003) MUST complete before any corrections
- Validation prep (T004-T008) before implementation (T009-T029)
- Each slide's corrections (T009-T012, T013-T017, etc.) are sequential within slide
- Different slides can theoretically be corrected in parallel but single file makes it risky
- Integration (T030-T033) after all corrections
- Final validation (T034-T040) after everything else

## Parallel Example
```bash
# After backup, validation checklists can be created in parallel:
Task: "Create validation checklist for Slide 3 (Asia population)"
Task: "Create validation checklist for Slide 4 (Niger statistics)"
Task: "Create validation checklist for Slide 5 (Brazil TFR)"
Task: "Create validation checklist for Slide 6 (Pakistan rate)"
Task: "Create validation checklist for Slide 10 (insights)"

# Final validation tasks can run in parallel:
Task: "Run browser console checks for JavaScript errors"
Task: "Validate file size remains under 10MB"
Task: "Test load time is under 3 seconds"
```

## Critical Values Reference
Quick lookup for exact corrections needed:

| Slide | Field | Current (Wrong) | Correct (PDF) | Source |
|-------|-------|----------------|---------------|--------|
| 3 | Asia 2005 | Sub-regions | 3,905M total | Table 1 |
| 3 | Asia 2050 | Sub-regions | 5,217M total | Table 1 |
| 4 | Niger pop | 12.5M | 14M | Table 2 |
| 4 | Niger contraceptive | 5% | 4.6% | Table 2 |
| 4 | Niger 2050 | <50M | 50M | Table 2 |
| 5 | Brazil TFR end | 2.3 | 2.5 | Panel 6 |
| 6 | Pakistan 1990 | 30% | 12% | Panel 8 |
| 10 | Insights | None | 2 insights | Text |

## Notes
- Single HTML file means most edits are sequential to avoid conflicts
- Use browser dev tools to locate specific slides and data
- Preserve existing code structure and styling
- Test after each slide correction before moving to next
- Keep original values in comments for potential rollback
- All numeric values must match PDF source EXACTLY

## Success Criteria
✅ All 5 slides display corrected data
✅ Values match main.pdf source precisely
✅ No JavaScript errors in console
✅ File size under 10MB
✅ Load time under 3 seconds
✅ Visualizations still interactive
✅ 16:9 aspect ratio preserved
✅ Backup file exists for rollback

---
*Total Tasks: 40 | Estimated Time: 3-4 hours*
*Priority: Data accuracy over visual enhancements*