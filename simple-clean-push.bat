@echo off
echo Pushing clean VandalHub to GitHub...

echo Creating .gitignore...
echo node_modules/ > .gitignore
echo .env >> .gitignore
echo *.log >> .gitignore
echo dist/ >> .gitignore
echo build/ >> .gitignore

echo Adding only essential files...
git add frontend-main/
git add backend-main/
git add vandalhub-project/
git add vandalhub-commands.js
git add package.json
git add README.md
git add .gitignore

echo Creating commit...
git commit -m "VandalHub: Modern Repository Management Platform"

echo Setting up remote...
git remote remove origin 2>nul
git remote add origin https://github.com/AkshayJod/Vandal.git

echo Pushing to GitHub...
git push -u origin main

echo Done! Check https://github.com/AkshayJod/Vandal
pause
