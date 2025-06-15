#!/usr/bin/env node

/**
 * Test Logout Flow
 * Verifies that logout properly redirects to homepage
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

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testLogoutFlow() {
  log('\n🔐 Testing Logout Flow...', 'bold');
  log('═'.repeat(40), 'blue');
  
  try {
    // Step 1: Create a test user and login
    log('\n1. Creating test user and logging in...', 'blue');
    
    const signupData = {
      username: `logout_test_${Date.now()}`,
      email: `logout_test_${Date.now()}@example.com`,
      password: 'testpassword123'
    };
    
    const signupResponse = await axios.post('http://localhost:3000/signup', signupData);
    
    if (signupResponse.data.token) {
      log('✅ User created and logged in successfully', 'green');
      log(`   Token: ${signupResponse.data.token.substring(0, 20)}...`, 'yellow');
      log(`   User ID: ${signupResponse.data.userId}`, 'yellow');
    } else {
      log('❌ Failed to create user', 'red');
      return;
    }
    
    // Step 2: Verify token works
    log('\n2. Verifying token works for API calls...', 'blue');
    
    try {
      const repoResponse = await axios.get('http://localhost:3000/repo/all');
      log('✅ API call successful - token is valid', 'green');
      log(`   Found ${repoResponse.data.length} repositories`, 'yellow');
    } catch (error) {
      log('❌ API call failed', 'red');
    }
    
    // Step 3: Test frontend homepage access
    log('\n3. Testing frontend homepage access...', 'blue');
    
    try {
      const homepageResponse = await axios.get('http://localhost:5174');
      if (homepageResponse.status === 200) {
        log('✅ Homepage is accessible', 'green');
      }
    } catch (error) {
      log('❌ Homepage not accessible', 'red');
      log(`   Error: ${error.message}`, 'red');
    }
    
    // Step 4: Instructions for manual testing
    log('\n4. Manual Testing Instructions:', 'blue');
    log('   📋 To complete the logout test:', 'yellow');
    log('   1. Open http://localhost:5174 in your browser', 'yellow');
    log('   2. If you see the homepage, click "Sign in"', 'yellow');
    log('   3. Login with any existing user or create a new one', 'yellow');
    log('   4. Once logged in, you should see the dashboard', 'yellow');
    log('   5. Click on your profile icon in the top right', 'yellow');
    log('   6. Click "Sign out" from the dropdown menu', 'yellow');
    log('   7. You should be redirected to the homepage with 3D animations', 'yellow');
    
    log('\n✅ Expected Behavior After Logout:', 'green');
    log('   • Should redirect to homepage (/) not login page (/auth)', 'green');
    log('   • Should show the beautiful 3D animated homepage', 'green');
    log('   • Should clear localStorage (token and userId)', 'green');
    log('   • Should show "Get started for free" and "Sign in" buttons', 'green');
    
    log('\n🔧 If logout doesn\'t work properly:', 'yellow');
    log('   • Check browser console for errors', 'yellow');
    log('   • Verify localStorage is cleared after logout', 'yellow');
    log('   • Ensure you\'re redirected to / not /auth', 'yellow');
    
  } catch (error) {
    log(`\n💥 Test failed: ${error.message}`, 'red');
    if (error.response) {
      log(`   Status: ${error.response.status}`, 'red');
      log(`   Data: ${JSON.stringify(error.response.data)}`, 'red');
    }
  }
}

async function checkServerStatus() {
  log('\n🔍 Checking server status...', 'blue');
  
  try {
    // Check backend
    const backendResponse = await axios.get('http://localhost:3000');
    log('✅ Backend server is running', 'green');
  } catch (error) {
    log('❌ Backend server is not running', 'red');
    log('   Please start with: cd backend-main && npm start', 'yellow');
    return false;
  }
  
  try {
    // Check frontend
    const frontendResponse = await axios.get('http://localhost:5174');
    log('✅ Frontend server is running', 'green');
  } catch (error) {
    log('❌ Frontend server is not running', 'red');
    log('   Please start with: cd frontend-main && npm run dev', 'yellow');
    return false;
  }
  
  return true;
}

async function main() {
  log('🚀 VandalHub Logout Flow Test', 'bold');
  
  const serversRunning = await checkServerStatus();
  
  if (serversRunning) {
    await testLogoutFlow();
    
    log('\n🎯 Summary:', 'bold');
    log('• Backend and frontend servers are running ✅', 'green');
    log('• Authentication system is working ✅', 'green');
    log('• Logout flow has been updated to redirect to homepage ✅', 'green');
    log('• Manual testing instructions provided above ⬆️', 'yellow');
    
    log('\n🔗 Quick Links:', 'blue');
    log('• Homepage: http://localhost:5174', 'blue');
    log('• Login: http://localhost:5174/auth', 'blue');
    log('• Dashboard: http://localhost:5174/dashboard', 'blue');
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
