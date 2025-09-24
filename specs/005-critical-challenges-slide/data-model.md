# Data Model: Critical Challenges Slide

## Core Entities

### ChallengesSlideData
Primary data structure for the critical challenges slide content.

```javascript
{
  slideNumber: 6,  // After merged slide 5
  title: "위기의 가족계획: 국제적 외면과 자원 부족",
  subtitle: "The Unfinished Agenda: Crisis in Support",
  panels: [FundingPanel, AfricaPanel, ResourcePanel],
  timeline: TimelineData,
  sources: ["Cleland et al., 2006", "MDG Reports 2000-2010"]
}
```

### FundingPanel
International priority decline panel data.

```javascript
{
  id: "funding-decline",
  icon: "📉",
  title: "국제 우선순위 하락",
  keyMetric: {
    value: "50%",
    label: "자금 감소 (1995-2003)",
    highlight: true
  },
  bulletPoints: [
    "MDG에서 가족계획 제외",
    "미국 리더십 공백",
    "새로운 후원자 필요 (유럽, 게이츠 재단)"
  ],
  visualization: {
    type: "line-chart",
    data: FundingTimelineData
  }
}
```

### AfricaPanel
Africa crisis panel data.

```javascript
{
  id: "africa-crisis",
  icon: "🌍",
  title: "아프리카 위기",
  keyMetric: {
    value: "3배",
    label: "니제르 인구 증가 예상 (2050)",
    highlight: true
  },
  bulletPoints: [
    "HIV/AIDS보다 큰 MDG 달성 위협",
    "사하라 이남 9개국 미충족 수요 >30%",
    "재앙적 인구 증가 예상"
  ],
  visualization: {
    type: "heat-map",
    data: AfricaCrisisData
  }
}
```

### ResourcePanel
Resource gap panel data.

```javascript
{
  id: "resource-gap",
  icon: "💰",
  title: "자원 격차",
  keyMetric: {
    value: "$2.3B",
    label: "연간 자금 부족",
    highlight: true
  },
  bulletPoints: [
    "정치적 의지 약화",
    "미완의 의제 (Unfinished Agenda)",
    "긴급 행동 필요"
  ],
  visualization: {
    type: "bar-chart",
    data: ResourceGapData
  }
}
```

## Supporting Data Structures

### FundingTimelineData
Timeline data for funding decline visualization.

```javascript
{
  labels: ['1994', '1995', '2000', '2003', '2010', '2020'],
  datasets: [{
    label: '국제 자금 지원 (기준년 대비 %)',
    data: [100, 95, 70, 60, 55, 50],
    trend: 'declining'
  }]
}
```

### AfricaCrisisData
Geographic data for Africa crisis heat map.

```javascript
{
  type: "FeatureCollection",
  features: [
    {
      country: "Niger",
      coordinates: [13.5, 2.1],
      severity: 100,
      unmetNeed: 35,
      populationGrowth: 3.8
    },
    {
      country: "Chad",
      coordinates: [15.0, 19.0],
      severity: 85,
      unmetNeed: 32,
      populationGrowth: 3.2
    }
    // ... 7 more countries
  ]
}
```

### ResourceGapData
Comparative data for resource gap visualization.

```javascript
{
  categories: ['필요 자원', '현재 자원'],
  values: [
    {
      year: 2020,
      needed: 5.2,  // billion USD
      available: 2.9,
      gap: 2.3
    }
  ]
}
```

## Validation Rules

### Content Validation
- All text must fit within panel boundaries
- Statistics must have source attribution
- Icons must be Unicode-compatible
- Bullet points limited to 3 per panel

### Data Validation
- Timeline years must be chronological
- Percentages must be 0-100
- Coordinates must be valid lat/lng
- Currency values must be positive

### Visual Validation
- Colors must meet contrast ratio (4.5:1)
- Font sizes must be ≥18px
- Panel heights must be equal
- Charts must have labels

## State Management

### Slide States
```javascript
{
  initialized: false,
  visible: false,
  chartsRendered: false,
  animationComplete: false
}
```

### Chart Instances
```javascript
{
  fundingChart: null,  // Chart.js instance
  resourceChart: null, // Chart.js instance
  africaMap: null     // Leaflet instance
}
```

## Event Handlers

### Slide Entry
```javascript
onSlideEnter() {
  // Initialize visualizations
  // Start animations
  // Track timing
}
```

### Slide Exit
```javascript
onSlideExit() {
  // Pause animations
  // Clean up resources
  // Save state
}
```

## Integration Points

### With Existing Data
- Reuse `countryData` for Africa coordinates
- Extend `charts` object for new visualizations
- Inherit base slide CSS classes
- Use existing color variables

### With Navigation
- Update slide count to 14 total
- Insert after slide 5 in sequence
- Maintain keyboard navigation
- Update progress indicator

---
*Data model defined: Ready for contract generation*