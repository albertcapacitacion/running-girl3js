@echo off
setlocal

cd /d "%~dp0"
echo Starting Running Girl with hot reload on http://localhost:5200/
echo Press Ctrl+C to stop the server.

call npm exec -- vite --host 0.0.0.0 --port 5200

endlocal
