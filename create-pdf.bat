@echo off
echo ===================================
echo PDF 생성 도구
echo ===================================
echo.

REM Check if Chrome is installed
where chrome >nul 2>&1
if %errorlevel% neq 0 (
    echo Chrome이 설치되어 있지 않습니다.
    echo 브라우저에서 수동으로 PDF를 생성하세요:
    echo 1. slides-for-pdf.html 파일을 브라우저에서 엽니다
    echo 2. Ctrl+P를 눌러 인쇄 대화상자를 엽니다
    echo 3. 대상을 "PDF로 저장"으로 선택합니다
    echo 4. 저장 버튼을 클릭합니다
    pause
    exit /b
)

echo Chrome을 사용하여 PDF를 생성합니다...
echo.

REM Get current directory
set "current_dir=%cd%"

REM Generate PDF using Chrome headless
start chrome --headless --disable-gpu --print-to-pdf="%current_dir%\Family_Planning_Presentation.pdf" "file:///%current_dir:\=/%/slides-for-pdf.html"

echo PDF 생성 중... (약 5-10초 소요)
timeout /t 10 /nobreak >nul

if exist "Family_Planning_Presentation.pdf" (
    echo.
    echo ✅ PDF 파일이 성공적으로 생성되었습니다!
    echo 📄 파일명: Family_Planning_Presentation.pdf
    echo 📁 위치: %current_dir%
) else (
    echo.
    echo ⚠️ PDF 생성에 실패했습니다.
    echo 브라우저에서 수동으로 생성하세요:
    echo 1. slides-for-pdf.html 파일을 브라우저에서 엽니다
    echo 2. Ctrl+P를 눌러 인쇄 대화상자를 엽니다
    echo 3. 대상을 "PDF로 저장"으로 선택합니다
    echo 4. 저장 버튼을 클릭합니다
)

echo.
pause