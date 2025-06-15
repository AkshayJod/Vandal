#!/usr/bin/env node

const axios = require('axios');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const BASE_URL = 'http://localhost:3000';
const USER_ID = '684a9cd5b8e2fd9a4febe094';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function quickAddProject() {
  console.log('🚀 VandalHub Quick Project Creator\n');

  try {
    // Get project details
    const name = await question('📝 Project name: ');
    const description = await question('📄 Project description: ');
    const visibility = await question('🔓 Public repository? (y/n): ');
    const topics = await question('🏷️  Topics (comma-separated): ');

    console.log('\n📁 Choose how to add files:');
    console.log('1. Create empty repository');
    console.log('2. Add files manually');
    console.log('3. Upload from directory');
    
    const choice = await question('\nChoice (1-3): ');

    let files = [];

    if (choice === '2') {
      // Manual file addition
      console.log('\n📄 Add files (press Enter with empty filename to finish):');
      while (true) {
        const filename = await question('File name: ');
        if (!filename) break;
        
        const content = await question('File content (or path to file): ');
        
        // Check if content is a file path
        let fileContent = content;
        if (fs.existsSync(content)) {
          fileContent = fs.readFileSync(content, 'utf8');
          console.log(`✅ Loaded content from ${content}`);
        }
        
        files.push({
          name: filename,
          content: fileContent,
          type: 'file'
        });
        
        console.log(`✅ Added ${filename}`);
      }
    } else if (choice === '3') {
      // Directory upload
      const dirPath = await question('📂 Directory path: ');
      
      if (fs.existsSync(dirPath)) {
        files = await readDirectoryRecursive(dirPath);
        console.log(`✅ Found ${files.length} files in directory`);
      } else {
        console.log('❌ Directory not found');
        process.exit(1);
      }
    }

    // Create repository
    const repo = {
      name: name,
      description: description,
      visibility: visibility.toLowerCase() === 'y',
      owner: USER_ID,
      content: files,
      topics: topics ? topics.split(',').map(t => t.trim()) : [],
      issues: []
    };

    console.log('\n📤 Creating repository...');
    const response = await axios.post(`${BASE_URL}/repo/create`, repo);

    console.log('\n🎉 Repository created successfully!');
    console.log(`📝 Name: ${response.data.repository.name}`);
    console.log(`🆔 ID: ${response.data.repositoryID}`);
    console.log(`📁 Files: ${response.data.repository.content.length}`);
    console.log(`🔗 URL: http://localhost:5175/repository/${response.data.repositoryID}`);

  } catch (error) {
    console.error('\n❌ Error:', error.response?.data?.error || error.message);
  } finally {
    rl.close();
  }
}

async function readDirectoryRecursive(dirPath, basePath = '') {
  const files = [];
  const items = fs.readdirSync(dirPath);

  for (const item of items) {
    const fullPath = path.join(dirPath, item);
    const relativePath = path.join(basePath, item);

    if (fs.statSync(fullPath).isDirectory()) {
      // Skip common directories to ignore
      if (!['node_modules', '.git', 'dist', 'build', '.next'].includes(item)) {
        const subFiles = await readDirectoryRecursive(fullPath, relativePath);
        files.push(...subFiles);
      }
    } else {
      // Skip common files to ignore
      if (!item.startsWith('.') && !item.endsWith('.log')) {
        try {
          const content = fs.readFileSync(fullPath, 'utf8');
          files.push({
            name: relativePath.replace(/\\/g, '/'),
            content: content,
            type: 'file'
          });
        } catch (error) {
          console.log(`⚠️  Skipped binary file: ${relativePath}`);
        }
      }
    }
  }

  return files;
}

// Command line argument handling
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  console.log(`
🚀 VandalHub Quick Project Creator

Usage:
  node quick-add-project.js              # Interactive mode
  node quick-add-project.js --help       # Show this help

Examples:
  node quick-add-project.js              # Start interactive creator
  
The script will guide you through:
1. Setting project name and description
2. Choosing visibility (public/private)
3. Adding topics/tags
4. Adding files (manual, empty, or from directory)

Repository will be created at: http://localhost:5175
`);
  process.exit(0);
}

// Run the interactive creator
quickAddProject();
