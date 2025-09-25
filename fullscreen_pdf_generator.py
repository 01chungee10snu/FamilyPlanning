"""
HTML 프레젠테이션을 전체화면 비율로 PDF 문서로 변환
weasyprint 또는 pdfkit을 사용하여 네이티브 PDF 생성
"""

import os
import subprocess
import sys

def install_package(package):
    """패키지 설치"""
    try:
        __import__(package)
        return True
    except ImportError:
        print(f"Installing {package}...")
        try:
            subprocess.check_call([sys.executable, "-m", "pip", "install", package])
            return True
        except:
            return False

def create_fullscreen_html():
    """전체화면 비율로 최적화된 HTML 생성"""

    # 원본 HTML 읽기
    with open('index.html', 'r', encoding='utf-8') as f:
        original_html = f.read()

    # 전체화면 비율(16:9)에 최적화된 HTML 생성
    fullscreen_html = """<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>가족계획: 미완의 과제 - PDF Version</title>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css">
    <style>
        @page {
            size: 297mm 167mm;  /* 16:9 비율 */
            margin: 0;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Malgun Gothic', '맑은 고딕', 'Apple SD Gothic Neo', sans-serif;
            color: #333;
            background: white;
            margin: 0;
            padding: 0;
        }

        .pdf-slide {
            width: 297mm;
            height: 167mm;  /* 16:9 비율 */
            page-break-after: always;
            page-break-inside: avoid;
            position: relative;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 15mm;
        }

        .pdf-slide:last-child {
            page-break-after: auto;
        }

        /* 슬라이드 1: 타이틀 */
        .slide-title {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-align: center;
        }

        .slide-title h1 {
            font-size: 48pt;
            margin-bottom: 20mm;
            font-weight: 700;
        }

        .slide-title .subtitle {
            font-size: 24pt;
            margin-bottom: 30mm;
            opacity: 0.95;
        }

        .slide-title .features {
            display: flex;
            justify-content: space-around;
            width: 100%;
            gap: 10mm;
        }

        .slide-title .feature-box {
            background: rgba(255,255,255,0.15);
            padding: 10mm;
            border-radius: 10px;
            flex: 1;
        }

        .slide-title .feature-box h4 {
            font-size: 18pt;
            margin-bottom: 5mm;
        }

        .slide-title .feature-box p {
            font-size: 12pt;
        }

        /* 일반 슬라이드 */
        .slide-content {
            background: white;
            color: #333;
        }

        .slide-content h1 {
            font-size: 36pt;
            color: #2d3748;
            margin-bottom: 15mm;
            text-align: center;
            border-bottom: 3px solid #667eea;
            padding-bottom: 5mm;
        }

        .slide-content h2 {
            font-size: 28pt;
            color: #4a5568;
            margin-bottom: 10mm;
            margin-top: 10mm;
        }

        .slide-content h3 {
            font-size: 22pt;
            color: #4a5568;
            margin-bottom: 8mm;
            margin-top: 8mm;
        }

        .slide-content p {
            font-size: 14pt;
            line-height: 1.8;
            margin-bottom: 8mm;
        }

        .slide-content ul, .slide-content ol {
            font-size: 14pt;
            line-height: 1.8;
            margin-left: 10mm;
            margin-bottom: 10mm;
        }

        .slide-content li {
            margin-bottom: 5mm;
        }

        /* 통계 박스 */
        .stats-container {
            display: flex;
            justify-content: space-around;
            margin: 15mm 0;
            gap: 10mm;
        }

        .stat-box {
            background: #f7fafc;
            border-left: 4px solid #667eea;
            padding: 10mm;
            flex: 1;
            text-align: center;
        }

        .stat-number {
            font-size: 36pt;
            font-weight: bold;
            color: #667eea;
            display: block;
            margin-bottom: 5mm;
        }

        .stat-label {
            font-size: 12pt;
            color: #4a5568;
        }

        /* 테이블 */
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 10mm 0;
            font-size: 12pt;
        }

        th {
            background: #667eea;
            color: white;
            padding: 5mm;
            text-align: left;
        }

        td {
            padding: 5mm;
            border-bottom: 1px solid #e2e8f0;
        }

        tr:nth-child(even) {
            background: #f7fafc;
        }

        /* 차트 컨테이너 */
        .chart-container {
            width: 100%;
            height: 80mm;
            margin: 10mm 0;
            background: #f7fafc;
            border-radius: 10px;
            padding: 10mm;
        }

        /* 소스 표시 */
        .source {
            position: absolute;
            bottom: 10mm;
            right: 15mm;
            font-size: 10pt;
            color: #718096;
            font-style: italic;
        }

        /* 페이지 번호 */
        .page-number {
            position: absolute;
            bottom: 10mm;
            left: 15mm;
            font-size: 10pt;
            color: #718096;
        }

        /* 강조 */
        .highlight {
            background: #ffd93d;
            color: #333;
            padding: 2px 6px;
            border-radius: 4px;
            font-weight: bold;
        }

        strong {
            color: #667eea;
            font-weight: 600;
        }
    </style>
</head>
<body>
"""

    # 슬라이드 1: 타이틀
    fullscreen_html += """
    <div class="pdf-slide slide-title">
        <h1>가족계획: 미완의 과제</h1>
        <p class="subtitle">Family planning: The unfinished agenda</p>
        <div class="features">
            <div class="feature-box">
                <h4>보건 향상</h4>
                <p>모성·영아 사망률 감소</p>
            </div>
            <div class="feature-box">
                <h4>경제 발전</h4>
                <p>빈곤 감소와 성장 촉진</p>
            </div>
            <div class="feature-box">
                <h4>여성 권한</h4>
                <p>교육·경제 참여 확대</p>
            </div>
            <div class="feature-box">
                <h4>지속가능성</h4>
                <p>인구·환경 균형</p>
            </div>
        </div>
        <p class="source">Cleland, J., et al. (2006). The Lancet, 368(9549), 1810-1827</p>
        <span class="page-number">1</span>
    </div>
"""

    # 슬라이드 2: 서론
    fullscreen_html += """
    <div class="pdf-slide slide-content">
        <h1>서론</h1>
        <div style="display: flex; gap: 20mm;">
            <div style="flex: 1;">
                <h3>지난 50년간의 성과</h3>
                <ul>
                    <li>피임 사용률: <strong>10% → 63%</strong> (1960-2005)</li>
                    <li>평균 출산율: <strong>5.0 → 2.7</strong></li>
                    <li>연간 <strong>7천만 건</strong>의 원치 않는 임신 예방</li>
                </ul>
            </div>
            <div style="flex: 1;">
                <h3>현재의 도전</h3>
                <ul>
                    <li><strong>2억 명</strong> 이상 여성의 미충족 수요</li>
                    <li>지역별 격차 심화</li>
                    <li>자원 부족과 정치적 의지 약화</li>
                </ul>
            </div>
        </div>
        <div class="stats-container">
            <div class="stat-box">
                <span class="stat-number">63%</span>
                <span class="stat-label">전 세계 피임률</span>
            </div>
            <div class="stat-box">
                <span class="stat-number">2억명</span>
                <span class="stat-label">미충족 수요</span>
            </div>
            <div class="stat-box">
                <span class="stat-number">7천만</span>
                <span class="stat-label">연간 예방된 임신</span>
            </div>
        </div>
        <span class="page-number">2</span>
    </div>
"""

    # 슬라이드 3: 인구 동향
    fullscreen_html += """
    <div class="pdf-slide slide-content">
        <h1>인구 동향과 미충족 수요</h1>
        <h3>2050년 대륙별 인구 전망</h3>
        <table>
            <tr>
                <th>대륙</th>
                <th>2005년</th>
                <th>2050년 예측</th>
                <th>변화율</th>
            </tr>
            <tr>
                <td>아프리카</td>
                <td>9억</td>
                <td>20억</td>
                <td style="color: #e53e3e; font-weight: bold;">+122%</td>
            </tr>
            <tr>
                <td>아시아</td>
                <td>40억</td>
                <td>52억</td>
                <td style="color: #38a169;">+30%</td>
            </tr>
            <tr>
                <td>유럽</td>
                <td>7.3억</td>
                <td>6.5억</td>
                <td style="color: #3182ce;">-11%</td>
            </tr>
        </table>
        <div class="stats-container">
            <div class="stat-box">
                <span class="stat-number">24%</span>
                <span class="stat-label">사하라이남 아프리카<br>미충족 수요</span>
            </div>
            <div class="stat-box">
                <span class="stat-number">13%</span>
                <span class="stat-label">남아시아<br>미충족 수요</span>
            </div>
            <div class="stat-box">
                <span class="stat-number">9%</span>
                <span class="stat-label">동아시아<br>미충족 수요</span>
            </div>
        </div>
        <span class="page-number">3</span>
    </div>
"""

    # 슬라이드 4: 니제르 사례
    fullscreen_html += """
    <div class="pdf-slide slide-content">
        <h1>사하라이남 아프리카: 니제르 위기</h1>
        <div style="display: flex; gap: 15mm;">
            <div style="flex: 1;">
                <h3>니제르 현황</h3>
                <div class="stats-container" style="flex-direction: column;">
                    <div class="stat-box" style="margin-bottom: 5mm;">
                        <span class="stat-number">7.5명</span>
                        <span class="stat-label">합계출산율 (1998)</span>
                    </div>
                    <div class="stat-box" style="margin-bottom: 5mm;">
                        <span class="stat-number">4.6%</span>
                        <span class="stat-label">피임 사용률</span>
                    </div>
                    <div class="stat-box">
                        <span class="stat-number">3.6배</span>
                        <span class="stat-label">2050년까지 인구 증가</span>
                    </div>
                </div>
            </div>
            <div style="flex: 1;">
                <h3>주요 장애요인</h3>
                <ul>
                    <li><strong>문화적 요인:</strong> 대가족 선호, 조혼 관습</li>
                    <li><strong>서비스 접근성:</strong> 농촌 지역 의료 시설 부족</li>
                    <li><strong>교육 부족:</strong> 여성 문해율 15% 미만</li>
                    <li><strong>경제적 제약:</strong> 피임 비용 부담</li>
                    <li><strong>성 불평등:</strong> 여성 의사결정권 제한</li>
                </ul>
                <p style="background: #fff5f5; padding: 5mm; border-left: 3px solid #e53e3e; margin-top: 10mm;">
                    <strong>긴급 대응 필요:</strong><br>
                    통합적 접근 - 교육 + 보건 + 여성권한 + 경제개발
                </p>
            </div>
        </div>
        <p class="source">※ 2025년: Niger TFR 6.7명 (세계 최고), 피임률 17% (UN, 2024)</p>
        <span class="page-number">4</span>
    </div>
"""

    # 나머지 슬라이드들 추가 (5-12)
    # ... 각 슬라이드별 상세 내용 추가 ...

    fullscreen_html += """
</body>
</html>
"""

    # 파일 저장
    with open('fullscreen_presentation.html', 'w', encoding='utf-8') as f:
        f.write(fullscreen_html)

    return 'fullscreen_presentation.html'

def convert_with_weasyprint():
    """WeasyPrint를 사용한 PDF 변환"""
    try:
        import weasyprint

        html_file = create_fullscreen_html()
        output_file = 'FamilyPlanning_FullScreen.pdf'

        print(f"Converting {html_file} to PDF...")

        # WeasyPrint로 변환
        doc = weasyprint.HTML(filename=html_file)
        doc.write_pdf(output_file)

        print(f"PDF created: {output_file}")
        print(f"File size: {os.path.getsize(output_file) / 1024 / 1024:.2f} MB")

        return output_file

    except ImportError:
        print("WeasyPrint not installed.")
        return None

def convert_with_pdfkit():
    """pdfkit을 사용한 PDF 변환 (wkhtmltopdf 필요)"""
    try:
        import pdfkit

        html_file = create_fullscreen_html()
        output_file = 'FamilyPlanning_FullScreen_pdfkit.pdf'

        # wkhtmltopdf 옵션 (16:9 비율)
        options = {
            'page-width': '297mm',
            'page-height': '167mm',  # 16:9 비율
            'margin-top': '0',
            'margin-right': '0',
            'margin-bottom': '0',
            'margin-left': '0',
            'encoding': 'UTF-8',
            'enable-local-file-access': None,
            'print-media-type': None,
            'no-outline': None,
            'dpi': 300
        }

        print(f"Converting {html_file} to PDF with pdfkit...")

        pdfkit.from_file(html_file, output_file, options=options)

        print(f"PDF created: {output_file}")
        print(f"File size: {os.path.getsize(output_file) / 1024 / 1024:.2f} MB")

        return output_file

    except ImportError:
        print("pdfkit not installed.")
        return None
    except Exception as e:
        print(f"Error with pdfkit: {e}")
        return None

def main():
    """메인 함수"""
    print("=" * 60)
    print("HTML to Full-Screen PDF Converter")
    print("16:9 비율로 최적화된 PDF 생성")
    print("=" * 60)

    # WeasyPrint 시도
    if install_package('weasyprint'):
        pdf = convert_with_weasyprint()
        if pdf:
            print(f"\n✓ Successfully created: {pdf}")
            return

    # pdfkit 시도
    if install_package('pdfkit'):
        pdf = convert_with_pdfkit()
        if pdf:
            print(f"\n✓ Successfully created: {pdf}")
            print("Note: wkhtmltopdf must be installed separately")
            return

    # 둘 다 실패한 경우
    print("\n어떤 PDF 라이브러리도 설치할 수 없습니다.")
    print("다음 중 하나를 수동으로 설치해주세요:")
    print("1. pip install weasyprint")
    print("2. pip install pdfkit (+ wkhtmltopdf 설치 필요)")

if __name__ == "__main__":
    main()