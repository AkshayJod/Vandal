# 🚀 VandalHub - Complete Project Setup & Commands Guide

A MERN based GitHub replica with custom version control implemented from scratch.

## 📋 Table of Contents
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Running the Project](#running-the-project)
- [Adding Files to Repository](#adding-files-to-repository)
- [API Commands](#api-commands)
- [CLI Commands](#cli-commands)
- [Utility Scripts](#utility-scripts)
- [Troubleshooting](#troubleshooting)

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Git

### 1. Clone & Install
```bash
# Clone the repository
git clone <your-repo-url>
cd vandal

# Install root dependencies
npm install

# Install backend dependencies
cd backend-main
npm install

# Install frontend dependencies
cd ../frontend-main
npm install
```

### 2. Environment Setup
Create `.env` file in `backend-main/` directory:
```env
MONGODB_URI=mongodb://localhost:27017/vandalhub
JWT_SECRET=your-jwt-secret-key
PORT=3000
AWS_ACCESS_KEY_ID=your-aws-key (optional)
AWS_SECRET_ACCESS_KEY=your-aws-secret (optional)
```

### 3. Start the Application
```bash
# Terminal 1: Start Backend Server
cd backend-main
npm start
# Server runs on http://localhost:3000

# Terminal 2: Start Frontend Development Server
cd frontend-main
npm run dev
# Frontend runs on http://localhost:5175
```

## 📁 Project Structure
```
vandal/
├── backend-main/           # Express.js backend server
│   ├── controllers/        # API route controllers
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── config/            # Configuration files
│   └── index.js           # Main server file
├── frontend-main/         # React.js frontend
│   ├── src/               # React source files
│   ├── public/            # Static assets
│   └── index.html         # Main HTML file
├── utility scripts/       # Helper scripts for automation
├── manual-commands.md     # Detailed command reference
└── package.json           # Root dependencies
```

## 🔧 Installation & Setup

### Step 1: Install Dependencies
```bash
# Root directory
npm install

# Backend dependencies
cd backend-main
npm install

# Frontend dependencies
cd ../frontend-main
npm install
cd ..
```

### Step 2: Database Setup
```bash
# Start MongoDB (if using local installation)
mongod

# Or use MongoDB Atlas cloud connection
# Update MONGODB_URI in backend-main/.env
```

### Step 3: Environment Configuration
```bash
# Create environment file
cd backend-main
touch .env

# Add required variables:
echo "MONGODB_URI=mongodb://localhost:27017/vandalhub" >> .env
echo "JWT_SECRET=your-super-secret-jwt-key" >> .env
echo "PORT=3000" >> .env
```

## 🏃‍♂️ Running the Project

### Development Mode
```bash
# Method 1: Run both servers simultaneously
# Terminal 1 - Backend
cd backend-main && npm start

# Terminal 2 - Frontend
cd frontend-main && npm run dev

# Method 2: Using the CLI tool
cd backend-main
node index.js start
```

### Production Mode
```bash
# Build frontend
cd frontend-main
npm run build

# Start backend in production
cd ../backend-main
NODE_ENV=production npm start
```

### Access Points
- **Frontend UI**: http://localhost:5175
- **Backend API**: http://localhost:3000
- **API Documentation**: http://localhost:3000/api-docs (if available)

## 📂 Adding Files to Repository

### Method 1: Web Interface (Recommended for Beginners)
1. Open http://localhost:5175
2. Click "Create Repository" or "New"
3. Fill in repository details
4. Use "Add file" button to upload files
5. Use built-in editor to create/edit files

### Method 2: Interactive Script (Recommended for Multiple Files)
```bash
# Quick project creator with interactive prompts
node quick-add-project.js

# Follow the prompts:
# 1. Enter project name
# 2. Enter description
# 3. Choose visibility (public/private)
# 4. Add topics/tags
# 5. Choose file addition method:
#    - Empty repository
#    - Manual file entry
#    - Upload from directory
```

### Method 3: API Calls (For Automation)
```bash
# Create repository with files
curl -X POST http://localhost:3000/repo/create \
  -H "Content-Type: application/json" \
  -d '{
    "name": "my-project",
    "description": "My awesome project",
    "visibility": true,
    "owner": "684a9cd5b8e2fd9a4febe094",
    "content": [
      {
        "name": "README.md",
        "content": "# My Project\n\nProject description here",
        "type": "file"
      },
      {
        "name": "index.js",
        "content": "console.log(\"Hello World!\");",
        "type": "file"
      }
    ],
    "topics": ["javascript", "nodejs"]
  }'
```

### Method 4: CLI Commands (Git-like Interface)
```bash
cd backend-main

# Initialize new repository
node index.js init

# Add files to staging
node index.js add filename.txt

# Commit changes
node index.js commit "Initial commit"

# Push to cloud storage
node index.js push

# Pull from cloud storage
node index.js pull
```

## 🌐 API Commands

### Repository Management
```bash
# Get all repositories
curl -X GET http://localhost:3000/repo/all

# Get specific repository
curl -X GET http://localhost:3000/repo/REPO_ID

# Delete repository
curl -X DELETE http://localhost:3000/repo/delete/REPO_ID

# Update repository
curl -X PUT http://localhost:3000/repo/REPO_ID \
  -H "Content-Type: application/json" \
  -d '{"name": "updated-name", "description": "Updated description"}'
```

### File Operations
```bash
# Add file to existing repository
curl -X POST http://localhost:3000/repo/REPO_ID/files \
  -H "Content-Type: application/json" \
  -d '{
    "name": "newfile.js",
    "content": "// New file content",
    "type": "file",
    "path": "newfile.js"
  }'

# Update existing file
curl -X PUT http://localhost:3000/repo/REPO_ID/files/filename.js \
  -H "Content-Type: application/json" \
  -d '{
    "content": "// Updated content",
    "commitMessage": "Update filename.js"
  }'

# Delete file
curl -X DELETE http://localhost:3000/repo/REPO_ID/files/filename.js
```

### User Operations
```bash
# Get user profile
curl -X GET http://localhost:3000/user/USER_ID

# Update user profile
curl -X PUT http://localhost:3000/user/USER_ID \
  -H "Content-Type: application/json" \
  -d '{"name": "New Name", "email": "new@email.com"}'
```

## 💻 CLI Commands (Git-like Interface)

All CLI commands are run from the `backend-main` directory:

```bash
cd backend-main

# Repository Management
node index.js init                    # Initialize new repository
node index.js clone REPO_URL          # Clone repository
node index.js status                  # Show repository status

# File Operations
node index.js add filename.txt        # Add file to staging
node index.js add .                   # Add all files to staging
node index.js remove filename.txt     # Remove file from staging

# Commit Operations
node index.js commit "message"        # Commit staged changes
node index.js commit -m "message"     # Commit with message flag
node index.js log                     # Show commit history

# Remote Operations
node index.js push                    # Push to remote storage
node index.js pull                    # Pull from remote storage
node index.js fetch                   # Fetch remote changes

# Branch Operations (if implemented)
node index.js branch                  # List branches
node index.js branch new-branch       # Create new branch
node index.js checkout branch-name    # Switch to branch

# Advanced Operations
node index.js revert COMMIT_HASH      # Revert to specific commit
node index.js diff                    # Show differences
node index.js merge branch-name       # Merge branch

# Server Operations
node index.js start                   # Start the server
node index.js --help                  # Show help information
```

## 🛠️ Utility Scripts

### 1. Quick Project Creator
```bash
# Interactive project creation
node quick-add-project.js

# With help
node quick-add-project.js --help
```

### 2. Batch Upload Scripts
```bash
# Upload complete project directory
node upload-complete-files.js

# Upload all files in current directory
node upload-all-files.js

# Push optimized project
node push-project-optimized.js
```

### 3. Demo & Test Scripts
```bash
# Create demo repository
node create-demo-repo.js

# Create demo project
node create-demo-project.js

# Test API endpoints
node test-api.js

# Test repository creation
node test-repo-creation.js
```

### 4. VandalHub Commands
```bash
# Run VandalHub specific commands
node vandalhub-commands.js
```

## 🔧 Development Commands

### Frontend Development
```bash
cd frontend-main

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm run test

# Lint code
npm run lint
```

### Backend Development
```bash
cd backend-main

# Start server
npm start

# Start with nodemon (if installed)
npm run dev

# Run tests (if available)
npm test
```

### Database Operations
```bash
# Connect to MongoDB shell
mongo

# Or with MongoDB Compass
# Use connection string: mongodb://localhost:27017/vandalhub

# Backup database
mongodump --db vandalhub --out ./backup

# Restore database
mongorestore --db vandalhub ./backup/vandalhub
```

## 🚨 Troubleshooting

### Common Issues & Solutions

#### 1. Server Won't Start
```bash
# Check if port is already in use
lsof -i :3000  # Backend port
lsof -i :5175  # Frontend port

# Kill process using port
kill -9 PID_NUMBER

# Or use different port
PORT=3001 npm start
```

#### 2. MongoDB Connection Issues
```bash
# Check MongoDB status
brew services list | grep mongodb  # macOS
sudo systemctl status mongod       # Linux
net start MongoDB                  # Windows

# Start MongoDB service
brew services start mongodb-community  # macOS
sudo systemctl start mongod            # Linux
net start MongoDB                      # Windows

# Check connection string in .env file
MONGODB_URI=mongodb://localhost:27017/vandalhub
```

#### 3. Frontend Build Issues
```bash
cd frontend-main

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf node_modules/.vite
npm run dev
```

#### 4. API Endpoints Not Working
```bash
# Check backend server is running
curl http://localhost:3000/health

# Check CORS settings in backend
# Verify frontend URL is allowed in CORS configuration

# Check network requests in browser DevTools
# F12 -> Network tab -> Check failed requests
```

#### 5. File Upload Issues
```bash
# Check file size limits in backend
# Verify multer configuration if using file uploads

# Check file permissions
chmod 755 filename

# Verify file encoding (should be UTF-8)
file -I filename
```

### Environment Variables Checklist
```bash
# backend-main/.env should contain:
MONGODB_URI=mongodb://localhost:27017/vandalhub
JWT_SECRET=your-jwt-secret-key-here
PORT=3000
NODE_ENV=development

# Optional AWS settings for cloud storage:
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
```

## 📚 Additional Resources

### Useful Commands for Development
```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Check MongoDB version
mongo --version

# Check Git version
git --version

# View running processes
ps aux | grep node

# Monitor server logs
tail -f backend-main/logs/server.log  # if logging to file
```

### Quick Aliases (Add to ~/.bashrc or ~/.zshrc)
```bash
# VandalHub development aliases
alias vh-start="cd ~/path/to/vandal/backend-main && npm start"
alias vh-dev="cd ~/path/to/vandal/frontend-main && npm run dev"
alias vh-create="node ~/path/to/vandal/quick-add-project.js"
alias vh-web="open http://localhost:5175"
alias vh-api="curl -X GET http://localhost:3000/repo/all"
```

### Testing the Installation
```bash
# 1. Test backend API
curl http://localhost:3000/repo/all

# 2. Test frontend access
curl http://localhost:5175

# 3. Test database connection
cd backend-main
node -e "
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/vandalhub')
  .then(() => console.log('✅ Database connected'))
  .catch(err => console.log('❌ Database error:', err));
"

# 4. Test file creation
node quick-add-project.js
```

## 🎯 Recommended Workflows

### For New Users
1. Follow [Quick Start](#quick-start) guide
2. Use Web Interface at http://localhost:5175
3. Create first repository using "Create Repository" button
4. Upload files using drag-and-drop or "Add file" button

### For Developers
1. Use CLI commands for Git-like workflow
2. Use API endpoints for automation
3. Use utility scripts for batch operations
4. Set up development aliases for faster access

### For Automation
1. Use REST API with curl or axios
2. Create custom scripts using provided examples
3. Use batch upload scripts for multiple files
4. Set up CI/CD pipelines using API endpoints

## 📞 Support & Documentation

- **Manual Commands**: See `manual-commands.md` for detailed command reference
- **API Documentation**: Available at backend endpoints
- **Frontend UI**: http://localhost:5175
- **Backend API**: http://localhost:3000
- **Database**: MongoDB at localhost:27017

## 🚀 Ready to Go!

Your VandalHub platform is now ready! Start with the web interface at http://localhost:5175 or use any of the command-line tools for advanced operations.

**Happy coding! 🎉**
