const axios = require('axios');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3000';

// Function to read file content safely
function readFileContent(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return content;
  } catch (error) {
    console.log(`⚠️  Could not read ${filePath}: ${error.message}`);
    return `# ${path.basename(filePath)}\n\nFile content could not be read.`;
  }
}

// Function to check if file exists
function fileExists(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch (error) {
    return false;
  }
}

async function uploadCompleteFiles() {
  console.log('🚀 Uploading Complete Project Files...\n');

  // Repository ID for the complete source repository
  const repositoryId = '684d4cf10e2700ac776c3666';

  // Define all the files we want to upload
  const filesToUpload = [
    // Backend files
    { localPath: '../backend-main/controllers/userController.js', repoPath: 'backend/controllers/userController.js' },
    { localPath: '../backend-main/models/User.js', repoPath: 'backend/models/User.js' },
    { localPath: '../backend-main/models/Repository.js', repoPath: 'backend/models/Repository.js' },
    { localPath: '../backend-main/routes/user.router.js', repoPath: 'backend/routes/user.router.js' },
    { localPath: '../backend-main/routes/main.router.js', repoPath: 'backend/routes/main.router.js' },
    { localPath: '../backend-main/config/database.js', repoPath: 'backend/config/database.js' },
    { localPath: '../backend-main/.env.example', repoPath: 'backend/.env.example' },

    // Frontend core files
    { localPath: 'src/authContext.jsx', repoPath: 'frontend/src/authContext.jsx' },
    { localPath: 'vite.config.js', repoPath: 'frontend/vite.config.js' },
    { localPath: 'src/App.jsx', repoPath: 'frontend/src/App.jsx' },

    // Frontend components - Dashboard
    { localPath: 'src/components/dashboard/Dashboard.jsx', repoPath: 'frontend/src/components/dashboard/Dashboard.jsx' },

    // Frontend components - Repository
    { localPath: 'src/components/repository/CreateRepository.jsx', repoPath: 'frontend/src/components/repository/CreateRepository.jsx' },
    { localPath: 'src/components/repository/RepositoriesList.jsx', repoPath: 'frontend/src/components/repository/RepositoriesList.jsx' },

    // Frontend components - Auth
    { localPath: 'src/components/auth/Login.jsx', repoPath: 'frontend/src/components/auth/Login.jsx' },
    { localPath: 'src/components/auth/Signup.jsx', repoPath: 'frontend/src/components/auth/Signup.jsx' },

    // Frontend components - User
    { localPath: 'src/components/user/Profile.jsx', repoPath: 'frontend/src/components/user/Profile.jsx' },

    // Frontend components - Other
    { localPath: 'src/components/Footer.jsx', repoPath: 'frontend/src/components/Footer.jsx' },

    // CSS files
    { localPath: 'src/components/repository/repository.css', repoPath: 'frontend/src/components/repository/repository.css' },
    { localPath: 'src/components/auth/auth.css', repoPath: 'frontend/src/components/auth/auth.css' },
    { localPath: 'src/components/user/profile.css', repoPath: 'frontend/src/components/user/profile.css' },

    // Configuration files
    { localPath: 'eslint.config.js', repoPath: 'frontend/eslint.config.js' },
    { localPath: '.gitignore', repoPath: 'frontend/.gitignore' },

    // Documentation files from vandalhub-project if they exist
    { localPath: '../vandalhub-project/README.md', repoPath: 'docs/PROJECT_README.md' },
    { localPath: '../vandalhub-project/API.md', repoPath: 'docs/API.md' },
    { localPath: '../vandalhub-project/FEATURES.md', repoPath: 'docs/FEATURES.md' },
    { localPath: '../vandalhub-project/DEPLOYMENT.md', repoPath: 'docs/DEPLOYMENT.md' },
  ];

  console.log(`📁 Preparing to upload ${filesToUpload.length} files...\n`);

  let successCount = 0;
  let errorCount = 0;

  // Upload files one by one to avoid payload size issues
  for (const file of filesToUpload) {
    try {
      if (!fileExists(file.localPath)) {
        console.log(`⚠️  File not found: ${file.localPath}`);
        continue;
      }

      const content = readFileContent(file.localPath);
      
      // Check if file already exists in repository
      try {
        const existingFileResponse = await axios.get(`${BASE_URL}/repo/${repositoryId}/files/${encodeURIComponent(file.repoPath)}`);
        console.log(`📝 Updating existing file: ${file.repoPath}`);
        
        // Update existing file
        await axios.put(`${BASE_URL}/repo/${repositoryId}/files/${encodeURIComponent(file.repoPath)}`, {
          content: content,
          commitMessage: `Update ${file.repoPath}`
        });
        
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.log(`📄 Adding new file: ${file.repoPath}`);
          
          // Add new file
          await axios.post(`${BASE_URL}/repo/${repositoryId}/files`, {
            name: file.repoPath,
            content: content,
            type: 'file',
            path: file.repoPath
          });
        } else {
          throw error;
        }
      }

      successCount++;
      console.log(`✅ Successfully processed: ${file.repoPath}`);
      
      // Small delay to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 100));

    } catch (error) {
      errorCount++;
      console.log(`❌ Failed to upload ${file.repoPath}: ${error.response?.data?.error || error.message}`);
    }
  }

  console.log(`\n🎉 Upload Complete!`);
  console.log(`✅ Successfully uploaded: ${successCount} files`);
  console.log(`❌ Failed uploads: ${errorCount} files`);
  console.log(`\n🌐 View your complete project at:`);
  console.log(`http://localhost:5175/repository/${repositoryId}`);

  // Also create a new repository with better organization
  await createOrganizedRepository();
}

async function createOrganizedRepository() {
  console.log('\n🏗️  Creating a new organized repository...');

  const organizedFiles = [];

  // Add a comprehensive README
  organizedFiles.push({
    name: 'README.md',
    content: `# 🚀 VandalHub - Complete Project Repository

This repository contains the complete source code for the VandalHub platform - a modern GitHub-like repository management system.

## 📁 Project Structure

\`\`\`
vandalhub/
├── backend/                    # Backend server (Node.js + Express)
│   ├── controllers/           # API controllers
│   │   ├── repoController.js  # Repository management
│   │   └── userController.js  # User management
│   ├── models/               # Database models
│   │   ├── Repository.js     # Repository schema
│   │   └── User.js          # User schema
│   ├── routes/              # API routes
│   │   ├── repo.router.js   # Repository routes
│   │   ├── user.router.js   # User routes
│   │   └── main.router.js   # Main router
│   ├── config/              # Configuration
│   │   └── database.js      # Database connection
│   ├── index.js            # Main server file
│   └── package.json        # Dependencies
├── frontend/                  # Frontend app (React + Vite)
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── auth/       # Authentication components
│   │   │   ├── dashboard/  # Dashboard components
│   │   │   ├── repository/ # Repository components
│   │   │   ├── user/       # User profile components
│   │   │   ├── Navbar.jsx  # Navigation component
│   │   │   └── Footer.jsx  # Footer component
│   │   ├── authContext.jsx # Authentication context
│   │   ├── Routes.jsx      # Application routing
│   │   ├── main.jsx        # Application entry
│   │   └── index.css       # Global styles
│   ├── index.html          # HTML template
│   ├── package.json        # Dependencies
│   └── vite.config.js      # Vite configuration
└── docs/                     # Documentation
    ├── API.md               # API documentation
    ├── FEATURES.md          # Feature documentation
    └── DEPLOYMENT.md        # Deployment guide
\`\`\`

## ✨ Features Implemented

### 🏗️ Backend Features
- **RESTful API** - Complete REST API with Express.js
- **Database Integration** - MongoDB with Mongoose ODM
- **Authentication** - JWT-based user authentication
- **Repository Management** - Full CRUD operations
- **File Management** - File upload, edit, delete operations
- **User Management** - User registration, login, profiles
- **Real-time Features** - Socket.IO integration

### 🎨 Frontend Features
- **Modern React App** - Built with React 18 and Vite
- **Responsive Design** - GitHub-inspired dark theme
- **Repository Browser** - File tree navigation and editing
- **In-browser Editor** - Code editor with syntax highlighting
- **User Authentication** - Login/signup with JWT tokens
- **Repository Settings** - Edit repository details and settings
- **Search & Filter** - Find repositories and files quickly
- **Real-time Updates** - Live notifications and updates

### 🛠️ Technical Stack
- **Backend:** Node.js, Express.js, MongoDB, Mongoose, Socket.IO, JWT
- **Frontend:** React 18, Vite, React Router, Axios, CSS3
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT tokens with secure storage
- **Real-time:** Socket.IO for live updates
- **Styling:** Custom CSS with GitHub-inspired design

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Git

### Backend Setup
\`\`\`bash
cd backend-main
npm install
node index.js start
\`\`\`

### Frontend Setup
\`\`\`bash
cd frontend-main
npm install
npm run dev
\`\`\`

### Access Application
- **Frontend:** http://localhost:5175
- **Backend API:** http://localhost:3000

## 📖 Documentation

- [API Documentation](docs/API.md) - Complete API reference
- [Features Overview](docs/FEATURES.md) - Detailed feature list
- [Deployment Guide](docs/DEPLOYMENT.md) - How to deploy

## 🎯 Key Achievements

This project demonstrates:
- ✅ Full-stack web development skills
- ✅ Modern React development with hooks
- ✅ RESTful API design and implementation
- ✅ Database design and integration
- ✅ User authentication and authorization
- ✅ Real-time web application features
- ✅ Responsive UI/UX design
- ✅ Professional code organization

## 📄 License

MIT License - Open source and free to use.

---

**VandalHub** - A complete GitHub-like platform built with modern web technologies! 🚀`,
    type: 'file'
  });

  // Add key backend files
  const backendFiles = [
    { path: '../backend-main/index.js', name: 'backend/index.js' },
    { path: '../backend-main/package.json', name: 'backend/package.json' },
    { path: '../backend-main/controllers/repoController.js', name: 'backend/controllers/repoController.js' },
    { path: '../backend-main/models/Repository.js', name: 'backend/models/Repository.js' },
  ];

  backendFiles.forEach(file => {
    if (fileExists(file.path)) {
      organizedFiles.push({
        name: file.name,
        content: readFileContent(file.path),
        type: 'file'
      });
    }
  });

  // Add key frontend files
  const frontendFiles = [
    { path: 'package.json', name: 'frontend/package.json' },
    { path: 'index.html', name: 'frontend/index.html' },
    { path: 'src/main.jsx', name: 'frontend/src/main.jsx' },
    { path: 'src/Routes.jsx', name: 'frontend/src/Routes.jsx' },
    { path: 'src/components/dashboard/Dashboard.jsx', name: 'frontend/src/components/dashboard/Dashboard.jsx' },
    { path: 'src/components/repository/RepositoryView.jsx', name: 'frontend/src/components/repository/RepositoryView.jsx' },
    { path: 'src/components/Navbar.jsx', name: 'frontend/src/components/Navbar.jsx' },
  ];

  frontendFiles.forEach(file => {
    if (fileExists(file.path)) {
      organizedFiles.push({
        name: file.name,
        content: readFileContent(file.path),
        type: 'file'
      });
    }
  });

  // Create the organized repository
  const organizedRepo = {
    name: 'vandalhub-complete-organized',
    description: '🚀 VandalHub Complete Project - Fully organized repository with all source files, proper structure, and comprehensive documentation. This is the complete implementation of a GitHub-like platform.',
    visibility: true,
    owner: '684a9cd5b8e2fd9a4febe094',
    content: organizedFiles,
    topics: ['github-clone', 'react', 'nodejs', 'mongodb', 'full-stack', 'complete-project', 'source-code'],
    issues: []
  };

  try {
    const response = await axios.post(`${BASE_URL}/repo/create`, organizedRepo);
    console.log(`✅ Created organized repository: ${response.data.repository.name}`);
    console.log(`🆔 Repository ID: ${response.data.repositoryID}`);
    console.log(`📁 Files: ${response.data.repository.content.length}`);
    console.log(`🔗 Direct link: http://localhost:5175/repository/${response.data.repositoryID}`);
  } catch (error) {
    console.log(`❌ Failed to create organized repository: ${error.response?.data?.error || error.message}`);
  }
}

// Run the upload
uploadCompleteFiles();
