#!/usr/bin/env node

const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Configuration
const VANDALHUB_API = 'http://localhost:3000';
const USER_ID = '684a9cd5b8e2fd9a4febe094'; // Replace with your user ID

/**
 * Upload current directory to VandalHub
 * Usage: node upload-to-vandalhub.js "repository-name" "description"
 */
async function uploadProject() {
  const args = process.argv.slice(2);
  const repoName = args[0] || path.basename(process.cwd());
  const description = args[1] || `Uploaded from ${process.cwd()}`;

  console.log(`🚀 Uploading project to VandalHub...`);
  console.log(`📁 Project: ${repoName}`);
  console.log(`📄 Description: ${description}`);

  try {
    // Read all files in current directory
    const files = [];
    
    function readDirectory(dir, basePath = '') {
      const items = fs.readdirSync(dir);
      
      items.forEach(item => {
        const fullPath = path.join(dir, item);
        const relativePath = basePath ? path.join(basePath, item) : item;
        
        // Skip common directories and files
        const skipDirs = ['node_modules', '.git', 'dist', 'build', '.next', 'coverage'];
        const skipFiles = ['.env', '.env.local', '.DS_Store'];
        
        if (fs.statSync(fullPath).isDirectory()) {
          if (!skipDirs.includes(item) && !item.startsWith('.')) {
            readDirectory(fullPath, relativePath);
          }
        } else {
          if (!skipFiles.includes(item) && !item.startsWith('.')) {
            try {
              const content = fs.readFileSync(fullPath, 'utf8');
              files.push({
                name: relativePath.replace(/\\/g, '/'), // Normalize path separators
                content: content,
                type: 'file',
                path: relativePath.replace(/\\/g, '/'),
                size: content.length,
                lastModified: new Date()
              });
              console.log(`📄 Added: ${relativePath}`);
            } catch (error) {
              console.log(`⚠️  Skipped binary file: ${relativePath}`);
            }
          }
        }
      });
    }
    
    readDirectory(process.cwd());
    
    // Create repository payload
    const repository = {
      name: repoName,
      description: description,
      visibility: true, // Public by default
      owner: USER_ID,
      content: files,
      topics: ['uploaded-from-vscode'],
      issues: []
    };

    // Upload to VandalHub
    const response = await axios.post(`${VANDALHUB_API}/repo/create`, repository);
    
    console.log(`\n✅ Successfully uploaded to VandalHub!`);
    console.log(`📋 Repository: ${repoName}`);
    console.log(`📁 Files uploaded: ${files.length}`);
    console.log(`🆔 Repository ID: ${response.data.repositoryID}`);
    console.log(`🔗 View at: http://localhost:5175/repository/${response.data.repositoryID}`);
    
  } catch (error) {
    console.error(`❌ Upload failed:`, error.response?.data?.error || error.message);
    
    if (error.response?.status === 409) {
      console.log(`💡 Tip: Repository name "${repoName}" already exists. Try a different name.`);
    }
  }
}

// Show help if no arguments
if (process.argv.length < 3) {
  console.log(`
🚀 VandalHub Project Uploader

Usage:
  node upload-to-vandalhub.js "repository-name" "description"

Examples:
  node upload-to-vandalhub.js "my-react-app" "A React application"
  node upload-to-vandalhub.js "backend-api" "Node.js REST API"

Notes:
  - Automatically skips node_modules, .git, dist, build directories
  - Skips hidden files and common environment files
  - Repository will be created as public by default
  - Make sure VandalHub server is running on http://localhost:3000
`);
  process.exit(0);
}

uploadProject();
