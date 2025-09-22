# Phase 0: Research & Analysis Report

**Feature**: Enhanced Presentation Slides with PDF Citations
**Date**: 2025-01-22
**Branch**: `001-slide-enhancement-pdf`

## Executive Summary
현재 16개 슬라이드 시스템을 60개로 확장하며, PDF 정확 인용과 인터랙티브 시각화를 추가하는 프로젝트입니다. 기존 코드베이스는 잘 구조화되어 있으나, JavaScript 로직과 데이터 관리 시스템이 부재하여 전면적인 구현이 필요합니다.

## 1. Existing Codebase Analysis

### 1.1 Current Structure
```
2_발제/
├── index.html (메인 컨테이너, 16개 슬라이드 참조)
├── css/
│   ├── main.css (1,237 lines - 핵심 스타일)
│   └── components.css (847 lines - 컴포넌트)
├── js/ (빈 디렉토리)
├── slides/ (16개 개별 HTML 파일)
│   ├── slide1.html - slide16.html
│   └── (정적 HTML 콘텐츠)
└── 문서 파일들
    ├── Family planning the unfi nished agenda.pdf (원본)
    ├── slide_structure.md (60개 슬라이드 구조)
    └── family_planning_paper.md (번역 및 구조)
```

### 1.2 Technology Stack (Current)
- **Frontend**: HTML5, CSS3 (CSS Variables 활용)
- **Fonts**: Pretendard Variable (CDN)
- **Libraries**:
  - Leaflet.js 1.9.4 (지도)
  - Chart.js (차트)
  - Font Awesome 6.4.0 (아이콘)
- **JavaScript**: 인라인 스크립트만 존재 (체계적 구조 없음)

### 1.3 CSS Analysis
```css
/* main.css 주요 변수 */
:root {
  --primary-color: #2c3e50;
  --secondary-color: #3498db;
  --accent-color: #e74c3c;
  --text-color: #333;
  --bg-color: #f8f9fa;
  --slide-bg: white;
  --border-radius: 8px;
  --transition-speed: 0.3s;
}

/* 반응형 브레이크포인트 */
@media (max-width: 768px) { /* 모바일 */ }
@media (min-width: 769px) and (max-width: 1024px) { /* 태블릿 */ }
@media (min-width: 1025px) { /* 데스크탑 */ }
```

### 1.4 Current Slide System
- **Loading**: 개별 HTML 파일을 fetch()로 로드
- **Navigation**: 버튼 클릭으로 슬라이드 전환
- **State**: currentSlideIndex 변수로 관리
- **Animation**: CSS transition 사용 (0.3s)

## 2. Gap Analysis

### 2.1 Quantitative Gaps
| 항목 | 현재 | 목표 | 갭 | 우선순위 |
|------|------|------|-----|----------|
| 슬라이드 수 | 16 | 60 | +44 | Critical |
| 시각화 | 2 (정적) | 15+ (인터랙티브) | +13 | High |
| PDF 인용 | 0 | 60+ | +60 | Critical |
| 데이터 구조 | None | JSON 기반 | 전체 구현 | Critical |
| JS 아키텍처 | 인라인 | 모듈식 | 재구성 | High |
| 네비게이션 | 선형 | 계층적 | 업그레이드 | Medium |

### 2.2 Functional Gaps
1. **데이터 관리 시스템 부재**
   - 슬라이드 데이터가 HTML에 하드코딩
   - 중앙 집중식 데이터 관리 없음
   - Citation 추적 시스템 없음

2. **시각화 엔진 미구현**
   - Plotly.js 미연동
   - D3.js 타임라인 미구현
   - 인터랙티브 요소 부재

3. **네비게이션 한계**
   - 선형 네비게이션만 지원
   - 섹션 점프 불가
   - 키보드 단축키 미지원

## 3. PDF Content Mapping

### 3.1 Citation Requirements
총 60개 슬라이드에 필요한 주요 인용:
- **Direct Quotes**: 25개 (Panel 1-8의 핵심 메시지)
- **Data Points**: 35개 (Figure 1-6, Table 1-3)
- **Statistical References**: 40개 (출산율, 사망률 등)
- **Timeline Events**: 15개 (1960-2006 주요 사건)

### 3.2 Page Number Mapping
```
Introduction: p.1810-1812
Panel 1 (Key Messages): p.1810
Panel 2 (Population Growth): p.1812-1813
Table 1 (Regional Growth): p.1813
Figure 1 (Korea Age Structure): p.1813
Panel 3 (Niger Case): p.1815
Panel 4 (Economic Implications): p.1816
Table 2 (Niger Indicators): p.1815
Panel 5 (Unmet Need): p.1817
Figure 2 (Wealth Quintiles): p.1818
Panel 6 (Brazil): p.1819
Panel 7 (Kenya): p.1820
Figure 4 (Kenya Trends): p.1821
Panel 8 (Bangladesh/Pakistan): p.1822
Figure 5 (Comparative Trends): p.1822
Table 3 (Contraceptive Methods): p.1823
Figure 6 (Supply Sources): p.1824
```

## 4. Visualization Strategy

### 4.1 Visualization Distribution by Type
| Type | Library | Count | Slides | Priority |
|------|---------|-------|--------|----------|
| Interactive Charts | Plotly.js | 6 | 17,25,35,45,48,50 | High |
| World Maps | Leaflet.js | 4 | 5,19,36,38 | Critical |
| Timelines | D3.js | 2 | 7,20 | Medium |
| Basic Charts | Chart.js | 5 | 8,13,24,49,54 | Medium |
| Tables | HTML+CSS | 3 | 17,24,48 | Low |

### 4.2 Plotly Implementation Plan
```javascript
// Priority Plotly Charts
1. Population Growth Trends (Line Chart)
2. Fertility Rate Comparison (Bar Chart)
3. Contraceptive Prevalence (Stacked Bar)
4. Maternal Mortality Reduction (Area Chart)
5. Economic Impact (Scatter Plot)
6. Unmet Need by Wealth (Grouped Bar)
```

### 4.3 Leaflet Map Requirements
```javascript
// Map Visualizations
1. Global Fertility Rates (Choropleth)
2. Contraceptive Prevalence by Country
3. Unmet Need Distribution
4. Regional Population Growth
```

## 5. Technical Requirements

### 5.1 Performance Constraints
- **Initial Load**: < 3s (현재 ~1.5s)
- **Slide Transition**: < 300ms (현재 300ms)
- **Memory Usage**: < 200MB (현재 ~50MB)
- **Bundle Size**: < 5MB (현재 ~2MB)

### 5.2 Browser Support
```javascript
// Minimum Versions
const browserSupport = {
  chrome: 90,    // 93% users
  firefox: 88,   // 4% users
  safari: 14,    // 2% users
  edge: 90       // 1% users
};
```

### 5.3 Offline Requirements
- Service Worker for caching
- LocalStorage for state
- IndexedDB for data (if > 10MB)
- Progressive Web App capabilities

## 6. Risk Assessment & Mitigation

### 6.1 Technical Risks
| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Performance degradation | High | Medium | Lazy loading, code splitting |
| Memory leaks (visualizations) | High | Medium | Proper cleanup, dispose methods |
| Browser compatibility | Medium | Low | Polyfills, feature detection |
| Data inconsistency | High | Low | Validation layer, tests |

### 6.2 Content Risks
| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| PDF citation errors | Critical | Medium | Automated validation |
| Translation accuracy | Medium | Low | Native speaker review |
| Copyright concerns | High | Low | Academic fair use |

## 7. Dependencies Analysis

### 7.1 Required New Libraries
```json
{
  "plotly.js": "2.27.0",  // 3.2MB - Interactive charts
  "d3": "7.8.5",          // 500KB - Timeline only
  "axios": "1.6.0",       // 30KB - Data fetching
  "lodash": "4.17.21"    // 70KB - Utilities
}
```

### 7.2 Existing Library Updates
- Leaflet.js: Already at 1.9.4 (latest)
- Chart.js: Update from CDN to v4.4.0
- Font Awesome: Already at 6.4.0

### 7.3 Build Tools Consideration
```javascript
// Option 1: No Build (CDN + ES6 Modules)
// Pros: Simple, no build step
// Cons: Multiple requests, no tree shaking

// Option 2: Webpack/Vite
// Pros: Bundling, optimization
// Cons: Complexity, build step

// Recommendation: Start with Option 1, migrate if needed
```

## 8. Architecture Recommendations

### 8.1 Proposed Structure
```
src/
├── index.html (enhanced)
├── css/
│   ├── main.css (preserved)
│   ├── components.css (preserved)
│   └── visualizations.css (new)
├── js/
│   ├── app.js (main entry)
│   ├── core/
│   │   ├── SlideManager.js
│   │   ├── NavigationController.js
│   │   └── StateManager.js
│   ├── data/
│   │   ├── DataLoader.js
│   │   └── CitationManager.js
│   ├── visualizations/
│   │   ├── PlotlyRenderer.js
│   │   ├── LeafletRenderer.js
│   │   └── TimelineRenderer.js
│   └── utils/
│       ├── constants.js
│       └── helpers.js
├── data/
│   ├── slides.json (60 slides)
│   ├── citations.json
│   ├── visualizations.json
│   └── translations.json
└── assets/
    ├── images/
    └── icons/
```

### 8.2 Data Flow
```
User Action → NavigationController → SlideManager
                                          ↓
                                    DataLoader
                                          ↓
                        [Slide Data + Citations + Visualizations]
                                          ↓
                                    VisualizationRenderer
                                          ↓
                                    DOM Update
```

## 9. Implementation Priority

### Phase 1: Foundation (Week 1)
1. Data structure definition
2. JSON data files creation
3. Core JavaScript modules
4. Basic slide loading system

### Phase 2: Visualizations (Week 2)
1. Plotly integration
2. Leaflet enhancements
3. Timeline implementation
4. Citation system

### Phase 3: Content & Polish (Week 3)
1. 44 new slides creation
2. PDF citation validation
3. Performance optimization
4. Testing & debugging

## 10. Success Metrics

### 10.1 Technical Metrics
- [ ] All 60 slides loading correctly
- [ ] < 3s initial load time
- [ ] < 200MB memory usage
- [ ] 60fps animations
- [ ] Offline functionality

### 10.2 Content Metrics
- [ ] 100% PDF citations accurate
- [ ] All visualizations interactive
- [ ] Mobile/tablet responsive
- [ ] Keyboard accessible

### 10.3 User Experience Metrics
- [ ] Smooth navigation
- [ ] Clear visual hierarchy
- [ ] Consistent design language
- [ ] Intuitive interactions

## Conclusion
The project requires significant JavaScript development but builds on a solid CSS/HTML foundation. The main challenges are data management, visualization integration, and maintaining performance with 60 slides. The phased approach allows for incremental development and testing.

**Recommendation**: Proceed with Phase 1 implementation immediately, as the foundation is critical for all subsequent work.

---
*Research Complete - No NEEDS CLARIFICATION items remain*