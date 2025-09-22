# Implementation Plan: Enhanced Presentation Slides with PDF Citations

**Branch**: `001-slide-enhancement-pdf` | **Date**: 2025-01-22 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-slide-enhancement-pdf/spec.md`

## Execution Flow (/plan command scope)
```
1. Load feature spec from Input path
   → SUCCESS: Spec loaded and analyzed
2. Fill Technical Context (scan for NEEDS CLARIFICATION)
   → Project Type: Web (frontend-focused presentation)
   → Structure Decision: Enhanced frontend with data layer
3. Fill the Constitution Check section
   → Evaluated against 5 core principles
4. Evaluate Constitution Check section
   → All principles validated
   → Update Progress Tracking: Initial Constitution Check ✓
5. Execute Phase 0 → research.md
   → Existing codebase analysis complete
6. Execute Phase 1 → contracts, data-model.md, quickstart.md
   → Design artifacts generated
7. Re-evaluate Constitution Check section
   → No new violations detected
   → Update Progress Tracking: Post-Design Constitution Check ✓
8. Plan Phase 2 → Task generation approach defined
9. STOP - Ready for /tasks command
```

## Summary
주요 요구사항: 60개 슬라이드로 확장된 학술 발표자료 구현 with PDF 정확 인용과 인터랙티브 시각화
기술 접근: 기존 HTML/CSS/JS 구조 확장 + Plotly/Leaflet 통합 + 계층적 데이터 관리

## Technical Context
**Language/Version**: JavaScript ES6+, HTML5, CSS3
**Primary Dependencies**: Plotly.js, Leaflet.js, Chart.js, Pretendard Font
**Storage**: JSON-based slide data, localStorage for presentation state
**Testing**: Browser DevTools, Visual regression testing
**Target Platform**: Modern browsers (Chrome 90+, Firefox 88+, Safari 14+)
**Project Type**: Web (frontend presentation application)
**Performance Goals**:
  - 초기 로딩 < 3초
  - 슬라이드 전환 < 300ms
  - 60fps 애니메이션
**Constraints**:
  - 오프라인 작동 필수
  - 메모리 사용량 < 200MB
  - 모바일 터치 지원
**Scale/Scope**: 60개 슬라이드, 10+ 시각화, 50+ PDF 인용

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. 학술적 정확성 (Academic Integrity)
- [x] **요구사항 준수**: 모든 슬라이드에 PDF 페이지 번호 인용 포함
- [x] **검증 방법**: Citation 엔티티로 모든 인용 추적
- [x] **구현 계획**: 각 데이터 포인트에 citation 속성 필수

### II. 최적 시각화 우선 (Visualization-First)
- [x] **요구사항 준수**: Plotly(5+), Leaflet(3+), Timeline(2+) 시각화
- [x] **검증 방법**: 각 섹션별 시각화 타입 매핑 완료
- [x] **구현 계획**: 데이터 복잡도별 최적 시각화 도구 선택

### III. 디자인 일관성 (Design Consistency)
- [x] **요구사항 준수**: 기존 index.html CSS 변수 재사용
- [x] **검증 방법**: 색상 팔레트, 폰트 시스템 문서화
- [x] **구현 계획**: CSS 변수 기반 테마 시스템 유지

### IV. 반응형 적응성 (Responsive Adaptability)
- [x] **요구사항 준수**: 모바일, 태블릿, 데스크탑 지원
- [x] **검증 방법**: 뷰포트별 테스트 시나리오 정의
- [x] **구현 계획**: CSS Grid/Flexbox 기반 반응형 레이아웃

### V. 스토리텔링 구조 (Narrative Structure)
- [x] **요구사항 준수**: 9개 섹션 논리적 흐름 구성
- [x] **검증 방법**: 섹션 간 전환 매트릭스 정의
- [x] **구현 계획**: 계층적 네비게이션 시스템

## Phase 0: Research & Analysis
*Output: research.md*

### Existing System Analysis
```
현재 구조:
├── index.html (기본 16개 슬라이드)
├── css/
│   ├── main.css (핵심 스타일)
│   └── components.css (컴포넌트)
├── js/
│   └── (미구현)
└── slides/ (개별 슬라이드 HTML)
```

### Technology Stack Validation
- **Plotly.js**: 인터랙티브 차트 (CDN 사용)
- **Leaflet.js**: 지도 시각화 (이미 포함됨)
- **Chart.js**: 기본 차트 (이미 포함됨)
- **추가 필요**: D3.js (타임라인용)

### Gap Analysis
| 현재 | 목표 | 갭 |
|------|------|-----|
| 16 슬라이드 | 60 슬라이드 | +44 |
| 정적 콘텐츠 | 인터랙티브 | 시각화 엔진 |
| 단순 네비게이션 | 계층적 메뉴 | 구조 재설계 |
| 인용 없음 | PDF 인용 | Citation 시스템 |

### Risk Assessment
1. **성능 리스크**: 60개 슬라이드 + 시각화 → 메모리 관리 필수
2. **호환성 리스크**: 구형 브라우저 → 폴리필 필요
3. **데이터 일관성**: PDF 인용 정확도 → 검증 시스템 필요

## Phase 1: Design Specification
*Outputs: contracts/, data-model.md, quickstart.md*

### Architecture Overview
```
프레젠테이션 시스템
├── Data Layer (JSON)
│   ├── slides.json (60개 슬라이드 데이터)
│   ├── citations.json (PDF 참조)
│   └── visualizations.json (차트 설정)
├── Presentation Layer
│   ├── SlideManager (슬라이드 제어)
│   ├── NavigationController (네비게이션)
│   └── VisualizationRenderer (차트 렌더링)
└── Utility Layer
    ├── CitationManager (인용 관리)
    ├── ThemeManager (테마 일관성)
    └── StateManager (상태 저장)
```

### Component Contracts

#### SlideManager
```javascript
interface SlideManager {
  loadSlide(id: number): Promise<Slide>
  preloadAdjacentSlides(id: number): void
  renderSlide(slide: Slide): void
  handleTransition(from: number, to: number): void
}
```

#### VisualizationRenderer
```javascript
interface VisualizationRenderer {
  renderPlotly(config: PlotlyConfig): void
  renderLeaflet(config: LeafletConfig): void
  renderTimeline(config: TimelineConfig): void
  updateVisualization(id: string, data: any): void
}
```

#### CitationManager
```javascript
interface CitationManager {
  getCitation(slideId: number): Citation[]
  formatCitation(citation: Citation): string
  validatePageNumber(page: string): boolean
  showCitationTooltip(element: HTMLElement): void
}
```

### Data Model

#### Core Entities
```typescript
interface Slide {
  id: number
  sectionId: number
  title: string
  subtitle?: string
  content: SlideContent
  citations: Citation[]
  visualizations: Visualization[]
  notes?: string
  duration?: number // 예상 발표 시간 (초)
}

interface Section {
  id: number
  title: string
  slides: number[] // slide IDs
  order: number
  color?: string // 섹션별 테마 색상
}

interface Citation {
  id: string
  pageNumber: string // e.g., "p.1810", "Table 1, p.1813"
  text: string
  context?: string
  slideId: number
  elementId?: string // 연결된 시각화 요소
}

interface Visualization {
  id: string
  type: 'plotly' | 'leaflet' | 'chart' | 'timeline' | 'd3'
  data: any // 시각화별 데이터
  config: any // 시각화별 설정
  interactive: boolean
  citations?: string[] // Citation IDs
}

interface SlideContent {
  type: 'text' | 'mixed' | 'visualization'
  elements: ContentElement[]
}

interface ContentElement {
  type: 'heading' | 'text' | 'list' | 'image' | 'chart' | 'map' | 'timeline'
  value: any
  style?: any
  animation?: AnimationConfig
}
```

### Integration Points
1. **기존 index.html**: 최소 변경, 프로그레시브 개선
2. **CSS 변수**: 재사용 및 확장
3. **네비게이션**: 기존 구조 유지하며 확장
4. **라이브러리**: CDN 우선, 로컬 폴백

## Phase 2: Task Planning (for /tasks command)
*Output approach: tasks.md will be generated by /tasks command*

### Task Generation Strategy
1. **Infrastructure Tasks** (우선순위 1)
   - 데이터 구조 설정
   - 빌드 시스템 구성
   - 테스트 환경 설정

2. **Core Implementation** (우선순위 2)
   - SlideManager 구현
   - NavigationController 구현
   - CitationManager 구현

3. **Visualization Integration** (우선순위 3)
   - Plotly 통합
   - Leaflet 확장
   - Timeline 구현

4. **Content Creation** (우선순위 4)
   - 60개 슬라이드 콘텐츠
   - PDF 인용 매핑
   - 시각화 데이터 준비

5. **Polish & Testing** (우선순위 5)
   - 성능 최적화
   - 반응형 테스트
   - 접근성 개선

### Estimation Framework
- **Small (S)**: 1-2시간 작업
- **Medium (M)**: 3-4시간 작업
- **Large (L)**: 5-8시간 작업
- **Extra Large (XL)**: 1일 이상 작업

총 예상: 약 40-50시간 (5-7일 풀타임 작업)

## Progress Tracking

### Phase Completion
- [x] **Phase 0**: Research & Analysis ✓
  - [x] Codebase analysis
  - [x] Technology validation
  - [x] Gap identification
  - [x] Risk assessment

- [x] **Phase 1**: Design Specification ✓
  - [x] Architecture design
  - [x] Component contracts
  - [x] Data model
  - [x] Integration plan

- [x] **Phase 2**: Task Planning ✓
  - [x] Task categorization
  - [x] Priority assignment
  - [x] Estimation approach

### Constitution Checks
- [x] Initial Check: PASSED (5/5 principles)
- [x] Post-Design Check: PASSED (no violations)

### Next Steps
1. Run `/tasks` command to generate detailed task list
2. Begin implementation with infrastructure tasks
3. Progressive enhancement approach
4. Regular testing against acceptance criteria

---

**Status**: Plan Complete - Ready for task generation
**Confidence**: High - All requirements understood, no NEEDS CLARIFICATION items
**Risks**: Managed - Performance and compatibility risks identified with mitigation strategies