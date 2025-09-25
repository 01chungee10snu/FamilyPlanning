"""
HTML 프레젠테이션을 PDF로 변환하는 스크립트
각 슬라이드를 캡처하여 하나의 PDF 파일로 생성
"""

import asyncio
from playwright.async_api import async_playwright
from PIL import Image
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import landscape, A4
from reportlab.lib.utils import ImageReader
import os
import io

async def capture_slides():
    """HTML 프레젠테이션의 각 슬라이드를 스크린샷으로 캡처"""

    # 슬라이드 총 개수 (index.html 분석 결과 기준)
    total_slides = 17
    screenshots = []

    async with async_playwright() as p:
        # 브라우저 실행
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            viewport={'width': 1920, 'height': 1080},
            device_scale_factor=2  # 고해상도 캡처
        )
        page = await context.new_page()

        # HTML 파일 열기
        file_path = f"file:///{os.path.abspath('index.html').replace(os.sep, '/')}"
        await page.goto(file_path)

        # 페이지 로드 대기
        await page.wait_for_load_state('networkidle')
        await asyncio.sleep(2)  # 추가 대기 시간

        print(f"총 {total_slides}개 슬라이드를 캡처합니다...")

        for slide_num in range(total_slides):
            print(f"슬라이드 {slide_num + 1}/{total_slides} 캡처 중...")

            # JavaScript로 슬라이드 전환
            await page.evaluate(f'showSlide({slide_num})')
            await asyncio.sleep(1)  # 슬라이드 전환 애니메이션 대기

            # 스크린샷 캡처
            screenshot_bytes = await page.screenshot(
                full_page=False,
                clip={'x': 0, 'y': 0, 'width': 1920, 'height': 1080}
            )

            # PIL 이미지로 변환
            img = Image.open(io.BytesIO(screenshot_bytes))
            screenshots.append(img)

        await browser.close()

    return screenshots

def create_pdf(screenshots, output_file='FamilyPlanning_Presentation.pdf'):
    """스크린샷 이미지들을 하나의 PDF로 병합"""

    print(f"\nPDF 생성 중: {output_file}")

    # PDF 캔버스 생성 (가로 방향 A4)
    pdf_width, pdf_height = landscape(A4)
    c = canvas.Canvas(output_file, pagesize=landscape(A4))

    for idx, img in enumerate(screenshots):
        print(f"페이지 {idx + 1}/{len(screenshots)} 추가 중...")

        # 이미지를 PDF 크기에 맞게 조정
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
        c.drawString(pdf_width - 50, 20, f"{idx + 1}/{len(screenshots)}")

        # 다음 페이지로 (마지막 페이지가 아닌 경우)
        if idx < len(screenshots) - 1:
            c.showPage()

    # PDF 저장
    c.save()

    print(f"\nPDF created successfully: {output_file}")
    print(f"   File size: {os.path.getsize(output_file) / 1024 / 1024:.2f} MB")

    return output_file

async def main():
    """메인 실행 함수"""
    try:
        # 1. 슬라이드 캡처
        print("Starting presentation capture...")
        screenshots = await capture_slides()

        # 2. PDF 생성
        output_file = 'FamilyPlanning_Presentation.pdf'
        create_pdf(screenshots, output_file)

        # 3. 개별 슬라이드 이미지도 저장 (선택사항)
        save_individual = input("\nSave individual slide images? (y/n): ")
        if save_individual.lower() == 'y':
            os.makedirs('slides', exist_ok=True)
            for idx, img in enumerate(screenshots):
                img_file = f'slides/slide_{idx+1:02d}.png'
                img.save(img_file)
                print(f"   Saved: {img_file}")

        print("\nAll tasks completed successfully!")

    except Exception as e:
        print(f"\nError occurred: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    # Playwright 설치 확인
    try:
        import playwright
        asyncio.run(main())
    except ImportError:
        print("playwright가 설치되어 있지 않습니다.")
        print("다음 명령어로 설치해주세요:")
        print("  pip install playwright")
        print("  playwright install chromium")