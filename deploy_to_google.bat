@echo off
title Deploy to Google Firebase Hosting
echo =============================================================
echo   Deploying Vodafone Cashier POS to Google Firebase
echo   Target Project: tast-b91f3
echo =============================================================
echo.
echo [1/2] Checking Google Login...
cmd.exe /c "npx firebase-tools login"
echo.
echo [2/2] Publishing to Google Firebase Hosting...
cmd.exe /c "npx firebase-tools deploy --only hosting --project tast-b91f3"
echo.
echo =============================================================
echo   Success! Your website is online on Google:
echo   Link: https://tast-b91f3.web.app
echo   Link: https://tast-b91f3.firebaseapp.com
echo =============================================================
pause
