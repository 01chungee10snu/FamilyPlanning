@echo off
chcp 65001 > nul
title 가족계획 발표자료
color 3F
cls

echo.
echo    ┌─────────────────────────────────────────────┐
echo    │                                             │
echo    │    Family Planning: The Unfinished Agenda  │
echo    │         가족계획: 미완의 과제               │
echo    │                                             │
echo    │           Lancet 2006 발표자료             │
echo    │                                             │
echo    └─────────────────────────────────────────────┘
echo.
echo.

:: 서버 선택 메뉴
echo    실행 방법을 선택하세요:
echo.
echo    [1] 웹 서버로 실행 (권장)
echo    [2] 파일 직접 열기 (간단)
echo    [3] 종료
echo.
set /p choice="   선택 (1-3): "

if "%choice%"=="1" goto :server_start
if "%choice%"=="2" goto :direct_open
if "%choice%"=="3" goto :exit
goto :invalid

:server_start
cls
echo.
echo    ▶ 서버를 시작합니다...
echo.

:: Node.js 확인
where node >nul 2>&1
if %errorlevel% equ 0 (
    echo    ✓ Node.js 감지됨
    echo.
    echo    주소: http://localhost:8080
    echo    브라우저가 자동으로 열립니다...
    echo.
    echo    [종료: Ctrl+C]
    echo.
    timeout /t 2 /nobreak > nul
    start http://localhost:8080
    node dev-server.config.js
    goto :end
)

:: Python 확인
where python >nul 2>&1
if %errorlevel% equ 0 (
    echo    ✓ Python 감지됨
    echo.
    echo    주소: http://localhost:8000
    echo    브라우저가 자동으로 열립니다...
    echo.
    echo    [종료: Ctrl+C]
    echo.
    timeout /t 2 /nobreak > nul
    start http://localhost:8000
    cd /d "%~dp0"
    python -m http.server 8000
    goto :end
)

echo    ⚠ 서버 프로그램이 없습니다.
echo    파일을 직접 엽니다...
timeout /t 2 /nobreak > nul
goto :direct_open

:direct_open
cls
echo.
echo    ▶ 브라우저에서 파일을 엽니다...
echo.
start index.html
echo    ✓ 발표자료가 열렸습니다.
echo.
echo    ┌──────────────────────────┐
echo    │  키보드 단축키           │
echo    ├──────────────────────────┤
echo    │  ← → : 슬라이드 이동    │
echo    │  F : 전체화면            │
echo    │  M : 메뉴 열기           │
echo    │  1-9 : 섹션 이동         │
echo    │  ESC : 전체화면 종료     │
echo    └──────────────────────────┘
echo.
pause
goto :end

:invalid
echo    잘못된 선택입니다.
timeout /t 2 /nobreak > nul
cls
goto :start

:exit
echo.
echo    발표 준비를 종료합니다.
timeout /t 1 /nobreak > nul
exit

:end
echo.
echo    ════════════════════════════════════════
echo    발표 시스템이 종료되었습니다.
echo    ════════════════════════════════════════
echo.
pause