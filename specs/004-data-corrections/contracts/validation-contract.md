# Validation Contract

## Contract: Validate Data Corrections

### Purpose
Defines the interface for validating that data corrections match PDF source and display correctly.

### Input Schema
```javascript
{
  "validationType": {
    "type": "string",
    "required": true,
    "enum": ["pre-correction", "post-correction", "visual", "complete"]
  },
  "targetSlides": {
    "type": "array",
    "required": true,
    "items": {
      "type": "integer",
      "min": 1,
      "max": 40
    },
    "description": "Slide numbers to validate"
  },
  "expectedValues": {
    "type": "object",
    "required": true,
    "properties": {
      "[slideNumber]": {
        "type": "object",
        "properties": {
          "[fieldName]": {
            "value": ["string", "number"],
            "unit": "string",
            "source": "string"
          }
        }
      }
    }
  },
  "options": {
    "type": "object",
    "required": false,
    "properties": {
      "screenshot": {
        "type": "boolean",
        "default": false
      },
      "generateReport": {
        "type": "boolean",
        "default": true
      },
      "strictMode": {
        "type": "boolean",
        "default": true,
        "description": "Fail on any mismatch"
      }
    }
  }
}
```

### Output Schema
```javascript
{
  "validationPassed": {
    "type": "boolean",
    "required": true
  },
  "timestamp": {
    "type": "string",
    "required": true,
    "format": "ISO 8601"
  },
  "totalChecks": {
    "type": "integer",
    "required": true,
    "min": 0
  },
  "passedChecks": {
    "type": "integer",
    "required": true,
    "min": 0
  },
  "failedChecks": {
    "type": "integer",
    "required": true,
    "min": 0
  },
  "details": {
    "type": "array",
    "required": true,
    "items": {
      "slideNumber": "integer",
      "fieldName": "string",
      "status": {
        "type": "string",
        "enum": ["passed", "failed", "skipped"]
      },
      "expectedValue": ["string", "number"],
      "actualValue": ["string", "number", "null"],
      "message": "string"
    }
  },
  "screenshots": {
    "type": "array",
    "required": false,
    "items": {
      "slideNumber": "integer",
      "dataUrl": "string"
    }
  },
  "report": {
    "type": "object",
    "required": false,
    "properties": {
      "summary": "string",
      "recommendations": "array"
    }
  }
}
```

### Pre-conditions
1. Presentation loaded in browser
2. All slides rendered and accessible
3. Expected values defined from PDF source
4. DOM fully loaded and stable

### Post-conditions
1. Validation report generated
2. No modifications to presentation
3. Screenshots saved if requested
4. Detailed results available for review

### Invariants
1. Read-only operation (no modifications)
2. All checks executed even if early failures
3. Results reproducible with same input

### Validation Rules

#### Numerical Validation
- Exact match for integers
- Within 0.1 tolerance for decimals
- Percentage values compared as decimals

#### Text Validation
- Case-insensitive comparison
- Whitespace normalized
- Unicode normalization applied

#### Visual Validation
- Element visible in viewport
- Text readable (contrast ratio)
- Chart/map rendered correctly

### Error Conditions
- `SLIDE_NOT_LOADED`: Slide not rendered
- `ELEMENT_NOT_FOUND`: Target element missing
- `PARSE_ERROR`: Unable to extract value
- `TIMEOUT`: Validation exceeded time limit
- `BROWSER_ERROR`: Browser automation failed

### Example Usage
```javascript
const validationRequest = {
  validationType: "post-correction",
  targetSlides: [3, 4, 5, 6, 10],
  expectedValues: {
    "3": {
      "asiaPopulation2005": {
        value: 3905,
        unit: "million",
        source: "Table 1"
      }
    },
    "4": {
      "currentPopulation": {
        value: 14,
        unit: "million",
        source: "Table 2"
      },
      "contraceptiveUse": {
        value: 4.6,
        unit: "percent",
        source: "Table 2"
      }
    }
  },
  options: {
    screenshot: true,
    generateReport: true,
    strictMode: true
  }
};

const result = validateCorrections(validationRequest);
// Expected output:
// {
//   validationPassed: true,
//   timestamp: "2024-09-24T10:00:00Z",
//   totalChecks: 3,
//   passedChecks: 3,
//   failedChecks: 0,
//   details: [...],
//   screenshots: [...],
//   report: {...}
// }
```

### Test Cases

#### Test Case 1: All Values Match
```javascript
// Input
{
  validationType: "post-correction",
  targetSlides: [4],
  expectedValues: {
    "4": {
      "currentPopulation": { value: 14, unit: "million", source: "Table 2" }
    }
  }
}
// Expected: validationPassed = true, passedChecks = 1
```

#### Test Case 2: Value Mismatch
```javascript
// Input
{
  validationType: "post-correction",
  targetSlides: [5],
  expectedValues: {
    "5": {
      "brazilTFR": { value: 2.5, unit: "births per woman", source: "Panel 6" }
    }
  }
}
// If actual is 2.3
// Expected: validationPassed = false, failedChecks = 1
```

#### Test Case 3: Visual Validation
```javascript
// Input
{
  validationType: "visual",
  targetSlides: [3, 4, 5],
  expectedValues: {...},
  options: {
    screenshot: true
  }
}
// Expected: screenshots array with 3 entries
```

### Validation Checklist
Generated automatically based on corrections:

- [ ] Slide 3: Asia 2005 = 3,905M
- [ ] Slide 3: Asia 2050 = 5,217M
- [ ] Slide 4: Niger population = 14M
- [ ] Slide 4: Niger contraceptive = 4.6%
- [ ] Slide 4: Niger 2050 = 50M
- [ ] Slide 5: Brazil TFR end = 2.5
- [ ] Slide 6: Pakistan 1990 = 12%
- [ ] Slide 10: Spacing insight present
- [ ] Slide 10: Wealth disparity insight present