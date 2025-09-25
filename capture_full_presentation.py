"""
Capture full presentation from index.html and create PDF
Captures all 17 slides from the presentation
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
    """Capture all 17 slides from the presentation"""

    async with async_playwright() as p:
        # Launch browser
        browser = await p.chromium.launch(headless=False)  # Show browser for monitoring
        page = await browser.new_page(viewport={'width': 1920, 'height': 1080})

        # Open HTML file
        file_path = f"file:///{os.path.abspath('index.html').replace(os.sep, '/')}"
        await page.goto(file_path)
        await page.wait_for_load_state('networkidle')
        await asyncio.sleep(2)

        # Total slides in the presentation
        total_slides = 17  # Based on analysis showing 17 slides total
        screenshots = []

        print(f"Capturing {total_slides} slides...")

        for i in range(total_slides):
            print(f"Capturing slide {i+1}/{total_slides}...")

            # Navigate to slide
            await page.evaluate(f'showSlide({i})')
            await asyncio.sleep(1)  # Wait for animation

            # Save screenshot
            screenshot_path = f"full_slide_{i+1:02d}.png"
            await page.screenshot(path=screenshot_path)
            screenshots.append(screenshot_path)

        await browser.close()

        return screenshots

def create_pdf_from_screenshots(screenshots, output_file='index_presentation.pdf'):
    """Convert screenshots to PDF"""

    print(f"\nCreating PDF: {output_file}")

    # Create PDF canvas
    pdf_width, pdf_height = landscape(A4)
    c = canvas.Canvas(output_file, pagesize=landscape(A4))

    for idx, img_path in enumerate(screenshots):
        if os.path.exists(img_path):
            print(f"Adding {img_path} to PDF...")

            img = Image.open(img_path)
            img_width, img_height = img.size
            aspect = img_width / img_height

            # Calculate size to fit PDF page
            if aspect > pdf_width / pdf_height:
                new_width = pdf_width
                new_height = pdf_width / aspect
            else:
                new_height = pdf_height
                new_width = pdf_height * aspect

            # Center alignment
            x_offset = (pdf_width - new_width) / 2
            y_offset = (pdf_height - new_height) / 2

            # Add image
            img_buffer = io.BytesIO()
            img.save(img_buffer, format='PNG')
            img_buffer.seek(0)

            c.drawImage(ImageReader(img_buffer),
                       x_offset, y_offset,
                       width=new_width, height=new_height)

            # Page number
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
        # 1. Capture all slides
        screenshots = await capture_all_slides()

        # 2. Create PDF
        pdf_file = create_pdf_from_screenshots(screenshots)

        print(f"\nSuccessfully created: {pdf_file}")

        # 3. Clean up screenshot files (optional)
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
    # Set event loop policy for Windows
    if os.name == 'nt':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

    asyncio.run(main())