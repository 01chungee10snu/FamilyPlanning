# PowerShell 스크립트 - 고급 사용자용
# 실행 정책 설정 필요: Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

$host.UI.RawUI.WindowTitle = "가족계획 발표 시스템"
Clear-Host

Write-Host ""
Write-Host "  ╔════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "  ║                                                    ║" -ForegroundColor Cyan
Write-Host "  ║   Family Planning: The Unfinished Agenda          ║" -ForegroundColor Cyan
Write-Host "  ║   가족계획: 미완의 과제                           ║" -ForegroundColor Cyan
Write-Host "  ║                                                    ║" -ForegroundColor Cyan
Write-Host "  ║   Lancet 2006 | 인구정책론 발제                   ║" -ForegroundColor Cyan
Write-Host "  ║                                                    ║" -ForegroundColor Cyan
Write-Host "  ╚════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# 현재 디렉토리 설정
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

Write-Host "  🔍 환경 확인 중..." -ForegroundColor Yellow
Write-Host ""

# Node.js 확인
$nodeInstalled = Get-Command node -ErrorAction SilentlyContinue
if ($nodeInstalled) {
    $nodeVersion = node --version
    Write-Host "  ✅ Node.js 설치됨 ($nodeVersion)" -ForegroundColor Green
    Write-Host ""
    Write-Host "  📡 Node.js 서버 시작..." -ForegroundColor Cyan
    Write-Host "  🌐 주소: " -NoNewline -ForegroundColor White
    Write-Host "http://localhost:8080" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "  ⏳ 3초 후 브라우저가 열립니다..." -ForegroundColor Gray
    Start-Sleep -Seconds 3

    # 브라우저 열기
    Start-Process "http://localhost:8080"

    Write-Host ""
    Write-Host "  ════════════════════════════════════════════" -ForegroundColor DarkGray
    Write-Host "  서버 실행 중... 종료하려면 Ctrl+C" -ForegroundColor White
    Write-Host "  ════════════════════════════════════════════" -ForegroundColor DarkGray
    Write-Host ""

    # 서버 시작
    & node dev-server.config.js
}
else {
    # Python 확인
    $pythonInstalled = Get-Command python -ErrorAction SilentlyContinue
    if ($pythonInstalled) {
        $pythonVersion = python --version
        Write-Host "  ✅ Python 설치됨 ($pythonVersion)" -ForegroundColor Green
        Write-Host ""
        Write-Host "  🐍 Python 서버 시작..." -ForegroundColor Cyan
        Write-Host "  🌐 주소: " -NoNewline -ForegroundColor White
        Write-Host "http://localhost:8000" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "  ⏳ 3초 후 브라우저가 열립니다..." -ForegroundColor Gray
        Start-Sleep -Seconds 3

        # 브라우저 열기
        Start-Process "http://localhost:8000"

        Write-Host ""
        Write-Host "  ════════════════════════════════════════════" -ForegroundColor DarkGray
        Write-Host "  서버 실행 중... 종료하려면 Ctrl+C" -ForegroundColor White
        Write-Host "  ════════════════════════════════════════════" -ForegroundColor DarkGray
        Write-Host ""

        # 서버 시작
        & python -m http.server 8000
    }
    else {
        Write-Host "  ⚠️  서버 프로그램이 설치되지 않았습니다." -ForegroundColor Yellow
        Write-Host "  📂 파일을 직접 엽니다..." -ForegroundColor Cyan
        Write-Host ""

        Start-Process "index.html"

        Write-Host "  ┌────────────────────────────────┐" -ForegroundColor DarkCyan
        Write-Host "  │  사용 방법                     │" -ForegroundColor DarkCyan
        Write-Host "  ├────────────────────────────────┤" -ForegroundColor DarkCyan
        Write-Host "  │  ← → : 슬라이드 이동          │" -ForegroundColor White
        Write-Host "  │  F : 전체화면                  │" -ForegroundColor White
        Write-Host "  │  M : 메뉴                      │" -ForegroundColor White
        Write-Host "  │  1-9 : 섹션 점프               │" -ForegroundColor White
        Write-Host "  │  ESC : 전체화면 종료           │" -ForegroundColor White
        Write-Host "  └────────────────────────────────┘" -ForegroundColor DarkCyan
        Write-Host ""
        Write-Host "  계속하려면 아무 키나 누르세요..." -ForegroundColor Gray
        $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    }
}

Write-Host ""
Write-Host "  발표 시스템이 종료되었습니다." -ForegroundColor Cyan
Write-Host ""