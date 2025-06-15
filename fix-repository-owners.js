#!/usr/bin/env node

const axios = require('axios');

async function fixRepositoryOwners() {
  console.log('🔧 Fixing Repository Owners\n');

  const BASE_URL = 'http://localhost:3000';
  const DEFAULT_USER_ID = '684a9cd5b8e2fd9a4febe094'; // The user ID we found in the API response

  try {
    // Step 1: Get all repositories
    console.log('1️⃣ Fetching all repositories...');
    const reposResponse = await axios.get(`${BASE_URL}/repo/all`);
    const repositories = reposResponse.data;
    console.log(`Found ${repositories.length} repositories\n`);

    // Step 2: Check which repositories need fixing
    const reposWithoutOwners = repositories.filter(repo => !repo.owner);
    console.log(`2️⃣ Found ${reposWithoutOwners.length} repositories without owners\n`);

    if (reposWithoutOwners.length === 0) {
      console.log('✅ All repositories already have owners assigned!');
      return;
    }

    // Step 3: Fix each repository
    console.log('3️⃣ Assigning owners to repositories...');
    let successCount = 0;
    let errorCount = 0;

    for (const repo of reposWithoutOwners) {
      try {
        console.log(`   Fixing: ${repo.name} (${repo._id})`);
        
        // Update the repository with the owner
        const updateResponse = await axios.put(`${BASE_URL}/repo/settings/${repo._id}`, {
          name: repo.name,
          description: repo.description,
          visibility: repo.visibility,
          topics: repo.topics || [],
          readme: repo.readme || '',
          owner: DEFAULT_USER_ID // Assign the owner
        });

        if (updateResponse.data.success) {
          console.log(`   ✅ Successfully assigned owner to: ${repo.name}`);
          successCount++;
        } else {
          console.log(`   ❌ Failed to update: ${repo.name}`);
          errorCount++;
        }
      } catch (error) {
        console.log(`   ❌ Error updating ${repo.name}: ${error.response?.data?.error || error.message}`);
        errorCount++;
      }
    }

    // Step 4: Verify the fix
    console.log('\n4️⃣ Verifying the fix...');
    const updatedReposResponse = await axios.get(`${BASE_URL}/repo/all`);
    const updatedRepositories = updatedReposResponse.data;
    const stillWithoutOwners = updatedRepositories.filter(repo => !repo.owner);

    console.log('\n📊 Results:');
    console.log(`   ✅ Successfully updated: ${successCount} repositories`);
    console.log(`   ❌ Failed to update: ${errorCount} repositories`);
    console.log(`   📋 Repositories still without owners: ${stillWithoutOwners.length}`);

    // Step 5: Test user repositories endpoint
    console.log('\n5️⃣ Testing user repositories endpoint...');
    try {
      const userReposResponse = await axios.get(`${BASE_URL}/repo/user/${DEFAULT_USER_ID}`);
      const userRepositories = userReposResponse.data.repositories || [];
      console.log(`✅ User now has ${userRepositories.length} repositories assigned`);
      
      if (userRepositories.length > 0) {
        console.log('   Sample repositories:');
        userRepositories.slice(0, 3).forEach(repo => {
          console.log(`   - ${repo.name} (${repo.visibility ? 'Public' : 'Private'})`);
        });
      }
    } catch (error) {
      console.log(`❌ Error testing user repositories: ${error.response?.data?.error || error.message}`);
    }

    console.log('\n🎉 Repository owner fix complete!');
    console.log('\n📝 Next steps:');
    console.log('   1. Refresh the frontend (http://localhost:5176)');
    console.log('   2. Login with any credentials (or create a test user)');
    console.log('   3. Check if repositories are now showing in the dashboard');

  } catch (error) {
    console.error('\n❌ Error during repository owner fix:', error.message);
    if (error.response) {
      console.error('   Response status:', error.response.status);
      console.error('   Response data:', error.response.data);
    }
  }
}

// Alternative method: Direct database update (if the API method doesn't work)
async function directDatabaseFix() {
  console.log('\n🔧 Alternative: Direct Database Fix');
  console.log('If the API method doesn\'t work, you can manually update the database:');
  console.log('\n1. Connect to MongoDB:');
  console.log('   mongo');
  console.log('\n2. Switch to the database:');
  console.log('   use githubclone');
  console.log('\n3. Update all repositories without owners:');
  console.log(`   db.repositories.updateMany(
     { owner: null }, 
     { $set: { owner: ObjectId("${DEFAULT_USER_ID}") } }
   )`);
  console.log('\n4. Verify the update:');
  console.log('   db.repositories.find({ owner: null }).count()');
}

// Run the fix
if (require.main === module) {
  fixRepositoryOwners().then(() => {
    console.log('\n💡 If the API method didn\'t work, try the direct database method:');
    directDatabaseFix();
  });
}

module.exports = { fixRepositoryOwners, directDatabaseFix };
