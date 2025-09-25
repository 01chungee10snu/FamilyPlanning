"""
모든 슬라이드를 자동으로 캡처하는 스크립트
playwright를 사용하여 브라우저를 제어하고 각 슬라이드를 캡처
"""

import asyncio
from playwright.async_api import async_playwright
import os
from PIL import Image
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import landscape, A4
from reportlab.lib.utils import ImageReader
import io

async def capture_all_slides():
    """모든 슬라이드를 자동으로 캡처"""

    async with async_playwright() as p:
        # 브라우저 실행
        browser = await p.chromium.launch(headless=False)  # headless=False로 브라우저 표시
        page = await browser.new_page(viewport={'width': 1920, 'height': 1080})

        # HTML 파일 열기
        file_path = f"file:///{os.path.abspath('index.html').replace(os.sep, '/')}"
        await page.goto(file_path)
        await page.wait_for_load_state('networkidle')
        await asyncio.sleep(2)

        # 슬라이드 총 개수
        total_slides = 12
        screenshots = []

        print(f"Capturing {total_slides} slides...")

        for i in range(total_slides):
            print(f"Capturing slide {i+1}/{total_slides}...")

            # 슬라이드 전환
            await page.evaluate(f'showSlide({i})')
            await asyncio.sleep(1)  # 애니메이션 대기

            # 스크린샷 저장
            screenshot_path = f"slide_{i+1:02d}.png"
            await page.screenshot(path=screenshot_path)
            screenshots.append(screenshot_path)

        await browser.close()

        return screenshots

def create_pdf_from_screenshots(screenshots, output_file='FamilyPlanning_Presentation.pdf'):
    """스크린샷들을 PDF로 변환"""

    print(f"\nCreating PDF: {output_file}")

    # PDF 캔버스 생성
    pdf_width, pdf_height = landscape(A4)
    c = canvas.Canvas(output_file, pagesize=landscape(A4))

    for idx, img_path in enumerate(screenshots):
        if os.path.exists(img_path):
            print(f"Adding {img_path} to PDF...")

            img = Image.open(img_path)
            img_width, img_height = img.size
            aspect = img_width / img_height

            # PDF 페이지에 맞게 크기 계산
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
            c.drawString(pdf_width - 50, 20, f"{idx + 1}/{len(screenshots)}")

            if idx < len(screenshots) - 1:
                c.showPage()

    c.save()
    print(f"\nPDF created successfully: {output_file}")
    print(f"File size: {os.path.getsize(output_file) / 1024 / 1024:.2f} MB")

    return output_file

async def main():
    try:
        # 1. 모든 슬라이드 캡처
        screenshots = await capture_all_slides()

        # 2. PDF 생성
        pdf_file = create_pdf_from_screenshots(screenshots)

        print(f"\n✅ Successfully created: {pdf_file}")

        # 3. 스크린샷 파일 정리 (선택사항)
        cleanup = input("\nDelete screenshot files? (y/n): ")
        if cleanup.lower() == 'y':
            for img_path in screenshots:
                if os.path.exists(img_path):
                    os.remove(img_path)
                    print(f"Deleted: {img_path}")

    except Exception as e:
        print(f"\nError: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    # Windows에서 이벤트 루프 정책 설정
    if os.name == 'nt':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

    asyncio.run(main())