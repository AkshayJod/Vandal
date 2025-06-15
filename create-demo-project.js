const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function createDemoProject() {
  console.log('🚀 Creating VandalHub Demo Project...\n');

  try {
    // First, let's create a user (you might need to adjust this based on your user creation API)
    const demoUser = {
      username: 'demo-user',
      email: 'demo@vandalhub.com',
      password: 'demo123'
    };

    // Create the VandalHub demo project
    const demoProject = {
      name: 'vandalhub-platform',
      description: '🚀 VandalHub - A modern GitHub-like platform built with React, Node.js, and MongoDB. Features include repository management, issue tracking, user profiles, and real-time collaboration tools.',
      visibility: true,
      owner: '507f1f77bcf86cd799439011', // Mock ObjectId - replace with actual user ID
      content: [
        {
          name: 'README.md',
          content: `# 🚀 VandalHub Platform

A modern, feature-rich GitHub-like platform built with React, Node.js, and MongoDB. VandalHub provides comprehensive repository management, issue tracking, user profiles, and real-time collaboration tools.

## ✨ Features

### 🏠 **Dashboard & Navigation**
- Modern UI with GitHub-inspired dark theme
- Responsive design for all devices
- Smart navigation with search and user menu
- Real-time data synchronization

### 📁 **Repository Management**
- Create, read, update, and delete repositories
- Public/private repository visibility
- File upload and content management
- Repository search and filtering
- Repository statistics tracking

### 📝 **File Management**
- In-browser file editor with syntax highlighting
- Create, edit, and delete files within repositories
- File content preview and editing
- Commit tracking for file changes

### 🐛 **Issue Tracking**
- Create and manage issues for repositories
- Issue status tracking (open, closed, in-progress)
- Issue assignment and labeling
- Issue search and filtering

### 👤 **User Profiles**
- Comprehensive user profile pages
- Repository statistics and activity tracking
- User authentication and authorization
- Profile customization options

### 🔄 **Real-time Features**
- Live updates using Socket.IO
- Real-time collaboration tools
- Instant notifications
- Live activity feeds

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **CSS3** - Modern styling with GitHub-inspired design

### Backend
- **Node.js** - Server runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Socket.IO** - Real-time communication
- **JWT** - Authentication tokens

### Development Tools
- **Vite** - Fast build tool
- **ESLint** - Code linting
- **Git** - Version control

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Git

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/your-username/vandalhub-platform.git
   cd vandalhub-platform
   \`\`\`

2. **Install backend dependencies**
   \`\`\`bash
   cd backend-main
   npm install
   \`\`\`

3. **Install frontend dependencies**
   \`\`\`bash
   cd ../frontend-main
   npm install
   \`\`\`

4. **Set up environment variables**
   Create a \`.env\` file in the backend-main directory:
   \`\`\`env
   MONGODB_URI=mongodb://localhost:27017/vandalhub
   JWT_SECRET=your-jwt-secret-key
   PORT=3000
   \`\`\`

5. **Start the development servers**
   
   Backend:
   \`\`\`bash
   cd backend-main
   node index.js start
   \`\`\`
   
   Frontend:
   \`\`\`bash
   cd frontend-main
   npm run dev
   \`\`\`

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

## 📖 API Documentation

### Repository Endpoints
- \`GET /repo/all\` - Get all repositories
- \`POST /repo/create\` - Create a new repository
- \`GET /repo/:id\` - Get repository by ID
- \`PUT /repo/settings/:id\` - Update repository settings
- \`DELETE /repo/delete/:id\` - Delete repository

### File Management Endpoints
- \`POST /repo/:id/files\` - Add file to repository
- \`GET /repo/:id/files/:fileName\` - Get file content
- \`PUT /repo/:id/files/:fileName\` - Update file content
- \`DELETE /repo/:id/files/:fileName\` - Delete file

### User Endpoints
- \`POST /user/register\` - Register new user
- \`POST /user/login\` - User login
- \`GET /user/profile/:id\` - Get user profile

## 🎯 Key Features Implemented

✅ **Complete Repository Management**
- Repository CRUD operations
- File management within repositories
- Repository settings and configuration

✅ **Advanced File Editor**
- In-browser code editing
- File content preview
- Commit tracking and history

✅ **User Authentication**
- JWT-based authentication
- User registration and login
- Protected routes and API endpoints

✅ **Modern UI/UX**
- GitHub-inspired dark theme
- Responsive design
- Professional styling and layout

✅ **Real-time Features**
- Socket.IO integration
- Live updates and notifications

## 🔧 Development

### Project Structure
\`\`\`
vandalhub-platform/
├── backend-main/          # Backend server
│   ├── controllers/       # Route controllers
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   └── index.js          # Server entry point
├── frontend-main/         # Frontend application
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   └── styles/       # CSS files
│   └── package.json
└── README.md
\`\`\`

### Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Support

For support and questions:
- Create an issue on GitHub
- Contact: support@vandalhub.com
- Documentation: https://docs.vandalhub.com

## 🙏 Acknowledgments

- Inspired by GitHub's excellent user experience
- Built with modern web technologies
- Community-driven development

---

**VandalHub** - Building the future of collaborative development! 🚀`,
          type: 'file'
        },
        {
          name: 'package.json',
          content: JSON.stringify({
            "name": "vandalhub-platform",
            "version": "1.0.0",
            "description": "A modern GitHub-like platform built with React, Node.js, and MongoDB",
            "main": "index.js",
            "scripts": {
              "start": "node index.js start",
              "dev": "nodemon index.js start",
              "test": "jest"
            },
            "keywords": ["github", "repository", "collaboration", "react", "nodejs", "mongodb"],
            "author": "VandalHub Team",
            "license": "MIT",
            "dependencies": {
              "express": "^4.19.2",
              "mongoose": "^8.5.0",
              "react": "^18.3.1",
              "socket.io": "^4.7.5"
            }
          }, null, 2),
          type: 'file'
        },
        {
          name: 'CONTRIBUTING.md',
          content: `# Contributing to VandalHub

Thank you for your interest in contributing to VandalHub! This document provides guidelines and information for contributors.

## Getting Started

1. Fork the repository
2. Clone your fork locally
3. Create a new branch for your feature
4. Make your changes
5. Test your changes
6. Submit a pull request

## Development Setup

Follow the setup instructions in the main README.md file.

## Code Style

- Use consistent indentation (2 spaces)
- Follow React best practices
- Write meaningful commit messages
- Add comments for complex logic

## Reporting Issues

Please use the GitHub issue tracker to report bugs or request features.`,
          type: 'file'
        },
        {
          name: 'LICENSE',
          content: `MIT License

Copyright (c) 2025 VandalHub

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`,
          type: 'file'
        }
      ],
      topics: ['github-clone', 'react', 'nodejs', 'mongodb', 'repository-management'],
      issues: []
    };

    console.log('📝 Creating VandalHub demo project...');
    const response = await axios.post(`${BASE_URL}/repo/create`, demoProject);
    
    console.log(`✅ Demo project created successfully!`);
    console.log(`📝 Repository name: ${response.data.repository.name}`);
    console.log(`🆔 Repository ID: ${response.data.repositoryID}`);
    console.log(`📁 Files created: ${response.data.repository.content.length}`);
    console.log(`🏷️ Topics: ${response.data.repository.topics.join(', ')}`);
    
    console.log('\n🎉 VandalHub demo project is now available in the repositories list!');
    console.log('🌐 Visit http://localhost:5175/repositories to see it.');

  } catch (error) {
    console.error('❌ Failed to create demo project:', error.response?.data?.error || error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

// Run the demo project creation
createDemoProject();
