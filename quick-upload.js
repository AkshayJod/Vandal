const axios = require('axios');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3000';
const USER_ID = '684a9cd5b8e2fd9a4febe094';

async function uploadProject() {
  console.log('🚀 Starting project upload to VandalHub...');
  
  try {
    // First, let's list existing repositories
    console.log('\n📋 Checking existing repositories...');
    const listResponse = await axios.get(`${BASE_URL}/repo/all`);
    console.log(`Found ${listResponse.data.length} existing repositories`);
    
    // Upload the vandalhub-project directory
    const projectPath = './vandalhub-project';
    const repoName = 'VandalHub-Documentation';
    const description = 'Complete documentation and project structure for VandalHub';
    
    console.log(`\n📁 Reading files from: ${projectPath}`);
    
    if (!fs.existsSync(projectPath)) {
      console.error(`❌ Directory not found: ${projectPath}`);
      return;
    }
    
    const files = [];
    
    function readDir(dir, basePath = '') {
      const items = fs.readdirSync(dir);
      
      items.forEach(item => {
        const fullPath = path.join(dir, item);
        const relativePath = basePath ? path.join(basePath, item) : item;
        
        if (fs.statSync(fullPath).isDirectory()) {
          if (!['node_modules', '.git', 'dist', 'build'].includes(item)) {
            readDir(fullPath, relativePath);
          }
        } else {
          if (!item.startsWith('.')) {
            try {
              const content = fs.readFileSync(fullPath, 'utf8');
              files.push({
                name: relativePath.replace(/\\/g, '/'),
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
    
    readDir(projectPath);
    
    console.log(`\n📊 Total files to upload: ${files.length}`);
    
    // Create repository
    const repo = {
      name: repoName,
      description: description,
      visibility: true,
      owner: USER_ID,
      content: files,
      topics: ['documentation', 'uploaded'],
      issues: []
    };
    
    console.log('\n🚀 Uploading to VandalHub...');
    const response = await axios.post(`${BASE_URL}/repo/create`, repo);
    
    console.log('\n✅ Upload successful!');
    console.log(`📋 Repository: ${repoName}`);
    console.log(`📁 Files uploaded: ${files.length}`);
    console.log(`🆔 Repository ID: ${response.data.repositoryID}`);
    console.log(`🔗 View at: http://localhost:5176/repository/${response.data.repositoryID}`);
    
  } catch (error) {
    console.error('\n❌ Upload failed:', error.response?.data?.error || error.message);
    
    if (error.response?.status === 409) {
      console.log('💡 Tip: Repository name already exists. Try a different name.');
    }
  }
}

uploadProject();
