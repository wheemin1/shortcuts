@echo off
echo "=== ShortcutHub 로컬 개발 환경 시작 ==="
echo.

echo "1. API 서버 시작중..."
start "API Server" cmd /k "cd /d c:\web\ShortcutHub && npm run dev:local"

timeout /t 3 /nobreak > nul

echo "2. 클라이언트 개발 서버 시작중..."
start "Client Dev Server" cmd /k "cd /d c:\web\ShortcutHub\client && npm run dev"

echo.
echo "=== 개발 서버가 시작되었습니다! ==="
echo "API 서버: http://localhost:3000"
echo "클라이언트: http://localhost:5174"
echo.
echo "두 창을 열어두고 개발하세요."
echo "종료하려면 각 창에서 Ctrl+C를 누르세요."
