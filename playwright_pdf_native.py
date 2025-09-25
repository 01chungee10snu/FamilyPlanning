"""
Convert HTML presentation to native PDF using Playwright
Creates a proper PDF document with each slide as a full page
"""

import asyncio
from playwright.async_api import async_playwright
import os
import PyPDF2
from PyPDF2 import PdfReader, PdfWriter

async def capture_slides_as_pdf():
    """Capture each slide as a PDF page using Playwright"""

    async with async_playwright() as p:
        # Launch browser
        browser = await p.chromium.launch(
            headless=True,
            args=['--disable-dev-shm-usage']
        )

        # Create page with full HD viewport
        context = await browser.new_context(
            viewport={'width': 1920, 'height': 1080},
            device_scale_factor=1.0
        )
        page = await context.new_page()

        # Load the HTML file
        file_path = f"file:///{os.path.abspath('index.html').replace(os.sep, '/')}"
        print(f"Loading presentation from: {file_path}")
        await page.goto(file_path, wait_until='networkidle')

        # Wait for initial load
        await asyncio.sleep(2)

        # PDF pages list
        pdf_files = []

        # Total slides
        total_slides = 12

        print(f"\nGenerating PDF with {total_slides} slides...")

        for i in range(total_slides):
            print(f"Processing slide {i+1}/{total_slides}...")

            # Navigate to slide
            await page.evaluate(f'''
                if (typeof showSlide === 'function') {{
                    showSlide({i});
                }}
            ''')

            # Wait for animation
            await asyncio.sleep(0.5)

            # Hide navigation controls for clean PDF
            await page.evaluate('''
                const nav = document.querySelector('.nav-dots');
                if (nav) nav.style.display = 'none';
                const counter = document.querySelector('.slide-counter');
                if (counter) counter.style.display = 'none';
            ''')

            # Generate PDF for this slide
            pdf_bytes = await page.pdf(
                format='A4',
                landscape=True,
                print_background=True,
                margin={
                    'top': '0mm',
                    'right': '0mm',
                    'bottom': '0mm',
                    'left': '0mm'
                },
                scale=0.9,
                display_header_footer=False,
                prefer_css_page_size=False
            )

            # Save individual PDF
            temp_pdf = f"temp_slide_{i+1:02d}.pdf"
            with open(temp_pdf, 'wb') as f:
                f.write(pdf_bytes)
            pdf_files.append(temp_pdf)

            # Restore navigation for next slide
            await page.evaluate('''
                const nav = document.querySelector('.nav-dots');
                if (nav) nav.style.display = '';
                const counter = document.querySelector('.slide-counter');
                if (counter) counter.style.display = '';
            ''')

        await browser.close()

        return pdf_files

def merge_pdfs(pdf_files, output_filename='FamilyPlanning_NativePresentation.pdf'):
    """Merge individual PDF files into one"""

    print(f"\nMerging {len(pdf_files)} PDF files...")

    pdf_writer = PdfWriter()

    for pdf_file in pdf_files:
        if os.path.exists(pdf_file):
            pdf_reader = PdfReader(pdf_file)
            for page in pdf_reader.pages:
                pdf_writer.add_page(page)

    # Write the merged PDF
    with open(output_filename, 'wb') as output_file:
        pdf_writer.write(output_file)

    print(f"Merged PDF created: {output_filename}")

    # Clean up temporary files
    for pdf_file in pdf_files:
        if os.path.exists(pdf_file):
            os.remove(pdf_file)
            print(f"Cleaned up: {pdf_file}")

    return output_filename

async def create_single_pdf_document():
    """Create a single PDF document with all slides"""

    async with async_playwright() as p:
        browser = await p.chromium.launch(
            headless=True,
            args=['--disable-dev-shm-usage', '--no-sandbox']
        )

        page = await browser.new_page(
            viewport={'width': 1920, 'height': 1080},
            device_scale_factor=1.0
        )

        # Create a comprehensive HTML with all slides
        html_content = '''<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>가족계획: 미완의 과제</title>
    <style>
        @page {
            size: A4 landscape;
            margin: 0;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            margin: 0;
            padding: 0;
            font-family: 'Malgun Gothic', 'Apple SD Gothic Neo', 'Segoe UI', sans-serif;
            background: white;
        }

        .pdf-page {
            width: 297mm;
            height: 210mm;
            page-break-after: always;
            page-break-inside: avoid;
            position: relative;
            overflow: hidden;
            background: white;
        }

        .pdf-page:last-child {
            page-break-after: auto;
        }

        .slide-frame {
            width: 100%;
            height: 100%;
            border: none;
            display: block;
        }
    </style>
</head>
<body>
'''

        # Add placeholder divs for slides
        for i in range(12):
            html_content += f'''
    <div class="pdf-page" id="slide-{i+1}">
        <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 24pt;">
            Slide {i+1} Content
        </div>
    </div>
'''

        html_content += '''
</body>
</html>'''

        # Save temporary HTML
        temp_html = 'temp_full_presentation.html'
        with open(temp_html, 'w', encoding='utf-8') as f:
            f.write(html_content)

        # Load the HTML
        temp_path = f"file:///{os.path.abspath(temp_html).replace(os.sep, '/')}"
        await page.goto(temp_path)

        # Generate complete PDF
        output_file = 'FamilyPlanning_FullDocument.pdf'
        await page.pdf(
            path=output_file,
            format='A4',
            landscape=True,
            print_background=True,
            margin={'top': '0', 'right': '0', 'bottom': '0', 'left': '0'},
            prefer_css_page_size=True,
            display_header_footer=False
        )

        await browser.close()

        # Clean up
        if os.path.exists(temp_html):
            os.remove(temp_html)

        print(f"\nCreated full document PDF: {output_file}")
        print(f"File size: {os.path.getsize(output_file) / 1024 / 1024:.2f} MB")

        return output_file

async def main():
    """Main function to create native PDF from HTML presentation"""

    try:
        print("=" * 50)
        print("HTML to Native PDF Converter")
        print("=" * 50)

        # Method 1: Capture and merge individual slides
        print("\nMethod 1: Capturing individual slides as PDF...")
        pdf_files = await capture_slides_as_pdf()

        if pdf_files:
            # Check if PyPDF2 is installed
            try:
                import PyPDF2
                output_file = merge_pdfs(pdf_files)
                print(f"\nSuccessfully created native PDF: {output_file}")
                print(f"File size: {os.path.getsize(output_file) / 1024 / 1024:.2f} MB")
            except ImportError:
                print("\nPyPDF2 not installed. Installing...")
                import subprocess
                import sys
                subprocess.check_call([sys.executable, "-m", "pip", "install", "PyPDF2"])
                print("Please run the script again.")

        print("\n" + "=" * 50)
        print("PDF generation complete!")
        print("The PDF contains native text and vector graphics.")
        print("=" * 50)

    except Exception as e:
        print(f"\nError: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    # Set event loop policy for Windows
    if os.name == 'nt':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

    asyncio.run(main())