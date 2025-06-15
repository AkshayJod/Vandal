#!/usr/bin/env node

const axios = require('axios');
const fs = require('fs');

const BASE_URL = 'http://localhost:3000';
const USER_ID = '684a9cd5b8e2fd9a4febe094';

// Command functions
const commands = {
  // List all repositories
  async list() {
    try {
      const response = await axios.get(`${BASE_URL}/repo/all`);
      console.log('\n📋 All Repositories:');
      response.data.forEach((repo, index) => {
        console.log(`${index + 1}. ${repo.name} (${repo.visibility ? 'Public' : 'Private'})`);
        console.log(`   📄 ${repo.description || 'No description'}`);
        console.log(`   🆔 ID: ${repo._id}`);
        console.log(`   📁 Files: ${repo.content?.length || 0}`);
        console.log('');
      });
    } catch (error) {
      console.error('❌ Error:', error.message);
    }
  },

  // Create a simple repository
  async create(name, description = '', isPublic = true) {
    try {
      const repo = {
        name: name,
        description: description,
        visibility: isPublic,
        owner: USER_ID,
        content: [{
          name: 'README.md',
          content: `# ${name}\n\n${description || 'A new repository created with VandalHub commands.'}`,
          type: 'file'
        }],
        topics: ['command-created'],
        issues: []
      };

      const response = await axios.post(`${BASE_URL}/repo/create`, repo);
      console.log(`✅ Created repository: ${name}`);
      console.log(`🆔 ID: ${response.data.repositoryID}`);
      console.log(`🔗 URL: http://localhost:5175/repository/${response.data.repositoryID}`);
    } catch (error) {
      console.error('❌ Error:', error.response?.data?.error || error.message);
    }
  },

  // Add file to repository
  async addfile(repoId, filename, content = '') {
    try {
      let fileContent = content;
      
      // If content looks like a file path, read it
      if (content && fs.existsSync(content)) {
        fileContent = fs.readFileSync(content, 'utf8');
        console.log(`📄 Reading content from: ${content}`);
      }

      const response = await axios.post(`${BASE_URL}/repo/${repoId}/files`, {
        name: filename,
        content: fileContent,
        type: 'file',
        path: filename
      });

      console.log(`✅ Added file: ${filename} to repository`);
    } catch (error) {
      console.error('❌ Error:', error.response?.data?.error || error.message);
    }
  },

  // Get repository info
  async info(repoId) {
    try {
      const response = await axios.get(`${BASE_URL}/repo/${repoId}`);
      const repo = response.data;
      
      console.log(`\n📋 Repository Info:`);
      console.log(`📝 Name: ${repo.name}`);
      console.log(`📄 Description: ${repo.description || 'No description'}`);
      console.log(`🔓 Visibility: ${repo.visibility ? 'Public' : 'Private'}`);
      console.log(`📁 Files: ${repo.content?.length || 0}`);
      console.log(`🏷️  Topics: ${repo.topics?.join(', ') || 'None'}`);
      console.log(`🆔 ID: ${repo._id}`);
      console.log(`🔗 URL: http://localhost:5175/repository/${repo._id}`);
      
      if (repo.content && repo.content.length > 0) {
        console.log(`\n📁 Files:`);
        repo.content.forEach((file, index) => {
          console.log(`  ${index + 1}. ${file.name} (${file.size || 0} bytes)`);
        });
      }
    } catch (error) {
      console.error('❌ Error:', error.response?.data?.error || error.message);
    }
  },

  // Delete repository
  async delete(repoId) {
    try {
      await axios.delete(`${BASE_URL}/repo/delete/${repoId}`);
      console.log(`✅ Deleted repository: ${repoId}`);
    } catch (error) {
      console.error('❌ Error:', error.response?.data?.error || error.message);
    }
  },

  // Upload directory as repository
  async upload(dirPath, repoName, description = '') {
    try {
      if (!fs.existsSync(dirPath)) {
        console.error('❌ Directory not found:', dirPath);
        return;
      }

      const files = [];
      
      function readDir(dir, basePath = '') {
        const items = fs.readdirSync(dir);
        
        items.forEach(item => {
          const fullPath = `${dir}/${item}`;
          const relativePath = basePath ? `${basePath}/${item}` : item;
          
          if (fs.statSync(fullPath).isDirectory()) {
            if (!['node_modules', '.git', 'dist', 'build'].includes(item)) {
              readDir(fullPath, relativePath);
            }
          } else {
            if (!item.startsWith('.')) {
              try {
                const content = fs.readFileSync(fullPath, 'utf8');
                files.push({
                  name: relativePath,
                  content: content,
                  type: 'file'
                });
              } catch (error) {
                console.log(`⚠️  Skipped binary file: ${relativePath}`);
              }
            }
          }
        });
      }
      
      readDir(dirPath);
      
      const repo = {
        name: repoName,
        description: description || `Uploaded from ${dirPath}`,
        visibility: true,
        owner: USER_ID,
        content: files,
        topics: ['uploaded'],
        issues: []
      };

      const response = await axios.post(`${BASE_URL}/repo/create`, repo);
      console.log(`✅ Uploaded ${files.length} files to repository: ${repoName}`);
      console.log(`🆔 ID: ${response.data.repositoryID}`);
      console.log(`🔗 URL: http://localhost:5175/repository/${response.data.repositoryID}`);
    } catch (error) {
      console.error('❌ Error:', error.response?.data?.error || error.message);
    }
  },

  // Show help
  help() {
    console.log(`
🚀 VandalHub Command Line Interface

Usage: node vandalhub-commands.js <command> [arguments]

Commands:
  list                                    List all repositories
  create <name> [description] [public]    Create new repository
  info <repo-id>                         Get repository information
  addfile <repo-id> <filename> [content] Add file to repository
  delete <repo-id>                       Delete repository
  upload <directory> <repo-name> [desc]  Upload directory as repository
  help                                   Show this help

Examples:
  node vandalhub-commands.js list
  node vandalhub-commands.js create "my-project" "My awesome project"
  node vandalhub-commands.js info 684d4f79e18ab077d6c0af78
  node vandalhub-commands.js addfile 684d4f79e18ab077d6c0af78 "test.js" "console.log('hello');"
  node vandalhub-commands.js upload ./my-project "uploaded-project" "My uploaded project"
  node vandalhub-commands.js delete 684d4f79e18ab077d6c0af78

Notes:
  - Repository IDs can be found using the 'list' command
  - For addfile, if content is a file path, it will read the file
  - Upload command ignores node_modules, .git, dist, build directories
  - All repositories are created with your user ID: ${USER_ID}

Web Interface: http://localhost:5175
API Base URL: ${BASE_URL}
`);
  }
};

// Parse command line arguments
const args = process.argv.slice(2);
const command = args[0];

if (!command || command === 'help' || command === '--help' || command === '-h') {
  commands.help();
  process.exit(0);
}

// Execute command
if (commands[command]) {
  commands[command](...args.slice(1));
} else {
  console.error(`❌ Unknown command: ${command}`);
  console.log('Run "node vandalhub-commands.js help" for available commands');
  process.exit(1);
}
