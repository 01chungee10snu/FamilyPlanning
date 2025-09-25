"""
캡처된 슬라이드 이미지를 전체화면 비율(16:9)로 PDF 생성
"""

import os
from PIL import Image
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.utils import ImageReader
import io

def create_fullscreen_pdf():
    """전체화면 비율(16:9)로 PDF 생성"""

    # 커스텀 페이지 크기 설정 (16:9 비율)
    # A4 landscape는 297mm x 210mm
    # 16:9 비율로 조정: 297mm x 167mm
    page_width = 842  # 297mm in points
    page_height = 473  # 167mm in points (16:9 ratio)

    # 이미지 파일 수집
    image_files = []
    image_dir = '.playwright-mcp'

    # 슬라이드 1-12 이미지 확인
    for i in range(1, 13):
        file_name = f'slide_{i:02d}.png'
        file_path = os.path.join(image_dir, file_name)
        if os.path.exists(file_path):
            image_files.append(file_path)
            print(f"Found: {file_name}")

    if not image_files:
        print("No slide images found!")
        return None

    print(f"\nTotal slides found: {len(image_files)}")

    # PDF 생성
    output_file = 'FamilyPlanning_FullScreen_16x9.pdf'
    print(f"Creating PDF with 16:9 aspect ratio: {output_file}")

    # PDF 캔버스 생성 (커스텀 크기)
    c = canvas.Canvas(output_file, pagesize=(page_width, page_height))

    for idx, img_path in enumerate(image_files):
        print(f"Processing slide {idx + 1}/{len(image_files)}...")

        # 이미지 열기
        img = Image.open(img_path)
        img_width, img_height = img.size
        img_aspect = img_width / img_height

        # 16:9 페이지에 맞게 크기 계산
        page_aspect = page_width / page_height

        if img_aspect > page_aspect:
            # 너비 기준으로 스케일링
            new_width = page_width
            new_height = page_width / img_aspect
        else:
            # 높이 기준으로 스케일링
            new_height = page_height
            new_width = page_height * img_aspect

        # 중앙 정렬
        x_offset = (page_width - new_width) / 2
        y_offset = (page_height - new_height) / 2

        # 이미지를 메모리 스트림으로 저장
        img_buffer = io.BytesIO()
        img.save(img_buffer, format='PNG')
        img_buffer.seek(0)

        # PDF에 이미지 그리기
        c.drawImage(ImageReader(img_buffer),
                   x_offset, y_offset,
                   width=new_width, height=new_height,
                   preserveAspectRatio=True)

        # 페이지 번호 추가 (우측 하단)
        c.setFont("Helvetica", 9)
        c.setFillColorRGB(0.5, 0.5, 0.5)
        c.drawRightString(page_width - 30, 20, f"{idx + 1} / {len(image_files)}")

        # 다음 페이지 (마지막 페이지가 아닌 경우)
        if idx < len(image_files) - 1:
            c.showPage()

    # PDF 저장
    c.save()

    print(f"\nPDF created successfully: {output_file}")
    print(f"  Page size: {page_width:.0f} x {page_height:.0f} points (16:9 ratio)")
    print(f"  File size: {os.path.getsize(output_file) / 1024 / 1024:.2f} MB")

    return output_file

def create_standard_pdf():
    """표준 A4 가로 방향 PDF 생성"""

    # 이미지 파일 수집
    image_files = []
    image_dir = '.playwright-mcp'

    for i in range(1, 13):
        file_name = f'slide_{i:02d}.png'
        file_path = os.path.join(image_dir, file_name)
        if os.path.exists(file_path):
            image_files.append(file_path)

    if not image_files:
        print("No slide images found!")
        return None

    # PDF 생성 (A4 가로)
    output_file = 'FamilyPlanning_Standard_A4.pdf'
    print(f"Creating standard A4 landscape PDF: {output_file}")

    pdf_width, pdf_height = landscape(A4)
    c = canvas.Canvas(output_file, pagesize=landscape(A4))

    for idx, img_path in enumerate(image_files):
        print(f"Processing slide {idx + 1}/{len(image_files)}...")

        img = Image.open(img_path)
        img_width, img_height = img.size
        aspect = img_width / img_height

        # A4 페이지에 맞게 크기 계산
        if aspect > pdf_width / pdf_height:
            new_width = pdf_width
            new_height = pdf_width / aspect
        else:
            new_height = pdf_height
            new_width = pdf_height * aspect

        # 중앙 정렬
        x_offset = (pdf_width - new_width) / 2
        y_offset = (pdf_height - new_height) / 2

        # 이미지 추가
        img_buffer = io.BytesIO()
        img.save(img_buffer, format='PNG')
        img_buffer.seek(0)

        c.drawImage(ImageReader(img_buffer),
                   x_offset, y_offset,
                   width=new_width, height=new_height)

        # 페이지 번호
        c.setFont("Helvetica", 10)
        c.drawString(pdf_width - 50, 20, f"{idx + 1}/{len(image_files)}")

        if idx < len(image_files) - 1:
            c.showPage()

    c.save()

    print(f"\nPDF created successfully: {output_file}")
    print(f"  Page size: A4 Landscape")
    print(f"  File size: {os.path.getsize(output_file) / 1024 / 1024:.2f} MB")

    return output_file

def main():
    """메인 함수"""
    print("=" * 60)
    print("PDF Generator - Full Screen & Standard Formats")
    print("=" * 60)

    # 16:9 전체화면 비율 PDF 생성
    print("\n[1] Creating 16:9 Full-Screen PDF...")
    pdf1 = create_fullscreen_pdf()

    # 표준 A4 가로 PDF 생성
    print("\n[2] Creating Standard A4 Landscape PDF...")
    pdf2 = create_standard_pdf()

    print("\n" + "=" * 60)
    print("PDF Generation Complete!")
    print("=" * 60)

    if pdf1:
        print(f"- Full-Screen (16:9): {pdf1}")
    if pdf2:
        print(f"- Standard A4: {pdf2}")

    print("\n모니터 전체화면으로 볼 때는 16:9 버전을 사용하세요.")
    print("인쇄나 일반 문서용으로는 A4 버전을 사용하세요.")

if __name__ == "__main__":
    main()