const axios = require('axios');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3000';

// Function to read file content safely
function readFileContent(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    // Limit file size to prevent payload issues
    if (content.length > 50000) {
      return content.substring(0, 50000) + '\n\n... (file truncated due to size)';
    }
    return content;
  } catch (error) {
    console.log(`⚠️  Could not read ${filePath}: ${error.message}`);
    return `# ${path.basename(filePath)}\n\nFile content could not be read.`;
  }
}

async function pushOptimizedProject() {
  console.log('🚀 Pushing Complete VandalHub Project (Optimized)...\n');

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
└── README.md             # This file
\`\`\`

## ✨ Features

- 📁 **Repository Management** - Complete CRUD operations for repositories
- 📝 **File Management** - In-browser file editor with syntax highlighting
- 🔐 **User Authentication** - JWT-based authentication system
- 🎨 **Modern UI** - GitHub-inspired dark theme with responsive design
- 📱 **Mobile Friendly** - Works perfectly on all devices
- 🔄 **Real-time Updates** - Live data synchronization with Socket.IO
- ⚙️ **Repository Settings** - Edit repository details, visibility, topics
- 🗂️ **File Operations** - Create, edit, delete files with commit tracking
- 🔍 **Search & Filter** - Find repositories and files quickly
- 👥 **User Profiles** - Comprehensive user profile management

## 🛠️ Technology Stack

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Fast, unopinionated web framework
- **MongoDB** - NoSQL database for flexible data storage
- **Mongoose** - Elegant MongoDB object modeling
- **JWT** - JSON Web Tokens for secure authentication
- **Socket.IO** - Real-time bidirectional event-based communication

### Frontend
- **React 18** - Modern UI library with hooks and concurrent features
- **Vite** - Next generation frontend build tool
- **React Router** - Declarative routing for React applications
- **Axios** - Promise-based HTTP client
- **CSS3** - Modern styling with GitHub-inspired design system

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
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

## 🎯 Key Features Implemented

✅ **Complete Repository Management**
- Create, read, update, delete repositories
- Repository visibility settings (public/private)
- Repository topics and descriptions
- Repository statistics and metadata

✅ **Advanced File Management**
- In-browser file editor with syntax highlighting
- File CRUD operations (create, read, update, delete)
- Commit tracking with messages
- File size and modification tracking

✅ **User Authentication & Profiles**
- JWT-based secure authentication
- User registration and login
- Protected routes and API endpoints
- User profile management

✅ **Modern UI/UX**
- GitHub-inspired dark theme
- Responsive design for all devices
- Professional styling and layout
- Loading states and error handling

✅ **Real-time Features**
- Socket.IO integration for live updates
- Real-time notifications
- Live activity feeds

## 📖 API Endpoints

### Repository Management
- \`GET /repo/all\` - Get all repositories
- \`POST /repo/create\` - Create new repository
- \`GET /repo/:id\` - Get repository by ID
- \`PUT /repo/settings/:id\` - Update repository settings
- \`DELETE /repo/delete/:id\` - Delete repository

### File Management
- \`POST /repo/:id/files\` - Add file to repository
- \`GET /repo/:id/files/:fileName\` - Get file content
- \`PUT /repo/:id/files/:fileName\` - Update file content
- \`DELETE /repo/:id/files/:fileName\` - Delete file

### User Management
- \`POST /user/register\` - Register new user
- \`POST /user/login\` - User login
- \`GET /user/profile/:id\` - Get user profile

## 🔧 Development

### Project Structure
The project follows a clean architecture with separated concerns:

- **Backend (backend-main/):** Contains the Express.js server, API routes, database models, and business logic
- **Frontend (frontend-main/):** Contains the React application, components, styles, and client-side logic

### Code Quality
- ESLint configuration for code consistency
- Modern JavaScript/React patterns
- Responsive CSS with mobile-first approach
- Error handling and loading states

## 🚀 Deployment

The application can be deployed to various platforms:

- **Frontend:** Vercel, Netlify, GitHub Pages
- **Backend:** Heroku, Railway, DigitalOcean
- **Database:** MongoDB Atlas, local MongoDB instance

## 📄 License

MIT License - This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🙏 Acknowledgments

- Inspired by GitHub's excellent user experience
- Built with modern web technologies
- Community-driven development approach

---

**VandalHub** - Building the future of collaborative development! 🚀`;

  // Essential project files (smaller payload)
  const projectFiles = [
    {
      name: 'README.md',
      content: projectReadme,
      type: 'file'
    }
  ];

  // Add key backend files
  const backendFiles = [
    { path: 'backend-main/package.json', name: 'backend/package.json' },
    { path: 'backend-main/index.js', name: 'backend/index.js' },
    { path: 'backend-main/controllers/repoController.js', name: 'backend/repoController.js' },
    { path: 'backend-main/models/Repository.js', name: 'backend/Repository.js' },
    { path: 'backend-main/routes/repo.router.js', name: 'backend/repo.router.js' }
  ];

  backendFiles.forEach(file => {
    if (fs.existsSync(file.path)) {
      projectFiles.push({
        name: file.name,
        content: readFileContent(file.path),
        type: 'file'
      });
    }
  });

  // Add key frontend files
  const frontendFiles = [
    { path: 'frontend-main/package.json', name: 'frontend/package.json' },
    { path: 'frontend-main/index.html', name: 'frontend/index.html' },
    { path: 'frontend-main/src/main.jsx', name: 'frontend/src/main.jsx' },
    { path: 'frontend-main/src/Routes.jsx', name: 'frontend/src/Routes.jsx' },
    { path: 'frontend-main/src/components/dashboard/Dashboard.jsx', name: 'frontend/src/Dashboard.jsx' },
    { path: 'frontend-main/src/components/repository/RepositoryView.jsx', name: 'frontend/src/RepositoryView.jsx' },
    { path: 'frontend-main/src/components/repository/RepositorySettings.jsx', name: 'frontend/src/RepositorySettings.jsx' },
    { path: 'frontend-main/src/components/Navbar.jsx', name: 'frontend/src/Navbar.jsx' }
  ];

  frontendFiles.forEach(file => {
    if (fs.existsSync(file.path)) {
      projectFiles.push({
        name: file.name,
        content: readFileContent(file.path),
        type: 'file'
      });
    }
  });

  // Add essential CSS files
  const cssFiles = [
    { path: 'frontend-main/src/index.css', name: 'frontend/styles/index.css' },
    { path: 'frontend-main/src/components/navbar.css', name: 'frontend/styles/navbar.css' },
    { path: 'frontend-main/src/components/dashboard/dashboard.css', name: 'frontend/styles/dashboard.css' }
  ];

  cssFiles.forEach(file => {
    if (fs.existsSync(file.path)) {
      projectFiles.push({
        name: file.name,
        content: readFileContent(file.path),
        type: 'file'
      });
    }
  });

  console.log(`📁 Prepared ${projectFiles.length} essential files for upload...\n`);

  // Create the complete project repository
  const completeProject = {
    name: 'vandalhub-complete-source',
    description: '🚀 Complete VandalHub Platform Source Code - A modern GitHub-like repository management system with React frontend, Node.js backend, and MongoDB database. Includes all source files, documentation, and deployment guides.',
    visibility: true,
    owner: '507f1f77bcf86cd799439011', // Mock ObjectId
    content: projectFiles,
    topics: ['github-clone', 'react', 'nodejs', 'mongodb', 'full-stack', 'repository-management', 'source-code'],
    issues: [],
    readme: projectReadme
  };

  try {
    console.log('📤 Uploading complete VandalHub source code...');
    const response = await axios.post(`${BASE_URL}/repo/create`, completeProject);
    
    console.log('\n✅ Complete VandalHub source code uploaded successfully!');
    console.log(`📝 Repository name: ${response.data.repository.name}`);
    console.log(`🆔 Repository ID: ${response.data.repositoryID}`);
    console.log(`📁 Total files uploaded: ${response.data.repository.content.length}`);
    console.log(`🏷️ Topics: ${response.data.repository.topics.join(', ')}`);
    
    console.log('\n🎉 Your complete project source code is now available in VandalHub!');
    console.log('🌐 Visit http://localhost:5175/repositories to see it.');
    console.log(`🔗 Direct link: http://localhost:5175/repository/${response.data.repositoryID}`);
    
    console.log('\n📋 Uploaded files include:');
    console.log('  • Complete project documentation');
    console.log('  • Backend server source code');
    console.log('  • Frontend React application');
    console.log('  • Essential CSS stylesheets');
    console.log('  • Configuration files');
    console.log('  • Package.json files');

  } catch (error) {
    console.error('❌ Failed to upload complete project:', error.response?.data?.error || error.message);
    if (error.response?.data) {
      console.error('Response data:', error.response.data);
    }
  }
}

// Run the optimized project upload
pushOptimizedProject();
