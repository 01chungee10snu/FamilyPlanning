@echo off
chcp 65001 > nul
title 발표자료 실행
cls

echo ╔══════════════════════════════════════════════╗
echo ║     가족계획 발표자료를 시작합니다...        ║
echo ╚══════════════════════════════════════════════╝
echo.

:: Try to start with default browser
start presentation-refined.html

echo ✓ 브라우저에서 발표자료가 열렸습니다.
echo.
echo [사용법]
echo   → / ← : 슬라이드 이동
echo   F : 전체화면
echo   M : 메뉴
echo   ESC : 종료
echo.
echo 창을 닫으려면 아무 키나 누르세요...
pause > nul