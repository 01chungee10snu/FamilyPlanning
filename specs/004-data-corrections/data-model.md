# Data Model: Data Corrections for PDF Source Alignment

## Overview
Data structures and entities involved in the presentation correction process.

## Core Entities

### 1. SlideCorrection
Represents a single slide requiring data correction.

**Attributes**:
- `slideNumber`: Integer (3, 4, 5, 6, 10)
- `slideTitle`: String - Title text for identification
- `corrections`: Array of DataCorrection objects
- `sourceReference`: String - PDF table/panel reference
- `validationStatus`: Enum (pending, corrected, validated)

**Validation Rules**:
- slideNumber must be between 1 and 40
- sourceReference must match pattern "Table X" or "Panel X"
- At least one correction required per slide

**State Transitions**:
- pending → corrected (after data update)
- corrected → validated (after verification)

### 2. DataCorrection
Represents a specific data point correction within a slide.

**Attributes**:
- `fieldName`: String - Data field identifier
- `originalValue`: String/Number - Current incorrect value
- `correctedValue`: String/Number - New correct value
- `unit`: String - Measurement unit (optional)
- `year`: String - Time reference (optional)
- `locationType`: Enum (text, chart, map, table)

**Validation Rules**:
- correctedValue must match PDF source exactly
- Numeric values preserve source precision
- Year format: YYYY when specified

### 3. QualitativeInsight
Represents additional contextual information to be added.

**Attributes**:
- `slideNumber`: Integer - Target slide
- `insightText`: String - Text to add
- `category`: Enum (spacing, limitation, wealth, regional)
- `placement`: Enum (bullet, note, subtitle)

**Validation Rules**:
- insightText maximum 200 characters
- Must not alter slide timing
- Category must match content type

### 4. ValidationReport
Represents the validation results for all corrections.

**Attributes**:
- `timestamp`: DateTime - Validation time
- `totalCorrections`: Integer - Number of corrections made
- `validatedCorrections`: Integer - Successfully validated
- `failedValidations`: Array of ValidationError
- `backupFile`: String - Path to backup file

**Validation Rules**:
- All corrections must be validated
- Backup file must exist before corrections
- Zero failed validations for success

### 5. ValidationError
Represents a failed validation case.

**Attributes**:
- `slideNumber`: Integer - Affected slide
- `fieldName`: String - Failed field
- `expectedValue`: Any - PDF source value
- `actualValue`: Any - Current display value
- `errorType`: Enum (mismatch, missing, format)

## Data Relationships

```
SlideCorrection (1) → (*) DataCorrection
SlideCorrection (1) → (*) QualitativeInsight
ValidationReport (1) → (*) ValidationError
ValidationReport (1) → (*) SlideCorrection
```

## Correction Data Structure

```javascript
const corrections = {
  slide3: {
    slideNumber: 3,
    slideTitle: "글로벌 인구 동향과 지역별 현황",
    corrections: [
      {
        fieldName: "asiaPopulation2005",
        originalValue: "multiple sub-regions",
        correctedValue: 3905,
        unit: "million",
        year: "2005",
        locationType: "chart"
      },
      {
        fieldName: "asiaPopulation2050",
        originalValue: "multiple sub-regions",
        correctedValue: 5217,
        unit: "million",
        year: "2050",
        locationType: "chart"
      }
    ],
    sourceReference: "Table 1"
  },
  slide4: {
    slideNumber: 4,
    slideTitle: "사하라 이남 아프리카: 니제르 위기",
    corrections: [
      {
        fieldName: "currentPopulation",
        originalValue: 12.5,
        correctedValue: 14,
        unit: "million",
        year: "2005",
        locationType: "text"
      },
      {
        fieldName: "contraceptiveUse",
        originalValue: 5,
        correctedValue: 4.6,
        unit: "percent",
        year: "1998",
        locationType: "chart"
      },
      {
        fieldName: "projectedPopulation",
        originalValue: "<50",
        correctedValue: 50,
        unit: "million",
        year: "2050",
        locationType: "text"
      }
    ],
    sourceReference: "Table 2"
  },
  slide5: {
    slideNumber: 5,
    slideTitle: "성공 스토리: 케냐와 브라질",
    corrections: [
      {
        fieldName: "brazilTFREnd",
        originalValue: 2.3,
        correctedValue: 2.5,
        unit: "births per woman",
        year: "1996",
        locationType: "chart"
      }
    ],
    sourceReference: "Panel 6"
  },
  slide6: {
    slideNumber: 6,
    slideTitle: "남아시아 대조: 방글라데시 vs 파키스탄",
    corrections: [
      {
        fieldName: "pakistanContraceptive",
        originalValue: 30,
        correctedValue: 12,
        unit: "percent",
        year: "1990",
        locationType: "chart"
      }
    ],
    sourceReference: "Panel 8"
  },
  slide10: {
    slideNumber: 10,
    slideTitle: "미충족 수요: 정의와 지역별 분포",
    corrections: [],
    qualitativeInsights: [
      {
        insightText: "사하라 이남: 출산 간격 조정 수요 > 가족 수 제한 수요",
        category: "spacing",
        placement: "bullet"
      },
      {
        insightText: "아시아/라틴: 최빈곤층 미충족 수요가 최부유층보다 2배 높음",
        category: "wealth",
        placement: "bullet"
      }
    ],
    sourceReference: "main.pdf text"
  }
};
```

## Validation Queries

### Pre-Correction Validation
```javascript
function validateSourceData(correction) {
  // Verify correction value matches PDF source
  return correction.correctedValue === pdfData[correction.sourceReference][correction.fieldName];
}
```

### Post-Correction Validation
```javascript
function validateDisplay(slideNumber, fieldName, expectedValue) {
  const actualValue = extractDisplayValue(slideNumber, fieldName);
  return actualValue === expectedValue;
}
```

### Completeness Check
```javascript
function validateCompleteness(corrections, requirements) {
  const correctedFields = corrections.flatMap(c => c.corrections.map(d => d.fieldName));
  const requiredFields = requirements.map(r => r.fieldName);
  return requiredFields.every(field => correctedFields.includes(field));
}
```

## Data Integrity Rules

1. **Numerical Precision**: Maintain exact precision from PDF source
2. **Unit Consistency**: Preserve units as specified in source
3. **Temporal Accuracy**: Include year references where provided
4. **Citation Integrity**: Every correction must reference source location
5. **Language Consistency**: Korean primary with English where in source
6. **No Interpolation**: Never calculate or estimate values
7. **Preserve Context**: Qualitative insights complement, not replace, data

## Migration Path

1. Create backup of current index.html
2. Parse existing slide data structures
3. Apply corrections to identified fields
4. Add qualitative insights where specified
5. Validate all corrections against source
6. Generate validation report
7. Commit with detailed change log