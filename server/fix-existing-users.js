// Script to check and optionally fix existing users
// Run this ONCE to see if existing users have issues

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');

const MONGO_URI = process.env.MONGO_URI;

async function checkUsers() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✓ Connected to MongoDB');

    const users = await User.find({});
    console.log(`\nFound ${users.length} users:\n`);

    for (const user of users) {
      console.log('-----------------------------------');
      console.log('User ID:', user._id);
      console.log('Username:', user.username);
      console.log('Email:', user.email);
      console.log('Email has spaces:', user.email !== user.email.trim());
      console.log('Email is lowercase:', user.email === user.email.toLowerCase());
      console.log('Has password:', !!user.password);
      console.log('Password length:', user.password?.length);
      console.log('Password starts with:', user.password?.substring(0, 7));
      console.log('Created at:', user.createdAt);
      
      // Check if email needs normalization
      const normalizedEmail = user.email.trim().toLowerCase();
      if (user.email !== normalizedEmail) {
        console.log('⚠️  EMAIL NEEDS NORMALIZATION!');
        console.log('   Current:', `"${user.email}"`);
        console.log('   Should be:', `"${normalizedEmail}"`);
      }
      
      // Check if password is valid bcrypt hash
      if (user.password && !user.password.startsWith('$2')) {
        console.log('❌ PASSWORD IS NOT HASHED!');
      }
      
      console.log('-----------------------------------\n');
    }

    console.log('\n✓ Check complete');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

checkUsers();
