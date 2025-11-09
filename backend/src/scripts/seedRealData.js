const mongoose = require('mongoose');
const realDataSeeder = require('../seeders/realDataSeeder');
require('dotenv').config();

async function seedRealData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mentortrack');
    console.log('📦 Connected to MongoDB');

    // Run the seeder
    await realDataSeeder.seedAll();

    console.log('🎉 Real data seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seedRealData();