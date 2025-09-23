# Data Model: Integrated 20-Minute Presentation

**Feature**: 002-integrated-presentation
**Date**: 2025-09-23
**Purpose**: Define data structures and relationships for presentation system

## Core Entities

### 1. Presentation
**Description**: Root container for entire presentation
```javascript
{
  id: "family-planning-2025",
  title: "Family Planning: The Unfinished Agenda",
  titleKo: "가족계획: 미완의 과제",
  version: "1.0.0",
  duration: 1200, // seconds (20 minutes)
  aspectRatio: "16:9",
  created: "2025-09-23",
  slides: [Slide],
  panels: [Panel],
  metadata: Metadata,
  settings: Settings
}
```

**Validation Rules**:
- Duration MUST equal sum of all slide durations ±5 seconds
- Aspect ratio MUST be exactly "16:9"
- Must contain between 35-40 slides

### 2. Slide
**Description**: Individual presentation screen
```javascript
{
  id: "slide-001",
  order: 1,
  section: "introduction", // intro|benefits|unmet|solutions|costs
  title: "Family Planning: The Unfinished Agenda",
  titleKo: "가족계획: 미완의 과제",
  duration: 30, // seconds
  content: Content,
  visualizations: [Visualization],
  panelRef: "panel-1", // optional reference to panel
  transitions: {
    entry: "fade",
    exit: "slide"
  },
  notes: "Speaker notes for this slide"
}
```

**Validation Rules**:
- Duration between 20-45 seconds
- Order must be sequential without gaps
- Section must be valid enum value

### 3. Content
**Description**: Slide content structure
```javascript
{
  type: "standard", // standard|title|data|map|timeline
  heading: {
    primary: "Main heading",
    primaryKo: "주제목",
    secondary: "Subheading", // optional
    secondaryKo: "부제목"
  },
  body: {
    paragraphs: [
      {
        text: "Paragraph text",
        textKo: "단락 텍스트",
        emphasis: "normal" // normal|strong|highlight
      }
    ],
    bulletPoints: [
      {
        text: "Bullet point",
        textKo: "불릿 포인트",
        level: 1 // 1-3 for nesting
      }
    ]
  },
  citations: [
    {
      text: "Cleland et al., 2006",
      page: 1810
    }
  ]
}
```

### 4. Visualization
**Description**: Data visualization configuration
```javascript
{
  id: "viz-001",
  type: "chart", // chart|map|timeline|composite
  title: "Total Fertility Rate Trends",
  titleKo: "합계출산율 추이",
  config: ChartConfig | MapConfig | TimelineConfig,
  data: DataSet,
  interactions: {
    hover: true,
    click: true,
    zoom: false
  },
  accessibility: {
    description: "Chart showing fertility rate decline",
    descriptionKo: "출산율 감소를 보여주는 차트"
  }
}
```

### 5. ChartConfig
**Description**: Chart.js configuration
```javascript
{
  chartType: "line", // line|bar|pie|scatter|doughnut
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          font: { size: 14 }
        }
      },
      tooltip: {
        callbacks: {
          // Custom tooltip formatters
        }
      }
    },
    scales: {
      x: { title: { text: "Year" } },
      y: { title: { text: "TFR" } }
    }
  },
  colors: ["#2D5F5F", "#8B7355", "#D4AF37", "#4D8F8F"]
}
```

### 6. MapConfig
**Description**: Leaflet map configuration
```javascript
{
  center: [0, 0], // [lat, lng]
  zoom: 2,
  style: "choropleth", // choropleth|points|heatmap
  layers: [
    {
      type: "geojson",
      data: GeoJSONData,
      style: {
        fillColor: "${value}",
        weight: 1,
        opacity: 1,
        color: "white",
        fillOpacity: 0.7
      }
    }
  ],
  legend: {
    position: "bottomright",
    title: "Fertility Rate",
    scale: [
      { value: ">6", color: "#800026" },
      { value: "4-6", color: "#FC4E2A" },
      { value: "2-4", color: "#FEB24C" },
      { value: "<2", color: "#FFEDA0" }
    ]
  },
  timeControl: TimeControl // optional
}
```

### 7. TimelineConfig
**Description**: Timeline visualization configuration
```javascript
{
  startDate: "1960-01-01",
  endDate: "2050-12-31",
  events: [
    {
      date: "1994-09-13",
      title: "Cairo Conference",
      titleKo: "카이로 회의",
      description: "ICPD conference held",
      type: "milestone" // milestone|period|point
    }
  ],
  periods: [
    {
      start: "1960-01-01",
      end: "1980-12-31",
      label: "Early Programs",
      labelKo: "초기 프로그램",
      color: "#2D5F5F"
    }
  ],
  axis: {
    format: "YYYY",
    intervals: "decade"
  }
}
```

### 8. DataSet
**Description**: Structured data for visualizations
```javascript
{
  labels: ["1960", "1980", "2000", "2020"],
  labelsKo: ["1960년", "1980년", "2000년", "2020년"],
  datasets: [
    {
      label: "Sub-Saharan Africa",
      labelKo: "사하라 이남 아프리카",
      data: [6.7, 6.8, 5.5, 4.6],
      borderColor: "#2D5F5F",
      backgroundColor: "rgba(45, 95, 95, 0.2)"
    }
  ],
  source: {
    reference: "Table 1",
    page: 1813
  }
}
```

### 9. Panel
**Description**: Special content sections from original paper
```javascript
{
  id: "panel-1",
  number: 1,
  title: "Key Messages",
  titleKo: "주요 메시지",
  content: {
    points: [
      {
        text: "Family planning is critical for MDGs",
        textKo: "가족계획은 MDGs 달성에 필수적"
      }
    ]
  },
  placement: {
    afterSlide: 3, // or section placement
    duration: 45
  },
  sourcePage: 1810
}
```

### 10. CountryData
**Description**: Geographic-specific information
```javascript
{
  iso3: "KEN",
  name: "Kenya",
  nameKo: "케냐",
  coordinates: [-1.286389, 36.817223],
  data: {
    tfr: {
      1980: 7.8,
      1990: 6.5,
      2000: 5.0,
      2010: 4.6,
      2020: 3.4
    },
    contraceptiveUse: {
      1980: 10,
      1990: 27,
      2000: 39,
      2010: 46,
      2020: 61
    },
    population: {
      1980: 16.3,
      2020: 53.8,
      2050: 95.5 // projection
    }
  }
}
```

### 11. TimeSeriesData
**Description**: Data with temporal dimension
```javascript
{
  id: "ts-fertility-global",
  metric: "Total Fertility Rate",
  metricKo: "합계출산율",
  unit: "births per woman",
  timePoints: [
    {
      date: "1960-01-01",
      regions: {
        "world": 5.0,
        "developed": 2.8,
        "developing": 6.0,
        "subsaharan": 6.7
      }
    }
  ],
  projections: [
    {
      date: "2050-01-01",
      scenario: "medium",
      values: { /* ... */ }
    }
  ]
}
```

### 12. NavigationState
**Description**: Current presentation state
```javascript
{
  currentSlide: 5,
  elapsedTime: 150, // seconds
  remainingTime: 1050,
  isPaused: false,
  isAutoAdvance: true,
  playbackSpeed: 1.0,
  sectionProgress: {
    introduction: "completed",
    benefits: "in-progress",
    unmet: "pending",
    solutions: "pending",
    costs: "pending"
  },
  history: [1, 2, 3, 4, 5], // slide navigation history
  bookmarks: [10, 25, 38] // bookmarked slides
}
```

### 13. Settings
**Description**: Presentation configuration
```javascript
{
  language: "ko", // ko|en|bilingual
  theme: "professional", // professional|academic|modern
  animations: true,
  soundEffects: false,
  autoAdvance: {
    enabled: true,
    defaultDuration: 30
  },
  display: {
    showTimer: true,
    showProgress: true,
    showSlideNumber: true,
    showSectionIndicator: true
  },
  accessibility: {
    highContrast: false,
    largeText: false,
    reduceMotion: false,
    screenReaderMode: false
  }
}
```

### 14. Metadata
**Description**: Presentation metadata
```javascript
{
  source: {
    paper: "Family planning: the unfinished agenda",
    authors: ["Cleland J", "Bernstein S", "Ezeh A", "Faundes A", "Glasier A", "Innis J"],
    journal: "The Lancet",
    year: 2006,
    volume: 368,
    issue: 9549,
    pages: "1810-1827"
  },
  created: {
    date: "2025-09-23",
    author: "System Generated",
    version: "1.0.0"
  },
  statistics: {
    totalSlides: 38,
    totalVisualizations: 45,
    totalDataPoints: 523,
    estimatedDuration: 1200
  }
}
```

## Relationships

### Entity Relationship Diagram
```
Presentation (1) ---> (*) Slide
Presentation (1) ---> (8) Panel
Slide (*) ---> (*) Visualization
Slide (1) ---> (1) Content
Visualization (1) ---> (1) DataSet
Visualization (1) ---> (1) Config (Chart|Map|Timeline)
DataSet (*) ---> (*) CountryData
DataSet (*) ---> (*) TimeSeriesData
Presentation (1) ---> (1) NavigationState
Presentation (1) ---> (1) Settings
Presentation (1) ---> (1) Metadata
Panel (*) ---> (1) Slide (placement reference)
```

## State Transitions

### Slide Navigation States
```
IDLE --> TRANSITIONING_OUT --> LOADING_NEXT --> TRANSITIONING_IN --> DISPLAYING --> IDLE
                |                                         ^
                +------------ PAUSED ---------------------+
```

### Auto-Advance States
```
DISABLED --> ENABLED --> RUNNING --> PAUSED --> RUNNING
                ^                        |
                +------------------------+
```

## Validation Rules Summary

1. **Data Accuracy**: All numerical values must match PDF source exactly
2. **Timing Constraint**: Total duration must be 1200 seconds ±60 seconds
3. **Slide Count**: Between 35-40 slides required
4. **Panel Inclusion**: All 8 panels must be present
5. **Language Consistency**: Korean labels required for all user-facing text
6. **Aspect Ratio**: Strict 16:9 enforcement
7. **Visualization Requirements**: All numeric data must have visualization
8. **Geographic Data**: Country data must include valid coordinates
9. **Time Series**: Must include both historical and projection data where available
10. **Accessibility**: All visualizations must have text descriptions

## Data Loading Strategy

### Inline Data Structure
```javascript
// All data embedded in single HTML file as JavaScript objects
window.PresentationData = {
  slides: [ /* ... */ ],
  panels: [ /* ... */ ],
  visualizations: [ /* ... */ ],
  datasets: {
    charts: { /* ... */ },
    maps: { /* ... */ },
    timelines: { /* ... */ }
  },
  countries: { /* ... */ },
  timeseries: { /* ... */ }
};
```

This data model ensures all constitutional requirements are met while providing a flexible structure for the single-file presentation implementation.