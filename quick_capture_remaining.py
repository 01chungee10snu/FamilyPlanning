"""
나머지 슬라이드를 빠르게 캡처하는 스크립트
슬라이드 4-12까지 캡처
"""

remaining_slides = [
    (4, "대륙별 인구 변화"),
    (5, "가족계획의 다중 혜택"),
    (6, "위기의 가족계획"),
    (7, "MDG와 가족계획"),
    (8, "권역별 피임 실천율"),
    (9, "피임법 공급원"),
    (10, "미충족 수요"),
    (11, "핵심 메시지"),
    (12, "글로벌 행동 촉구")
]

print("Remaining slides to capture:")
for num, title in remaining_slides:
    print(f"  Slide {num}: {title}")