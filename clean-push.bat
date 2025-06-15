@echo off
echo Creating clean GitHub repository...

echo Step 1: Removing unnecessary files...

REM Remove test files
del /f /q test-*.js 2>nul
del /f /q quick-*.js 2>nul
del /f /q upload-*.js 2>nul
del /f /q optimize-*.js 2>nul
del /f /q fix-*.js 2>nul
del /f /q create-demo-*.js 2>nul
del /f /q assign-*.js 2>nul
del /f /q push-*.js 2>nul

REM Remove documentation files (keep only main README)
del /f /q BACKEND_INTEGRATION_SUCCESS.md 2>nul
del /f /q COMPLETE_PROFILE_SYSTEM.md 2>nul
del /f /q LOGOUT_FIX_SUMMARY.md 2>nul
del /f /q OPTIMIZATION_REPORT.md 2>nul
del /f /q PROFILE_PHOTO_SYSTEM.md 2>nul
del /f /q PROJECT_STATUS.md 2>nul
del /f /q VANDALHUB_LOGO_CHANGES.md 2>nul
del /f /q 3D_ANIMATIONS_IMPLEMENTATION.md 2>nul
del /f /q manual-commands.md 2>nul

REM Remove setup files
del /f /q setup-*.html 2>nul

REM Remove other batch files (except this one)
del /f /q auto-push.bat 2>nul
del /f /q fix-push.bat 2>nul
del /f /q cleanup-files.bat 2>nul
del /f /q push-to-github.bat 2>nul
del /f /q github-push-troubleshoot.bat 2>nul
del /f /q simple-test.bat 2>nul

echo Step 2: Creating clean .gitignore...
(
echo # Dependencies
echo node_modules/
echo npm-debug.log*
echo yarn-debug.log*
echo yarn-error.log*
echo.
echo # Production builds
echo /frontend-main/dist/
echo /frontend-main/build/
echo /backend-main/dist/
echo.
echo # Environment variables
echo .env
echo .env.local
echo .env.development.local
echo .env.test.local
echo .env.production.local
echo.
echo # IDE files
echo .vscode/
echo .idea/
echo *.swp
echo *.swo
echo.
echo # OS generated files
echo .DS_Store
echo Thumbs.db
echo.
echo # Logs
echo logs
echo *.log
echo.
echo # Temporary files
echo *.tmp
echo *.temp
) > .gitignore

echo Step 3: Adding files to Git...
git add .

echo Step 4: Creating commit...
git commit -m "VandalHub: Modern Repository Management Platform

Features:
- React frontend with modern UI
- Node.js backend with MongoDB
- User authentication and profiles
- Repository and file management
- Issue tracking system
- CLI tools for project management"

echo Step 5: Setting up GitHub remote...
git remote remove origin 2>nul
git remote add origin https://github.com/AkshayJod/Vandal.git

echo Step 6: Pushing to GitHub...
git push -u origin main

echo.
echo Clean push complete!
echo Check your repository: https://github.com/AkshayJod/Vandal
echo.
echo Files included:
echo - frontend-main/ (React application)
echo - backend-main/ (Node.js API)
echo - vandalhub-project/ (Documentation)
echo - vandalhub-commands.js (CLI tools)
echo - package.json (Dependencies)
echo - README.md (Documentation)
echo - .gitignore (Git configuration)

pause
