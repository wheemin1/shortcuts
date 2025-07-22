Write-Host "=== ShortcutHub 로컬 개발 환경 시작 ===" -ForegroundColor Green
Write-Host ""

Write-Host "1. API 서버 시작중..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'c:\web\ShortcutHub'; npm run dev:local"

Start-Sleep -Seconds 3

Write-Host "2. 클라이언트 개발 서버 시작중..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'c:\web\ShortcutHub\client'; npm run dev"

Write-Host ""
Write-Host "=== 개발 서버가 시작되었습니다! ===" -ForegroundColor Green
Write-Host "API 서버: http://localhost:3000" -ForegroundColor Cyan
Write-Host "클라이언트: http://localhost:5173" -ForegroundColor Cyan
Write-Host ""
Write-Host "두 PowerShell 창을 열어두고 개발하세요." -ForegroundColor White
Write-Host "종료하려면 각 창에서 Ctrl+C를 누르세요." -ForegroundColor White
