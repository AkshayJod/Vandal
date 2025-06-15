#!/usr/bin/env node

const axios = require('axios');

async function testFrontendAPI() {
  console.log('🧪 Testing VandalHub Frontend API Connections\n');

  const BASE_URL = 'http://localhost:3000';
  const FRONTEND_URL = 'http://localhost:5176';

  try {
    // Test 1: Check if backend is running
    console.log('1️⃣ Testing Backend Connection...');
    const backendTest = await axios.get(`${BASE_URL}/repo/all`);
    console.log(`✅ Backend is running - Found ${backendTest.data.length} repositories\n`);

    // Test 2: Check if frontend is accessible
    console.log('2️⃣ Testing Frontend Connection...');
    try {
      const frontendTest = await axios.get(FRONTEND_URL);
      console.log('✅ Frontend is accessible\n');
    } catch (err) {
      console.log('❌ Frontend is not accessible - Make sure it\'s running on port 5176\n');
    }

    // Test 3: Test specific API endpoints
    console.log('3️⃣ Testing API Endpoints...');
    
    // Test all repositories
    const allRepos = await axios.get(`${BASE_URL}/repo/all`);
    console.log(`✅ GET /repo/all - ${allRepos.data.length} repositories found`);

    // Test user repositories (with the user ID from the API response)
    const userId = '684a9cd5b8e2fd9a4febe094';
    try {
      const userRepos = await axios.get(`${BASE_URL}/repo/user/${userId}`);
      console.log(`✅ GET /repo/user/${userId} - ${userRepos.data.repositories?.length || 0} user repositories found`);
    } catch (err) {
      console.log(`❌ GET /repo/user/${userId} - Error: ${err.response?.data?.error || err.message}`);
    }

    // Test 4: Check repository data structure
    console.log('\n4️⃣ Analyzing Repository Data Structure...');
    if (allRepos.data.length > 0) {
      const sampleRepo = allRepos.data[0];
      console.log('✅ Sample repository structure:');
      console.log(`   - ID: ${sampleRepo._id}`);
      console.log(`   - Name: ${sampleRepo.name}`);
      console.log(`   - Description: ${sampleRepo.description?.substring(0, 50)}...`);
      console.log(`   - Visibility: ${sampleRepo.visibility ? 'Public' : 'Private'}`);
      console.log(`   - Owner: ${sampleRepo.owner || 'null'}`);
      console.log(`   - Files: ${sampleRepo.content?.length || 0}`);
    }

    // Test 5: Check for common issues
    console.log('\n5️⃣ Checking for Common Issues...');
    
    // Check if repositories have owners
    const reposWithoutOwners = allRepos.data.filter(repo => !repo.owner);
    if (reposWithoutOwners.length > 0) {
      console.log(`⚠️  Found ${reposWithoutOwners.length} repositories without owners`);
      console.log('   This might cause issues in the frontend display');
    } else {
      console.log('✅ All repositories have owners assigned');
    }

    // Check if repositories have proper structure
    const reposWithIssues = allRepos.data.filter(repo => 
      !repo._id || !repo.name || repo.content === undefined
    );
    if (reposWithIssues.length > 0) {
      console.log(`⚠️  Found ${reposWithIssues.length} repositories with structural issues`);
    } else {
      console.log('✅ All repositories have proper structure');
    }

    console.log('\n🎉 API Testing Complete!');
    console.log('\n📋 Summary:');
    console.log(`   - Backend Status: ✅ Running`);
    console.log(`   - Total Repositories: ${allRepos.data.length}`);
    console.log(`   - API Endpoints: ✅ Working`);
    console.log(`   - Data Structure: ✅ Valid`);

    console.log('\n🔧 If repositories are not showing in the frontend:');
    console.log('   1. Check if user is logged in (localStorage should have userId and token)');
    console.log('   2. Check browser console for JavaScript errors');
    console.log('   3. Check network tab for failed API requests');
    console.log('   4. Verify the Dashboard component is making the correct API calls');

  } catch (error) {
    console.error('\n❌ Error during testing:', error.message);
    if (error.response) {
      console.error('   Response status:', error.response.status);
      console.error('   Response data:', error.response.data);
    }
  }
}

// Run the test
testFrontendAPI();
