const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function createDemoRepository() {
  console.log('🚀 Creating VandalHub Demo Repository...\n');

  const demoRepo = {
    name: 'vandalhub-platform',
    description: '🚀 VandalHub - A modern GitHub-like platform built with React, Node.js, and MongoDB. Features include repository management, issue tracking, user profiles, and real-time collaboration tools.',
    visibility: true,
    owner: '507f1f77bcf86cd799439011', // Mock ObjectId
    content: [
      {
        name: 'README.md',
        content: `# 🚀 VandalHub Platform

A modern, feature-rich GitHub-like platform built with React, Node.js, and MongoDB.

## ✨ Features

- 📁 **Repository Management** - Create, read, update, and delete repositories
- 📝 **File Management** - In-browser file editor with syntax highlighting  
- 🐛 **Issue Tracking** - Create and manage issues for repositories
- 👤 **User Profiles** - Comprehensive user profile pages
- 🔄 **Real-time Features** - Live updates using Socket.IO

## 🛠️ Technology Stack

- **Frontend:** React 18, React Router, Axios, CSS3
- **Backend:** Node.js, Express.js, MongoDB, Mongoose, Socket.IO
- **Development:** Vite, ESLint, Git

## 🚀 Getting Started

1. Clone the repository
2. Install dependencies: \`npm install\`
3. Start the backend: \`node index.js start\`
4. Start the frontend: \`npm run dev\`
5. Visit http://localhost:5175

## 📄 License

MIT License - see LICENSE file for details.`,
        type: 'file'
      },
      {
        name: 'package.json',
        content: JSON.stringify({
          "name": "vandalhub-platform",
          "version": "1.0.0",
          "description": "A modern GitHub-like platform",
          "main": "index.js",
          "scripts": {
            "start": "node index.js start",
            "dev": "npm run dev",
            "test": "jest"
          },
          "keywords": ["github", "repository", "collaboration", "react", "nodejs"],
          "author": "VandalHub Team",
          "license": "MIT"
        }, null, 2),
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

  try {
    const response = await axios.post(`${BASE_URL}/repo/create`, demoRepo);
    
    console.log('✅ Demo repository created successfully!');
    console.log(`📝 Repository name: ${response.data.repository.name}`);
    console.log(`🆔 Repository ID: ${response.data.repositoryID}`);
    console.log(`📁 Files created: ${response.data.repository.content.length}`);
    console.log(`🏷️ Topics: ${response.data.repository.topics.join(', ')}`);
    
    console.log('\n🎉 VandalHub demo repository is now available!');
    console.log('🌐 Visit http://localhost:5175/repositories to see it.');
    console.log(`🔗 Direct link: http://localhost:5175/repository/${response.data.repositoryID}`);

  } catch (error) {
    console.error('❌ Failed to create demo repository:', error.response?.data?.error || error.message);
  }
}

// Run the demo repository creation
createDemoRepository();
