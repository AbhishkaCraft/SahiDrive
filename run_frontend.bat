@echo off
echo ========================================================
echo Starting SahiDrive React + Vite Frontend (Port 5173)
echo ========================================================
set PATH=C:\Users\91789\AppData\Local\Programs\nodejs;%PATH%
cd /d "%~dp0frontend"
npm run dev
pause
