# 🛠️ VandalHub Manual Commands Guide

## 📋 Complete Command Reference

### 1. **Git-like CLI Commands**

```bash
# Navigate to backend directory
cd backend-main

# Initialize new repository
node index.js init

# Add file to staging
node index.js add filename.txt

# Commit changes
node index.js commit "Initial commit"

# Push to cloud storage
node index.js push

# Pull from cloud storage
node index.js pull

# Revert to specific commit
node index.js revert abc123def456

# Start server
node index.js start

# Show help
node index.js --help
```

### 2. **cURL Commands for API**

#### **Create New Repository**
```bash
curl -X POST http://localhost:3000/repo/create \
  -H "Content-Type: application/json" \
  -d '{
    "name": "my-new-project",
    "description": "My awesome project description",
    "visibility": true,
    "owner": "684a9cd5b8e2fd9a4febe094",
    "content": [
      {
        "name": "README.md",
        "content": "# My Project\n\nThis is my awesome project!",
        "type": "file"
      },
      {
        "name": "index.js",
        "content": "console.log(\"Hello World!\");",
        "type": "file"
      }
    ],
    "topics": ["javascript", "nodejs", "project"]
  }'
```

#### **Add File to Existing Repository**
```bash
curl -X POST http://localhost:3000/repo/REPO_ID/files \
  -H "Content-Type: application/json" \
  -d '{
    "name": "newfile.js",
    "content": "// New file content here",
    "type": "file",
    "path": "newfile.js"
  }'
```

#### **Update Existing File**
```bash
curl -X PUT http://localhost:3000/repo/REPO_ID/files/filename.js \
  -H "Content-Type: application/json" \
  -d '{
    "content": "// Updated file content",
    "commitMessage": "Update filename.js"
  }'
```

#### **Get All Repositories**
```bash
curl -X GET http://localhost:3000/repo/all
```

#### **Get Specific Repository**
```bash
curl -X GET http://localhost:3000/repo/REPO_ID
```

#### **Delete Repository**
```bash
curl -X DELETE http://localhost:3000/repo/delete/REPO_ID
```

### 3. **JavaScript/Node.js Scripts**

#### **Quick Repository Creator Script**
```javascript
const axios = require('axios');

async function createQuickRepo(name, description, files = []) {
  const repo = {
    name: name,
    description: description,
    visibility: true,
    owner: '684a9cd5b8e2fd9a4febe094',
    content: files,
    topics: ['manual-upload'],
    issues: []
  };

  try {
    const response = await axios.post('http://localhost:3000/repo/create', repo);
    console.log(`✅ Created: ${response.data.repository.name}`);
    console.log(`🔗 ID: ${response.data.repositoryID}`);
    return response.data.repositoryID;
  } catch (error) {
    console.error('❌ Error:', error.response?.data?.error || error.message);
  }
}

// Usage
createQuickRepo('my-project', 'My project description', [
  { name: 'README.md', content: '# My Project', type: 'file' }
]);
```

### 4. **Batch Upload Commands**

#### **Upload Multiple Files Script**
```bash
#!/bin/bash
REPO_ID="your-repo-id-here"
BASE_URL="http://localhost:3000"

# Upload multiple files
for file in *.js *.md *.json; do
  if [ -f "$file" ]; then
    echo "Uploading $file..."
    curl -X POST "$BASE_URL/repo/$REPO_ID/files" \
      -H "Content-Type: application/json" \
      -d "{
        \"name\": \"$file\",
        \"content\": \"$(cat $file | sed 's/"/\\"/g' | sed ':a;N;$!ba;s/\n/\\n/g')\",
        \"type\": \"file\"
      }"
  fi
done
```

### 5. **Frontend UI Methods**

#### **Web Interface Commands**
- **Create Repository:** Go to `/create` page
- **Upload Files:** Use "Add file" button in repository view
- **Edit Files:** Click on any file to edit in browser
- **Repository Settings:** Click "Settings" in repository view
- **Bulk Operations:** Use repository management interface

### 6. **Advanced Automation Scripts**

#### **Project Structure Uploader**
```javascript
const fs = require('fs');
const path = require('path');
const axios = require('axios');

async function uploadProjectStructure(projectPath, repoName) {
  const files = [];
  
  function readDirectory(dir, basePath = '') {
    const items = fs.readdirSync(dir);
    
    items.forEach(item => {
      const fullPath = path.join(dir, item);
      const relativePath = path.join(basePath, item);
      
      if (fs.statSync(fullPath).isDirectory()) {
        if (!item.startsWith('.') && item !== 'node_modules') {
          readDirectory(fullPath, relativePath);
        }
      } else {
        if (!item.startsWith('.')) {
          const content = fs.readFileSync(fullPath, 'utf8');
          files.push({
            name: relativePath.replace(/\\/g, '/'),
            content: content,
            type: 'file'
          });
        }
      }
    });
  }
  
  readDirectory(projectPath);
  
  const repo = {
    name: repoName,
    description: `Uploaded project from ${projectPath}`,
    visibility: true,
    owner: '684a9cd5b8e2fd9a4febe094',
    content: files,
    topics: ['uploaded-project']
  };
  
  try {
    const response = await axios.post('http://localhost:3000/repo/create', repo);
    console.log(`✅ Uploaded ${files.length} files to ${repoName}`);
    return response.data.repositoryID;
  } catch (error) {
    console.error('❌ Upload failed:', error.message);
  }
}

// Usage: uploadProjectStructure('./my-project', 'my-uploaded-project');
```

### 7. **Environment Variables & Configuration**

```bash
# Set environment variables for easier commands
export VANDALHUB_API="http://localhost:3000"
export VANDALHUB_USER_ID="684a9cd5b8e2fd9a4febe094"

# Then use in commands
curl -X GET $VANDALHUB_API/repo/all
```

### 8. **Quick Command Aliases**

Add these to your `.bashrc` or `.zshrc`:

```bash
# VandalHub aliases
alias vh-start="cd backend-main && node index.js start"
alias vh-create="curl -X POST http://localhost:3000/repo/create -H 'Content-Type: application/json' -d"
alias vh-list="curl -X GET http://localhost:3000/repo/all"
alias vh-web="open http://localhost:5175"
```

### 9. **Database Direct Commands** (Advanced)

```javascript
// Connect directly to MongoDB (if needed)
const mongoose = require('mongoose');
const Repository = require('./backend-main/models/Repository');

async function directDBOperation() {
  await mongoose.connect('your-mongodb-uri');
  
  // Create repository directly in DB
  const repo = new Repository({
    name: 'direct-db-repo',
    description: 'Created directly in database',
    // ... other fields
  });
  
  await repo.save();
  console.log('Repository created directly in database');
}
```

## 🎯 **Recommended Workflow**

1. **For Single Projects:** Use the web interface at `/create`
2. **For Multiple Files:** Use the JavaScript upload scripts
3. **For Automation:** Use the REST API with cURL or axios
4. **For Development:** Use the Git-like CLI commands
5. **For Bulk Operations:** Use the batch upload scripts

## 📞 **Need Help?**

- **Web Interface:** http://localhost:5175
- **API Documentation:** Check `/repo/all` endpoint
- **Server Logs:** Check backend console output
- **Database:** MongoDB connection status in server logs

All these commands give you complete control over your VandalHub platform! 🚀
