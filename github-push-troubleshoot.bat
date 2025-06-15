@echo off
echo 🔍 GitHub Push Troubleshooting Script
echo =====================================
echo.

REM Check if we're in the right directory
echo 📁 Current directory: %CD%
echo.

REM Check if git is installed
echo 🔧 Checking Git installation...
git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Git is not installed or not in PATH
    echo Please install Git from: https://git-scm.com/download/win
    pause
    exit /b 1
) else (
    echo ✅ Git is installed
    git --version
)
echo.

REM Check if this is a git repository
echo 📦 Checking if this is a Git repository...
if exist ".git" (
    echo ✅ This is a Git repository
) else (
    echo ❌ This is not a Git repository
    echo Initializing Git repository...
    git init
    echo ✅ Git repository initialized
)
echo.

REM Check git status
echo 📋 Checking Git status...
git status
echo.

REM Check if remote origin exists
echo 🔗 Checking remote repositories...
git remote -v
echo.

REM Check if there are any commits
echo 📝 Checking commit history...
git log --oneline -5 2>nul
if errorlevel 1 (
    echo ❌ No commits found
    echo You need to make your first commit
) else (
    echo ✅ Commits found
)
echo.

REM Check GitHub repository accessibility
echo 🌐 Testing GitHub repository access...
curl -s -I https://github.com/AkshayJod/Vandal >nul 2>&1
if errorlevel 1 (
    echo ⚠️  Cannot reach GitHub or repository
    echo Please check your internet connection and repository URL
) else (
    echo ✅ GitHub repository is accessible
)
echo.

echo 🔧 Suggested Solutions:
echo.
echo 1. If no commits: Run the following commands:
echo    git add .
echo    git commit -m "Initial commit"
echo.
echo 2. If no remote: Run the following command:
echo    git remote add origin https://github.com/AkshayJod/Vandal.git
echo.
echo 3. If authentication issues: 
echo    - Use GitHub Desktop
echo    - Or set up SSH keys
echo    - Or use Personal Access Token
echo.
echo 4. If repository doesn't exist:
echo    - Make sure you created the repository on GitHub
echo    - Check the repository URL is correct
echo.

pause
