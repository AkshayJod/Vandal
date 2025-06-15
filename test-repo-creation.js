const axios = require('axios');

async function testRepositoryCreation() {
  try {
    console.log('Testing repository creation...');
    
    const testRepo = {
      name: 'test-repository',
      description: 'A test repository to verify functionality',
      visibility: true,
      owner: '675d8b8b4c123456789abcde', // Replace with actual user ID
      content: [
        {
          name: 'README.md',
          content: '# Test Repository\n\nThis is a test repository created to verify the repository management system.',
          type: 'file'
        },
        {
          name: 'package.json',
          content: '{\n  "name": "test-repository",\n  "version": "1.0.0",\n  "description": "A test repository"\n}',
          type: 'file'
        }
      ],
      issues: []
    };

    const response = await axios.post('http://localhost:3000/repo/create', testRepo, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Repository created successfully!');
    console.log('Repository ID:', response.data.repositoryID);
    console.log('Response:', response.data);

    // Test fetching all repositories
    console.log('\nTesting repository fetching...');
    const fetchResponse = await axios.get('http://localhost:3000/repo/all');
    console.log('✅ Repositories fetched successfully!');
    console.log('Number of repositories:', fetchResponse.data.length);

    return response.data;

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
    throw error;
  }
}

// Run the test
if (require.main === module) {
  testRepositoryCreation()
    .then(() => {
      console.log('\n🎉 All tests passed!');
      process.exit(0);
    })
    .catch(() => {
      console.log('\n💥 Tests failed!');
      process.exit(1);
    });
}

module.exports = { testRepositoryCreation };
