# Validation Checklist for Data Corrections

## Slide 3: Global Population Trends (글로벌 인구 동향과 지역별 현황)
### Current Values (INCORRECT)
- Asia broken into sub-regions (South Asia, East Asia, Southeast Asia, West Asia)
- Multiple data points for Asian sub-regions

### Target Values (CORRECT - from Table 1)
- [ ] Asia 2005: 3,905 million (total only)
- [ ] Asia 2050: 5,217 million (total only)
- [ ] Remove all sub-regional breakdowns
- [ ] Single entry for Asia in charts

---

## Slide 4: Niger Crisis (사하라이남 아프리카: 니제르 위기)
### Current Values (INCORRECT)
- Population: 12.5 million
- Contraceptive use: 5%
- 2050 projection: <50 million

### Target Values (CORRECT - from Table 2)
- [ ] Current population (2005): 14 million
- [ ] Contraceptive use (1998): 4.6%
- [ ] 2050 projection: 50 million (not "<50")
- [ ] Values in both text and charts

---

## Slide 5: Success Stories (성공 스토리: 케냐와 브라질)
### Current Values (INCORRECT)
- Brazil TFR endpoint: 2.3

### Target Values (CORRECT - from Panel 6)
- [ ] Brazil TFR endpoint (1996): 2.5
- [ ] Chart line must end at 2.5
- [ ] Tooltip shows 2.5

---

## Slide 6: Bangladesh vs Pakistan (남아시아 대조: 방글라데시 vs 파키스탄)
### Current Values (INCORRECT)
- Pakistan contraceptive rate: "30% 정체"

### Target Values (CORRECT - from Panel 8)
- [ ] Pakistan contraceptive rate (1990): 12%
- [ ] Remove "30% 정체" reference
- [ ] Chart/timeline shows 12% for 1990

---

## Slide 10: Unmet Demand (미충족 수요: 정의와 지역별 분포)
### Current Values (INCORRECT)
- Only regional percentages shown
- No qualitative insights

### Target Values (CORRECT - from main.pdf text)
- [ ] Add: "사하라 이남: 출산 간격 조정 수요 > 가족 수 제한 수요"
- [ ] Add: "아시아/라틴: 최빈곤층 미충족 수요가 최부유층보다 2배 높음"
- [ ] Format as bullet points
- [ ] Maintain existing layout

---

## Validation Steps
1. Open index.html in browser
2. Navigate to each slide
3. Check text values
4. Hover over charts for tooltips
5. Verify visual consistency
6. Check console for errors
7. Confirm file size < 10MB
8. Test load time < 3s