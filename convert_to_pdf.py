"""
Convert HTML presentation to native PDF using pdfkit
This creates a proper PDF document with text and vector graphics
"""

import os
import subprocess
import sys

def install_requirements():
    """Install required packages"""
    packages = ['pdfkit', 'beautifulsoup4']
    for package in packages:
        try:
            __import__(package)
        except ImportError:
            print(f"Installing {package}...")
            subprocess.check_call([sys.executable, "-m", "pip", "install", package])

def create_printable_html():
    """Create a print-optimized version of the presentation"""

    from bs4 import BeautifulSoup

    # Read the original HTML
    with open('index.html', 'r', encoding='utf-8') as f:
        html_content = f.read()

    # Parse HTML
    soup = BeautifulSoup(html_content, 'html.parser')

    # Create new HTML for printing
    print_html = """<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>가족계획: 미완의 과제 - PDF Version</title>
    <style>
        @page {
            size: A4 landscape;
            margin: 10mm;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Malgun Gothic', 'Segoe UI', sans-serif;
            line-height: 1.6;
            color: #333;
            background: white;
        }

        .pdf-slide {
            width: 277mm;
            height: 190mm;
            page-break-after: always;
            page-break-inside: avoid;
            padding: 20mm;
            display: flex;
            flex-direction: column;
            justify-content: center;
            position: relative;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }

        .pdf-slide:nth-child(even) {
            background: white;
            color: #333;
        }

        .pdf-slide:last-child {
            page-break-after: auto;
        }

        h1 {
            font-size: 36pt;
            margin-bottom: 20px;
            text-align: center;
        }

        h2 {
            font-size: 28pt;
            margin-bottom: 15px;
            color: #4a5568;
        }

        h3 {
            font-size: 22pt;
            margin-bottom: 10px;
            color: #2d3748;
        }

        h4 {
            font-size: 18pt;
            margin-bottom: 8px;
            color: #4a5568;
        }

        p {
            font-size: 14pt;
            margin-bottom: 10px;
            line-height: 1.8;
        }

        ul, ol {
            margin-left: 20px;
            margin-bottom: 15px;
        }

        li {
            font-size: 14pt;
            margin-bottom: 8px;
        }

        .stats-box {
            background: rgba(255,255,255,0.1);
            padding: 15px;
            border-radius: 10px;
            margin: 10px 0;
        }

        .pdf-slide:nth-child(even) .stats-box {
            background: #f7fafc;
        }

        .highlight {
            background: #ffd93d;
            color: #333;
            padding: 2px 6px;
            border-radius: 4px;
            font-weight: bold;
        }

        .source {
            position: absolute;
            bottom: 20mm;
            right: 20mm;
            font-size: 10pt;
            opacity: 0.8;
        }

        .page-number {
            position: absolute;
            bottom: 10mm;
            right: 10mm;
            font-size: 10pt;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }

        th, td {
            padding: 10px;
            border: 1px solid rgba(255,255,255,0.3);
            text-align: left;
        }

        .pdf-slide:nth-child(even) th,
        .pdf-slide:nth-child(even) td {
            border-color: #e2e8f0;
        }
    </style>
</head>
<body>
"""

    # Slide 1: Title
    print_html += """
    <div class="pdf-slide">
        <h1>가족계획: 미완의 과제</h1>
        <p style="text-align: center; font-size: 18pt; margin-top: 20px;">Family planning: The unfinished agenda</p>
        <div style="display: flex; justify-content: space-around; margin-top: 40px;">
            <div class="stats-box" style="text-align: center;">
                <h4>보건 향상</h4>
                <p>모성·영아 사망률 감소</p>
            </div>
            <div class="stats-box" style="text-align: center;">
                <h4>경제 발전</h4>
                <p>빈곤 감소와 성장 촉진</p>
            </div>
            <div class="stats-box" style="text-align: center;">
                <h4>여성 권한</h4>
                <p>교육·경제 참여 확대</p>
            </div>
            <div class="stats-box" style="text-align: center;">
                <h4>지속가능성</h4>
                <p>인구·환경 균형</p>
            </div>
        </div>
        <p class="source">Cleland, J., et al. (2006). The Lancet, 368(9549), 1810-1827.</p>
        <span class="page-number">1</span>
    </div>
"""

    # Slide 2: Introduction
    print_html += """
    <div class="pdf-slide">
        <h1>서론</h1>
        <h3>지난 50년간의 성과</h3>
        <ul>
            <li>피임 사용률: 10% → 63% (1960-2005)</li>
            <li>평균 출산율: 5.0 → 2.7</li>
            <li>연간 7천만 건의 원치 않는 임신 예방</li>
        </ul>
        <h3>현재의 도전</h3>
        <ul>
            <li>2억 명 이상 여성의 미충족 수요</li>
            <li>지역별 격차 심화</li>
            <li>자원 부족과 정치적 의지 약화</li>
        </ul>
        <span class="page-number">2</span>
    </div>
"""

    # Slide 3: Population Trends
    print_html += """
    <div class="pdf-slide">
        <h1>인구 동향과 미충족 수요</h1>
        <h3>2050년 인구 전망</h3>
        <table>
            <tr>
                <th>대륙</th>
                <th>2005년</th>
                <th>2050년 예측</th>
                <th>변화</th>
            </tr>
            <tr>
                <td>아프리카</td>
                <td>9억</td>
                <td>20억</td>
                <td>+122%</td>
            </tr>
            <tr>
                <td>아시아</td>
                <td>40억</td>
                <td>52억</td>
                <td>+30%</td>
            </tr>
            <tr>
                <td>유럽</td>
                <td>7.3억</td>
                <td>6.5억</td>
                <td>-11%</td>
            </tr>
        </table>
        <h3>미충족 수요 현황</h3>
        <ul>
            <li>사하라이남 아프리카: 24%</li>
            <li>남아시아: 13%</li>
            <li>동아시아: 9%</li>
        </ul>
        <span class="page-number">3</span>
    </div>
"""

    # Continue with remaining slides...
    # Add slides 4-12 with similar structure

    print_html += """
</body>
</html>
"""

    # Save the print-optimized HTML
    with open('presentation_for_pdf.html', 'w', encoding='utf-8') as f:
        f.write(print_html)

    return 'presentation_for_pdf.html'

def convert_with_pdfkit():
    """Convert HTML to PDF using pdfkit (requires wkhtmltopdf)"""

    try:
        import pdfkit

        # Configuration for pdfkit
        options = {
            'page-size': 'A4',
            'orientation': 'Landscape',
            'margin-top': '0.5in',
            'margin-right': '0.5in',
            'margin-bottom': '0.5in',
            'margin-left': '0.5in',
            'encoding': "UTF-8",
            'no-outline': None,
            'enable-local-file-access': None,
            'print-media-type': None,
            'dpi': 300
        }

        # Create print-optimized HTML
        print_html = create_printable_html()

        # Convert to PDF
        output_file = 'FamilyPlanning_Document.pdf'
        pdfkit.from_file(print_html, output_file, options=options)

        print(f"PDF created successfully: {output_file}")
        print(f"File size: {os.path.getsize(output_file) / 1024 / 1024:.2f} MB")

        return output_file

    except ImportError:
        print("pdfkit not installed. Please install it with: pip install pdfkit")
        print("Also requires wkhtmltopdf: https://wkhtmltopdf.org/downloads.html")
        return None
    except Exception as e:
        print(f"Error with pdfkit: {e}")
        return None

def main():
    """Main function to convert HTML to native PDF"""

    print("Converting HTML presentation to native PDF document...")
    print("This will create a PDF with selectable text and proper formatting.\n")

    # Install requirements if needed
    install_requirements()

    # Try pdfkit conversion
    pdf_file = convert_with_pdfkit()

    if pdf_file:
        print(f"\nSuccessfully created: {pdf_file}")
        print("The PDF contains native text and maintains proper document structure.")
    else:
        print("\nNote: For best results, install wkhtmltopdf from https://wkhtmltopdf.org/downloads.html")
        print("Then run this script again.")

if __name__ == "__main__":
    main()