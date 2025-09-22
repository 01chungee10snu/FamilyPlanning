# Feature Specification: Enhanced Presentation Slides with PDF Citations and Visualizations

**Feature Branch**: `001-slide-enhancement-pdf`
**Created**: 2025-01-22
**Status**: Draft
**Input**: User description: "slide_structure.md 이 내용을 읽고, 기존 pdf 문서의 내용의 전문도 이해하고, index.html 의 내용을 보완하여 슬라이드를 제작할 요건에 대해서 구체화"

## Execution Flow (main)
```
1. Parse slide_structure.md for content hierarchy
   → Extract 9 main sections with subsections
2. Map PDF content to slide structure
   → Identify page numbers for each citation
3. Analyze existing index.html implementation
   → Identify gaps between current slides (16) and required slides (50+)
4. Define visualization requirements per section
   → Maps, charts, timelines, interactive elements
5. Generate comprehensive slide specifications
   → Each slide with exact PDF citations
6. Validate against Constitution principles
   → Academic integrity, visualization-first, design consistency
7. Run Review Checklist
   → Ensure all requirements are testable
8. Return: SUCCESS (spec ready for implementation)
```

---

## ⚡ Quick Guidelines
- ✅ Focus on WHAT users need and WHY
- ❌ Avoid HOW to implement (no tech stack, APIs, code structure)
- 👥 Written for business stakeholders, not developers

---

## User Scenarios & Testing *(mandatory)*

### Primary User Story
발제자는 "Family Planning: The Unfinished Agenda" 논문을 30-40분간 효과적으로 발표하기 위해 시각적으로 풍부하고 학술적으로 정확한 프레젠테이션을 필요로 합니다. 모든 데이터와 인용은 PDF 원문의 정확한 페이지 번호를 포함해야 하며, 복잡한 데이터는 인터랙티브 시각화로 표현되어야 합니다.

### Acceptance Scenarios
1. **Given** 발제자가 프레젠테이션을 시작할 때, **When** 첫 슬라이드를 표시하면, **Then** 논문 제목, 저자, 출처가 명확하게 표시되어야 함
2. **Given** 청중이 통계 데이터를 보고 있을 때, **When** 데이터 포인트를 클릭하면, **Then** PDF 페이지 번호와 원문 인용이 표시되어야 함
3. **Given** 발제자가 지역별 데이터를 설명할 때, **When** 세계 지도를 표시하면, **Then** 인터랙티브 지도에서 국가별 상세 정보를 볼 수 있어야 함
4. **Given** 발제자가 시간순 발전을 설명할 때, **When** 타임라인 슬라이드를 표시하면, **Then** 1960년대부터 2006년까지의 주요 사건이 시각화되어야 함

### Edge Cases
- 프레젠테이션 중 인터넷 연결이 끊어져도 모든 시각화가 작동해야 함
- 모바일 기기에서도 모든 인터랙티브 요소가 터치로 작동해야 함
- 전체화면 모드에서도 네비게이션이 가능해야 함

## Requirements *(mandatory)*

### Functional Requirements

#### 콘텐츠 요구사항
- **FR-001**: 시스템은 최소 50개의 슬라이드를 지원해야 함 (현재 16개 → 50개 이상)
- **FR-002**: 모든 데이터 인용은 PDF 페이지 번호를 포함해야 함 (예: "p.1810", "Table 1, p.1813")
- **FR-003**: slide_structure.md의 9개 주요 섹션이 모두 구현되어야 함
- **FR-004**: 각 Panel (1-8)의 내용이 독립적인 슬라이드로 구현되어야 함
- **FR-005**: Figure 1-6과 Table 1-3의 데이터가 시각화되어야 함

#### 시각화 요구사항
- **FR-006**: 세계 지도 기반 시각화가 최소 3개 구현되어야 함 (출산율, 피임률, 미충족 수요)
- **FR-007**: Plotly.js를 사용한 인터랙티브 차트가 최소 5개 구현되어야 함
- **FR-008**: 타임라인 시각화가 2개 구현되어야 함 (역사적 발전, 인구 증가 추이)
- **FR-009**: 국가별 비교 차트가 구현되어야 함 (니제르, 케냐, 방글라데시, 파키스탄)
- **FR-010**: 모든 차트는 호버/클릭 시 상세 정보를 표시해야 함

#### 네비게이션 요구사항
- **FR-011**: 슬라이드 목차가 50개 이상의 슬라이드를 계층적으로 표시해야 함
- **FR-012**: 섹션 간 빠른 이동이 가능해야 함
- **FR-013**: 현재 위치가 전체 구조에서 표시되어야 함
- **FR-014**: 키보드 단축키가 지원되어야 함 (화살표, 숫자, ESC)

#### 디자인 요구사항
- **FR-015**: 기존 index.html의 색상 체계가 유지되어야 함
- **FR-016**: Pretendard 폰트가 모든 텍스트에 적용되어야 함
- **FR-017**: 다크/라이트 모드 전환이 가능해야 함
- **FR-018**: 애니메이션 전환 효과가 300ms 이내여야 함

### Key Entities *(include if feature involves data)*

- **Slide**: 개별 프레젠테이션 페이지 (id, sectionId, title, content, citations, visualizations)
- **Section**: slide_structure.md의 주요 섹션 (id, title, slides[], order)
- **Citation**: PDF 참조 정보 (pageNumber, text, context, slideId)
- **Visualization**: 시각화 요소 (type, data, config, slideId, interactive)
- **Dataset**: 차트/지도용 데이터 (source, values, metadata, citations)

---

## Detailed Slide Requirements

### 섹션 1: 제목 및 도입부 (3 슬라이드)
1. **제목 슬라이드**: 논문 제목, 저자, Lancet 2006 정보
2. **핵심 메시지 요약**: Panel 1의 8개 주요 메시지 시각화
3. **발표 구조 안내**: 9개 섹션 개요와 예상 시간

### 섹션 2: 초록/요약 (2 슬라이드)
4. **Abstract 주요 내용**: 7개 핵심 문장 시각화
5. **연구의 중요성**: MDGs와의 연관성 다이어그램

### 섹션 3: 서론 및 배경 (8 슬라이드)
6. **가족계획 프로그램의 시작**: 1960년대 아시아/라틴아메리카 비교
7. **역사적 발전 타임라인**: 1960-2006 주요 사건
8. **국제 자금 지원 추이**: $168M (1971) → $512M (1985) 차트
9. **정책 채택 국가 수**: 2개(1960) → 115개(1996) 지도
10. **카이로 회의 (1994)**: 패러다임 전환 설명
11. **의제의 변화**: 인구-경제 → 여성 권한/생식권
12. **MDGs의 문제점**: 가족계획 누락 비판
13. **현재 상황**: 자금 감소 $560M → $460M 차트

### 섹션 4: 인구 증가 및 예측 (7 슬라이드)
14. **Panel 2 개요**: 과거와 미래 인구 증가
15. **인구 증가 3대 요인**: 모멘텀, 출산율, 사망률
16. **Figure 1**: 한국 연령 구조 피라미드 (1975 vs 2005)
17. **Table 1**: 지역별 인구 증가 (1960-2050) 인터랙티브 테이블
18. **아프리카 인구 전망**: 2배 증가 예측 지도
19. **아시아/라틴아메리카**: 안정화 추세 차트
20. **인구 모멘텀 설명**: 연령 구조의 영향

### 섹션 5: 왜 가족계획이 중요한가 (12 슬라이드)
21. **4대 혜택 개요**: 빈곤, 건강, 성평등, 환경
22. **빈곤 감소**: 가구 규모와 빈곤의 관계
23. **Panel 3**: 니제르 사례 - 재앙 예방 가능성
24. **Table 2**: 니제르 주요 지표 대시보드
25. **Panel 4**: 출산율 감소와 경제적 함의
26. **인구 배당 효과**: 동아시아 성공 사례
27. **모성 건강**: 32% 모성 사망 예방 가능
28. **아동 건강**: 10% 아동 사망 예방 가능
29. **성평등**: 여성 교육과 권한 강화
30. **인권**: 생식 자기결정권
31. **환경 지속가능성**: 인구와 자원 소비
32. **MDGs 달성 기여**: 교차적 영향 다이어그램

### 섹션 6: 미완의 과제 (10 슬라이드)
33. **충족되지 않은 수요 정의**: Panel 5 설명
34. **Figure 2**: 소득 5분위별 미충족 수요 차트
35. **미혼 여성의 수요**: 간과된 집단
36. **Figure 3**: 75개국 분류 - 4개 카테고리
37. **출산 간격 문제**: 건강 위험과 해결책
38. **지역별 현황 지도**: 미충족 수요 시각화
39. **Panel 6**: 브라질 - 정부 개입 없는 성공
40. **도시-농촌 격차**: 접근성 문제
41. **품질 문제**: 서비스 개선 필요성
42. **청소년 대상 서비스**: 특별한 도전

### 섹션 7: 무엇이 효과적인가 (10 슬라이드)
43. **효과적 프로그램 원칙**: 5대 핵심 요소
44. **Panel 7**: 케냐 - 위기의 성공 사례
45. **Figure 4**: 케냐 출산율/피임률 추세
46. **Panel 8**: 방글라데시 vs 파키스탄 비교
47. **Figure 5**: 두 국가의 출산율/인구 예측
48. **Table 3**: 피임 방법별 효과성과 사용률
49. **서비스 제공 방식**: 시설/지역사회 기반
50. **Figure 6**: 피임약/콘돔 공급원 분석
51. **민간 부문 역할**: 사회적 마케팅
52. **통합 서비스**: HIV/AIDS와 가족계획

### 섹션 8: 재정 및 비용 (3 슬라이드)
53. **자금 조달 현황**: 국제/국내 비교
54. **비용 효과성**: 투자 대비 수익
55. **지속가능한 재정**: 국가별 전략

### 섹션 9: 무엇을 해야 하는가 (5 슬라이드)
56. **의제 재활성화**: 긴급 행동 필요성
57. **리더십 요구**: 유럽의 역할
58. **HIV/AIDS vs 인구 증가**: 우선순위 재고
59. **정책 권고사항**: 구체적 행동 계획
60. **결론**: 미완의 과제 완수를 위한 호소

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
- [x] Key concepts extracted (slides, PDF citations, visualizations)
- [x] Ambiguities marked (none found)
- [x] User scenarios defined
- [x] Requirements generated (18 functional requirements)
- [x] Entities identified (5 key entities)
- [x] Review checklist passed

---