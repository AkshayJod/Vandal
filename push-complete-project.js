const axios = require('axios');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3000';

// Function to read file content safely
function readFileContent(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    console.log(`⚠️  Could not read ${filePath}: ${error.message}`);
    return `# ${path.basename(filePath)}\n\nFile content could not be read.`;
  }
}

// Function to check if file should be included
function shouldIncludeFile(filePath) {
  const excludePatterns = [
    'node_modules',
    '.git',
    'dist',
    'build',
    '.env',
    '.DS_Store',
    'package-lock.json',
    '.vscode',
    '.idea'
  ];
  
  return !excludePatterns.some(pattern => filePath.includes(pattern));
}

async function pushCompleteProject() {
  console.log('🚀 Pushing Complete VandalHub Project...\n');

  // Read main project files
  const projectFiles = [];

  // Add main README
  if (fs.existsSync('./README.md')) {
    projectFiles.push({
      name: 'README.md',
      content: readFileContent('./README.md'),
      type: 'file'
    });
  }

  // Add main package.json
  if (fs.existsSync('./package.json')) {
    projectFiles.push({
      name: 'package.json',
      content: readFileContent('./package.json'),
      type: 'file'
    });
  }

  // Add backend files
  const backendFiles = [
    'backend-main/package.json',
    'backend-main/index.js',
    'backend-main/controllers/repoController.js',
    'backend-main/controllers/userController.js',
    'backend-main/models/Repository.js',
    'backend-main/models/User.js',
    'backend-main/routes/repo.router.js',
    'backend-main/routes/user.router.js',
    'backend-main/config/database.js'
  ];

  backendFiles.forEach(filePath => {
    if (fs.existsSync(filePath)) {
      const fileName = `backend/${path.basename(filePath)}`;
      projectFiles.push({
        name: fileName,
        content: readFileContent(filePath),
        type: 'file'
      });
    }
  });

  // Add frontend files
  const frontendFiles = [
    'frontend-main/package.json',
    'frontend-main/index.html',
    'frontend-main/src/main.jsx',
    'frontend-main/src/App.jsx',
    'frontend-main/src/Routes.jsx',
    'frontend-main/src/authContext.jsx',
    'frontend-main/src/index.css',
    'frontend-main/src/components/Navbar.jsx',
    'frontend-main/src/components/Footer.jsx',
    'frontend-main/src/components/dashboard/Dashboard.jsx',
    'frontend-main/src/components/repository/RepositoryView.jsx',
    'frontend-main/src/components/repository/RepositorySettings.jsx',
    'frontend-main/src/components/repository/CreateRepository.jsx',
    'frontend-main/src/components/repository/RepositoriesList.jsx',
    'frontend-main/src/components/auth/Login.jsx',
    'frontend-main/src/components/auth/Signup.jsx',
    'frontend-main/src/components/user/Profile.jsx'
  ];

  frontendFiles.forEach(filePath => {
    if (fs.existsSync(filePath)) {
      const fileName = `frontend/${path.relative('frontend-main/', filePath)}`;
      projectFiles.push({
        name: fileName,
        content: readFileContent(filePath),
        type: 'file'
      });
    }
  });

  // Add CSS files
  const cssFiles = [
    'frontend-main/src/components/navbar.css',
    'frontend-main/src/components/dashboard/dashboard.css',
    'frontend-main/src/components/repository/repository.css',
    'frontend-main/src/components/auth/auth.css',
    'frontend-main/src/components/user/profile.css'
  ];

  cssFiles.forEach(filePath => {
    if (fs.existsSync(filePath)) {
      const fileName = `frontend/styles/${path.basename(filePath)}`;
      projectFiles.push({
        name: fileName,
        content: readFileContent(filePath),
        type: 'file'
      });
    }
  });

  // Add documentation files from vandalhub-project
  const docFiles = [
    'vandalhub-project/README.md',
    'vandalhub-project/API.md',
    'vandalhub-project/FEATURES.md',
    'vandalhub-project/PROJECT_STRUCTURE.md',
    'vandalhub-project/DEPLOYMENT.md',
    'vandalhub-project/CONTRIBUTING.md',
    'vandalhub-project/CHANGELOG.md',
    'vandalhub-project/LICENSE'
  ];

  docFiles.forEach(filePath => {
    if (fs.existsSync(filePath)) {
      const fileName = `docs/${path.basename(filePath)}`;
      projectFiles.push({
        name: fileName,
        content: readFileContent(filePath),
        type: 'file'
      });
    }
  });

  // Create comprehensive project README
  const projectReadme = `# 🚀 VandalHub - Complete Project

A modern, feature-rich GitHub-like platform built with React, Node.js, and MongoDB.

## 📁 Project Structure

\`\`\`
vandalhub/
├── backend/                 # Backend server files
│   ├── index.js            # Main server file
│   ├── package.json        # Backend dependencies
│   ├── repoController.js   # Repository management
│   ├── userController.js   # User management
│   ├── Repository.js       # Repository model
│   ├── User.js            # User model
│   └── database.js        # Database configuration
├── frontend/               # Frontend application
│   ├── src/
│   │   ├── main.jsx       # Application entry point
│   │   ├── Routes.jsx     # Application routing
│   │   ├── components/    # React components
│   │   └── styles/        # CSS stylesheets
│   ├── index.html         # HTML template
│   └── package.json       # Frontend dependencies
├── docs/                  # Documentation
│   ├── API.md            # API documentation
│   ├── FEATURES.md       # Feature documentation
│   ├── DEPLOYMENT.md     # Deployment guide
│   └── CONTRIBUTING.md   # Contribution guidelines
└── README.md             # This file
\`\`\`

## ✨ Features

- 📁 **Repository Management** - Complete CRUD operations
- 📝 **File Management** - In-browser file editor
- 🔐 **User Authentication** - JWT-based auth system
- 🎨 **Modern UI** - GitHub-inspired dark theme
- 📱 **Responsive Design** - Works on all devices
- 🔄 **Real-time Updates** - Live data synchronization

## 🛠️ Technology Stack

### Backend
- **Node.js** - Server runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **React Router** - Routing
- **Axios** - HTTP client
- **CSS3** - Styling

## 🚀 Quick Start

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
- Frontend: http://localhost:5175
- Backend API: http://localhost:3000

## 📖 Documentation

- [API Documentation](docs/API.md)
- [Features Overview](docs/FEATURES.md)
- [Project Structure](docs/PROJECT_STRUCTURE.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [Contributing](docs/CONTRIBUTING.md)

## 📄 License

MIT License - see [LICENSE](docs/LICENSE) for details.

## 🤝 Contributing

Please read [CONTRIBUTING.md](docs/CONTRIBUTING.md) for contribution guidelines.

---

**VandalHub** - Building the future of collaborative development! 🚀`;

  // Replace the main README with comprehensive project README
  projectFiles[0] = {
    name: 'README.md',
    content: projectReadme,
    type: 'file'
  };

  console.log(`📁 Prepared ${projectFiles.length} files for upload...\n`);

  // Create the complete project repository
  const completeProject = {
    name: 'vandalhub-complete-project',
    description: '🚀 Complete VandalHub Platform - A modern GitHub-like repository management system with React frontend, Node.js backend, and MongoDB database. Features include repository CRUD, file management, user authentication, and real-time collaboration tools.',
    visibility: true,
    owner: '507f1f77bcf86cd799439011', // Mock ObjectId
    content: projectFiles,
    topics: ['github-clone', 'react', 'nodejs', 'mongodb', 'repository-management', 'file-editor', 'authentication', 'full-stack'],
    issues: [],
    readme: projectReadme
  };

  try {
    console.log('📤 Uploading complete project to VandalHub...');
    const response = await axios.post(`${BASE_URL}/repo/create`, completeProject);
    
    console.log('\n✅ Complete VandalHub project uploaded successfully!');
    console.log(`📝 Repository name: ${response.data.repository.name}`);
    console.log(`🆔 Repository ID: ${response.data.repositoryID}`);
    console.log(`📁 Total files uploaded: ${response.data.repository.content.length}`);
    console.log(`🏷️ Topics: ${response.data.repository.topics.join(', ')}`);
    
    console.log('\n🎉 Your complete project is now available in VandalHub!');
    console.log('🌐 Visit http://localhost:5175/repositories to see it.');
    console.log(`🔗 Direct link: http://localhost:5175/repository/${response.data.repositoryID}`);
    
    console.log('\n📋 Project includes:');
    console.log('  • Complete backend server code');
    console.log('  • Full frontend React application');
    console.log('  • All CSS stylesheets');
    console.log('  • Comprehensive documentation');
    console.log('  • Configuration files');
    console.log('  • Project structure and guides');

  } catch (error) {
    console.error('❌ Failed to upload complete project:', error.response?.data?.error || error.message);
    if (error.response?.data) {
      console.error('Response data:', error.response.data);
    }
  }
}

// Run the complete project upload
pushCompleteProject();
