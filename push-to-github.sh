#!/bin/bash

# VandalHub Project - Push to GitHub
# This script will push your VandalHub project to GitHub

set -e

echo "🚀 Pushing VandalHub Project to GitHub..."
echo "📍 Target Repository: https://github.com/AkshayJod/Vandal"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# GitHub repository URL
GITHUB_REPO="https://github.com/AkshayJod/Vandal.git"

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ Git is not installed. Please install Git first.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Git is available${NC}"

# Initialize git repository if not already initialized
if [ ! -d ".git" ]; then
    echo -e "${YELLOW}📦 Initializing Git repository...${NC}"
    git init
    echo -e "${GREEN}✅ Git repository initialized${NC}"
else
    echo -e "${GREEN}✅ Git repository already exists${NC}"
fi

# Create .gitignore file
echo -e "${YELLOW}📝 Creating .gitignore file...${NC}"
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Production builds
/frontend-main/dist/
/frontend-main/build/
/backend-main/dist/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE files
.vscode/
.idea/
*.swp
*.swo

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Logs
logs
*.log

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/

# nyc test coverage
.nyc_output

# Dependency directories
jspm_packages/

# Optional npm cache directory
.npm

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variables file
.env

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# next.js build output
.next

# nuxt.js build output
.nuxt

# vuepress build output
.vuepress/dist

# Serverless directories
.serverless

# FuseBox cache
.fusebox/

# DynamoDB Local files
.dynamodb/

# TernJS port file
.tern-port

# AWS deployment files
aws-deployment/
EOF

echo -e "${GREEN}✅ .gitignore created${NC}"

# Create comprehensive README.md
echo -e "${YELLOW}📖 Creating README.md...${NC}"
cat > README.md << 'EOF'
# 🚀 VandalHub

A modern, GitHub-like repository management platform built with React and Node.js.

![VandalHub Logo](https://img.shields.io/badge/VandalHub-Repository%20Platform-blue)
![React](https://img.shields.io/badge/React-18.x-blue)
![Node.js](https://img.shields.io/badge/Node.js-18.x-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green)

## ✨ Features

- 🔐 **User Authentication** - Secure login/signup system
- 📁 **Repository Management** - Create, edit, and manage repositories
- 📝 **File Editor** - Built-in code editor with syntax highlighting
- 🔍 **Search & Filter** - Find repositories and files easily
- 👥 **User Profiles** - Customizable user profiles with avatars
- 📊 **Dashboard** - Clean, GitHub-like dashboard interface
- 🎯 **Issue Tracking** - Create and manage project issues
- 🌐 **Responsive Design** - Works on all devices
- 🎨 **Modern UI** - Clean, professional interface

## 🏗️ Architecture

### Frontend (React + Vite)
- **Framework**: React 18 with Vite
- **Styling**: CSS3 with modern design patterns
- **State Management**: React Context API
- **Routing**: React Router
- **HTTP Client**: Axios

### Backend (Node.js + Express)
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT tokens
- **File Upload**: Multer
- **CORS**: Enabled for cross-origin requests

### Database Schema
- **Users**: Authentication and profile data
- **Repositories**: Project information and file content
- **Issues**: Project issue tracking
- **Files**: Repository file management

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- MongoDB running locally or MongoDB Atlas account
- Git installed

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/AkshayJod/Vandal.git
cd Vandal
```

2. **Install dependencies**
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend-main
npm install

# Install frontend dependencies
cd ../frontend-main
npm install
```

3. **Environment Setup**
```bash
# Create .env file in backend-main directory
cd backend-main
cp .env.example .env
# Edit .env with your MongoDB connection string and JWT secret
```

4. **Start the application**
```bash
# Start backend (from backend-main directory)
npm start

# Start frontend (from frontend-main directory)
cd ../frontend-main
npm run dev
```

5. **Access the application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

## 📁 Project Structure

```
VandalHub/
├── 📂 frontend-main/          # React frontend application
│   ├── 📂 src/
│   │   ├── 📂 components/     # React components
│   │   ├── 📂 pages/          # Page components
│   │   ├── 📂 context/        # React context
│   │   └── 📂 assets/         # Static assets
│   ├── 📄 package.json
│   └── 📄 vite.config.js
├── 📂 backend-main/           # Node.js backend API
│   ├── 📂 controllers/        # Route controllers
│   ├── 📂 models/             # MongoDB models
│   ├── 📂 routes/             # API routes
│   ├── 📂 middleware/         # Custom middleware
│   ├── 📄 index.js           # Server entry point
│   └── 📄 package.json
├── 📂 vandalhub-project/      # Project documentation
├── 📄 vandalhub-commands.js   # CLI commands
├── 📄 README.md
└── 📄 package.json
```

## 🛠️ API Endpoints

### Authentication
- `POST /register` - User registration
- `POST /login` - User login
- `GET /user/:id` - Get user profile

### Repositories
- `GET /repo/all` - Get all repositories
- `POST /repo/create` - Create new repository
- `GET /repo/:id` - Get repository by ID
- `PUT /repo/update/:id` - Update repository
- `DELETE /repo/delete/:id` - Delete repository

### Files
- `POST /repo/:id/files` - Add file to repository
- `GET /repo/:id/files/:filename` - Get file content
- `PUT /repo/:id/files/:filename` - Update file
- `DELETE /repo/:id/files/:filename` - Delete file

## 🎯 Usage Examples

### Creating a Repository
```javascript
// Using the CLI
node vandalhub-commands.js create "my-project" "My awesome project"

// Using the API
POST /repo/create
{
  "name": "my-project",
  "description": "My awesome project",
  "visibility": true,
  "owner": "user_id"
}
```

### Uploading a Project
```bash
# Upload entire directory
node vandalhub-commands.js upload ./my-project "uploaded-project" "Description"
```

## 🔧 Configuration

### Environment Variables (Backend)
```env
MONGODB_URI=mongodb://localhost:27017/vandalhub
JWT_SECRET=your_jwt_secret_key
PORT=3000
NODE_ENV=development
```

### Frontend Configuration
Update API base URL in frontend if needed:
```javascript
// src/config.js
export const API_BASE_URL = 'http://localhost:3000';
```

## 🚀 Deployment

### AWS Deployment
- Frontend: S3 + CloudFront
- Backend: EC2 or ECS
- Database: DocumentDB or MongoDB Atlas

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up --build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Akshay Jod**
- GitHub: [@AkshayJod](https://github.com/AkshayJod)
- Repository: [VandalHub](https://github.com/AkshayJod/Vandal)

## 🙏 Acknowledgments

- Inspired by GitHub's interface and functionality
- Built with modern web technologies
- Designed for developers and teams

---

⭐ **Star this repository if you find it helpful!**
EOF

echo -e "${GREEN}✅ README.md created${NC}"

# Add all files to git
echo -e "${YELLOW}📦 Adding files to Git...${NC}"
git add .

# Commit changes
echo -e "${YELLOW}💾 Committing changes...${NC}"
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

# Add remote origin
echo -e "${YELLOW}🔗 Adding GitHub remote...${NC}"
git remote remove origin 2>/dev/null || true
git remote add origin $GITHUB_REPO

# Push to GitHub
echo -e "${YELLOW}🚀 Pushing to GitHub...${NC}"
git branch -M main
git push -u origin main

echo ""
echo -e "${GREEN}🎉 Successfully pushed VandalHub to GitHub!${NC}"
echo ""
echo "📋 Summary:"
echo -e "${BLUE}🔗 Repository URL: https://github.com/AkshayJod/Vandal${NC}"
echo -e "${BLUE}📁 Files pushed: All VandalHub project files${NC}"
echo -e "${BLUE}📖 Documentation: Comprehensive README.md included${NC}"
echo -e "${BLUE}🔧 Configuration: .gitignore and project structure set up${NC}"
echo ""
echo -e "${YELLOW}🔧 Next Steps:${NC}"
echo "1. Visit your GitHub repository to verify the upload"
echo "2. Set up GitHub Pages for frontend deployment (optional)"
echo "3. Configure GitHub Actions for CI/CD (optional)"
echo "4. Add collaborators to your repository"
echo "5. Create issues and project boards for task management"
echo ""
echo -e "${GREEN}✅ Your VandalHub project is now live on GitHub!${NC}"
