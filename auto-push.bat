@echo off
echo Auto-pushing VandalHub to GitHub...

git init
git add .
git commit -m "VandalHub - Complete repository management platform"
git branch -M main
git remote add origin https://github.com/AkshayJod/Vandal.git
git push -u origin main

echo Done! Check https://github.com/AkshayJod/Vandal
pause
