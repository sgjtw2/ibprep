@echo off
wscript "%~dp0serve-hidden.vbs"
timeout /t 2 /nobreak >nul
start "" "http://localhost:5500/login.html"
