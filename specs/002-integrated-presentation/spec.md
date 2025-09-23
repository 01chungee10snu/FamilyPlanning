# Feature Specification: Integrated 20-Minute Presentation

**Feature Branch**: `002-integrated-presentation`
**Created**: 2025-09-23
**Status**: Draft
**Input**: User description: "@slides\ 폴더에 있는 슬라이드의 내용과 @\"Family planning the unfi nished agenda.pdf\" 내용을 고려하여 20분 분량의 발제슬라이드 제작. 원문에 있는 수치데이터는 틀리지않게 시각화. 국가에 대한 데이터는 지도위에 시각화. 서론, 가족계획의 이점, 미충족 수요에 대한, 미충족 수요 감소를 위한 방안, 국제적 비용문제 및 제언 등의 순서대로 , 패널1~8은 적절한 위치에 배치할 것."

## Execution Flow (main)
```
1. Parse user description from Input
   → If empty: ERROR "No feature description provided"
2. Extract key concepts from description
   → Identify: actors, actions, data, constraints
3. For each unclear aspect:
   → Mark with [NEEDS CLARIFICATION: specific question]
4. Fill User Scenarios & Testing section
   → If no clear user flow: ERROR "Cannot determine user scenarios"
5. Generate Functional Requirements
   → Each requirement must be testable
   → Mark ambiguous requirements
6. Identify Key Entities (if data involved)
7. Run Review Checklist
   → If any [NEEDS CLARIFICATION]: WARN "Spec has uncertainties"
   → If implementation details found: ERROR "Remove tech details"
8. Return: SUCCESS (spec ready for planning)
```

---

## ⚡ Quick Guidelines
- ✅ Focus on WHAT users need and WHY
- ❌ Avoid HOW to implement (no tech stack, APIs, code structure)
- 👥 Written for business stakeholders, not developers

### Section Requirements
- **Mandatory sections**: Must be completed for every feature
- **Optional sections**: Include only when relevant to the feature
- When a section doesn't apply, remove it entirely (don't leave as "N/A")

---

## User Scenarios & Testing *(mandatory)*

### Primary User Story
As a presenter delivering a talk on family planning policy, I need an integrated presentation that combines multiple slide sources and PDF data into a single 20-minute presentation with accurate data visualizations, so that I can effectively communicate the key findings and recommendations from "Family Planning: The Unfinished Agenda" research paper.

### Acceptance Scenarios
1. **Given** a presenter opens the presentation file, **When** they advance through slides using navigation controls, **Then** the presentation displays exactly 35-40 slides optimized for 20-minute delivery (30-35 seconds per slide)

2. **Given** the presentation displays numeric data from the source PDF, **When** a viewer examines any data visualization, **Then** all numbers match exactly with the original PDF source material

3. **Given** the presentation shows country-level data, **When** displayed on screen, **Then** the data appears as interactive visualizations on geographic maps

4. **Given** the presentation follows the specified structure, **When** viewed sequentially, **Then** content flows in order: Introduction → Benefits of Family Planning → Unmet Need → Solutions for Reducing Unmet Need → International Cost Issues and Recommendations

5. **Given** Panels 1-8 from the original paper are included, **When** the presentation progresses, **Then** each panel appears at the contextually appropriate point in the narrative

### Edge Cases
- What happens when the browser doesn't support required visualization libraries?
  - System must provide fallback static images or simplified visualizations
- How does system handle different screen resolutions?
  - Presentation must maintain 16:9 aspect ratio and scale appropriately
- What if source data contains conflicting numbers?
  - Always use the PDF as the authoritative source

## Requirements *(mandatory)*

### Functional Requirements
- **FR-001**: System MUST integrate all content from slides folder into a unified presentation
- **FR-002**: System MUST extract and accurately visualize all numerical data from the PDF source
- **FR-003**: System MUST display country-specific data as visualizations on geographic maps
- **FR-004**: System MUST organize content into exactly 20 minutes of presentation time
- **FR-005**: System MUST maintain the specified content structure (Introduction → Benefits → Unmet Need → Solutions → Costs/Recommendations)
- **FR-006**: System MUST position Panels 1-8 from the original paper at appropriate narrative points
- **FR-007**: System MUST ensure all data visualizations are accurate to the source material with zero tolerance for numerical errors
- **FR-008**: System MUST provide navigation controls for advancing through slides
- **FR-009**: System MUST display slides in 16:9 aspect ratio format
- **FR-010**: System MUST combine time-series data with geographic visualizations where both data types are available
- **FR-011**: System MUST provide Korean language labels with English subtitles where appropriate
- **FR-012**: System MUST deliver the entire presentation as a single file for portability

### Key Entities *(include if feature involves data)*
- **Slide**: Individual presentation screen with content, visualizations, and navigation metadata
- **Panel**: Specific content sections (1-8) from the original research paper that must be integrated
- **DataPoint**: Numerical values from PDF that require visualization (includes value, source, context)
- **CountryData**: Geographic-specific information requiring map visualization (country name, metrics, time period)
- **TimeSeriesData**: Data with temporal dimension requiring animated or progressive visualization
- **NavigationState**: Current position in presentation, elapsed time, remaining slides

---

## Review & Acceptance Checklist
*GATE: Automated checks run during main() execution*

### Content Quality
- [x] No implementation details (languages, frameworks, APIs)
- [x] Focused on user value and business needs
- [x] Written for non-technical stakeholders
- [x] All mandatory sections completed

### Requirement Completeness
- [x] No [NEEDS CLARIFICATION] markers remain
- [x] Requirements are testable and unambiguous
- [x] Success criteria are measurable
- [x] Scope is clearly bounded
- [x] Dependencies and assumptions identified

---

## Execution Status
*Updated by main() during processing*

- [x] User description parsed
- [x] Key concepts extracted
- [x] Ambiguities marked (none found - requirements are clear)
- [x] User scenarios defined
- [x] Requirements generated
- [x] Entities identified
- [x] Review checklist passed

---

## Additional Context

### Data Sources
- **Primary Source**: "Family planning the unfinished agenda.pdf" - All numerical data and Panels 1-8
- **Secondary Sources**: HTML files in slides/ folder - Pre-existing slide content to be integrated

### Presentation Structure Requirements
1. **Introduction Section**: Context and background of family planning initiatives
2. **Benefits of Family Planning**: Health, economic, and social benefits with data visualization
3. **Unmet Need Analysis**: Current gaps in family planning services with geographic distribution
4. **Solutions for Reducing Unmet Need**: Evidence-based interventions and case studies
5. **International Cost Issues and Recommendations**: Funding requirements and policy recommendations

### Quality Standards
- Data accuracy: 100% fidelity to source PDF
- Timing precision: 20 minutes ± 1 minute
- Visual consistency: Unified design language across all slides
- Geographic coverage: All countries mentioned in source must appear on maps
- Panel integration: All 8 panels must be included and properly contextualized