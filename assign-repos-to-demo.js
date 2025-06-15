#!/usr/bin/env node

const axios = require('axios');

async function assignRepositoriesToDemo() {
  console.log('🔧 Assigning repositories to demo user...\n');

  const BASE_URL = 'http://localhost:3000';
  const DEMO_USER_ID = '684d58b5054010d0fdc3e3b4';

  try {
    // Get all repositories
    const reposResponse = await axios.get(`${BASE_URL}/repo/all`);
    const repositories = reposResponse.data;
    
    console.log(`Found ${repositories.length} repositories`);

    // Assign first 3 repositories to demo user
    const reposToAssign = repositories.slice(0, 3);
    
    for (const repo of reposToAssign) {
      try {
        console.log(`Assigning repository: ${repo.name}`);
        
        const updateResponse = await axios.put(`${BASE_URL}/repo/settings/${repo._id}`, {
          name: repo.name,
          description: repo.description,
          visibility: repo.visibility,
          topics: repo.topics || [],
          readme: repo.readme || '',
          owner: DEMO_USER_ID
        });

        console.log(`✅ Successfully assigned: ${repo.name}`);
      } catch (error) {
        console.log(`❌ Failed to assign ${repo.name}:`, error.response?.data || error.message);
      }
    }

    // Verify the assignment
    console.log('\n🔍 Verifying assignment...');
    const userReposResponse = await axios.get(`${BASE_URL}/repo/user/${DEMO_USER_ID}`);
    const userRepositories = userReposResponse.data.repositories || [];
    
    console.log(`✅ Demo user now has ${userRepositories.length} repositories:`);
    userRepositories.forEach(repo => {
      console.log(`   - ${repo.name} (${repo.visibility ? 'Public' : 'Private'})`);
    });

    console.log('\n🎉 Repository assignment complete!');
    console.log('\nDemo user credentials:');
    console.log('Email: demo@vandalhub.com');
    console.log('Password: demo123');

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
  }
}

assignRepositoriesToDemo();
