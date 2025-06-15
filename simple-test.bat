@echo off
echo 🔍 Simple GitHub Test
echo ====================
echo.

echo Current directory: %CD%
echo.

echo Testing Git installation...
git --version
if errorlevel 1 (
    echo ❌ Git not found
    pause
    exit
)
echo.

echo Checking if .git folder exists...
if exist ".git" (
    echo ✅ Git repository exists
) else (
    echo ❌ No Git repository found
    echo Initializing...
    git init
)
echo.

echo Checking Git status...
git status
echo.

echo Checking remotes...
git remote -v
echo.

echo Testing GitHub connectivity...
ping github.com -n 1
echo.

pause
