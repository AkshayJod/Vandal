@echo off
echo 🚀 GitHub Push Fix Script
echo =========================
echo.

REM Step 1: Initialize Git if needed
if not exist ".git" (
    echo 📦 Initializing Git repository...
    git init
    echo ✅ Git initialized
) else (
    echo ✅ Git repository already exists
)
echo.

REM Step 2: Configure Git user (if not set)
echo 🔧 Configuring Git user...
git config user.name "AkshayJod" 2>nul
git config user.email "your-email@example.com" 2>nul
echo ✅ Git user configured
echo.

REM Step 3: Add all files
echo 📁 Adding all files to Git...
git add .
echo ✅ Files added
echo.

REM Step 4: Check if there are changes to commit
git diff --cached --quiet
if errorlevel 1 (
    echo 📝 Creating initial commit...
    git commit -m "Initial commit: VandalHub - Modern Repository Management Platform"
    echo ✅ Initial commit created
) else (
    echo ℹ️  No changes to commit
)
echo.

REM Step 5: Add remote origin (remove existing first)
echo 🔗 Setting up GitHub remote...
git remote remove origin 2>nul
git remote add origin https://github.com/AkshayJod/Vandal.git
echo ✅ Remote origin added
echo.

REM Step 6: Set main branch
echo 🌿 Setting main branch...
git branch -M main
echo ✅ Main branch set
echo.

REM Step 7: Try to push
echo 🚀 Attempting to push to GitHub...
echo.
echo ⚠️  You may be prompted for GitHub credentials
echo    Username: AkshayJod
echo    Password: Use your GitHub Personal Access Token (not your password)
echo.
echo 💡 If you don't have a Personal Access Token:
echo    1. Go to GitHub.com → Settings → Developer settings → Personal access tokens
echo    2. Generate new token with 'repo' permissions
echo    3. Use that token as your password
echo.

git push -u origin main

if errorlevel 1 (
    echo.
    echo ❌ Push failed. Common solutions:
    echo.
    echo 1. Authentication Issue:
    echo    - Use GitHub Desktop for easier authentication
    echo    - Or generate a Personal Access Token from GitHub
    echo.
    echo 2. Repository doesn't exist:
    echo    - Make sure you created the repository on GitHub first
    echo    - Go to https://github.com/AkshayJod/Vandal to verify
    echo.
    echo 3. Network Issue:
    echo    - Check your internet connection
    echo    - Try again in a few minutes
    echo.
    echo 4. Alternative method - Use GitHub Desktop:
    echo    - Download GitHub Desktop
    echo    - Open this folder in GitHub Desktop
    echo    - Publish to GitHub
    echo.
) else (
    echo.
    echo 🎉 SUCCESS! Your project has been pushed to GitHub!
    echo.
    echo 🔗 View your repository at: https://github.com/AkshayJod/Vandal
    echo.
    echo 📋 What's uploaded:
    echo    ✅ Frontend React application
    echo    ✅ Backend Node.js API
    echo    ✅ Database models and controllers
    echo    ✅ Documentation and README
    echo    ✅ CLI tools and scripts
    echo.
    echo 🚀 Next steps:
    echo    1. Visit your GitHub repository
    echo    2. Set up GitHub Pages for frontend deployment
    echo    3. Configure GitHub Actions for CI/CD
    echo    4. Add collaborators if needed
)

echo.
pause
