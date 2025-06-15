#!/usr/bin/env node

/**
 * Simple Profile Test
 * Quick test to debug the profile system
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

async function testSimpleProfile() {
  log('\n🔍 Simple Profile Test...', 'bold');
  
  try {
    // Test 1: Create user
    log('\n1. Creating test user...', 'blue');
    
    const signupData = {
      username: `simple_test_${Date.now()}`,
      email: `simple_test_${Date.now()}@example.com`,
      password: 'testpassword123'
    };
    
    const signupResponse = await axios.post('http://localhost:3000/signup', signupData);
    log(`✅ User created: ${signupResponse.data.userId}`, 'green');
    
    const userId = signupResponse.data.userId;
    
    // Test 2: Get user profile
    log('\n2. Getting user profile...', 'blue');
    
    const profileResponse = await axios.get(`http://localhost:3000/userProfile/${userId}`);
    log('✅ Profile retrieved:', 'green');
    log(JSON.stringify(profileResponse.data, null, 2), 'yellow');
    
    // Test 3: Simple update
    log('\n3. Updating name only...', 'blue');
    
    const updateData = { name: 'Test User' };
    
    try {
      const updateResponse = await axios.put(`http://localhost:3000/updateProfile/${userId}`, updateData);
      log('✅ Update successful:', 'green');
      log(JSON.stringify(updateResponse.data, null, 2), 'yellow');
    } catch (updateError) {
      log('❌ Update failed:', 'red');
      log(`Status: ${updateError.response?.status}`, 'red');
      log(`Error: ${updateError.response?.data}`, 'red');
      log(`Message: ${updateError.message}`, 'red');
    }
    
  } catch (error) {
    log('❌ Test failed:', 'red');
    log(`Status: ${error.response?.status}`, 'red');
    log(`Error: ${error.response?.data}`, 'red');
    log(`Message: ${error.message}`, 'red');
  }
}

testSimpleProfile();
