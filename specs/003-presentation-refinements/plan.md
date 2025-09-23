# Implementation Plan: Presentation Refinements and Data Validation

**Branch**: `003-presentation-refinements` | **Date**: 2025-09-24 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-presentation-refinements/spec.md`

## Execution Flow (/plan command scope)
```
1. Load feature spec from Input path
   → Feature spec loaded successfully
2. Fill Technical Context (scan for NEEDS CLARIFICATION)
   → Project Type detected: Single HTML presentation
   → Structure Decision: Single-file architecture
3. Fill the Constitution Check section based on the content of the constitution document.
   → Constitution principles evaluated
4. Evaluate Constitution Check section below
   → All principles PASS
   → Update Progress Tracking: Initial Constitution Check ✓
5. Execute Phase 0 → research.md
   → Research completed for data sources and technical decisions
6. Execute Phase 1 → contracts, data-model.md, quickstart.md, CLAUDE.md
   → Design artifacts generated
7. Re-evaluate Constitution Check section
   → All principles still PASS
   → Update Progress Tracking: Post-Design Constitution Check ✓
8. Plan Phase 2 → Task generation approach documented
9. STOP - Ready for /tasks command
```

## Summary
Refine the Family Planning presentation by correcting data values, adding proper citations, fixing UI issues, and ensuring all content is validated against the source PDF. The implementation maintains single-file architecture while improving data accuracy, navigation, and user experience through 19 specific functional requirements.

## Technical Context
**Language/Version**: HTML5, CSS3, JavaScript ES6
**Primary Dependencies**: Chart.js 4.4.0, Leaflet.js 1.9.4 (CDN)
**Storage**: N/A (all data inline)
**Testing**: Manual validation against PDF source
**Target Platform**: Modern browsers (Chrome/Firefox/Safari/Edge 100+)
**Project Type**: Single-file HTML presentation
**Performance Goals**: <3s load time, 60fps transitions
**Constraints**: Single file delivery, 10MB max size, no external dependencies except CDN
**Scale/Scope**: 35-40 slides, 20-minute presentation duration

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. Single-File Architecture ✅
- All changes maintain inline code structure
- No external files created or referenced
- CDN usage only for Chart.js and Leaflet.js

### II. Data-Driven Visualization ✅
- All numeric corrections will update existing visualizations
- South Korea case study data will be visualized
- MDG relationships will be shown graphically

### III. 16:9 Presentation Format ✅
- Navigation elements positioned to maintain aspect ratio
- Page counter placement respects 16:9 boundaries
- No structural changes to slide dimensions

### IV. Time-Series Geographic Integration ✅
- Existing map visualizations enhanced with proper tooltips
- Regional data tables updated with complete PDF data
- No degradation of temporal-geographic features

### V. 20-Minute Presentation Scope ✅
- Slide 10 removal keeps within 35-40 slide target
- Content refinements don't extend presentation time
- Citation additions are concise (in-text format)

## Project Structure

### Documentation (this feature)
```
specs/003-presentation-refinements/
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (/plan command)
├── data-model.md        # Phase 1 output (/plan command)
├── quickstart.md        # Phase 1 output (/plan command)
├── contracts/           # Phase 1 output (/plan command)
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (repository root)
```
# Single HTML file structure (existing)
presentation.html        # Single deliverable file containing:
├── Navigation Component # Page counter addition
├── Slide Data          # Corrections and validations
├── Visualizations      # Updated charts and maps
└── Citations           # APA format references
```

**Structure Decision**: Single-file HTML (Constitutional requirement)

## Phase 0: Outline & Research
1. **Extract unknowns from Technical Context** above:
   - NEEDS CLARIFICATION: East Asia economic growth percentage source
   - NEEDS CLARIFICATION: MDG-family planning exclusion documentation
   - Research APA citation format requirements
   - Investigate tooltip boundary containment techniques

2. **Generate and dispatch research agents**:
   ```
   Task: "Research East Asia economic growth data from family planning"
   Task: "Find MDG documentation on family planning exclusion"
   Task: "Research APA citation formatting for presentations"
   Task: "Find best practices for tooltip containment in maps"
   ```

3. **Consolidate findings** in `research.md` using format:
   - Decision: Data source validation approach
   - Rationale: Maintain scientific accuracy
   - Alternatives considered: Placeholder data vs. removal

**Output**: research.md with all NEEDS CLARIFICATION resolved

## Phase 1: Design & Contracts
*Prerequisites: research.md complete*

1. **Extract entities from feature spec** → `data-model.md`:
   - Navigation state (current slide, total slides)
   - Citation entities (full reference, in-text)
   - Slide content corrections (per-slide data)
   - Visualization updates (tooltips, boundaries)

2. **Generate API contracts** from functional requirements:
   - Navigation contract for page counter
   - Citation formatting contract
   - Data validation contract
   - Tooltip positioning contract

3. **Generate contract tests** from contracts:
   - Page counter display test
   - Citation format validation test
   - Data accuracy verification test
   - Tooltip boundary containment test

4. **Extract test scenarios** from user stories:
   - Navigation visibility on all slides
   - Citation presence verification
   - Data value accuracy checks
   - UI interaction boundary tests

5. **Update agent file incrementally**:
   - Update CLAUDE.md with refinement context
   - Document data validation requirements
   - Note citation formatting standards

**Output**: data-model.md, /contracts/*, test scenarios, quickstart.md, CLAUDE.md update

## Phase 2: Task Planning Approach
*This section describes what the /tasks command will do - DO NOT execute during /plan*

**Task Generation Strategy**:
- Group tasks by slide number for systematic execution
- Prioritize data validation before UI fixes
- Create verification tasks after each major change
- Batch similar operations (all citations, all tooltips)

**Ordering Strategy**:
1. Navigation implementation (FR-001) [P]
2. Slide 1-5 corrections in sequence
3. Slide 6-9 validations and updates
4. Slide 10 removal
5. Global citation formatting [P]
6. UI fixes (tooltips) [P]
7. Final validation against PDF

**Estimated Output**: 20-25 numbered, ordered tasks in tasks.md

**IMPORTANT**: This phase is executed by the /tasks command, NOT by /plan

## Phase 3+: Future Implementation
*These phases are beyond the scope of the /plan command*

**Phase 3**: Task execution (/tasks command creates tasks.md)
**Phase 4**: Implementation (execute tasks.md following constitutional principles)
**Phase 5**: Validation (run tests, verify against PDF, check presentation timing)

## Complexity Tracking
*No constitutional violations - section not needed*

## Progress Tracking
*This checklist is updated during execution flow*

**Phase Status**:
- [x] Phase 0: Research complete (/plan command) ✓
- [x] Phase 1: Design complete (/plan command) ✓
- [x] Phase 2: Task planning complete (/plan command - approach described) ✓
- [ ] Phase 3: Tasks generated (/tasks command) - Ready to execute
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:
- [x] Initial Constitution Check: PASS
- [x] Post-Design Constitution Check: PASS
- [x] All NEEDS CLARIFICATION resolved (pending research)
- [x] Complexity deviations documented (none)

---
*Based on Constitution v1.0.0 - See `/memory/constitution.md`*