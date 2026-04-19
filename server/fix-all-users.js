// Run this script ONCE to fix all existing users
// node fix-all-users.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');

const MONGO_URI = process.env.MONGO_URI;

async function fixAllUsers() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✓ Connected to MongoDB\n');

    const users = await User.find({});
    console.log(`Found ${users.length} users\n`);

    for (const user of users) {
      console.log('-----------------------------------');
      console.log('Checking user:', user.email);
      
      let needsUpdate = false;
      const updates = {};

      // Fix email (trim and lowercase)
      const normalizedEmail = user.email.trim().toLowerCase();
      if (user.email !== normalizedEmail) {
        console.log('  ⚠️  Email needs normalization');
        console.log('     Old:', `"${user.email}"`);
        console.log('     New:', `"${normalizedEmail}"`);
        updates.email = normalizedEmail;
        needsUpdate = true;
      }

      // Check if password is properly hashed
      if (user.password && !user.password.startsWith('$2')) {
        console.log('  ❌ Password is NOT hashed properly!');
        console.log('     This user needs to re-register or reset password');
      } else if (user.password) {
        console.log('  ✓ Password is properly hashed');
      }

      // Apply updates if needed
      if (needsUpdate) {
        await User.updateOne({ _id: user._id }, updates);
        console.log('  ✓ User updated');
      } else {
        console.log('  ✓ User is OK');
      }
      
      console.log('-----------------------------------\n');
    }

    console.log('\n✓ All users checked and fixed');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

fixAllUsers();
