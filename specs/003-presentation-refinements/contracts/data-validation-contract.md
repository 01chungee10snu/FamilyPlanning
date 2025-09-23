# Data Validation Contract

## Contract: Data Validation and Correction
**Version**: 1.0.0
**Component**: Data Integrity Management

### Interface
```javascript
interface DataValidationContract {
  // Validate data against source
  validateDataPoint(
    value: any,
    source: string,
    tolerance?: number
  ): ValidationResult;

  // Correct data value
  correctDataValue(
    slideId: number,
    elementId: string,
    newValue: any,
    source: string
  ): void;

  // Remove unverified element
  removeUnverifiedElement(
    slideId: number,
    elementId: string
  ): void;

  // Batch validation
  validateSlideData(
    slideId: number
  ): ValidationReport;
}
```

### Requirements
- **FR-006**: Regional growth table must contain complete PDF data
- **FR-007**: Niger TFR must display as 7.5 (1998)
- **FR-011**: Use verified figures only
- **FR-014**: Remove unverifiable data

### Type Definitions
```typescript
interface ValidationResult {
  isValid: boolean;
  source: string;
  originalValue: any;
  correctedValue?: any;
  action: "keep" | "correct" | "remove";
}

interface ValidationReport {
  slideId: number;
  totalElements: number;
  validatedElements: number;
  corrections: DataCorrection[];
  removals: string[];
}

interface DataCorrection {
  elementId: string;
  field: string;
  oldValue: any;
  newValue: any;
  source: string;
}
```

### Validation Rules

#### Numerical Data
```javascript
const NumericalValidation = {
  TFR: {
    min: 1.0,
    max: 10.0,
    decimals: 1,
    format: "X.X"
  },
  Percentage: {
    min: 0,
    max: 100,
    decimals: 0,
    format: "XX%"
  },
  Year: {
    min: 1950,
    max: 2100,
    decimals: 0,
    format: "YYYY"
  },
  Population: {
    min: 0,
    max: 10000000000,
    format: "X.XM" | "X.XB"
  }
};
```

### Specific Corrections

#### Slide 4 - Niger Data
```javascript
const slide4Corrections = {
  TFR: {
    oldValue: null,
    newValue: 7.5,
    year: 1998,
    source: "PDF Page X, Table Y"
  },
  PopulationProjections: {
    withDecline: 50000000,
    currentTrend: 82000000,
    year: 2050,
    source: "PDF Page X, Figure Z"
  },
  UnmetNeed: {
    percentage: 17,
    noFutureIntent: 56,
    source: "PDF Page X"
  }
};
```

#### Slide 5 - Kenya Data
```javascript
const slide5Corrections = {
  TFR: {
    initial: {
      oldValue: 7.8,
      newValue: 8.0,
      source: "PDF Page X"
    }
  },
  ContraceptiveUse: {
    initial: 7,
    final: {
      oldValue: 41,
      newValue: 27,
      source: "PDF Page X"
    }
  }
};
```

#### Slide 8 - Health Data
```javascript
const slide8Corrections = {
  InfantMortality: {
    oldValue: "20%",
    newValue: "nearly 10%",
    annualDeaths: 1000000,
    source: "PDF Page X"
  },
  CancerReduction: {
    action: "remove",
    reason: "No source in PDF"
  }
};
```

### Test Cases

#### Test 1: Validate Correct Data
**Given**: TFR value = 7.5, Source confirms 7.5
**When**: validateDataPoint(7.5, "PDF Page X")
**Then**: { isValid: true, action: "keep" }

#### Test 2: Correct Invalid Data
**Given**: Kenya TFR = 7.8, Source shows 8.0
**When**: correctDataValue(5, "tfr-initial", 8.0, "PDF")
**Then**: Value updated to 8.0

#### Test 3: Remove Unverified Data
**Given**: Cancer reduction claim, No source found
**When**: removeUnverifiedElement(8, "cancer-stat")
**Then**: Element removed from DOM

#### Test 4: Batch Validation
**Given**: Slide 5 with multiple data points
**When**: validateSlideData(5)
**Then**: Report shows 2 corrections, 0 removals

### Implementation Pattern
```javascript
class DataValidator {
  constructor(sourceDocument) {
    this.source = sourceDocument;
    this.corrections = [];
  }

  validateSlide(slideNumber) {
    const slide = document.querySelector(`#slide-${slideNumber}`);
    const dataElements = slide.querySelectorAll('[data-value]');

    const report = {
      slideId: slideNumber,
      totalElements: dataElements.length,
      validatedElements: 0,
      corrections: [],
      removals: []
    };

    dataElements.forEach(element => {
      const value = element.getAttribute('data-value');
      const sourceRef = element.getAttribute('data-source');

      const validation = this.validateDataPoint(value, sourceRef);

      if (validation.action === 'correct') {
        this.correctDataValue(
          slideNumber,
          element.id,
          validation.correctedValue,
          sourceRef
        );
        report.corrections.push({
          elementId: element.id,
          oldValue: value,
          newValue: validation.correctedValue
        });
      } else if (validation.action === 'remove') {
        this.removeUnverifiedElement(slideNumber, element.id);
        report.removals.push(element.id);
      } else {
        report.validatedElements++;
      }
    });

    return report;
  }
}
```

### DOM Structure
```html
<!-- Data element with source reference -->
<div class="data-point"
     id="niger-tfr"
     data-value="7.5"
     data-source="PDF-Table-2">
  <span class="value">7.5</span>
  <span class="year">(1998)</span>
  <span class="citation">(Cleland et al., 2006)</span>
</div>

<!-- Element marked for removal -->
<div class="data-point unverified"
     id="cancer-stat"
     data-remove="true">
  <!-- This element will be removed -->
</div>
```

### Validation Workflow
1. Load PDF reference data
2. Iterate through each slide
3. For each data element:
   - Check against source
   - Apply correction if needed
   - Remove if unverifiable
4. Generate validation report
5. Update presentation state

### Error Handling
- Missing source: Remove element
- Invalid format: Correct to standard
- Out of range: Flag for review
- Parsing error: Log and skip