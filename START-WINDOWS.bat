@echo off
cd /d "%~dp0"
where node >nul 2>nul
if %ERRORLEVEL% EQU 0 (
  start "" "http://127.0.0.1:4173"
  node server.cjs
  goto :end
)
where py >nul 2>nul
if %ERRORLEVEL% EQU 0 (
  echo Node.js not found. Starting with Python instead.
  start "" "http://127.0.0.1:4173"
  py -3 -m http.server 4173 --bind 127.0.0.1
  goto :end
)
echo Node.js or Python is needed to run a local web server.
echo Please install Node.js from https://nodejs.org/ and run this file again.
pause
:end
