# Citation Contract

## Contract: Citation Formatting
**Version**: 1.0.0
**Component**: Citation

### Interface
```javascript
interface CitationContract {
  // Format full APA citation
  formatFullCitation(citation: CitationData): string;

  // Format in-text citation
  formatInTextCitation(authors: string[], year: number): string;

  // Add citation to slide
  addCitationToSlide(slideId: number, citation: string, position?: string): void;

  // Validate citation format
  validateAPAFormat(citation: string): boolean;
}
```

### Requirements
- **FR-003**: Display citation in full APA format
- **FR-004**: Include in-text citations for all data

### Citation Data Structure
```javascript
interface CitationData {
  authors: string[];      // ["Cleland, J.", "Bernstein, S."]
  year: number;          // 2006
  title: string;         // "Family planning: The unfinished agenda"
  journal: string;       // "The Lancet"
  volume?: string;       // "368"
  issue?: string;        // "9549"
  pages?: string;        // "1810-1827"
  doi?: string;          // "10.1016/S0140-6736(06)69480-4"
}
```

### APA Format Rules

#### Full Citation Format
```
Authors. (Year). Title. Journal, Volume(Issue), Pages. DOI
```

#### In-Text Citation Format
- 1-2 authors: (Author1 & Author2, Year)
- 3+ authors: (FirstAuthor et al., Year)

### Test Cases

#### Test 1: Format Full Citation
**Given**: Cleland et al. 2006 paper data
**When**: formatFullCitation(citationData)
**Then**: "Cleland, J., Bernstein, S., Ezeh, A., Faundes, A., Glasier, A., & Innis, J. (2006). Family planning: The unfinished agenda. The Lancet, 368(9549), 1810-1827."

#### Test 2: Format In-Text Citation (Multiple Authors)
**Given**: Authors = ["Cleland, J.", "Bernstein, S.", "Others"]
**When**: formatInTextCitation(authors, 2006)
**Then**: "(Cleland et al., 2006)"

#### Test 3: Format In-Text Citation (Two Authors)
**Given**: Authors = ["Smith, A.", "Jones, B."]
**When**: formatInTextCitation(authors, 2020)
**Then**: "(Smith & Jones, 2020)"

#### Test 4: Add Citation to Slide
**Given**: Slide 1, full citation text
**When**: addCitationToSlide(1, citation, "bottom")
**Then**: Citation appears at bottom of slide

### Validation Rules
```javascript
const APAValidation = {
  hasAuthors: /^[A-Z][a-z]+, [A-Z]\./,
  hasYear: /\(\d{4}\)/,
  hasTitle: /\. [A-Z][^.]+\./,
  hasJournal: /\. [A-Z][^,]+,/,
  hasPages: /\d+-\d+/
};
```

### DOM Structure
```html
<!-- Full citation on slide 1 -->
<div class="citation citation-full" data-slide="1">
  <p>Cleland, J., Bernstein, S., Ezeh, A., Faundes, A., Glasier, A., & Innis, J. (2006).
     Family planning: The unfinished agenda. <em>The Lancet</em>, 368(9549), 1810-1827.</p>
</div>

<!-- In-text citation on data slides -->
<span class="citation citation-intext">(Cleland et al., 2006)</span>
```

### CSS Requirements
```css
.citation-full {
  font-size: 12px;
  color: #333;
  text-align: left;
  margin-top: 20px;
  line-height: 1.5;
}

.citation-intext {
  font-size: 11px;
  color: #666;
  vertical-align: super;
}
```

### Special Cases

#### Slide 1 Citation
- Must be white color (#FFFFFF)
- Full APA format required
- Positioned below subtitle

#### Data Visualizations
- In-text citations required
- Position: bottom-right of chart/map
- Font size: 10px

#### Missing Sources
- If source unavailable: Remove element
- Never show "Citation needed" placeholder