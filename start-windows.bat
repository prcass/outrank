@echo off
echo Starting Know-It-All Game Server...
echo.
echo If localhost doesn't work, try one of these URLs:
echo   - http://localhost:8000
echo   - http://127.0.0.1:8000
echo   - http://192.168.37.29:8000
echo.
echo Starting server...
wsl python3 -m http.server 8000 --bind 0.0.0.0