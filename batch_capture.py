"""
Browser를 통해 모든 슬라이드를 캡처하는 배치 스크립트
이미 캡처된 슬라이드는 스킵합니다.
"""

# 슬라이드 전환 및 캡처 명령어 생성
slides_to_capture = [
    (3, "인구 동향과 미충족 수요"),
    (4, "대륙별 인구 변화 예측"),
    (5, "가족계획의 다중 혜택"),
    (6, "위기의 가족계획"),
    (7, "MDG와 가족계획"),
    (8, "권역별 피임 실천율과 미충족 수요"),
    (9, "피임법 공급원 및 효과성"),
    (10, "미충족 수요"),
    (11, "핵심 메시지"),
    (12, "글로벌 행동 촉구")
]

print("=" * 50)
print("슬라이드 캡처 배치 명령")
print("=" * 50)

for slide_num, slide_title in slides_to_capture:
    print(f"\n# 슬라이드 {slide_num}: {slide_title}")
    print(f"1. JavaScript로 슬라이드 전환:")
    print(f"   showSlide({slide_num - 1})")
    print(f"2. 스크린샷 캡처:")
    print(f"   slide_{slide_num:02d}.png")

print("\n모든 슬라이드 캡처가 완료되면 PDF 생성을 진행하세요.")