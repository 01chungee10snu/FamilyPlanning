import re

def unify_markdown_table(input_file, output_file):
    with open(input_file, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    # 새로운 내용을 저장할 리스트
    new_content = []

    # 제목 추가
    new_content.append("# Family Planning: The Unfinished Agenda\n")
    new_content.append("## 가족계획: 미완의 과제\n\n")

    # 표 헤더 추가
    new_content.append("| English Original | 한글 번역 |\n")
    new_content.append("|------------------|----------|\n")

    # 섹션 제목을 저장할 변수
    current_section = ""
    in_table = False
    skip_next_separator = False

    for i, line in enumerate(lines):
        # 빈 줄 건너뛰기
        if line.strip() == "":
            continue

        # 메인 제목들은 건너뛰기
        if line.startswith("# Family Planning:") or line.startswith("## 가족계획:"):
            continue

        # 구분선 건너뛰기
        if line.strip() == "---":
            continue

        # 섹션 제목 처리
        if line.startswith("## ") and not line.startswith("## 가족계획:"):
            section_eng = line.strip().replace("## ", "")
            # 다음 줄에서 한글 제목 찾기
            if i+1 < len(lines) and lines[i+1].startswith("### "):
                section_kor = lines[i+1].strip().replace("### ", "")
                new_content.append(f"| **{section_eng.upper()}** | **{section_kor}** |\n")
                skip_next_separator = True
            continue

        # 한글 부제목 건너뛰기
        if line.startswith("### "):
            continue

        # 표 헤더 줄 건너뛰기
        if "English Original" in line or "English" in line and "Korean" in line:
            continue

        # 표 구분선 건너뛰기
        if line.startswith("|---") or line.startswith("|-"):
            continue

        # 실제 표 내용만 추가
        if line.startswith("|"):
            # 줄 끝의 개행 문자 제거 후 추가
            new_content.append(line.rstrip() + "\n")

    # 파일에 쓰기
    with open(output_file, 'w', encoding='utf-8') as f:
        f.writelines(new_content)

    print(f"통합된 파일이 {output_file}에 저장되었습니다.")

# 실행
unify_markdown_table(
    r"C:\Users\Administrator\OneDrive\Onedrive\SNU\박사과정\[2025-2] 인구정책론\2_발제\translate.md",
    r"C:\Users\Administrator\OneDrive\Onedrive\SNU\박사과정\[2025-2] 인구정책론\2_발제\translate_unified.md"
)