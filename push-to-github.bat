@echo off
setlocal enabledelayedexpansion

echo 🚀 Pushing VandalHub Project to GitHub...
echo 📍 Target Repository: https://github.com/AkshayJod/Vandal

set GITHUB_REPO=https://github.com/AkshayJod/Vandal.git

REM Check if git is installed
git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Git is not installed. Please install Git first.
    pause
    exit /b 1
)

echo ✅ Git is available

REM Initialize git repository if not already initialized
if not exist ".git" (
    echo 📦 Initializing Git repository...
    git init
    echo ✅ Git repository initialized
) else (
    echo ✅ Git repository already exists
)

REM Create .gitignore file
echo 📝 Creating .gitignore file...
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
echo .DS_Store?
echo ._*
echo .Spotlight-V100
echo .Trashes
echo ehthumbs.db
echo Thumbs.db
echo.
echo # Logs
echo logs
echo *.log
echo.
echo # Runtime data
echo pids
echo *.pid
echo *.seed
echo *.pid.lock
echo.
echo # Coverage directory used by tools like istanbul
echo coverage/
echo.
echo # nyc test coverage
echo .nyc_output
echo.
echo # Dependency directories
echo jspm_packages/
echo.
echo # Optional npm cache directory
echo .npm
echo.
echo # Optional REPL history
echo .node_repl_history
echo.
echo # Output of 'npm pack'
echo *.tgz
echo.
echo # Yarn Integrity file
echo .yarn-integrity
echo.
echo # dotenv environment variables file
echo .env
echo.
echo # parcel-bundler cache
echo .cache
echo .parcel-cache
echo.
echo # next.js build output
echo .next
echo.
echo # nuxt.js build output
echo .nuxt
echo.
echo # vuepress build output
echo .vuepress/dist
echo.
echo # Serverless directories
echo .serverless
echo.
echo # FuseBox cache
echo .fusebox/
echo.
echo # DynamoDB Local files
echo .dynamodb/
echo.
echo # TernJS port file
echo .tern-port
echo.
echo # AWS deployment files
echo aws-deployment/
) > .gitignore

echo ✅ .gitignore created

REM Add all files to git
echo 📦 Adding files to Git...
git add .

REM Commit changes
echo 💾 Committing changes...
git commit -m "Initial commit: VandalHub - Modern Repository Management Platform

✨ Features:
- User authentication and profiles  
- Repository management with file editor
- GitHub-like dashboard interface
- Issue tracking system
- Responsive design
- CLI commands for project management

🏗️ Tech Stack:
- Frontend: React 18 + Vite
- Backend: Node.js + Express + MongoDB
- Authentication: JWT
- UI: Modern CSS with GitHub-inspired design"

REM Add remote origin
echo 🔗 Adding GitHub remote...
git remote remove origin 2>nul
git remote add origin %GITHUB_REPO%

REM Push to GitHub
echo 🚀 Pushing to GitHub...
git branch -M main
git push -u origin main

echo.
echo 🎉 Successfully pushed VandalHub to GitHub!
echo.
echo 📋 Summary:
echo 🔗 Repository URL: https://github.com/AkshayJod/Vandal
echo 📁 Files pushed: All VandalHub project files
echo 📖 Documentation: Comprehensive README.md included
echo 🔧 Configuration: .gitignore and project structure set up
echo.
echo 🔧 Next Steps:
echo 1. Visit your GitHub repository to verify the upload
echo 2. Set up GitHub Pages for frontend deployment (optional)
echo 3. Configure GitHub Actions for CI/CD (optional)
echo 4. Add collaborators to your repository
echo 5. Create issues and project boards for task management
echo.
echo ✅ Your VandalHub project is now live on GitHub!

pause
