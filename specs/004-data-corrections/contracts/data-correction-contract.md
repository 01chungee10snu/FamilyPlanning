# Data Correction Contract

## Contract: Apply Data Corrections

### Purpose
Defines the interface for applying data corrections to presentation slides to align with PDF source.

### Input Schema
```javascript
{
  "targetSlide": {
    "type": "integer",
    "required": true,
    "min": 1,
    "max": 40,
    "description": "Slide number to correct"
  },
  "corrections": {
    "type": "array",
    "required": true,
    "items": {
      "fieldName": {
        "type": "string",
        "required": true,
        "pattern": "^[a-zA-Z][a-zA-Z0-9_]*$"
      },
      "correctedValue": {
        "type": ["string", "number"],
        "required": true
      },
      "unit": {
        "type": "string",
        "required": false,
        "enum": ["million", "percent", "births per woman"]
      },
      "year": {
        "type": "string",
        "required": false,
        "pattern": "^[0-9]{4}$"
      },
      "locationType": {
        "type": "string",
        "required": true,
        "enum": ["text", "chart", "map", "table"]
      }
    }
  },
  "sourceReference": {
    "type": "string",
    "required": true,
    "pattern": "^(Table|Panel|Figure)\\s+[0-9]+$|^main\\.pdf\\s+text$"
  }
}
```

### Output Schema
```javascript
{
  "success": {
    "type": "boolean",
    "required": true
  },
  "slideNumber": {
    "type": "integer",
    "required": true
  },
  "correctionsApplied": {
    "type": "integer",
    "required": true,
    "min": 0
  },
  "backupCreated": {
    "type": "boolean",
    "required": true
  },
  "validationPassed": {
    "type": "boolean",
    "required": true
  },
  "errors": {
    "type": "array",
    "required": false,
    "items": {
      "field": "string",
      "message": "string"
    }
  }
}
```

### Pre-conditions
1. index.html file exists and is valid HTML
2. Target slide exists in presentation
3. No other modifications in progress
4. Browser environment available for validation

### Post-conditions
1. Backup file created with timestamp
2. All specified corrections applied
3. Visual presentation maintained
4. Data matches PDF source exactly

### Invariants
1. File remains valid HTML5
2. Single-file architecture preserved
3. 16:9 aspect ratio maintained
4. CDN dependencies unchanged

### Error Conditions
- `SLIDE_NOT_FOUND`: Target slide doesn't exist
- `FIELD_NOT_FOUND`: Specified field not in slide
- `BACKUP_FAILED`: Unable to create backup
- `VALIDATION_FAILED`: Corrected value doesn't match display
- `PARSE_ERROR`: Unable to parse HTML structure

### Example Usage
```javascript
const correctionRequest = {
  targetSlide: 4,
  corrections: [
    {
      fieldName: "currentPopulation",
      correctedValue: 14,
      unit: "million",
      year: "2005",
      locationType: "text"
    },
    {
      fieldName: "contraceptiveUse",
      correctedValue: 4.6,
      unit: "percent",
      year: "1998",
      locationType: "chart"
    }
  ],
  sourceReference: "Table 2"
};

const result = applyDataCorrection(correctionRequest);
// Expected output:
// {
//   success: true,
//   slideNumber: 4,
//   correctionsApplied: 2,
//   backupCreated: true,
//   validationPassed: true
// }
```

### Test Cases

#### Test Case 1: Valid Correction
```javascript
// Input
{
  targetSlide: 4,
  corrections: [{
    fieldName: "currentPopulation",
    correctedValue: 14,
    unit: "million",
    year: "2005",
    locationType: "text"
  }],
  sourceReference: "Table 2"
}
// Expected: success = true, correctionsApplied = 1
```

#### Test Case 2: Invalid Slide Number
```javascript
// Input
{
  targetSlide: 99,
  corrections: [{...}],
  sourceReference: "Table 1"
}
// Expected: success = false, error = "SLIDE_NOT_FOUND"
```

#### Test Case 3: Multiple Corrections
```javascript
// Input
{
  targetSlide: 10,
  corrections: [
    { fieldName: "insight1", ... },
    { fieldName: "insight2", ... }
  ],
  sourceReference: "main.pdf text"
}
// Expected: success = true, correctionsApplied = 2
```