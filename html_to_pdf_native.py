"""
Convert HTML presentation directly to PDF with proper formatting
Uses Playwright's PDF generation capability for native PDF conversion
"""

import asyncio
from playwright.async_api import async_playwright
import os

async def convert_html_to_pdf():
    """Convert HTML presentation directly to PDF format"""

    async with async_playwright() as p:
        # Launch browser in headless mode for PDF generation
        browser = await p.chromium.launch(headless=True)

        # Create a new page with full HD viewport
        page = await browser.new_page(viewport={'width': 1920, 'height': 1080})

        # Load the HTML file
        file_path = f"file:///{os.path.abspath('index.html').replace(os.sep, '/')}"
        print(f"Loading: {file_path}")
        await page.goto(file_path, wait_until='networkidle')

        # Wait for content to fully load
        await asyncio.sleep(2)

        # Get total number of slides
        total_slides = 12

        # Create individual PDFs for each slide first
        pdf_pages = []

        for i in range(total_slides):
            print(f"Processing slide {i+1}/{total_slides}...")

            # Navigate to the slide
            await page.evaluate(f'showSlide({i})')
            await asyncio.sleep(0.5)  # Wait for transition

            # Generate PDF for this slide
            pdf_content = await page.pdf(
                format='A4',
                landscape=True,
                print_background=True,
                margin={
                    'top': '0px',
                    'bottom': '0px',
                    'left': '0px',
                    'right': '0px'
                },
                scale=0.8,
                prefer_css_page_size=False
            )

            # Save individual slide PDF
            slide_pdf_path = f"temp_slide_{i+1:02d}.pdf"
            with open(slide_pdf_path, 'wb') as f:
                f.write(pdf_content)
            pdf_pages.append(slide_pdf_path)

        await browser.close()

        return pdf_pages

async def create_single_pdf():
    """Create a single PDF with all slides using Playwright"""

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)

        # Create page with presentation dimensions
        page = await browser.new_page(viewport={'width': 1920, 'height': 1080})

        # Create HTML that contains all slides in sequence
        html_content = """
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        @page {
            size: A4 landscape;
            margin: 0;
        }

        body {
            margin: 0;
            padding: 0;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .slide-page {
            width: 297mm;
            height: 210mm;
            page-break-after: always;
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            box-sizing: border-box;
            overflow: hidden;
        }

        .slide-page:last-child {
            page-break-after: auto;
        }

        iframe {
            width: 100%;
            height: 100%;
            border: none;
            transform: scale(1);
            transform-origin: top left;
        }
    </style>
</head>
<body>
"""

        # Load original HTML to extract slides
        file_path = f"file:///{os.path.abspath('index.html').replace(os.sep, '/')}"
        await page.goto(file_path, wait_until='networkidle')
        await asyncio.sleep(1)

        # Navigate through slides and capture their HTML
        for i in range(12):
            await page.evaluate(f'showSlide({i})')
            await asyncio.sleep(0.3)

            html_content += f'<div class="slide-page" id="page-{i+1}">'
            html_content += f'<iframe src="{file_path}#slide-{i}" width="100%" height="100%"></iframe>'
            html_content += '</div>\n'

        html_content += """
</body>
</html>
"""

        # Save temporary HTML
        with open('temp_presentation.html', 'w', encoding='utf-8') as f:
            f.write(html_content)

        # Load the temporary HTML
        temp_path = f"file:///{os.path.abspath('temp_presentation.html').replace(os.sep, '/')}"
        await page.goto(temp_path, wait_until='networkidle')

        # Generate the final PDF
        print("Generating final PDF...")
        pdf_content = await page.pdf(
            path='FamilyPlanning_Native.pdf',
            format='A4',
            landscape=True,
            print_background=True,
            margin={
                'top': '0mm',
                'bottom': '0mm',
                'left': '0mm',
                'right': '0mm'
            },
            scale=1.0,
            display_header_footer=False,
            prefer_css_page_size=True
        )

        await browser.close()

        # Clean up temporary file
        if os.path.exists('temp_presentation.html'):
            os.remove('temp_presentation.html')

        print(f"PDF created successfully: FamilyPlanning_Native.pdf")
        print(f"File size: {os.path.getsize('FamilyPlanning_Native.pdf') / 1024 / 1024:.2f} MB")

        return 'FamilyPlanning_Native.pdf'

async def main():
    """Main function to create native PDF from HTML"""

    try:
        print("Converting HTML presentation to native PDF format...")
        print("This will preserve text, vectors, and maintain proper PDF structure.\n")

        # Create single comprehensive PDF
        pdf_file = await create_single_pdf()

        print(f"\nSuccessfully created native PDF: {pdf_file}")
        print("The PDF maintains vector graphics and selectable text.")

    except Exception as e:
        print(f"Error: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    # Set event loop policy for Windows
    if os.name == 'nt':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

    asyncio.run(main())