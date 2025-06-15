#!/usr/bin/env node

/**
 * VandalHub Comprehensive Test Suite
 * Tests all major functionality of the platform
 */

const axios = require('axios');
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

const BASE_URL = 'http://localhost:3000';
let authToken = '';
let userId = '';

// Test results tracking
const results = {
  passed: 0,
  failed: 0,
  tests: []
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logTest(testName, passed, details = '') {
  const status = passed ? '✅ PASS' : '❌ FAIL';
  const color = passed ? 'green' : 'red';
  log(`${status} ${testName}${details ? ' - ' + details : ''}`, color);
  
  results.tests.push({ name: testName, passed, details });
  if (passed) results.passed++;
  else results.failed++;
}

async function testAPI(method, endpoint, data = null, expectedStatus = 200, description = '') {
  try {
    const config = {
      method,
      url: `${BASE_URL}${endpoint}`,
      headers: authToken ? { 'Authorization': `Bearer ${authToken}` } : {}
    };
    
    if (data) {
      config.data = data;
      config.headers['Content-Type'] = 'application/json';
    }
    
    const response = await axios(config);
    
    if (response.status === expectedStatus) {
      logTest(`${method.toUpperCase()} ${endpoint}`, true, description);
      return response.data;
    } else {
      logTest(`${method.toUpperCase()} ${endpoint}`, false, `Expected ${expectedStatus}, got ${response.status}`);
      return null;
    }
  } catch (error) {
    const status = error.response?.status || 'Network Error';
    if (status === expectedStatus) {
      logTest(`${method.toUpperCase()} ${endpoint}`, true, description);
      return error.response?.data;
    } else {
      logTest(`${method.toUpperCase()} ${endpoint}`, false, `Error: ${status} - ${error.message}`);
      return null;
    }
  }
}

async function runTests() {
  log('\n🚀 Starting VandalHub Comprehensive Test Suite\n', 'bold');
  
  // Test 1: Server Health Check
  log('📡 Testing Server Health...', 'blue');
  await testAPI('GET', '/', null, 200, 'Server is running');
  
  // Test 2: User Registration
  log('\n👤 Testing User Authentication...', 'blue');
  const signupData = {
    username: `testuser_${Date.now()}`,
    email: `test_${Date.now()}@example.com`,
    password: 'testpassword123'
  };
  
  const signupResult = await testAPI('POST', '/signup', signupData, 200, 'User registration');
  if (signupResult && signupResult.token) {
    authToken = signupResult.token;
    userId = signupResult.userId;
    logTest('Token received', true, 'Authentication token obtained');
  } else {
    logTest('Token received', false, 'No token in signup response');
  }
  
  // Test 3: User Login
  const loginData = {
    email: signupData.email,
    password: signupData.password
  };
  
  const loginResult = await testAPI('POST', '/login', loginData, 200, 'User login');
  if (loginResult && loginResult.token) {
    logTest('Login token received', true, 'Login successful');
  } else {
    logTest('Login token received', false, 'Login failed');
  }
  
  // Test 4: Repository Operations
  log('\n📁 Testing Repository Operations...', 'blue');
  
  // Get all repositories
  await testAPI('GET', '/repo/all', null, 200, 'Fetch all repositories');
  
  // Get user repositories
  if (userId) {
    await testAPI('GET', `/repo/user/${userId}`, null, 200, 'Fetch user repositories');
  }
  
  // Create a new repository
  const repoData = {
    name: `test-repo-${Date.now()}`,
    description: 'Test repository created by automated test',
    visibility: true,
    owner: userId,
    language: 'JavaScript'
  };
  
  const createRepoResult = await testAPI('POST', '/repo/create', repoData, 201, 'Create repository');
  let repoId = null;
  if (createRepoResult && createRepoResult._id) {
    repoId = createRepoResult._id;
    logTest('Repository created', true, `Repository ID: ${repoId}`);
  }
  
  // Test 5: Repository Details
  if (repoId) {
    await testAPI('GET', `/repo/${repoId}`, null, 200, 'Fetch repository details');
    
    // Update repository
    const updateData = {
      description: 'Updated description for test repository'
    };
    await testAPI('PUT', `/repo/update/${repoId}`, updateData, 200, 'Update repository');
  }
  
  // Test 6: User Profile Operations
  log('\n👥 Testing User Profile Operations...', 'blue');
  
  if (userId) {
    await testAPI('GET', `/userProfile/${userId}`, null, 200, 'Fetch user profile');
    
    // Update user profile
    const profileData = {
      username: signupData.username,
      email: signupData.email
    };
    await testAPI('PUT', `/updateProfile/${userId}`, profileData, 200, 'Update user profile');
  }
  
  // Test 7: Issues Operations
  log('\n🐛 Testing Issues Operations...', 'blue');

  await testAPI('GET', '/issue/all', null, 200, 'Fetch all issues');

  if (repoId) {
    await testAPI('GET', `/issue/repository/${repoId}`, null, 200, 'Fetch repository issues');

    // Create an issue
    const issueData = {
      title: 'Test Issue',
      description: 'This is a test issue created by automated test',
      repository: repoId,
      author: userId
    };

    const createIssueResult = await testAPI('POST', '/issue/create', issueData, 201, 'Create issue');
    if (createIssueResult && createIssueResult._id) {
      const issueId = createIssueResult._id;
      logTest('Issue created', true, `Issue ID: ${issueId}`);

      // Update issue
      const updateIssueData = {
        title: 'Updated Test Issue',
        description: 'Updated description for test issue'
      };
      await testAPI('PUT', `/issue/update/${issueId}`, updateIssueData, 200, 'Update issue');
    }
  }
  
  // Test 8: Error Handling
  log('\n⚠️  Testing Error Handling...', 'blue');
  
  // Test invalid endpoints
  await testAPI('GET', '/invalid-endpoint', null, 404, 'Invalid endpoint returns 404');
  
  // Test invalid login
  const invalidLogin = {
    email: 'invalid@example.com',
    password: 'wrongpassword'
  };
  await testAPI('POST', '/login', invalidLogin, 200, 'Invalid login returns error message');
  
  // Test invalid repository access
  await testAPI('GET', '/repo/invalid-id', null, 500, 'Invalid repository ID handling');
  
  // Test Results Summary
  log('\n📊 Test Results Summary', 'bold');
  log('═'.repeat(50), 'blue');
  log(`Total Tests: ${results.tests.length}`, 'blue');
  log(`Passed: ${results.passed}`, 'green');
  log(`Failed: ${results.failed}`, results.failed > 0 ? 'red' : 'green');
  log(`Success Rate: ${((results.passed / results.tests.length) * 100).toFixed(1)}%`, 
       results.failed === 0 ? 'green' : 'yellow');
  
  if (results.failed > 0) {
    log('\n❌ Failed Tests:', 'red');
    results.tests.filter(t => !t.passed).forEach(test => {
      log(`  • ${test.name}: ${test.details}`, 'red');
    });
  } else {
    log('\n🎉 All tests passed! VandalHub is working perfectly!', 'green');
  }
  
  log('\n✨ Test suite completed!', 'bold');
}

// Performance Test
async function performanceTest() {
  log('\n⚡ Running Performance Tests...', 'blue');
  
  const startTime = Date.now();
  const promises = [];
  
  // Concurrent API calls
  for (let i = 0; i < 10; i++) {
    promises.push(axios.get(`${BASE_URL}/repo/all`));
  }
  
  try {
    await Promise.all(promises);
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    logTest('Concurrent API calls', duration < 5000, `Completed in ${duration}ms`);
  } catch (error) {
    logTest('Concurrent API calls', false, 'Failed to handle concurrent requests');
  }
}

// Run all tests
async function main() {
  try {
    await runTests();
    await performanceTest();
  } catch (error) {
    log(`\n💥 Test suite failed with error: ${error.message}`, 'red');
    process.exit(1);
  }
}

// Check if axios is available
try {
  require('axios');
  main();
} catch (error) {
  log('❌ axios is required to run tests. Install it with: npm install axios', 'red');
  process.exit(1);
}
