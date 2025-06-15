const axios = require('axios');

async function testConnection() {
  try {
    console.log('🔍 Testing VandalHub API connection...');
    
    // Test basic connection
    const response = await axios.get('http://localhost:3000/repo/all');
    console.log('✅ API connection successful!');
    console.log(`📋 Found ${response.data.length} repositories`);
    
    // List repositories
    if (response.data.length > 0) {
      console.log('\n📁 Existing repositories:');
      response.data.forEach((repo, index) => {
        console.log(`${index + 1}. ${repo.name} (${repo.visibility ? 'Public' : 'Private'})`);
        console.log(`   📄 ${repo.description || 'No description'}`);
        console.log(`   🆔 ID: ${repo._id}`);
        console.log('');
      });
    } else {
      console.log('\n📭 No repositories found. Ready to create your first one!');
    }
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Make sure VandalHub backend is running on http://localhost:3000');
    }
  }
}

testConnection();
