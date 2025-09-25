"""
Capture all slides from browser and create PDF
Uses browser automation to capture all 12 slides
"""

import os
from PIL import Image
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import landscape, A4
from reportlab.lib.utils import ImageReader
import io

def create_comprehensive_pdf():
    """Create PDF from all available slide captures"""

    # Check for all possible slide images
    image_files = []

    # Check main captures (slides 1-12)
    for i in range(1, 13):
        file_name = f'slide_{i:02d}.png'
        file_path = os.path.join('.playwright-mcp', file_name)
        if os.path.exists(file_path):
            image_files.append(file_path)
            print(f"Found: {file_name}")

    # Check for any full_slide captures
    for i in range(1, 18):
        file_name = f'full_slide_{i:02d}.png'
        if os.path.exists(file_name):
            image_files.append(file_name)
            print(f"Found: {file_name}")

    if not image_files:
        print("No image files found!")
        return

    print(f"\nTotal slides found: {len(image_files)}")

    # Create comprehensive PDF
    output_file = 'index_complete_presentation.pdf'
    print(f"Creating PDF: {output_file}")

    # Create PDF canvas (landscape orientation)
    pdf_width, pdf_height = landscape(A4)
    c = canvas.Canvas(output_file, pagesize=landscape(A4))

    for idx, img_path in enumerate(image_files):
        print(f"Processing slide {idx + 1}/{len(image_files)}...")

        # Open image
        img = Image.open(img_path)
        img_width, img_height = img.size
        aspect = img_width / img_height

        # Calculate size to fit PDF page
        if aspect > pdf_width / pdf_height:
            # Width-based scaling
            new_width = pdf_width
            new_height = pdf_width / aspect
        else:
            # Height-based scaling
            new_height = pdf_height
            new_width = pdf_height * aspect

        # Center alignment offsets
        x_offset = (pdf_width - new_width) / 2
        y_offset = (pdf_height - new_height) / 2

        # Save image to memory stream
        img_buffer = io.BytesIO()
        img.save(img_buffer, format='PNG')
        img_buffer.seek(0)

        # Draw image on PDF
        c.drawImage(ImageReader(img_buffer),
                   x_offset, y_offset,
                   width=new_width, height=new_height)

        # Add page number
        c.setFont("Helvetica", 10)
        c.drawString(pdf_width - 50, 20, f"{idx + 1}/{len(image_files)}")

        # Next page (except for the last page)
        if idx < len(image_files) - 1:
            c.showPage()

    # Save PDF
    c.save()

    print(f"\nPDF created successfully: {output_file}")
    file_size_mb = os.path.getsize(output_file) / 1024 / 1024
    print(f"File size: {file_size_mb:.2f} MB")

    return output_file

if __name__ == "__main__":
    create_comprehensive_pdf()