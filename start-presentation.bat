@echo off
chcp 65001 > nul
title 가족계획 발표자료 - Family Planning Presentation
color 0A

echo ========================================================
echo    가족계획: 미완의 과제 - 발표 시스템
echo    Family Planning: The Unfinished Agenda
echo ========================================================
echo.

:: Check if Node.js is installed
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [오류] Node.js가 설치되어 있지 않습니다.
    echo.
    echo Python으로 서버를 시작합니다...
    goto :python_server
) else (
    goto :node_server
)

:node_server
echo [정보] Node.js 서버를 시작합니다...
echo.
echo 서버 주소: http://localhost:8080
echo.
echo 브라우저가 자동으로 열립니다...
echo 종료하려면 Ctrl+C를 누르세요.
echo.
timeout /t 2 /nobreak > nul
start http://localhost:8080
node dev-server.config.js
goto :end

:python_server
:: Check if Python is installed
where python >nul 2>&1
if %errorlevel% neq 0 (
    echo [오류] Python도 설치되어 있지 않습니다.
    echo.
    echo 파일을 직접 열겠습니다...
    goto :direct_open
) else (
    echo [정보] Python 서버를 시작합니다...
    echo.
    echo 서버 주소: http://localhost:8000
    echo.
    echo 브라우저가 자동으로 열립니다...
    echo 종료하려면 Ctrl+C를 누르세요.
    echo.
    timeout /t 2 /nobreak > nul
    start http://localhost:8000
    python -m http.server 8000
    goto :end
)

:direct_open
echo [정보] 브라우저에서 직접 파일을 엽니다...
echo.
echo 주의: 일부 기능이 제한될 수 있습니다.
echo 최적의 경험을 위해 Node.js 또는 Python 설치를 권장합니다.
echo.
timeout /t 2 /nobreak > nul
start index.html
goto :end

:end
echo.
echo ========================================================
echo    발표 시스템이 종료되었습니다.
echo ========================================================
pause