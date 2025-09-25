"""
모든 슬라이드를 캡처하고 PDF로 변환하는 스크립트
"""

import os
from PIL import Image
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import landscape, A4
from reportlab.lib.utils import ImageReader
import io

def create_pdf_from_images(image_folder='.playwright-mcp', output_file='FamilyPlanning_Presentation.pdf'):
    """이미지 파일들을 하나의 PDF로 병합"""

    # 이미지 파일 목록 가져오기
    image_files = []
    for i in range(1, 18):  # 슬라이드 1부터 17까지
        file_name = f'slide_{i:02d}.png'
        file_path = os.path.join(image_folder, file_name)
        if os.path.exists(file_path):
            image_files.append(file_path)

    if not image_files:
        print("No image files found!")
        return

    print(f"Found {len(image_files)} slide images")
    print(f"Creating PDF: {output_file}")

    # PDF 캔버스 생성 (가로 방향 A4)
    pdf_width, pdf_height = landscape(A4)
    c = canvas.Canvas(output_file, pagesize=landscape(A4))

    for idx, img_path in enumerate(image_files):
        print(f"Adding page {idx + 1}/{len(image_files)}...")

        # 이미지 열기
        img = Image.open(img_path)
        img_width, img_height = img.size
        aspect = img_width / img_height

        # PDF 페이지에 맞게 크기 계산
        if aspect > pdf_width / pdf_height:
            # 너비 기준
            new_width = pdf_width
            new_height = pdf_width / aspect
        else:
            # 높이 기준
            new_height = pdf_height
            new_width = pdf_height * aspect

        # 중앙 정렬을 위한 오프셋 계산
        x_offset = (pdf_width - new_width) / 2
        y_offset = (pdf_height - new_height) / 2

        # 이미지를 메모리 스트림으로 저장
        img_buffer = io.BytesIO()
        img.save(img_buffer, format='PNG')
        img_buffer.seek(0)

        # PDF에 이미지 그리기
        c.drawImage(ImageReader(img_buffer),
                   x_offset, y_offset,
                   width=new_width, height=new_height)

        # 페이지 번호 추가
        c.setFont("Helvetica", 10)
        c.drawString(pdf_width - 50, 20, f"{idx + 1}/{len(image_files)}")

        # 다음 페이지로 (마지막 페이지가 아닌 경우)
        if idx < len(image_files) - 1:
            c.showPage()

    # PDF 저장
    c.save()

    print(f"\nPDF created successfully: {output_file}")
    print(f"File size: {os.path.getsize(output_file) / 1024 / 1024:.2f} MB")

    return output_file

if __name__ == "__main__":
    create_pdf_from_images()